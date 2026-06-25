import React, { useState } from 'react';
import TopNavbar from '../components/TopNavbar';
import { useErpStore } from '../store/erpStore';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();
  const {
    patients,
    doctors,
    appointments,
    alerts,
    availableBeds,
    registerPatient,
    addAppointment,
    cancelAppointment,
    rescheduleAppointment,
    toggleDoctorCheckIn,
    markAlertRead,
    exportReport
  } = useErpStore();

  // Modal triggers
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showApptModal, setShowApptModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  
  // Reschedule inline modal states
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [reschedTime, setReschedTime] = useState("09:00");
  const [reschedDate, setReschedDate] = useState("2024-05-22");

  // Alert Detail Modal
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Form states - Patient
  const [pName, setPName] = useState("");
  const [pAge, setPAge] = useState("");
  const [pGender, setPGender] = useState("Male");
  const [pPhone, setPPhone] = useState("");
  const [pEmail, setPEmail] = useState("");
  const [pBlood, setPBlood] = useState("O+");
  const [pAddress, setPAddress] = useState("");

  // Form states - Appointment
  const [apptPatientName, setApptPatientName] = useState("");
  const [apptDoctorName, setApptDoctorName] = useState("");
  const [apptTime, setApptTime] = useState("09:00 AM");
  const [apptDate, setApptDate] = useState("2024-05-22");
  const [apptReason, setApptReason] = useState("");

  // Handler submissions
  const handleRegisterPatientSubmit = (e) => {
    e.preventDefault();
    const newPatient = registerPatient({
      name: pName,
      age: parseInt(pAge),
      gender: pGender,
      phone: pPhone,
      email: pEmail,
      bloodGroup: pBlood,
      address: pAddress
    });
    setShowPatientModal(false);
    setPName("");
    setPAge("");
    setPPhone("");
    setPEmail("");
    setPAddress("");
    useErpStore.getState().addAlert({
      title: "Patient Registered",
      type: "system",
      desc: `Patient ${newPatient.name} registered successfully with ID ${newPatient.id}!`,
      category: "success"
    });
  };

  const handleBookApptSubmit = (e) => {
    e.preventDefault();
    const newAppt = addAppointment({
      patientName: apptPatientName,
      doctorName: apptDoctorName,
      time: apptTime,
      dateTime: `${apptDate}T${apptTime.slice(0, 5)}:00`,
      status: "Scheduled",
      reason: apptReason
    });
    setShowApptModal(false);
    setApptPatientName("");
    setApptDoctorName("");
    setApptReason("");
    useErpStore.getState().addAlert({
      title: "Appointment Scheduled",
      type: "system",
      desc: `Appointment scheduled successfully for ${newAppt.patientName}!`,
      category: "success"
    });
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (rescheduleTarget) {
      // Convert 24h to AM/PM for layout display
      let displayTime = reschedTime;
      const [h, m] = reschedTime.split(":");
      const hours = parseInt(h, 10);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      displayTime = `${String(formattedHours).padStart(2, '0')}:${m} ${ampm}`;

      rescheduleAppointment(rescheduleTarget, displayTime, reschedDate);
      setRescheduleTarget(null);
      useErpStore.getState().addAlert({
        title: "Appointment Rescheduled",
        type: "system",
        desc: "Appointment rescheduled successfully!",
        category: "success"
      });
    }
  };

  // KPIs values
  const countPatients = patients.length;
  const countTodayAppointments = appointments.filter(a => a.status !== "CANCELLED").length;
  const countDoctorsOnDuty = doctors.filter(d => d.onDuty).length;

  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">MediCore ERP</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Overview</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="mb-4">
        <h1 className="page-title" style={{ fontSize: '1.75rem', fontWeight: 800 }}>Overview</h1>
      </div>

      {/* KPI Cards Roster */}
      <div className="row g-3 mb-4">
        {/* KPI 1: Total Patients */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card dashboard-card p-3 h-100 border-0 shadow-sm hover-bg-light" style={{ borderLeft: '4px solid var(--primary-color) !important', cursor: 'pointer' }} onClick={() => navigate('/patients')}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <div className="text-muted uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>TOTAL PATIENTS</div>
                <div className="fs-3 fw-bold text-dark mt-1" style={{ fontWeight: 800 }}>{countPatients.toLocaleString()}</div>
              </div>
              <div className="p-2 rounded bg-primary-subtle text-primary">
                <i className="bi bi-people-fill fs-5"></i>
              </div>
            </div>
            <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
              <span className="text-success fw-bold"><i className="bi bi-arrow-up-short"></i> +12%</span>
              <span className="text-muted">vs last week</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Today's Appointments */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card dashboard-card p-3 h-100 border-0 shadow-sm hover-bg-light" style={{ cursor: 'pointer' }} onClick={() => navigate('/appointments')}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <div className="text-muted uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>TODAY'S APPOINTMENTS</div>
                <div className="fs-3 fw-bold text-dark mt-1" style={{ fontWeight: 800 }}>{countTodayAppointments}</div>
              </div>
              <div className="p-2 rounded bg-info-subtle text-info">
                <i className="bi bi-calendar-event-fill fs-5"></i>
              </div>
            </div>
            <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
              <span className="text-success fw-bold"><i className="bi bi-arrow-up-short"></i> +4</span>
              <span className="text-muted">new walk-ins</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Doctors on Duty */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card dashboard-card p-3 h-100 border-0 shadow-sm hover-bg-light" style={{ cursor: 'pointer' }} onClick={() => navigate('/doctors')}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <div className="text-muted uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>DOCTORS ON DUTY</div>
                <div className="fs-3 fw-bold text-dark mt-1" style={{ fontWeight: 800 }}>{countDoctorsOnDuty}</div>
              </div>
              <div className="p-2 rounded bg-success-subtle text-success">
                <i className="bi bi-person-badge-fill fs-5"></i>
              </div>
            </div>
            <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
              <span className="text-muted">Across 8 departments</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Available Beds (Warning capacity) */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card p-3 h-100 border-0 shadow-sm hover-bg-light" style={{ backgroundColor: availableBeds <= 15 ? '#fef2f2' : 'var(--card-bg)', border: availableBeds <= 15 ? '1px solid #fca5a5' : '1px solid var(--border-color)', cursor: 'pointer' }} onClick={() => navigate('/inventory')}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <div className="text-muted uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>AVAILABLE BEDS</div>
                <div className="fs-3 fw-bold text-dark mt-1" style={{ fontWeight: 800 }}>{availableBeds}</div>
              </div>
              <div className="p-2 rounded bg-danger-subtle text-danger">
                <i className="bi bi-hospital fs-5"></i>
              </div>
            </div>
            <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.78rem' }}>
              {availableBeds <= 15 ? (
                <span className="text-danger fw-bold"><i className="bi bi-exclamation-triangle-fill"></i> Critical Capacity</span>
              ) : (
                <span className="text-success fw-bold"><i className="bi bi-check-circle-fill"></i> Normal Capacity</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left column (Actions, Table) and Right column (Alerts Log) */}
      <div className="row g-4">
        <div className="col-lg-8">
          
          {/* Quick Actions Panel */}
          <div className="card dashboard-card p-4 mb-4">
            <h2 className="fs-6 fw-bold text-uppercase text-muted mb-3" style={{ letterSpacing: '0.05em' }}>Quick Actions</h2>
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <button className="btn btn-outline-primary w-100 py-3 d-flex flex-column align-items-center justify-content-center gap-2 border-dashed shadow-sm hover-bg-light" onClick={() => setShowPatientModal(true)}>
                  <i className="bi bi-person-plus fs-3"></i>
                  <span className="fw-semibold text-center" style={{ fontSize: '0.8rem' }}>Register New Patient</span>
                </button>
              </div>

              <div className="col-6 col-md-3">
                <button className="btn btn-outline-primary w-100 py-3 d-flex flex-column align-items-center justify-content-center gap-2 border-dashed shadow-sm hover-bg-light" onClick={() => setShowApptModal(true)}>
                  <i className="bi bi-calendar-check fs-3"></i>
                  <span className="fw-semibold text-center" style={{ fontSize: '0.8rem' }}>Schedule Appointment</span>
                </button>
              </div>

              <div className="col-6 col-md-3">
                <button className="btn btn-outline-primary w-100 py-3 d-flex flex-column align-items-center justify-content-center gap-2 border-dashed shadow-sm hover-bg-light" onClick={() => setShowDoctorModal(true)}>
                  <i className="bi bi-person-check fs-3"></i>
                  <span className="fw-semibold text-center" style={{ fontSize: '0.8rem' }}>Check-in Doctor</span>
                </button>
              </div>

              <div className="col-6 col-md-3">
                <button className="btn btn-outline-primary w-100 py-3 d-flex flex-column align-items-center justify-content-center gap-2 border-dashed shadow-sm hover-bg-light" onClick={() => exportReport('csv')}>
                  <i className="bi bi-file-earmark-arrow-down fs-3"></i>
                  <span className="fw-semibold text-center" style={{ fontSize: '0.8rem' }}>Generate Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments Table */}
          <div className="card dashboard-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="fs-6 fw-bold text-uppercase text-muted mb-0" style={{ letterSpacing: '0.05em' }}>Upcoming Appointments</h2>
              <a href="#" className="text-primary text-decoration-none fw-bold" style={{ fontSize: '0.82rem' }} onClick={(e) => { e.preventDefault(); navigate('/appointments'); }}>View All</a>
            </div>

            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0" style={{ fontSize: '0.85rem' }}>
                <thead className="table-light">
                  <tr>
                    <th scope="col" style={{ fontWeight: 600 }}>Time</th>
                    <th scope="col" style={{ fontWeight: 600 }}>Patient Name</th>
                    <th scope="col" style={{ fontWeight: 600 }}>Doctor</th>
                    <th scope="col" style={{ fontWeight: 600 }}>Room</th>
                    <th scope="col" style={{ fontWeight: 600 }}>Status</th>
                    <th scope="col" className="text-end" style={{ fontWeight: 600, width: '150px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => {
                    let statusBg = "#f1f5f9";
                    let statusColor = "#475569";
                    
                    if (appt.status === "Checked In") {
                      statusBg = "#ecfdf5";
                      statusColor = "#059669";
                    } else if (appt.status === "Waiting") {
                      statusBg = "#eff6ff";
                      statusColor = "#2563eb";
                    } else if (appt.status === "Scheduled") {
                      statusBg = "#f5f3ff";
                      statusColor = "#7c3aed";
                    } else if (appt.status === "Delayed") {
                      statusBg = "#fff1f2";
                      statusColor = "#e11d48";
                    } else if (appt.status === "CANCELLED") {
                      statusBg = "#f8fafc";
                      statusColor = "#94a3b8";
                    }

                    return (
                      <tr key={appt.id} className="cursor-pointer">
                        <td className="fw-semibold text-dark">{appt.time}</td>
                        <td className="fw-bold hover-text-primary" onClick={() => navigate(`/appointments/details/${appt.id}`)} style={{ cursor: 'pointer' }}>{appt.patientName}</td>
                        <td>{appt.doctorName}</td>
                        <td>{appt.room}</td>
                        <td>
                          <span className="badge rounded px-2 py-1 border-0 fw-bold" style={{ backgroundColor: statusBg, color: statusColor, fontSize: '0.72rem' }}>
                            {appt.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="text-end">
                          {appt.status !== "CANCELLED" ? (
                            <div className="d-flex justify-content-end gap-1">
                              <button className="btn btn-sm btn-outline-secondary px-2 py-1" style={{ fontSize: '0.72rem' }} onClick={(e) => { e.stopPropagation(); setRescheduleTarget(appt.id); setReschedTime(appt.time.slice(0, 5)); }}>
                                <i className="bi bi-clock-history"></i> Resched
                              </button>
                              <button className="btn btn-sm btn-outline-danger px-2 py-1" style={{ fontSize: '0.72rem' }} onClick={(e) => { e.stopPropagation(); cancelAppointment(appt.id); }}>
                                <i className="bi bi-x-circle"></i> Cancel
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted" style={{ fontSize: '0.72rem' }}>No Actions</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Staff Alerts Log */}
        <div className="col-lg-4">
          <div className="card dashboard-card p-4 h-100 d-flex flex-column">
            <h2 className="fs-6 fw-bold text-uppercase text-muted mb-3" style={{ letterSpacing: '0.05em' }}>Staff Alerts & Updates</h2>
            
            <div className="flex-grow-1 overflow-y-auto" style={{ maxHeight: '420px' }}>
              {alerts.map((alertItem) => {
                let iconClass = "bi-info-circle-fill text-primary";
                let bgClass = "bg-primary-subtle";
                
                if (alertItem.type === "blood_bank") {
                  iconClass = "bi-droplet-fill text-danger";
                  bgClass = "bg-danger-subtle";
                } else if (alertItem.type === "maintenance") {
                  iconClass = "bi-gear-fill text-success";
                  bgClass = "bg-success-subtle";
                } else if (alertItem.type === "system") {
                  iconClass = "bi-shield-fill-exclamation text-warning";
                  bgClass = "bg-warning-subtle";
                }

                return (
                  <div 
                    key={alertItem.id} 
                    className={`d-flex gap-3 p-3 mb-2 rounded border cursor-pointer align-items-start hover-bg-light ${!alertItem.read ? 'bg-light border-primary' : 'bg-white border-light'}`}
                    onClick={() => { markAlertRead(alertItem.id); setSelectedAlert(alertItem); }}
                    style={{ cursor: 'pointer', transition: 'all 0.15s' }}
                  >
                    <div className={`p-2 rounded-circle ${bgClass} d-flex align-items-center justify-content-center`}>
                      <i className={`bi ${iconClass} fs-5`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold text-dark" style={{ fontSize: '0.8rem' }}>{alertItem.title}</span>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>{alertItem.timeLabel}</span>
                      </div>
                      <p className="text-muted mb-0 text-truncate-2 mt-1" style={{ fontSize: '0.75rem', lineHeight: '1.3' }}>{alertItem.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button className="btn btn-outline-secondary w-100 fw-bold mt-3" onClick={() => navigate('/low-stock-alerts')}>
              View All Alerts
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Register Patient */}
      {showPatientModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 1050 }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                <h5 className="modal-title fw-bold"><i className="bi bi-person-plus-fill me-2"></i>Register New Patient</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowPatientModal(false)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleRegisterPatientSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Full Name</label>
                    <input type="text" className="form-control" placeholder="e.g. Johnathan Doe" value={pName} onChange={(e) => setPName(e.target.value)} required />
                  </div>
                  
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Age</label>
                      <input type="number" className="form-control" placeholder="e.g. 35" value={pAge} onChange={(e) => setPAge(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Gender</label>
                      <select className="form-select" value={pGender} onChange={(e) => setPGender(e.target.value)} required>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Phone</label>
                      <input type="text" className="form-control" placeholder="+1 (555) 000-0000" value={pPhone} onChange={(e) => setPPhone(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Blood Group</label>
                      <select className="form-select" value={pBlood} onChange={(e) => setPBlood(e.target.value)} required>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email Address</label>
                    <input type="email" className="form-control" placeholder="john.doe@example.com" value={pEmail} onChange={(e) => setPEmail(e.target.value)} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Address</label>
                    <input type="text" className="form-control" placeholder="123 Medical Center Dr" value={pAddress} onChange={(e) => setPAddress(e.target.value)} required />
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '8px' }} onClick={() => setShowPatientModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-bold px-4 py-2" style={{ borderRadius: '8px' }}>Register</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Schedule Appointment */}
      {showApptModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 1050 }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                <h5 className="modal-title fw-bold"><i className="bi bi-calendar-plus-fill me-2"></i>Schedule Appointment</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowApptModal(false)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleBookApptSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Select Patient</label>
                    <select className="form-select" value={apptPatientName} onChange={(e) => setApptPatientName(e.target.value)} required>
                      <option value="">-- Choose Patient --</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.name}>{p.name} ({p.id})</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Select Doctor</label>
                    <select className="form-select" value={apptDoctorName} onChange={(e) => setApptDoctorName(e.target.value)} required>
                      <option value="">-- Choose Doctor --</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.name}>{d.name} ({d.specialty})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Appt Date</label>
                      <input type="date" className="form-control" value={apptDate} onChange={(e) => setApptDate(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Time Slot</label>
                      <select className="form-select" value={apptTime} onChange={(e) => setApptTime(e.target.value)} required>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="09:30 AM">09:30 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="10:30 AM">10:30 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Reason for Visit</label>
                    <textarea className="form-control" rows="3" placeholder="Symptoms, diagnostic reason..." value={apptReason} onChange={(e) => setApptReason(e.target.value)} required></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '8px' }} onClick={() => setShowApptModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-bold px-4 py-2" style={{ borderRadius: '8px' }}>Book Roster</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Check-in Doctor Availability */}
      {showDoctorModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 1050 }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                <h5 className="modal-title fw-bold"><i className="bi bi-person-check-fill me-2"></i>Doctor Shift Roster</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDoctorModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body p-4">
                <div className="list-group">
                  {doctors.map(d => (
                    <div key={d.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                      <div>
                        <div className="fw-bold">{d.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{d.specialty} • {d.room}</div>
                      </div>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" checked={d.onDuty} onChange={() => toggleDoctorCheckIn(d.id)} style={{ cursor: 'pointer', scale: '1.2' }} />
                        <label className="form-check-label ms-1 fw-semibold" style={{ fontSize: '0.8rem' }}>{d.onDuty ? "ON DUTY" : "OFF DUTY"}</label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button type="button" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '8px' }} onClick={() => setShowDoctorModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Modal: Alert Details */}
      {selectedAlert && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 1050 }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header bg-light border-0 py-3" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                <h5 className="modal-title fw-bold text-dark"><i className="bi bi-info-circle-fill text-primary me-2"></i>Alert Update Details</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedAlert(null)} aria-label="Close"></button>
              </div>
              <div className="modal-body p-4">
                <h4 className="fw-bold mb-3">{selectedAlert.title}</h4>
                <div className="p-3 bg-light rounded-3 mb-2" style={{ fontSize: '0.9rem' }}>
                  {selectedAlert.desc}
                </div>
                <div className="text-muted mt-3" style={{ fontSize: '0.75rem' }}>Time: {selectedAlert.timeLabel}</div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button type="button" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '8px' }} onClick={() => setSelectedAlert(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardPage;
