import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import DoctorStatCard from '../components/DoctorStatCard';
import { useErpStore } from '../store/erpStore';
import '../assets/css/doctors.css';

function AppointmentsPage() {
  const navigate = useNavigate();
  const { appointments, doctors, cancelAppointment, rescheduleAppointment } = useErpStore();
  
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [reschedTime, setReschedTime] = useState("09:00");
  const [reschedDate, setReschedDate] = useState("2024-05-22");

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Collect unique departments covered by doctors dynamically
  const departmentsList = [...new Set(doctors.map(d => d.department))];

  // Mapped appointments list populated dynamically with doctor names and departments
  const appointmentsList = appointments.map(appt => {
    const doc = doctors.find(d => d.id === appt.doctorId || d.name === appt.doctorName) || {};
    
    // Format dateTime display if it is ISO format
    let displayTime = appt.dateTime || appt.time;
    if (appt.dateTime && appt.dateTime.includes('T')) {
      const dateObj = new Date(appt.dateTime);
      displayTime = dateObj.toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    
    return {
      ...appt,
      dateTime: displayTime,
      doctorName: appt.doctorName || doc.name || "N/A",
      department: doc.department || "General"
    };
  });

  // Filtering Logic
  const filteredAppointments = appointmentsList.filter(appt => {
    const matchesSearch = appt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          appt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          appt.id.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesDepartment = selectedDepartment === 'All' || appt.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All' || appt.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Calculate statistics for KPI cards dynamically
  const totalCount = appointmentsList.length;
  const confirmedCount = appointmentsList.filter(a => a.status === 'CONFIRMED' || a.status === 'Confirmed').length;
  const completedCount = appointmentsList.filter(a => a.status === 'COMPLETED' || a.status === 'Completed').length;
  const cancelledCount = appointmentsList.filter(a => a.status === 'CANCELLED' || a.status === 'Cancelled').length;

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (rescheduleTarget) {
      // Convert 24h to AM/PM for layout display
      let displayTime = reschedTime;
      const [h, m] = reschedTime.split(":");
      const hours = parseInt(h);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      displayTime = `${String(formattedHours).padStart(2, '0')}:${m} ${ampm}`;

      rescheduleAppointment(rescheduleTarget, displayTime, reschedDate);
      setRescheduleTarget(null);
      useErpStore.getState().showToast("Appointment rescheduled successfully!", "success");
    }
  };

  const handleCancelClick = (apptId) => {
    if (confirm(`Are you sure you want to cancel appointment ${apptId}?`)) {
      cancelAppointment(apptId);
      useErpStore.getState().showToast("Appointment cancelled successfully!", "success");
    }
  };

  return (
    <>
      {/* Top Navbar & Header Breadcrumbs */}
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Operations</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Appointments</span>
          </nav>
        </div>
        <TopNavbar showUserRole={true} />
      </div>

      {/* Main Title Row */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="page-title mb-1">Appointments</h1>
          <div className="text-muted" style={{ fontSize: '0.9rem' }}>
            Monitor and manage hospital patient appointments.
          </div>
        </div>
        <button className="btn-medicore" onClick={() => navigate('/appointments/create')}>
          <i className="bi bi-plus-lg"></i> Book Appointment
        </button>
      </div>

      {/* Statistics Row / KPI Cards */}
      <div className="stats-card-container mb-4">
        <DoctorStatCard 
          icon="bi-calendar-event" 
          iconColorClass="icon-blue" 
          label="TOTAL APPOINTMENTS" 
          value={totalCount} 
        />
        <DoctorStatCard 
          icon="bi-calendar-check" 
          iconColorClass="icon-green" 
          label="CONFIRMED" 
          value={confirmedCount} 
        />
        <DoctorStatCard 
          icon="bi-check2-circle" 
          iconColorClass="icon-gray" 
          label="COMPLETED" 
          value={completedCount} 
        />
        <DoctorStatCard 
          icon="bi-calendar-x" 
          iconColorClass="icon-orange" 
          label="CANCELLED" 
          value={cancelledCount} 
        />
      </div>

      {/* Search and Filters Action Bar */}
      <div className="dashboard-card p-3 mb-4">
        <div className="row g-3 align-items-center">
          {/* Search Input */}
          <div className="col-md-4">
            <div className="position-relative">
              <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                className="form-control ps-5" 
                placeholder="Search by Patient, Doctor or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.9rem', height: '40px' }}
              />
            </div>
          </div>
          
          {/* Department Filter */}
          <div className="col-md-3">
            <select 
              className="form-select" 
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{ fontSize: '0.9rem', height: '40px', cursor: 'pointer' }}
            >
              <option value="All">All Departments</option>
              {departmentsList.map((dept, idx) => (
                <option key={idx} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          {/* Status Filter */}
          <div className="col-md-3">
            <select 
              className="form-select" 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ fontSize: '0.9rem', height: '40px', cursor: 'pointer' }}
            >
              <option value="All">All Statuses</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
          
          {/* Book Appointment Action Button */}
          <div className="col-md-2 text-md-end">
            <button 
              className="btn-medicore w-100 justify-content-center" 
              onClick={() => navigate('/appointments/create')}
              style={{ height: '40px' }}
            >
              <i className="bi bi-plus-lg"></i> Book Appt
            </button>
          </div>
        </div>
      </div>

      {/* Appointments Grid Table */}
      <div className="dashboard-card p-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.875rem' }}>
            <thead className="table-header-custom" style={{ backgroundColor: '#f8fafc' }}>
              <tr>
                <th scope="col" style={{ fontWeight: 600 }}>APPT ID</th>
                <th scope="col" style={{ fontWeight: 600 }}>PATIENT</th>
                <th scope="col" style={{ fontWeight: 600 }}>ASSIGNED DOCTOR</th>
                <th scope="col" style={{ fontWeight: 600 }}>DEPARTMENT</th>
                <th scope="col" style={{ fontWeight: 600 }}>DATE & TIME</th>
                <th scope="col" style={{ fontWeight: 600 }}>TYPE</th>
                <th scope="col" style={{ fontWeight: 600 }}>STATUS</th>
                <th scope="col" style={{ fontWeight: 600, width: '220px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appt) => (
                <tr key={appt.id} className="table-row-custom">
                  <td className="fw-bold text-muted">{appt.id}</td>
                  <td className="fw-bold text-dark">{appt.patientName}</td>
                  <td>{appt.doctorName}</td>
                  <td>{appt.department}</td>
                  <td className="text-muted">{appt.dateTime}</td>
                  <td>{appt.type || "Consultation"}</td>
                  <td>
                    <span 
                      className="badge-active"
                      style={{
                        backgroundColor: appt.status?.toUpperCase() === 'COMPLETED' ? '#e0f2fe' : appt.status?.toUpperCase() === 'CANCELLED' ? '#f1f5f9' : '#dcfce7',
                        color: appt.status?.toUpperCase() === 'COMPLETED' ? '#0369a1' : appt.status?.toUpperCase() === 'CANCELLED' ? '#64748b' : '#15803d'
                      }}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate(`/appointments/details/${appt.id}`)}
                        style={{ fontSize: '0.8rem', fontWeight: 600 }}
                      >
                        <i className="bi bi-eye me-1"></i> Details
                      </button>
                      {appt.status?.toUpperCase() !== "CANCELLED" && (
                        <>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              setRescheduleTarget(appt.id);
                              setReschedDate(appt.dateTime?.split(',')[0] || "2024-05-22");
                            }}
                            style={{ fontSize: '0.8rem', fontWeight: 600 }}
                          >
                            Reschedule
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleCancelClick(appt.id)}
                            style={{ fontSize: '0.8rem', fontWeight: 600 }}
                          >
                            <i className="bi bi-x-circle me-1"></i> Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No appointments found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal: Reschedule Appointment Inline */}
      {rescheduleTarget && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 1060 }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-sm" role="document">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header bg-secondary text-white border-0 py-3" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                <h5 className="modal-title fw-bold"><i className="bi bi-clock-history me-2"></i>Reschedule</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setRescheduleTarget(null)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleRescheduleSubmit}>
                <div className="modal-body p-3">
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{ fontSize: '0.8rem' }}>New Date</label>
                    <input type="date" className="form-control form-control-sm" value={reschedDate} onChange={(e) => setReschedDate(e.target.value)} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-bold" style={{ fontSize: '0.8rem' }}>New Time</label>
                    <input type="time" className="form-control form-control-sm" value={reschedTime} onChange={(e) => setReschedTime(e.target.value)} required />
                  </div>
                </div>
                <div className="modal-footer border-0 p-3 pt-0">
                  <button type="button" className="btn btn-sm btn-light fw-bold" onClick={() => setRescheduleTarget(null)}>Cancel</button>
                  <button type="submit" className="btn btn-sm btn-primary fw-bold">Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AppointmentsPage;
