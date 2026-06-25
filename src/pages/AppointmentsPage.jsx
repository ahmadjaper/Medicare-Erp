import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { useErpStore } from '../store/erpStore';

function AppointmentsPage() {
  const navigate = useNavigate();
  const { appointments, cancelAppointment, rescheduleAppointment } = useErpStore();
  
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [reschedTime, setReschedTime] = useState("09:00");
  const [reschedDate, setReschedDate] = useState("2024-05-22");

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

  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Operations</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Appointments</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title">Appointments</h1>
        <button className="btn-medicore" onClick={() => useErpStore.getState().showToast("Opening Book Appointment form...", "info")}>
          <i className="bi bi-plus-lg"></i> Book Appointment
        </button>
      </div>

      <div className="dashboard-card p-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.9rem' }}>
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ fontWeight: 600 }}>Appt ID</th>
                <th scope="col" style={{ fontWeight: 600 }}>Patient</th>
                <th scope="col" style={{ fontWeight: 600 }}>Date & Time</th>
                <th scope="col" style={{ fontWeight: 600 }}>Type</th>
                <th scope="col" style={{ fontWeight: 600 }}>Doctor</th>
                <th scope="col" style={{ fontWeight: 600 }}>Status</th>
                <th scope="col" style={{ fontWeight: 600, width: '200px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td className="fw-bold text-primary">{appt.id}</td>
                  <td>{appt.patientName}</td>
                  <td>{appt.dateTime ? new Date(appt.dateTime).toLocaleString() : appt.time}</td>
                  <td>{appt.type || "Consultation"}</td>
                  <td>{appt.doctorName}</td>
                  <td>
                    <span 
                      className="badge-active"
                      style={{
                        backgroundColor: appt.status === 'COMPLETED' ? '#e0f2fe' : appt.status === 'CANCELLED' ? '#f8fafc' : 'var(--badge-active-bg)',
                        color: appt.status === 'COMPLETED' ? '#0369a1' : appt.status === 'CANCELLED' ? '#94a3b8' : 'var(--badge-active-text)'
                      }}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate(`/appointments/details/${appt.id}`)}
                      >
                        View Details
                      </button>
                      {appt.status !== "CANCELLED" && (
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => { e.stopPropagation(); cancelAppointment(appt.id); }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
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
