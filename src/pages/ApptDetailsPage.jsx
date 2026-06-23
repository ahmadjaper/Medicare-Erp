import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { getAppointmentDetails, updateAppointmentStatus, appointments } from '../services/api';
import { doctors } from '../data/doctorsData';
import patientAvatar from '../assets/img/patient-avatar.png';
import doctorAvatar from '../assets/img/doctor-avatar.png';
import '../assets/css/details.css';

function ApptDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Component State
  const [apptData, setApptData] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // 2. Fetch Data Lifecycle
  useEffect(() => {
    async function loadData() {
      const targetId = id || "APT-1001";
      
      // Find appointment in shared database case-insensitively
      const appt = appointments.find(a => a.id.toUpperCase() === targetId.toUpperCase());
      if (!appt) {
        setApptData({ notFound: true });
        return;
      }
      
      const rawData = await getAppointmentDetails(appt.id);
      
      if (rawData) {
        // Deep clone top-level properties and nested objects to prevent mutating global state
        const data = {
          ...rawData,
          id: appt.id,
          status: appt.status,
          doctorId: appt.doctorId,
          type: appt.type,
          dateTime: appt.dateTime,
          payment: rawData.payment ? { ...rawData.payment } : {
            amount: 0,
            status: "UNPAID",
            method: "N/A",
            transactionId: "N/A"
          },
          patient: rawData.patient ? { ...rawData.patient } : {
            id: "N/A",
            name: appt.patientName || "N/A",
            age: 0,
            gender: "N/A",
            phone: "N/A",
            email: "N/A",
            address: "N/A",
            bloodGroup: "N/A",
            allergies: "N/A",
            history: "N/A"
          },
          clinicalNotes: rawData.clinicalNotes ? { ...rawData.clinicalNotes } : {
            reason: "N/A",
            internalNotes: "N/A"
          },
          timeline: rawData.timeline ? rawData.timeline.map(t => ({ ...t })) : []
        };
        
        // Dynamic doctor lookup from Doctors module
        const doc = doctors.find(d => d.id.toUpperCase() === (data.doctorId || "").toUpperCase());
        
        // Populate assignedDoctor structure dynamically
        data.assignedDoctor = {
          id: doc?.id || data.doctorId || "DOC-1001",
          name: doc?.name || "Unassigned Doctor",
          specialty: doc?.specialty || "General Medicine",
          phone: doc?.phone || "+1 (555) 000-0000",
          email: doc?.email || `${(doc?.id || data.doctorId || "DOC-1001").toLowerCase()}@medicore.com`,
          rating: doc?.rating || "4.8",
          reviewsCount: doc?.reviewsCount || "45"
        };
        
        // Match lists page data dynamically for patient details to enrich layout
        if (data.id === "APT-1002") {
          data.patient.name = "Linda Davis";
          data.patient.id = "PAT-1202";
          data.patient.phone = "+1 (555) 234-5678";
          data.patient.gender = "Female";
          data.patient.age = 42;
          data.type = "ECG & Tests";
        } else if (data.id === "APT-1003") {
          data.patient.name = "Alice Smith";
          data.patient.id = "PAT-1203";
          data.patient.phone = "+1 (555) 345-6789";
          data.patient.gender = "Female";
          data.patient.age = 29;
          data.type = "Surgery";
        } else if (data.id === "APT-1004") {
          data.patient.name = "Mark T.";
          data.patient.id = "PAT-1204";
          data.patient.phone = "+1 (555) 456-7890";
          data.patient.gender = "Male";
          data.patient.age = 51;
          data.type = "Follow-up";
        } else if (data.id === "APT-1005") {
          data.patient.name = "Robert W.";
          data.patient.id = "PAT-1205";
          data.patient.phone = "+1 (555) 567-8901";
          data.patient.gender = "Male";
          data.patient.age = 38;
          data.type = "Consultation";
        } else if (data.id === "APT-1001") {
          data.patient.name = "John Doe";
          data.patient.id = "PAT-1201";
          data.patient.phone = "+1 (555) 123-4567";
          data.patient.gender = "Male";
          data.patient.age = 35;
          data.type = "Consultation";
        }
        
        setApptData(data);
      } else {
        setApptData({ notFound: true });
      }
    }
    loadData();
  }, [id]);

  // 3. Status Action Handler
  const handleCancelAppointment = () => {
    if (!apptData || apptData.status === "CANCELLED") return;
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!apptData) return;
    await updateAppointmentStatus(apptData.id, "CANCELLED");
    alert(`Success: Appointment ${apptData.id} has been successfully cancelled.`);
    setShowCancelModal(false);
    navigate('/appointments');
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
    if (!isoString) return "N/A";
    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) return "N/A";
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

  if (apptData.notFound) {
    return (
      <>
        {/* Top Navbar & Header Breadcrumbs */}
        <div className="top-navbar mb-4">
          <div>
            <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
              <span className="text-muted" style={{ cursor: 'pointer' }} onClick={() => navigate('/appointments')}>Appointments</span>
              <span className="mx-1">/</span>
              <span className="text-muted">Appointment Details</span>
              <span className="mx-1">/</span>
              <span className="text-dark fw-bold">Not Found</span>
            </nav>
          </div>
          <TopNavbar showUserRole={true} />
        </div>

        <div className="card dashboard-card p-5 text-center my-5 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="mb-3 text-danger fs-1">
            <i className="bi bi-calendar-x"></i>
          </div>
          <h3 className="fw-bold text-dark mb-2">Appointment Not Found</h3>
          <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
            The appointment ID you are looking for does not exist or has been removed.
          </p>
          <div className="d-flex justify-content-center">
            <button 
              className="btn btn-primary px-4 py-2 fw-semibold" 
              onClick={() => navigate('/appointments')}
              style={{ borderRadius: '8px', fontSize: '0.9rem' }}
            >
              Back to Appointments
            </button>
          </div>
        </div>
      </>
    );
  }

  const assignedDoctor = {
    id: apptData?.assignedDoctor?.id || "N/A",
    name: apptData?.assignedDoctor?.name || "Unassigned Doctor",
    specialty: apptData?.assignedDoctor?.specialty || "General Medicine",
    phone: apptData?.assignedDoctor?.phone || "N/A",
    email: apptData?.assignedDoctor?.email || "N/A",
    rating: apptData?.assignedDoctor?.rating || "0",
    reviewsCount: apptData?.assignedDoctor?.reviewsCount || "0"
  };

  return (
    <>
      {/* Top Navbar & Header Breadcrumbs */}
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted" style={{ cursor: 'pointer' }} onClick={() => navigate('/appointments')}>Appointments</span>
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
            Reviewing patient visit for <span className="fw-semibold text-dark">{apptData.type || "N/A"}</span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-secondary" onClick={() => navigate('/appointments')} style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            <i className="bi bi-arrow-left"></i> Back to Appointments
          </button>
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
                  <span className={
                    apptData.status === "CONFIRMED" ? "badge-confirmed" :
                    apptData.status === "COMPLETED" ? "badge-completed" :
                    "badge-cancelled"
                  }>
                    {apptData.status || "N/A"}
                  </span>
                </div>
                <div className="info-list-row">
                  <span className="info-label">Appointment ID</span>
                  <span className="info-value">{apptData.id}</span>
                </div>
                <div className="info-list-row">
                  <span className="info-label">Date & Time</span>
                  <span className="info-value">{apptData.dateTime ? formatDateTimeStr(apptData.dateTime) : "N/A"}</span>
                </div>
                <div className="info-list-row">
                  <span className="info-label">Type</span>
                  <span className="info-value">{apptData.type || "N/A"}</span>
                </div>
                <div className="info-list-row">
                  <span className="info-label">Duration</span>
                  <span className="info-value">{apptData.durationMinutes || 0} Minutes</span>
                </div>
              </div>
            </div>

            {/* Payment Card */}
            <div className="col-md-6">
              <div className="card dashboard-card p-4 h-100">
                <div className="card-header-caps">
                  <span>Payment Details</span>
                  <span className="badge-paid">{apptData.payment?.status || "N/A"}</span>
                </div>
                <div className="d-flex align-items-baseline gap-2 mb-3">
                  <span className="fs-2 fw-bold text-dark" style={{ fontWeight: 800 }}>
                    {formatCurrency(apptData.payment?.amount || 0)}
                  </span>
                </div>
                <div className="info-list-row">
                  <span className="info-label">Method</span>
                  <span className="info-value">{apptData.payment?.method || "N/A"}</span>
                </div>
                <div className="info-list-row">
                  <span className="info-label">Transaction ID</span>
                  <span className="info-value">{apptData.payment?.transactionId || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Card */}
          <div className="card dashboard-card p-4 mb-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <img src={patientAvatar} id="patient-avatar" className="patient-avatar-img" alt={apptData.patient?.name || "Patient"} />
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h3 className="fw-bold mb-0 fs-4 text-dark">{apptData.patient?.name || "N/A"}</h3>
                  <a href="#" className="text-muted" aria-label="Open Patient Card" onClick={(e) => { e.preventDefault(); alert("Opening patient record details..."); }}>
                    <i className="bi bi-box-arrow-up-right"></i>
                  </a>
                </div>
                <div className="text-muted fs-6">{`${apptData.patient?.age || 0} Years, ${apptData.patient?.gender || "N/A"} • ${apptData.patient?.id || "N/A"}`}</div>
              </div>
            </div>

            {/* Quick Contact Rows */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="patient-contact-badge">
                  <i className="bi bi-telephone"></i> {apptData.patient?.phone || "N/A"}
                </div>
              </div>
              <div className="col-md-4">
                <div className="patient-contact-badge">
                  <i className="bi bi-envelope"></i> {apptData.patient?.email || "N/A"}
                </div>
              </div>
              <div className="col-md-4">
                <div className="patient-contact-badge">
                  <i className="bi bi-geo-alt"></i> {apptData.patient?.address || "N/A"}
                </div>
              </div>
            </div>

            <hr className="text-muted opacity-25 mb-4" />

            {/* Medical Metrics details */}
            <div className="row g-3">
              <div className="col-md-3">
                <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>Blood Group</div>
                <span className="badge-blood">{apptData.patient?.bloodGroup || "N/A"}</span>
              </div>
              <div className="col-md-4">
                <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>Allergies</div>
                <div className="fw-bold text-dark">{apptData.patient?.allergies || "N/A"}</div>
              </div>
              <div className="col-md-5">
                <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>History</div>
                <div className="fw-bold text-dark">{apptData.patient?.history || "N/A"}</div>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="card dashboard-card p-4 mb-4 mb-lg-0">
            <div className="card-header-caps">
              <span><i className="bi bi-file-text me-1"></i> Appointment Notes & Reason</span>
            </div>
            <h4 className="fw-bold fs-6 mb-2">Reason for Visit</h4>
            <p className="text-muted fs-6 mb-4">{apptData.clinicalNotes?.reason || "N/A"}</p>
            
            <div className="internal-notes-box">
              <h5>Doctor's Internal Notes</h5>
              <p>{apptData.clinicalNotes?.internalNotes || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Right narrower column */}
        <div className="col-lg-4">
          
          {/* Assigned Doctor Card */}
          <div className="card dashboard-card p-4 mb-4">
            <div className="card-header-caps">Assigned Doctor</div>
            <div className="d-flex align-items-center gap-3 mb-4">
              <img src={doctorAvatar} id="doctor-avatar" className="patient-avatar-img" alt={assignedDoctor?.name || "Doctor"} />
              <div>
                <h3 className="fw-bold mb-0 fs-5 text-dark">{assignedDoctor?.name || "Unassigned Doctor"}</h3>
                <div className="text-primary fw-semibold fs-6 mb-1">{assignedDoctor?.specialty || "General Medicine"}</div>
                <div className="text-warning d-flex align-items-center gap-1" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-star-fill"></i>
                  <span className="text-muted fw-medium">{`${assignedDoctor?.rating || "0"} (${assignedDoctor?.reviewsCount || "0"} reviews)`}</span>
                </div>
              </div>
            </div>
            
            <div className="info-list-row">
              <span className="info-label"><i className="bi bi-telephone me-1"></i> Phone</span>
              <span className="info-value text-dark">{assignedDoctor?.phone || "N/A"}</span>
            </div>
            <div className="info-list-row">
              <span className="info-label"><i className="bi bi-envelope me-1"></i> Email</span>
              <span className="info-value text-dark">{assignedDoctor?.email || "N/A"}</span>
            </div>
          </div>

          {/* Activity Timeline Card */}
          <div className="card dashboard-card p-4 mb-4">
            <div className="card-header-caps">Activity Timeline</div>
            <div className="activity-timeline">
              {(apptData.timeline || []).map((step, idx) => {
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
            <p>{`Create a new session for ${apptData.patient?.name || "Patient"} after reviewing the visit logs.`}</p>
            <button className="btn-navy-action" onClick={handleBookNext}>Book Next Slot</button>
          </div>
        </div>

      </div>

      {/* Appointment Cancel/Delete Modal */}
      {showCancelModal && apptData && (() => {
        const docObj = doctors.find(d => d.name === (assignedDoctor?.name));
        const docDept = docObj ? docObj.department : (assignedDoctor?.specialty || "General Medicine");
        const dateObj = apptData.dateTime ? new Date(apptData.dateTime) : null;
        const apptDate = dateObj && !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A";
        const apptTime = dateObj && !isNaN(dateObj.getTime()) ? dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : "N/A";

        return (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
                <div className="modal-header bg-light border-0 py-3" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                  <h5 className="modal-title fw-bold text-dark">
                    <i className="bi bi-calendar-x text-danger me-2"></i>Cancel Appointment
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowCancelModal(false)} aria-label="Close"></button>
                </div>
                
                <div className="modal-body p-4">
                  <p className="mb-3 text-muted" style={{ fontSize: '0.9rem' }}>
                    Are you sure you want to cancel this appointment?
                  </p>
                  
                  <div className="p-3 bg-light rounded-3 mb-3 border">
                    <div className="row g-2" style={{ fontSize: '0.85rem' }}>
                      <div className="col-6">
                        <span className="text-muted small d-block fw-semibold" style={{ fontSize: '0.75rem' }}>APPOINTMENT ID</span>
                        <strong className="text-dark">{apptData.id}</strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted small d-block fw-semibold" style={{ fontSize: '0.75rem' }}>CURRENT STATUS</span>
                        <span className="badge-confirmed text-warning bg-warning-subtle" style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px' }}>
                          {apptData.status || "N/A"}
                        </span>
                      </div>
                      
                      <div className="col-12 mt-2">
                        <span className="text-muted small d-block fw-semibold" style={{ fontSize: '0.75rem' }}>PATIENT NAME</span>
                        <strong className="text-dark">{apptData.patient?.name || "N/A"}</strong>
                      </div>
                      
                      <div className="col-12 mt-2">
                        <span className="text-muted small d-block fw-semibold" style={{ fontSize: '0.75rem' }}>ASSIGNED DOCTOR</span>
                        <strong className="text-primary">{assignedDoctor?.name || "Unassigned Doctor"} ({docDept})</strong>
                      </div>
                      
                      <div className="col-6 mt-2">
                        <span className="text-muted small d-block fw-semibold" style={{ fontSize: '0.75rem' }}>DATE</span>
                        <strong className="text-dark">{apptDate}</strong>
                      </div>
                      <div className="col-6 mt-2">
                        <span className="text-muted small d-block fw-semibold" style={{ fontSize: '0.75rem' }}>TIME</span>
                        <strong className="text-dark">{apptTime}</strong>
                      </div>
                    </div>
                  </div>
                  
                  <div className="alert alert-danger d-flex align-items-start gap-2 mb-0" role="alert" style={{ borderRadius: '8px' }}>
                    <i className="bi bi-exclamation-octagon-fill fs-5 mt-0 text-danger"></i>
                    <div>
                      <strong className="d-block" style={{ fontSize: '0.85rem' }}>Warning</strong>
                      <span style={{ fontSize: '0.8rem' }}>
                        This cancellation cannot be undone. All slot allocations and schedule mappings for this appointment will be permanently cleared.
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer border-0 p-4 pt-0 d-flex justify-content-end gap-2">
                  <button 
                    type="button" 
                    className="btn btn-light fw-bold px-4 py-2" 
                    style={{ borderRadius: '8px', fontSize: '0.9rem' }} 
                    onClick={() => setShowCancelModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger fw-bold px-4 py-2" 
                    style={{ borderRadius: '8px', fontSize: '0.9rem' }} 
                    onClick={handleConfirmCancel}
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}

export default ApptDetailsPage;
