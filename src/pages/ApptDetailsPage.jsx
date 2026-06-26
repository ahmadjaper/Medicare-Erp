import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { useErpStore } from '../store/erpStore';
import { getAppointmentDetails } from '../services/api';
import patientAvatar from '../assets/img/patient-avatar.png';
import doctorAvatar from '../assets/img/doctor-avatar.png';
import '../assets/css/details.css';

function ApptDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { appointments, patients, doctors, cancelAppointment } = useErpStore();

  const [apptData, setApptData] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      const targetId = id || "APT-1001";
      const appt = appointments.find(a => a.id.toUpperCase() === targetId.toUpperCase());
      if (!appt) {
        setApptData({ notFound: true });
        return;
      }
      
      const rawData = await getAppointmentDetails(appt.id);
      
      if (rawData) {
        const data = {
          ...rawData,
          id: appt.id,
          status: appt.status,
          doctorId: appt.doctorId,
          type: appt.type,
          dateTime: appt.dateTime || appt.time,
          payment: rawData.payment ? { ...rawData.payment } : {
            amount: 150,
            status: "PAID",
            method: "Insurance",
            transactionId: "TXN-73918239"
          },
          patient: rawData.patient ? { ...rawData.patient } : {
            id: appt.patientId || "PAT-1201",
            name: appt.patientName || "N/A",
            age: 35,
            gender: "Male",
            phone: "+1 (555) 123-4567",
            email: "john@medicore.com",
            address: "123 Medical Center Dr, Cityville",
            bloodGroup: "O+",
            allergies: "None",
            history: "None"
          },
          clinicalNotes: rawData.clinicalNotes ? { ...rawData.clinicalNotes } : {
            reason: appt.reason || "General health consultation",
            internalNotes: "No internal notes recorded."
          },
          timeline: rawData.timeline ? rawData.timeline.map(t => ({ ...t })) : [
            { status: "Appointment Created", timestamp: "May 20, 2024, 09:00 AM", completed: true },
            { status: "Confirmed", timestamp: "May 20, 2024, 10:30 AM", completed: true, current: true }
          ]
        };
        
        // Enrich patient details if patient is in the store
        const storePatient = patients.find(p => p.id === appt.patientId || p.name === appt.patientName);
        if (storePatient) {
          data.patient = {
            ...data.patient,
            ...storePatient
          };
        }

        // Dynamic doctor lookup from store
        const doc = doctors.find(d => d.id === appt.doctorId || d.name === appt.doctorName);
        
        data.assignedDoctor = {
          id: doc?.id || appt.doctorId || "DOC-1001",
          name: doc?.name || appt.doctorName || "Unassigned Doctor",
          specialty: doc?.specialty || "General Medicine",
          phone: doc?.phone || "+1 (555) 000-0000",
          email: doc?.email || `${(doc?.id || "DOC-1001").toLowerCase()}@medicore.com`,
          rating: doc?.rating || "4.8",
          reviewsCount: doc?.reviewsCount || "45"
        };
        
        setApptData(data);
      } else {
        setApptData({ notFound: true });
      }
    }
    loadData();
  }, [id, appointments, doctors, patients]);

  const handleCancelAppointment = () => {
    if (!apptData || apptData.status === "CANCELLED" || apptData.status === "Cancelled") return;
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (!apptData) return;
    cancelAppointment(apptData.id);
    useErpStore.getState().showToast(`Success: Appointment ${apptData.id} has been successfully cancelled.`, "success");
    setShowCancelModal(false);
  };

  const handleEditAppointment = () => {
    useErpStore.getState().showToast("Opening Edit Appointment panel... (REST integration ready)", "info");
  };

  const handleBookNext = (e) => {
    e.preventDefault();
    navigate("/schedules");
  };

  const formatDateTimeStr = (isoString) => {
    if (!isoString) return "N/A";
    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) return isoString;
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
    if (value === undefined) return "$0.00";
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

  const patient = apptData.patient;
  const assignedDoctor = apptData.assignedDoctor;

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
        
        <TopNavbar showUserRole={true} />
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
            className={`btn-cancel-appt ${apptData.status?.toUpperCase() === "CANCELLED" ? 'opacity-50' : ''}`}
            onClick={handleCancelAppointment}
            disabled={apptData.status?.toUpperCase() === "CANCELLED"}
          >
            <i className={apptData.status?.toUpperCase() === "CANCELLED" ? "bi bi-x-circle-fill" : "bi bi-x-circle"}></i>
            {apptData.status?.toUpperCase() === "CANCELLED" ? " Cancelled" : " Cancel Appointment"}
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
                  <span className={apptData.status?.toUpperCase() === "CONFIRMED" || apptData.status?.toUpperCase() === "CONFIRM" ? "badge-confirmed text-success bg-success-subtle" : apptData.status?.toUpperCase() === "COMPLETED" ? "badge-completed text-primary bg-primary-subtle" : "badge-cancelled text-danger bg-danger-subtle"}>
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
                  <span className="info-value">{apptData.type || "N/A"}</span>
                </div>
                <div className="info-list-row">
                  <span className="info-label">Duration</span>
                  <span className="info-value">{apptData.durationMinutes || 30} Minutes</span>
                </div>
              </div>
            </div>

            {/* Payment Card */}
            <div className="col-md-6">
              <div className="card dashboard-card p-4 h-100">
                <div className="card-header-caps">
                  <span>Payment Details</span>
                  <span className="badge-paid text-primary bg-primary-subtle">{apptData.payment?.status || "PAID"}</span>
                </div>
                <div className="d-flex align-items-baseline gap-2 mb-3">
                  <span className="fs-2 fw-bold text-dark" style={{ fontWeight: 800 }}>
                    {formatCurrency(apptData.payment?.amount)}
                  </span>
                </div>
                <div className="info-list-row">
                  <span className="info-label">Method</span>
                  <span className="info-value">{apptData.payment?.method || "-"}</span>
                </div>
                <div className="info-list-row">
                  <span className="info-label">Transaction ID</span>
                  <span className="info-value">{apptData.payment?.transactionId || "-"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Card */}
          <div className="card dashboard-card p-4 mb-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <img src={patientAvatar} id="patient-avatar" className="patient-avatar-img" alt={patient.name} />
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h3 className="fw-bold mb-0 fs-4 text-dark">{patient.name}</h3>
                  <a href="#" className="text-muted" aria-label="Open Patient Card" onClick={(e) => { e.preventDefault(); useErpStore.getState().showToast("Opening patient record details...", "info"); }}>
                    <i className="bi bi-box-arrow-up-right"></i>
                  </a>
                </div>
                <div className="text-muted fs-6">{`${patient.age || 35} Years, ${patient.gender || "Male"} • ${patient.id}`}</div>
              </div>
            </div>

            {/* Quick Contact Rows */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="patient-contact-badge">
                  <i className="bi bi-telephone"></i> {patient.phone || "+1 (555) 123-4567"}
                </div>
              </div>
              <div className="col-md-4">
                <div className="patient-contact-badge">
                  <i className="bi bi-envelope"></i> {patient.email || "patient@email.com"}
                </div>
              </div>
              <div className="col-md-4">
                <div className="patient-contact-badge">
                  <i className="bi bi-geo-alt"></i> {patient.address || "123 Medical Center Dr"}
                </div>
              </div>
            </div>

            <hr className="text-muted opacity-25 mb-4" />

            {/* Medical Metrics details */}
            <div className="row g-3">
              <div className="col-md-3">
                <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>Blood Group</div>
                <span className="badge-blood">{patient.bloodGroup || "O+"}</span>
              </div>
              <div className="col-md-4">
                <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>Allergies</div>
                <div className="fw-bold text-dark">{patient.allergies || "None"}</div>
              </div>
              <div className="col-md-5">
                <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>History</div>
                <div className="fw-bold text-dark">{patient.history || "No significant medical history"}</div>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className="card dashboard-card p-4 mb-4 mb-lg-0">
            <div className="card-header-caps">
              <span><i className="bi bi-file-text me-1"></i> Appointment Notes & Reason</span>
            </div>
            <h4 className="fw-bold fs-6 mb-2">Reason for Visit</h4>
            <p className="text-muted fs-6 mb-4">{apptData.clinicalNotes?.reason}</p>
            
            <div className="internal-notes-box">
              <h5>Doctor's Internal Notes</h5>
              <p>{apptData.clinicalNotes?.internalNotes || "No internal notes recorded."}</p>
            </div>
          </div>
        </div>

        {/* Right narrower column */}
        <div className="col-lg-4">
          
          {/* Assigned Doctor Card */}
          <div className="card dashboard-card p-4 mb-4">
            <div className="card-header-caps">Assigned Doctor</div>
            <div className="d-flex align-items-center gap-3 mb-4">
              <img src={doctorAvatar} id="doctor-avatar" className="patient-avatar-img" alt={assignedDoctor.name} />
              <div>
                <h3 className="fw-bold mb-0 fs-5 text-dark">{assignedDoctor.name}</h3>
                <div className="text-primary fw-semibold fs-6 mb-1">{assignedDoctor.specialty}</div>
                <div className="text-warning d-flex align-items-center gap-1" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-star-fill"></i>
                  <span className="text-muted fw-medium">{`${assignedDoctor.rating || '4.8'} (${assignedDoctor.reviewsCount || '100'} reviews)`}</span>
                </div>
              </div>
            </div>
            
            <div className="info-list-row">
              <span className="info-label"><i className="bi bi-telephone me-1"></i> Phone</span>
              <span className="info-value text-dark">{assignedDoctor.phone || "N/A"}</span>
            </div>
            <div className="info-list-row">
              <span className="info-label"><i className="bi bi-envelope me-1"></i> Email</span>
              <span className="info-value text-dark">{assignedDoctor.email || "N/A"}</span>
            </div>
          </div>

          {/* Activity Timeline Card */}
          <div className="card dashboard-card p-4 mb-4">
            <div className="card-header-caps">Activity Timeline</div>
            <div className="activity-timeline">
              {apptData.timeline?.map((step, idx) => {
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
            <p>{`Create a new session for ${patient.name} after reviewing the visit logs.`}</p>
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
                        <strong className="text-dark">{patient.name || "N/A"}</strong>
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
