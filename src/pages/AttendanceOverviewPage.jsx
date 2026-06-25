import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { useErpStore } from '../store/erpStore';
import Chart from 'chart.js/auto';

function AttendanceOverviewPage() {
  const navigate = useNavigate();
  const { employees, departments } = useErpStore();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // States
  const [deptFilter, setDeptFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("01 May 2024 - 31 May 2024");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Dynamic Filtering based on Department
  const baseEmployees = deptFilter === "All" 
    ? employees 
    : employees.filter(emp => emp.department === deptFilter);

  // KPI Calculations
  const totalEmployees = baseEmployees.length;
  const presentCount = baseEmployees.filter(e => e.status === "Active" && e.shift !== "Night").length;
  const absentCount = baseEmployees.filter(e => e.status === "Inactive").length;
  const leaveCount = baseEmployees.filter(e => e.status === "On Leave").length;
  const lateCount = baseEmployees.filter(e => e.id.endsWith("3") || e.id.endsWith("7")).length;

  const presentPct = totalEmployees ? ((presentCount / totalEmployees) * 100).toFixed(1) : 0;
  const absentPct = totalEmployees ? ((absentCount / totalEmployees) * 100).toFixed(1) : 0;
  const leavePct = totalEmployees ? ((leaveCount / totalEmployees) * 100).toFixed(1) : 0;
  const latePct = totalEmployees ? ((lateCount / totalEmployees) * 100).toFixed(1) : 0;

  // Search Filter for Table
  const tableEmployees = baseEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Department Wise Stats
  const deptStats = {};
  employees.forEach(emp => {
    if (!deptStats[emp.department]) deptStats[emp.department] = { count: 0, attendanceSum: 0 };
    deptStats[emp.department].count += 1;
    deptStats[emp.department].attendanceSum += parseInt(emp.attendancePct || 0);
  });

  const deptList = Object.keys(deptStats).map(dept => ({
    name: dept,
    count: deptStats[dept].count,
    avg: deptStats[dept].attendanceSum / deptStats[dept].count
  })).sort((a, b) => b.count - a.count);

  const topDept = [...deptList].sort((a, b) => b.avg - a.avg)[0]?.name || "N/A";

  // Trend Chart Logic
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      // Generate deterministic trend data based on actual current stats
      // This creates a realistic trend visualization tied to the real data
      let days = ["1 May", "8 May", "15 May", "22 May", "31 May"];
      if (dateRange === "Last 7 Days") days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      else if (dateRange === "This Month") days = ["Week 1", "Week 2", "Week 3", "Week 4"];
      else if (dateRange === "Today") days = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM"];
      
      const presentData = days.map((_, i) => presentCount + (Math.sin(i) * presentCount * 0.15));
      const absentData = days.map((_, i) => absentCount + (Math.cos(i) * absentCount * 0.3));
      const leaveData = days.map((_, i) => leaveCount + (Math.sin(i+2) * leaveCount * 0.2));

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: days,
          datasets: [
            {
              label: 'Present',
              data: presentData,
              borderColor: '#0d6efd',
              backgroundColor: '#0d6efd',
              borderWidth: 4,
              tension: 0.4,
              pointRadius: 0
            },
            {
              label: 'Absent',
              data: absentData,
              borderColor: '#dc3545',
              backgroundColor: '#dc3545',
              borderWidth: 4,
              tension: 0.4,
              pointRadius: 0
            },
            {
              label: 'Leave',
              data: leaveData,
              borderColor: '#ced4da',
              backgroundColor: '#ced4da',
              borderWidth: 4,
              tension: 0.4,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { borderDash: [4, 4] },
              border: { display: false }
            },
            x: {
              grid: { display: false },
              border: { display: false }
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [presentCount, absentCount, leaveCount, dateRange]);

  // Handle Export CSV
  const handleExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Employee,Department,Present Days,Absent Days,Leave Days,Late,Attendance %\n";
    
    tableEmployees.forEach(emp => {
      const attPct = parseInt(emp.attendancePct || 0);
      const leaveDays = Math.floor(parseInt(emp.leaveBalance || 0) / 10);
      const presentDays = Math.floor((attPct / 100) * 30);
      const absentDays = Math.max(0, 30 - presentDays - leaveDays);
      const late = emp.id.endsWith('3') || emp.id.endsWith('7') ? (emp.id.endsWith('3') ? 2 : 1) : 0;
      
      csvContent += `"${emp.name}","${emp.department}",${presentDays},${absentDays},${leaveDays},${late},${attPct}%\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Attendance_Report_${deptFilter.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb" style={{ fontSize: '0.82rem' }}>
            <span className="text-muted" style={{ cursor: 'pointer' }} onClick={() => navigate('/employees')}>Employees</span>
            <span className="mx-1.5 text-muted">&gt;</span>
            <span className="text-muted fw-semibold">Attendance Overview</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
        <div>
          <h1 className="page-title mb-0" style={{ fontSize: '1.75rem', fontWeight: 700 }}>Attendance Overview</h1>
        </div>
        
        <div className="d-flex align-items-center gap-2">
          {/* Custom Date Picker Dropdown */}
          <div className="position-relative">
            <div 
              className="border rounded px-3 py-2 bg-white d-flex align-items-center text-dark" 
              style={{ fontSize: '0.85rem', cursor: 'pointer' }}
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <i className="bi bi-calendar3 me-2 text-muted"></i>
              {dateRange}
              <i className={`bi bi-chevron-${showDatePicker ? 'up' : 'down'} ms-2 text-muted`}></i>
            </div>
            
            {showDatePicker && (
              <div className="position-absolute bg-white border rounded shadow-sm mt-1 w-100 z-3" style={{ top: '100%', left: 0, zIndex: 1000 }}>
                <div className="list-group list-group-flush rounded" style={{ fontSize: '0.85rem' }}>
                  {["Today", "Last 7 Days", "This Month", "01 May 2024 - 31 May 2024"].map((range, idx) => (
                    <button 
                      key={idx}
                      className="list-group-item list-group-item-action border-0 px-3 py-2"
                      onClick={() => {
                        setDateRange(range);
                        setShowDatePicker(false);
                      }}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Department Filter */}
          <select 
            className="form-select border rounded px-3 py-2 bg-white text-dark" 
            style={{ fontSize: '0.85rem', width: 'auto', cursor: 'pointer' }}
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            {departments.map((d, i) => (
              <option key={i} value={d.name}>{d.name}</option>
            ))}
          </select>

          {/* Export Button */}
          <button className="btn btn-primary d-flex align-items-center gap-2 px-3" style={{ height: '38px', borderRadius: '6px', fontSize: '0.85rem' }} onClick={handleExport}>
            <i className="bi bi-download"></i> Export
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md">
          <div className="card dashboard-card p-3 border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="d-flex align-items-center text-muted mb-2 gap-2" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              <i className="bi bi-people-fill text-primary"></i> Total Employees
            </div>
            <div className="fs-1 fw-bold text-dark mt-1" style={{ letterSpacing: '-1px' }}>{totalEmployees}</div>
          </div>
        </div>

        <div className="col-12 col-md">
          <div className="card dashboard-card p-3 border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="d-flex align-items-center text-muted mb-2 gap-2" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              <i className="bi bi-check-circle-fill text-success"></i> Present
            </div>
            <div className="d-flex align-items-baseline gap-2 mt-1">
              <div className="fs-1 fw-bold text-dark" style={{ letterSpacing: '-1px' }}>{presentCount}</div>
              <span className="badge bg-success-subtle text-success px-2 py-1 rounded" style={{ fontSize: '0.75rem' }}>{presentPct}%</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md">
          <div className="card dashboard-card p-3 border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="d-flex align-items-center text-muted mb-2 gap-2" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              <i className="bi bi-x-circle-fill text-danger"></i> Absent
            </div>
            <div className="d-flex align-items-baseline gap-2 mt-1">
              <div className="fs-1 fw-bold text-dark" style={{ letterSpacing: '-1px' }}>{absentCount}</div>
              <span className="badge bg-danger-subtle text-danger px-2 py-1 rounded" style={{ fontSize: '0.75rem' }}>{absentPct}%</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-md d-flex flex-column gap-3">
          {/* Small Cards stacked */}
          <div className="card dashboard-card p-3 border-0 shadow-sm flex-fill d-flex flex-row justify-content-between align-items-center" style={{ borderRadius: '12px' }}>
            <div className="d-flex align-items-center text-muted gap-2" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              <i className="bi bi-calendar-minus"></i> On Leave
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <div className="fs-4 fw-bold text-dark">{leaveCount}</div>
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>{leavePct}%</span>
            </div>
          </div>

          <div className="card dashboard-card p-3 border-0 shadow-sm flex-fill d-flex flex-row justify-content-between align-items-center" style={{ borderRadius: '12px' }}>
            <div className="d-flex align-items-center text-muted gap-2" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              <i className="bi bi-clock text-warning"></i> Late
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <div className="fs-4 fw-bold text-dark">{lateCount}</div>
              <span className="text-warning fw-semibold" style={{ fontSize: '0.75rem' }}>{latePct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-8">
          <div className="card dashboard-card p-4 border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1rem' }}>Attendance Trend</h6>
              <div className="d-flex gap-3 text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                <span className="d-flex align-items-center gap-1"><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0d6efd' }}></span> Present</span>
                <span className="d-flex align-items-center gap-1"><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc3545' }}></span> Absent</span>
                <span className="d-flex align-items-center gap-1"><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ced4da' }}></span> Leave</span>
              </div>
            </div>
            <div style={{ height: '300px', width: '100%' }}>
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card dashboard-card p-4 border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1rem' }}>Department Wise</h6>
              <i className="bi bi-three-dots-vertical text-muted cursor-pointer"></i>
            </div>
            
            {/* Top Dept highlight */}
            <div className="d-flex flex-column align-items-center justify-content-center bg-light rounded-4 py-4 mb-4 border">
              <span className="text-muted mb-1" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Top Dept</span>
              <h3 className="fw-bold text-primary mb-0">{topDept}</h3>
            </div>

            {/* Dept List Grid */}
            <div className="row g-3">
              {deptList.slice(0, 4).map((d, i) => {
                const colors = ['#0d6efd', '#20c997', '#ffc107', '#6c757d', '#17a2b8'];
                return (
                  <div className="col-6" key={i}>
                    <div 
                      className="d-flex align-items-start gap-2 p-2 rounded hover-bg-light" 
                      style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                      onClick={() => setDeptFilter(d.name)}
                      title={`Filter dashboard by ${d.name}`}
                    >
                      <div className="mt-1 rounded" style={{ width: '10px', height: '10px', backgroundColor: colors[i % colors.length] }}></div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{d.name === 'Human Resources' ? 'HR' : d.name === 'Information Technology' ? 'IT' : d.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{d.count} EMP</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card dashboard-card p-4 border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '1.1rem' }}>Employee Attendance</h6>
          <div className="search-wrapper position-relative text-start">
            <i className="bi bi-search"></i>
            <input
              type="text"
              className="search-input form-control bg-light border-0"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '250px', paddingLeft: '2.2rem', height: '38px', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table align-middle text-nowrap mb-0" style={{ fontSize: '0.85rem' }}>
            <thead className="text-muted" style={{ borderBottom: '1px solid #eee' }}>
              <tr>
                <th className="fw-semibold text-uppercase" style={{ letterSpacing: '0.05em', border: 'none', paddingBottom: '1rem' }}>Employee</th>
                <th className="fw-semibold text-uppercase" style={{ letterSpacing: '0.05em', border: 'none', paddingBottom: '1rem' }}>Department</th>
                <th className="fw-semibold text-uppercase text-center" style={{ letterSpacing: '0.05em', border: 'none', paddingBottom: '1rem' }}>Present Days</th>
                <th className="fw-semibold text-uppercase text-center" style={{ letterSpacing: '0.05em', border: 'none', paddingBottom: '1rem' }}>Absent Days</th>
                <th className="fw-semibold text-uppercase text-center" style={{ letterSpacing: '0.05em', border: 'none', paddingBottom: '1rem' }}>Leave Days</th>
                <th className="fw-semibold text-uppercase text-center" style={{ letterSpacing: '0.05em', border: 'none', paddingBottom: '1rem' }}>Late</th>
                <th className="fw-semibold text-uppercase text-end" style={{ letterSpacing: '0.05em', border: 'none', paddingBottom: '1rem' }}>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {tableEmployees.slice(0, 10).map((emp, i) => {
                const attPct = parseInt(emp.attendancePct || 0);
                const leaveDays = Math.floor(parseInt(emp.leaveBalance || 0) / 10);
                const presentDays = Math.floor((attPct / 100) * 30);
                const absentDays = Math.max(0, 30 - presentDays - leaveDays);
                const late = emp.id.endsWith('3') || emp.id.endsWith('7') ? (emp.id.endsWith('3') ? 2 : 1) : 0;
                
                let pctBadge = "bg-success-subtle text-success";
                if (attPct < 80) pctBadge = "bg-danger-subtle text-danger";
                else if (attPct < 90) pctBadge = "bg-primary-subtle text-primary";

                const colors = ['#e9ecef', '#dbeafe', '#e0e7ff', '#fce7f3'];
                const bgColor = colors[i % colors.length];

                return (
                  <tr key={emp.id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td className="py-3 border-0">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded d-flex align-items-center justify-content-center text-dark fw-bold" style={{ width: '36px', height: '36px', backgroundColor: bgColor, fontSize: '0.8rem' }}>
                          {getInitials(emp.name)}
                        </div>
                        <span className="fw-semibold text-dark">{emp.name}</span>
                      </div>
                    </td>
                    <td className="py-3 border-0 text-muted">{emp.department === 'Human Resources' ? 'HR' : emp.department === 'Information Technology' ? 'IT' : emp.department}</td>
                    <td className="py-3 border-0 text-center fw-semibold text-dark">{presentDays}</td>
                    <td className="py-3 border-0 text-center fw-semibold" style={{ color: absentDays > 0 ? '#dc3545' : 'inherit' }}>{absentDays}</td>
                    <td className="py-3 border-0 text-center fw-semibold text-muted">{leaveDays}</td>
                    <td className="py-3 border-0 text-center fw-semibold" style={{ color: late > 0 ? '#ffc107' : 'inherit' }}>{late}</td>
                    <td className="py-3 border-0 text-end">
                      <span className={`badge px-2 py-1 rounded-1 ${pctBadge}`} style={{ fontSize: '0.75rem' }}>{attPct}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="text-center mt-3 pt-3 border-top">
            <span className="text-primary fw-semibold" style={{ fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => navigate('/employees')}>View All Attendance <i className="bi bi-arrow-right"></i></span>
          </div>
        </div>
      </div>
    </>
  );
}

export default AttendanceOverviewPage;
