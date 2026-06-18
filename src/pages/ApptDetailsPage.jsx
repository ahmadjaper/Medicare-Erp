import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { getAppointmentDetails, updateAppointmentStatus } from '../services/api';
import patientAvatar from '../assets/img/patient-avatar.png';
import doctorAvatar from '../assets/img/doctor-avatar.png';
import '../assets/css/details.css';

function ApptDetailsPage() {
  const navigate = useNavigate();

  // 1. Component State
  const [apptData, setApptData] = useState(null);

  // 2. Fetch Data Lifecycle
  useEffect(() => {
    async function loadData() {
      const data = await getAppointmentDetails("APT-1001");
      setApptData(data);
    }
    loadData();
  }, []);

  // 3. Status Action Handler
  const handleCancelAppointment = async () => {
    if (!apptData || apptData.status === "CANCELLED") return;

    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      const res = await updateAppointmentStatus(apptData.id, "CANCELLED");
      if (res.success) {
        // Fetch updated status
        const updatedData = await getAppointmentDetails("APT-1001");
        setApptData(updatedData);
        alert("Appointment status updated to CANCELLED successfully.");
      }
    }
  };

  const handleEditAppointment = () => {
    alert("Opening Edit Appointment panel... (REST integration ready)");
  };

  const handleBookNext = (e) => {
    e.preventDefault();
    // Navigate reactive-ly to /schedule
    navigate("/schedule");
  };

  // 4. Utility Formatters
  const formatDateTimeStr = (isoString) => {
    const dateObj = new Date(isoString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const datePart = dateObj.toLocaleDateString('en-US', options);
    
    const timePart = dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    return `${datePart}, ${timePart}`;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(value);
  };

  if (!apptData) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Appointment Details...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top Navbar & Header Breadcrumbs */}
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Appointments</span>
            <span className="mx-1">/</span>
            <span className="text-muted">Appointment Details</span>
            <span className="mx-2 fw-bold text-dark fs-5">{apptData.id}</span>
          </nav>
        </div>
        
        {/* Renders right-hand search navbar, including the chat/message bubble */}
        <TopNavbar showChat={true} showUserRole={true} />
      </div>

      {/* Main Title Row & Actions */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h1 className="page-title mb-1">Appointment Details</h1>
          <div className="text-muted fs-6">
            Reviewing patient visit for <span className="fw-semibold text-dark">{apptData.type}</span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn-edit-appt" onClick={handleEditAppointment}>
            <i className="bi bi-pencil"></i> Edit Appointment
          </button>
          <button 
            className={`btn-cancel-appt ${apptData.status === "CANCELLED" ? 'opacity-50' : ''}`}
            onClick={handleCancelAppointment}
            disabled={apptData.status === "CANCELLED"}
          >
            <i className={apptData.status === "CANCELLED" ? "bi bi-x-circle-fill" : "bi bi-x-circle"}></i>
            {apptData.status === "CANCELLED" ? " Cancelled" : " Cancel Appointment"}
          </button>
        </div>
      </div>

      {/* 2-Column Grid Split */}
      <div className="row">
        
        {/* Left wider column */}
        <div className="col-lg-8">
          {/* Double Card row: Info & Payment */}
          <div className="row g-4 mb-4">
            {/* Info Card */}
            <div className="col-md-6">
              <div className="card dashboard-card p-4 h-100">
                <div className="card-header-caps">
                  <span>Appointment Info</span>
                  <span className={apptData.status === "CONFIRMED" ? "badge-confirmed" : "badge-cancelled"}>
                    {apptData.status}
                  </span>
                </div>
                <div className="info-list-row">
                  <span className="info-label">Appointment ID</span>
                  <span className="info-value">{apptData.id}</span>
                </div>
                <div className="info-list-row">
                  <span className="info-label">Date & Time</span>
                  <span className="info-value">{formatDateTimeStr(apptData.dateTime)}</span>
                </div>
                <div className="info-list-row">
                  <span className="info-label">Type</span>
                  <span className="info-value">{apptData.type}</span>
                </div>
                <div className="info-list-row">
                  <span className="info-label">Duration</span>
                  <span className="info-value">{apptData.durationMinutes} Minutes</span>
                </div>
              </div>
            </div>

            {/* Payment Card */}
            <div className="col-md-6">
              <div className="card dashboard-card p-4 h-100">
                <div className="card-header-caps">
                  <span>Payment Details</span>
                  <span className="badge-paid">{apptData.payment.status}</span>
                </div>
                <div className="d-flex align-items-baseline gap-2 mb-3">
                  <span className="fs-2 fw-bold text-dark" style={{ fontWeight: 800 }}>
                    {formatCurrency(apptData.payment.amount)}
                  </span>
                </div>
                <div className="info-list-row">
                  <span className="info-label">Method</span>
                  <span className="info-value">{apptData.payment.method}</span>
                </div>
                <div className="info-list-row">
                  <span className="info-label">Transaction ID</span>
                  <span className="info-value">{apptData.payment.transactionId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Card */}
          <div className="card dashboard-card p-4 mb-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <img src={patientAvatar} id="patient-avatar" className="patient-avatar-img" alt={apptData.patient.name} />
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h3 className="fw-bold mb-0 fs-4 text-dark">{apptData.patient.name}</h3>
                  <a href="#" className="text-muted" aria-label="Open Patient Card" onClick={(e) => { e.preventDefault(); alert("Opening patient record details..."); }}>
                    <i className="bi bi-box-arrow-up-right"></i>
                  </a>
                </div>
                <div className="text-muted fs-6">{`${apptData.patient.age} Years, ${apptData.patient.gender} • ${apptData.patient.id}`}</div>
              </div>
            </div>

            {/* Quick Contact Rows */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="patient-contact-badge">
                  <i className="bi bi-telephone"></i> {apptData.patient.phone}
                </div>
              </div>
              <div className="col-md-4">
                <div className="patient-contact-badge">
                  <i className="bi bi-envelope"></i> {apptData.patient.email}
                </div>
              </div>
              <div className="col-md-4">
                <div className="patient-contact-badge">
                  <i className="bi bi-geo-alt"></i> {apptData.patient.address}
                </div>
              </div>
            </div>

            <hr className="text-muted opacity-25 mb-4" />

            {/* Medical Metrics details */}
            <div className="row g-3">
              <div className="col-md-3">
                <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>Blood Group</div>
                <span className="badge-blood">{apptData.patient.bloodGroup}</span>
              </div>
              <div className="col-md-4">
                <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>Allergies</div>
                <div className="fw-bold text-dark">{apptData.patient.allergies}</div>
              </div>
              <div className="col-md-5">
                <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>History</div>
                <div className="fw-bold text-dark">{apptData.patient.history}</div>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="card dashboard-card p-4 mb-4 mb-lg-0">
            <div className="card-header-caps">
              <span><i className="bi bi-file-text me-1"></i> Appointment Notes & Reason</span>
            </div>
            <h4 className="fw-bold fs-6 mb-2">Reason for Visit</h4>
            <p className="text-muted fs-6 mb-4">{apptData.clinicalNotes.reason}</p>
            
            <div className="internal-notes-box">
              <h5>Doctor's Internal Notes</h5>
              <p>{apptData.clinicalNotes.internalNotes}</p>
            </div>
          </div>
        </div>

        {/* Right narrower column */}
        <div className="col-lg-4">
          
          {/* Assigned Doctor Card */}
          <div className="card dashboard-card p-4 mb-4">
            <div className="card-header-caps">Assigned Doctor</div>
            <div className="d-flex align-items-center gap-3 mb-4">
              <img src={doctorAvatar} id="doctor-avatar" className="patient-avatar-img" alt={apptData.assignedDoctor.name} />
              <div>
                <h3 className="fw-bold mb-0 fs-5 text-dark">{apptData.assignedDoctor.name}</h3>
                <div className="text-primary fw-semibold fs-6 mb-1">{apptData.assignedDoctor.specialty}</div>
                <div className="text-warning d-flex align-items-center gap-1" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-star-fill"></i>
                  <span className="text-muted fw-medium">{`${apptData.assignedDoctor.rating} (${apptData.assignedDoctor.reviewsCount} reviews)`}</span>
                </div>
              </div>
            </div>
            
            <div className="info-list-row">
              <span className="info-label"><i className="bi bi-telephone me-1"></i> Phone</span>
              <span className="info-value text-dark">{apptData.assignedDoctor.phone}</span>
            </div>
            <div className="info-list-row">
              <span className="info-label"><i className="bi bi-envelope me-1"></i> Email</span>
              <span className="info-value text-dark">{apptData.assignedDoctor.email}</span>
            </div>
          </div>

          {/* Activity Timeline Card */}
          <div className="card dashboard-card p-4 mb-4">
            <div className="card-header-caps">Activity Timeline</div>
            <div className="activity-timeline">
              {apptData.timeline.map((step, idx) => {
                let stateClass = "pending";
                if (step.completed) stateClass = "completed";
                if (step.current) stateClass = "current";
                if (step.isCancelled) stateClass = "current";
                
                return (
                  <div key={idx} className={`timeline-item ${stateClass}`}>
                    {step.isCancelled ? (
                      <span className="timeline-marker bg-danger border-danger"></span>
                    ) : (
                      <span className="timeline-marker"></span>
                    )}
                    <div className="timeline-content">
                      <div className="timeline-title">{step.status}</div>
                      <div className="timeline-time">{step.timestamp}</div>
                      {step.actor && (
                        <div className="timeline-actor">BY {step.actor}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dark Navy CTA Card */}
          <div className="card navy-action-card">
            <p>{`Create a new session for ${apptData.patient.name} after reviewing the visit logs.`}</p>
            <button className="btn-navy-action" onClick={handleBookNext}>Book Next Slot</button>
          </div>
        </div>

      </div>
    </>
  );
}

export default ApptDetailsPage;
