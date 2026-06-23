import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import DoctorStatCard from '../components/DoctorStatCard';
import { doctors } from '../data/doctorsData';
import { appointments } from '../services/api';
import '../assets/css/doctors.css';

function AppointmentsPage() {
  const navigate = useNavigate();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Collect unique departments covered by doctors dynamically
  const departments = [...new Set(doctors.map(d => d.department))];

  // Mapped mock appointments list populated dynamically with doctor names and departments
  const appointmentsList = appointments.map(appt => {
    const doc = doctors.find(d => d.id === appt.doctorId) || doctors[0];
    
    // Format dateTime display if it is ISO format
    let displayTime = appt.dateTime;
    if (appt.dateTime.includes('T')) {
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
      doctorName: doc.name,
      department: doc.department
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
  const confirmedCount = appointmentsList.filter(a => a.status === 'CONFIRMED').length;
  const completedCount = appointmentsList.filter(a => a.status === 'COMPLETED').length;
  const cancelledCount = appointmentsList.filter(a => a.status === 'CANCELLED').length;

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
      <div className="mb-4">
        <h1 className="page-title mb-1">Appointments</h1>
        <div className="text-muted" style={{ fontSize: '0.9rem' }}>
          Monitor and manage hospital patient appointments.
        </div>
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
              {departments.map((dept, idx) => (
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
              <i className="bi bi-plus-lg"></i> Book Appointment
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
                <th scope="col" style={{ fontWeight: 600, width: '180px' }}>ACTIONS</th>
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
                  <td>{appt.type}</td>
                  <td>
                    <span className={
                      appt.status === 'COMPLETED' ? 'badge-completed' :
                      appt.status === 'CANCELLED' ? 'badge-cancelled' :
                      'badge-confirmed'
                    }>
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
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          if (confirm(`Are you sure you want to cancel appointment ${appt.id}?`)) {
                            alert(`Cancel action triggered for ${appt.id}. (Future Cancel Appointment screen will be linked here)`);
                          }
                        }}
                        style={{ fontSize: '0.8rem', fontWeight: 600 }}
                      >
                        <i className="bi bi-x-circle me-1"></i> Cancel
                      </button>
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
    </>
  );
}

export default AppointmentsPage;
