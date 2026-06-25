import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { useErpStore } from '../store/erpStore';
import doctorAvatar from '../assets/img/doctor-avatar.png';
import Chart from 'chart.js/auto';

function DepartmentDashboardPage() {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const { departments, doctors, appointments } = useErpStore();

  const dept = departments.find(d => d.id === departmentId || d.id === departmentId?.toUpperCase());

  const performanceChartRef = useRef(null);
  const appointmentChartRef = useRef(null);

  const [timeRange, setTimeRange] = useState("This Month");

  useEffect(() => {
    if (!dept) return;

    const renderCharts = () => {
      // 1. Performance Analytics Line Chart
      const perfCtx = document.getElementById('perfChart');
      if (perfCtx) {
        if (performanceChartRef.current) {
          performanceChartRef.current.destroy();
        }
        
        // Generate pseudo-random deterministic data based on department id
        const seed = dept.id.charCodeAt(0) + dept.id.charCodeAt(1);
        const dataPoints = Array.from({ length: 6 }, (_, i) => 10000 + (seed * 1000) + Math.random() * 20000 + (i * 5000));
        
        // Create gradient
        const gradient = perfCtx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(13, 110, 253, 0.2)');
        gradient.addColorStop(1, 'rgba(13, 110, 253, 0)');

        performanceChartRef.current = new Chart(perfCtx, {
          type: 'line',
          data: {
            labels: ['1 May', '8 May', '15 May', '22 May', '29 May', '5 Jun'],
            datasets: [{
              label: 'Revenue',
              data: dataPoints,
              borderColor: '#0d6efd',
              borderWidth: 4,
              backgroundColor: gradient,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#fff',
              pointBorderColor: '#0d6efd',
              pointBorderWidth: 3,
              pointRadius: 6,
              pointHoverRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: {
                beginAtZero: true,
                border: { display: false },
                grid: { color: '#f1f5f9', borderDash: [5, 5] },
                ticks: {
                  callback: (value) => '$' + (value / 1000) + 'k',
                  color: '#94a3b8',
                  font: { size: 11 }
                }
              },
              x: {
                border: { display: false },
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { size: 11 } }
              }
            }
          }
        });
      }

      // 2. Appointment Statistics Doughnut Chart
      const apptCtx = document.getElementById('apptChart');
      if (apptCtx) {
        if (appointmentChartRef.current) {
          appointmentChartRef.current.destroy();
        }

        const completed = 192 + (seed * 2);
        const pending = 80 + seed;
        const cancelled = 48 + Math.floor(seed / 2);

        appointmentChartRef.current = new Chart(apptCtx, {
          type: 'doughnut',
          data: {
            labels: ['Completed', 'Pending', 'Cancelled'],
            datasets: [{
              data: [completed, pending, cancelled],
              backgroundColor: ['#198754', '#0d6efd', '#dc3545'],
              borderWidth: 0,
              cutout: '75%'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return ` ${context.label}: ${context.raw}`;
                  }
                }
              }
            }
          }
        });
      }
    };

    // Small timeout to ensure canvas elements are mounted
    setTimeout(renderCharts, 50);

    return () => {
      if (performanceChartRef.current) performanceChartRef.current.destroy();
      if (appointmentChartRef.current) appointmentChartRef.current.destroy();
    };
  }, [dept, timeRange]);

  if (!dept) {
    return (
      <div className="p-5 text-center text-danger fw-bold">
        Error: Department not found.
      </div>
    );
  }

  // Filter Doctors for this department
  const deptDoctors = doctors.filter(doc => {
    const specialty = doc.specialty.toLowerCase();
    const deptName = dept.name.toLowerCase();
    return specialty.includes(deptName) || doc.id === dept.headDoctorId;
  });

  // KPI Calculations
  const seed = dept.id.charCodeAt(0) + dept.id.charCodeAt(1);
  const totalPatients = 1000 + (seed * 10);
  const activeDoctors = deptDoctors.length;
  const weeklyRevenue = 30000 + (seed * 500);
  const bedOccupancy = Math.min(100, 60 + (seed % 35));

  // Determine Support Staff (Mock data based on department)
  const supportStaff = [
    { id: 1, name: "John Doe", role: "Head Nurse", initials: "JD" },
    { id: 2, name: "Alice Smith", role: "Technician", initials: "AS" },
    { id: 3, name: "Mark Wilson", role: "Administrator", initials: "MW" }
  ].slice(0, 1 + (seed % 3));

  // Appointments mapping
  const docIds = deptDoctors.map(d => d.id);
  const deptAppointments = appointments.filter(a => docIds.includes(a.doctorId)).slice(0, 5);

  const completedCount = 192 + (seed * 2);
  const pendingCount = 80 + seed;
  const cancelledCount = 48 + Math.floor(seed / 2);
  const totalAppts = completedCount + pendingCount + cancelledCount;

  return (
    <>
      <style>{`
        .dept-dashboard-container {
          font-family: 'Inter', sans-serif;
          background-color: #f8f9fa;
          color: #0f172a;
          padding-bottom: 2rem;
        }
        
        .dept-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        
        .dept-back-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #0f172a;
          text-decoration: none;
          font-size: 1.5rem;
          font-weight: 700;
          transition: transform 0.2s;
          cursor: pointer;
        }
        .dept-back-link:hover {
          transform: translateX(-3px);
        }
        
        .kpi-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 1.25rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        
        .kpi-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        
        .kpi-icon-box {
          color: #0d6efd;
          font-size: 1.2rem;
        }
        
        .kpi-badge {
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          border-radius: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .kpi-badge.success { background-color: #d1fae5; color: #059669; }
        .kpi-badge.danger { background-color: #fee2e2; color: #dc2626; }
        
        .kpi-label {
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }
        
        .kpi-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
        }
        
        .panel-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          height: calc(100% - 1.5rem);
        }
        
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        
        .panel-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #334155;
          margin: 0;
        }
        
        .panel-link {
          font-size: 0.8rem;
          color: #0d6efd;
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
        }
        .panel-link:hover { text-decoration: underline; }
        
        .list-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .list-item-row:last-child {
          border-bottom: none;
        }
        
        .person-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .person-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid #e2e8f0;
        }
        
        .person-initials {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #eff6ff;
          color: #0d6efd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.85rem;
        }
        
        .person-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 2px;
        }
        
        .person-role {
          font-size: 0.75rem;
          color: #64748b;
        }
        
        .list-chevron {
          color: #cbd5e1;
          font-size: 0.9rem;
        }
        
        .chart-container {
          position: relative;
          height: 250px;
          width: 100%;
        }
        
        .donut-container {
          position: relative;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .donut-center-text {
          position: absolute;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        
        .donut-total {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1;
        }
        .donut-label {
          font-size: 0.75rem;
          color: #64748b;
        }
        
        .stats-legend {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          justify-content: center;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #334155;
        }
        
        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .legend-dot.completed { background-color: #198754; }
        .legend-dot.pending { background-color: #0d6efd; }
        .legend-dot.cancelled { background-color: #dc3545; }
        
        .legend-count {
          color: #64748b;
          font-size: 0.75rem;
          margin-left: auto;
        }
        
        .timeline-container {
          position: relative;
          padding-left: 2rem;
        }
        .timeline-container::before {
          content: '';
          position: absolute;
          left: 11px;
          top: 5px;
          bottom: 5px;
          width: 2px;
          background-color: #e2e8f0;
        }
        .timeline-item {
          position: relative;
          margin-bottom: 1.5rem;
        }
        .timeline-icon {
          position: absolute;
          left: -2rem;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          color: #0d6efd;
          z-index: 2;
        }
        .timeline-icon.success {
          border-color: #10b981;
          color: #10b981;
        }
        .timeline-content {
          background: #f8f9fa;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
        }
        .timeline-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }
        .timeline-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #0f172a;
        }
        .timeline-time {
          font-size: 0.7rem;
          color: #94a3b8;
        }
        .timeline-desc {
          font-size: 0.8rem;
          color: #64748b;
          margin: 0;
        }
        
        .schedule-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .schedule-time {
          font-size: 0.75rem;
          font-weight: 600;
          color: #334155;
          min-width: 60px;
          padding-top: 0.25rem;
        }
        .schedule-card {
          flex: 1;
          background: #f8f9fa;
          border-left: 3px solid #0d6efd;
          padding: 0.75rem 1rem;
          border-radius: 0 0.375rem 0.375rem 0;
        }
        .schedule-card.danger { border-left-color: #dc3545; }
        .schedule-card-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.25rem;
        }
        .schedule-card-desc {
          font-size: 0.75rem;
          color: #64748b;
        }
      `}</style>

      <div className="dept-dashboard-container">
        
        {/* Top Navbar Header */}
        <div className="dept-header-bar">
          <div className="dept-back-link" onClick={() => navigate('/departments')}>
            <i className="bi bi-arrow-left"></i> {dept.name} Department
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="position-relative" style={{ width: '250px' }}>
              <i className="bi bi-search position-absolute" style={{ left: '10px', top: '8px', color: '#94a3b8' }}></i>
              <input type="text" className="form-control form-control-sm ps-5" placeholder="Search department..." style={{ borderRadius: '0.375rem' }} />
            </div>
            <i className="bi bi-bell fs-5 text-muted" style={{ cursor: 'pointer' }}></i>
            <i className="bi bi-envelope fs-5 text-muted" style={{ cursor: 'pointer' }}></i>
            <button className="btn btn-primary btn-sm fw-bold d-flex align-items-center gap-2" onClick={() => navigate(`/departments/${dept.id}/edit`)}>
              <i className="bi bi-pencil-fill"></i> Edit Department
            </button>
          </div>
        </div>

        {/* Top KPI Cards Row */}
        <div className="row g-3 mb-3">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="kpi-card">
              <div className="kpi-title-row">
                <i className="bi bi-people-fill kpi-icon-box"></i>
                <div className="kpi-badge success"><i className="bi bi-graph-up-arrow"></i> 12.5%</div>
              </div>
              <div>
                <div className="kpi-label">Total Patients</div>
                <div className="kpi-value">{totalPatients.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="kpi-card">
              <div className="kpi-title-row">
                <i className="bi bi-file-medical-fill kpi-icon-box text-primary"></i>
                <div className="kpi-badge success"><i className="bi bi-arrow-up-short"></i> 2 added</div>
              </div>
              <div>
                <div className="kpi-label">Active Doctors</div>
                <div className="kpi-value">{activeDoctors}</div>
              </div>
            </div>
          </div>
          
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="kpi-card">
              <div className="kpi-title-row">
                <i className="bi bi-cash-stack kpi-icon-box text-primary"></i>
                <div className="kpi-badge success"><i className="bi bi-graph-up-arrow"></i> 8.2%</div>
              </div>
              <div>
                <div className="kpi-label">Weekly Revenue</div>
                <div className="kpi-value">${weeklyRevenue.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="kpi-card">
              <div className="kpi-title-row">
                <i className="bi bi-hospital kpi-icon-box text-primary"></i>
                {bedOccupancy > 80 ? (
                  <div className="kpi-badge danger"><i className="bi bi-exclamation-triangle"></i> High</div>
                ) : (
                  <div className="kpi-badge success">Normal</div>
                )}
              </div>
              <div>
                <div className="kpi-label">Bed Occupancy</div>
                <div className="kpi-value">{bedOccupancy}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          {/* Left Column */}
          <div className="col-12 col-lg-4">
            {/* Doctors in Department */}
            <div className="panel-card" style={{ height: 'auto', marginBottom: '1rem' }}>
              <div className="panel-header">
                <h3 className="panel-title">Doctors in Department</h3>
                <span className="panel-link" onClick={() => navigate('/doctors')}>View All</span>
              </div>
              <div>
                {deptDoctors.slice(0, 3).map(doc => (
                  <div key={doc.id} className="list-item-row">
                    <div className="person-info">
                      <img src={doctorAvatar} className="person-avatar" alt="doc" />
                      <div>
                        <div className="person-name">{doc.name}</div>
                        <div className="person-role">{doc.specialty}</div>
                      </div>
                    </div>
                    <i className="bi bi-chevron-right list-chevron"></i>
                  </div>
                ))}
                {deptDoctors.length === 0 && (
                  <div className="text-muted text-center py-3" style={{ fontSize: '0.85rem' }}>No doctors assigned.</div>
                )}
              </div>
            </div>

            {/* Support Staff */}
            <div className="panel-card" style={{ height: 'auto', marginBottom: '1rem' }}>
              <div className="panel-header">
                <h3 className="panel-title">Support Staff</h3>
                <span className="panel-link">View All</span>
              </div>
              <div>
                {supportStaff.map(staff => (
                  <div key={staff.id} className="list-item-row">
                    <div className="person-info">
                      <div className="person-initials">{staff.initials}</div>
                      <div>
                        <div className="person-name">{staff.name}</div>
                        <div className="person-role">{staff.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-12 col-lg-8">
            {/* Performance Analytics */}
            <div className="panel-card" style={{ height: 'auto', marginBottom: '1rem' }}>
              <div className="panel-header">
                <h3 className="panel-title">Performance Analytics</h3>
                <select 
                  className="form-select form-select-sm" 
                  style={{ width: 'auto', fontSize: '0.75rem', borderRadius: '0.375rem' }}
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Quarter</option>
                </select>
              </div>
              <div className="chart-container">
                <canvas id="perfChart"></canvas>
              </div>
            </div>

            {/* Bottom Split */}
            <div className="row g-3">
              {/* Appointment Statistics */}
              <div className="col-12 col-md-6">
                <div className="panel-card" style={{ height: 'auto' }}>
                  <div className="panel-header">
                    <h3 className="panel-title">Appointment Statistics</h3>
                    <i className="bi bi-three-dots text-muted" style={{ cursor: 'pointer' }}></i>
                  </div>
                  <div className="row align-items-center mt-3">
                    <div className="col-6">
                      <div className="donut-container">
                        <canvas id="apptChart"></canvas>
                        <div className="donut-center-text">
                          <div className="donut-total">{totalAppts}</div>
                          <div className="donut-label">Total</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="stats-legend">
                        <div className="legend-item">
                          <div className="legend-dot completed"></div>
                          <div>Completed</div>
                          <div className="legend-count">{completedCount} ({(completedCount/totalAppts * 100).toFixed(0)}%)</div>
                        </div>
                        <div className="legend-item">
                          <div className="legend-dot pending"></div>
                          <div>Pending</div>
                          <div className="legend-count">{pendingCount} ({(pendingCount/totalAppts * 100).toFixed(0)}%)</div>
                        </div>
                        <div className="legend-item">
                          <div className="legend-dot cancelled"></div>
                          <div>Cancelled</div>
                          <div className="legend-count">{cancelledCount} ({(cancelledCount/totalAppts * 100).toFixed(0)}%)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Schedule & Recent Activity */}
              <div className="col-12 col-md-6">
                <div className="panel-card" style={{ height: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  <div>
                    <div className="panel-header mb-3">
                      <h3 className="panel-title">Recent Activity</h3>
                      <span className="panel-link">View All</span>
                    </div>
                    <div className="timeline-container">
                      <div className="timeline-item">
                        <div className="timeline-icon"><i className="bi bi-calendar-event"></i></div>
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <span className="timeline-title">New Appointment</span>
                            <span className="timeline-time">10 min ago</span>
                          </div>
                          <p className="timeline-desc">Patient John Doe booked with Dr. Sarah Johnson.</p>
                        </div>
                      </div>
                      <div className="timeline-item mb-0">
                        <div className="timeline-icon success"><i className="bi bi-check2"></i></div>
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <span className="timeline-title">Procedure Completed</span>
                            <span className="timeline-time">1 hr ago</span>
                          </div>
                          <p className="timeline-desc">Checkup completed successfully.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="panel-header mb-3">
                      <h3 className="panel-title">Today's Schedule</h3>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-light border p-1 py-0"><i className="bi bi-chevron-left text-muted"></i></button>
                        <button className="btn btn-sm btn-light border p-1 py-0"><i className="bi bi-chevron-right text-muted"></i></button>
                      </div>
                    </div>
                    <div>
                      {deptAppointments.slice(0, 2).map((appt, i) => (
                        <div key={appt.id} className="schedule-item">
                          <div className="schedule-time">{appt.time}</div>
                          <div className={`schedule-card ${i % 2 !== 0 ? 'danger' : ''}`}>
                            <div className="schedule-card-title">{appt.type} - {appt.patientName}</div>
                            <div className="schedule-card-desc"><i className="bi bi-person me-1"></i>{appt.doctorName} | {appt.room}</div>
                          </div>
                        </div>
                      ))}
                      {deptAppointments.length === 0 && (
                        <div className="text-muted text-center" style={{ fontSize: '0.8rem' }}>No schedule for today.</div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DepartmentDashboardPage;
