import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctorInfo, getScheduleSlots, saveScheduleSlot, deleteScheduleSlot } from '../services/api';
import { doctors } from '../data/doctorsData';
import doctorAvatar from '../assets/img/doctor-avatar.png';
import '../assets/css/schedule.css';
import '../assets/css/doctors.css';

function SchedulePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. Component States
  const [doctor, setDoctor] = useState({ name: '-', specialty: '-', id: '-', status: '-' });
  const [slots, setSlots] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date("2024-05-19T00:00:00"));
  const [mockCurrentTime] = useState(new Date("2024-05-21T10:30:00"));
  
  const [activeFilters, setActiveFilters] = useState({
    consultation: true,
    surgery: true,
    followup: true,
    tests: true,
    ward_rounds: true
  });

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Add Slot form states
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("consultation");
  const [formDate, setFormDate] = useState("");
  const [formStart, setFormStart] = useState("09:00");
  const [formEnd, setFormEnd] = useState("11:00");
  const [formPatient, setFormPatient] = useState("");
  const [formStatus, setFormStatus] = useState("booked");

  const startGridHour = 8;
  const endGridHour = 18;
  const hourHeight = 80;

  // 2. Fetch Data Lifecycle
  useEffect(() => {
    async function loadData() {
      const selectedDoc = doctors.find(d => d.id === id);
      if (selectedDoc) {
        setDoctor(selectedDoc);
      } else {
        const docData = await getDoctorInfo();
        setDoctor(docData);
      }
      
      const slotsData = await getScheduleSlots();
      setSlots(slotsData);
    }
    loadData();
  }, [id]);

  // 3. Date Math Helpers
  const navigateWeek = (direction) => {
    const nextWeek = new Date(currentWeekStart);
    nextWeek.setDate(nextWeek.getDate() + (direction * 7));
    setCurrentWeekStart(nextWeek);
  };

  const setToday = () => {
    setCurrentWeekStart(new Date("2024-05-19T00:00:00"));
  };

  const getWeekRangeStr = () => {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const options = { day: 'numeric', month: 'short' };
    const startStr = currentWeekStart.toLocaleDateString('en-US', options);
    const endStr = weekEnd.toLocaleDateString('en-US', options);
    const yearStr = weekEnd.toLocaleDateString('en-US', { year: 'numeric' });
    
    return `${startStr} - ${endStr} ${yearStr}`;
  };

  const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const formatDateISO = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 4. Modal Triggers
  const handleCellClick = (dayIndex, hour) => {
    const cellDate = new Date(currentWeekStart);
    cellDate.setDate(cellDate.getDate() + dayIndex);
    
    setFormTitle("");
    setFormCategory("consultation");
    setFormDate(formatDateISO(cellDate));
    setFormStart(`${String(hour).padStart(2, '0')}:00`);
    setFormEnd(`${String(hour + 1).padStart(2, '0')}:00`);
    setFormPatient("");
    setFormStatus("booked");
    
    setIsAddOpen(true);
  };

  const handleOpenAddBtn = () => {
    const defaultDate = new Date(currentWeekStart);
    defaultDate.setDate(defaultDate.getDate() + 2); // Default Tuesday
    
    setFormTitle("");
    setFormCategory("consultation");
    setFormDate(formatDateISO(defaultDate));
    setFormStart("09:00");
    setFormEnd("11:00");
    setFormPatient("");
    setFormStatus("booked");
    
    setIsAddOpen(true);
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    if (formStart >= formEnd) {
      useErpStore.getState().showToast("Error: End time must be greater than start time.", "danger");
      return;
    }
    
    const newSlot = {
      title: formTitle,
      type: formCategory,
      startTime: new Date(`${formDate}T${formStart}:00`),
      endTime: new Date(`${formDate}T${formEnd}:00`),
      patientName: formPatient,
      status: formStatus
    };
    
    const res = await saveScheduleSlot(newSlot);
    if (res.success) {
      // Reload slots
      const slotsData = await getScheduleSlots();
      setSlots(slotsData);
      setIsAddOpen(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    const res = await deleteScheduleSlot(slotId);
    if (res.success) {
      const slotsData = await getScheduleSlots();
      setSlots(slotsData);
      setIsViewOpen(false);
    }
  };

  const formatSlotTime = (dateObj) => {
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  // 5. Render Components
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);
    weekDays.push(d);
  }

  const visibleSlots = slots.filter(slot => {
    const slotStart = new Date(slot.startTime);
    const slotEnd = new Date(slot.endTime);
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    return activeFilters[slot.type] && slotStart >= currentWeekStart && slotStart < weekEnd;
  });

  return (
    <>
      {/* Title & Breadcrumbs */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn btn-link p-0 text-dark" 
            onClick={() => navigate(`/doctors/details/${doctor.id}`)}
            title="Back to Doctor Details"
          >
            <i className="bi bi-arrow-left fs-3"></i>
          </button>
          <div>
            <h1 className="page-title mb-1" style={{ fontSize: '1.75rem' }}>Doctor Schedule</h1>
            <nav className="breadcrumb-custom" aria-label="breadcrumb">
              <span className="text-muted" style={{ cursor: 'pointer' }} onClick={() => navigate('/doctors')}>Doctors</span>
              <span className="mx-2">&gt;</span>
              <span className="text-muted" style={{ cursor: 'pointer' }} onClick={() => navigate(`/doctors/details/${doctor.id}`)}>{doctor.name}</span>
              <span className="mx-2">&gt;</span>
              <span className="active">Schedule</span>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Doctor Summary Header Card */}
      <div className="card doctor-card p-4 mb-4">
        <div className="doctor-card-content d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <img src={doctorAvatar} id="doctor-avatar" className="doctor-profile-img" alt={doctor.name} />
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h2 className="doctor-name mb-0">{doctor.name}</h2>
                <span className="badge-active">{doctor.status}</span>
              </div>
              <div className="doctor-specialty">{doctor.specialty}</div>
              <div className="doctor-id">{doctor.id}</div>
            </div>
          </div>
          
          <div className="action-section d-flex align-items-center gap-3 flex-wrap">
            <div className="schedule-nav-group">
              <button className="schedule-nav-btn" onClick={() => navigateWeek(-1)}><i className="bi bi-chevron-left"></i></button>
              <button className="schedule-nav-btn" onClick={setToday}><i className="bi bi-calendar3"></i> Today</button>
              <div className="schedule-date-range">{getWeekRangeStr()}</div>
              <button className="schedule-nav-btn" onClick={() => navigateWeek(1)}><i className="bi bi-chevron-right"></i></button>
            </div>
            
            <button 
              className="btn btn-outline-primary"
              onClick={() => navigate(`/doctors/${doctor.id}/performance`)}
              style={{ fontWeight: 600, fontSize: '0.875rem', height: '38px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <i className="bi bi-bar-chart"></i> View Performance
            </button>
            
            <button className="btn-medicore" onClick={handleOpenAddBtn} style={{ height: '38px' }}>
              <i className="bi bi-plus-lg"></i> Add Slot
            </button>
          </div>
        </div>
      </div>
      
      {/* Schedule Table Container */}
      <div className="card schedule-container-card overflow-hidden">
        <div className="calendar-wrapper">
          <div className="calendar-grid">
            
            {/* Header Columns */}
            <div className="grid-header">
              <div className="grid-header-cell time-header">Time</div>
              {weekDays.map((day, idx) => {
                const isToday = isSameDay(day, mockCurrentTime);
                return (
                  <div key={idx} className={`grid-header-cell ${isToday ? 'active-day' : ''}`}>
                    <span className="day-label">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className="date-label">{day.getDate()}</span>
                    <span className="day-label mt-1" style={{ fontSize: '0.75rem' }}>
                      {day.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Grid Body */}
            <div className="grid-body">
              {/* Time Column labels */}
              <div className="time-column">
                {Array.from({ length: 10 }).map((_, idx) => {
                  const hour = startGridHour + idx;
                  const label = hour < 12 ? `${hour}:00 AM` : hour === 12 ? "12:00 PM" : `${hour - 12}:00 PM`;
                  return (
                    <div key={idx} className="time-slot-label">
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Columns for Days 0-6 */}
              <div className="day-column-container">
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const dayDate = weekDays[dayIdx];
                  const isToday = isSameDay(dayDate, mockCurrentTime);
                  
                  // Filter events on this specific column day
                  const daySlots = visibleSlots.filter(s => isSameDay(new Date(s.startTime), dayDate));
                  
                  // Calculate time indicator offset
                  const currentHour = mockCurrentTime.getHours() + mockCurrentTime.getMinutes() / 60;
                  const indicatorTop = (currentHour - startGridHour) * hourHeight;
                  const showIndicator = isToday && currentHour >= startGridHour && currentHour <= endGridHour;

                  return (
                    <div 
                      key={dayIdx} 
                      className="day-column"
                      onClick={(e) => {
                        if (e.target.closest('.schedule-event')) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickY = e.clientY - rect.top;
                        const clickedHour = Math.floor(startGridHour + (clickY / hourHeight));
                        handleCellClick(dayIdx, clickedHour);
                      }}
                    >
                      {/* Render indicator line */}
                      {showIndicator && (
                        <div className="time-indicator-line" style={{ top: `${indicatorTop}px` }}>
                          <span className="time-indicator-dot"></span>
                        </div>
                      )}
                      
                      {/* Render Events */}
                      {daySlots.map((slot, sIdx) => {
                        const start = new Date(slot.startTime);
                        const end = new Date(slot.endTime);
                        const sh = start.getHours() + start.getMinutes() / 60;
                        const eh = end.getHours() + end.getMinutes() / 60;
                        
                        const top = (sh - startGridHour) * hourHeight;
                        const height = (eh - sh) * hourHeight;
                        
                        let dotClass = "dot-booked";
                        if (slot.status === "urgent") dotClass = "dot-urgent";
                        if (slot.status === "priority") dotClass = "dot-priority";
                        if (slot.status === "available") dotClass = "dot-available";
                        
                        return (
                          <div 
                            key={sIdx} 
                            className={`schedule-event event-${slot.type}`}
                            style={{ top: `${top + 4}px`, height: `${height - 8}px` }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSlot(slot);
                              setIsViewOpen(true);
                            }}
                          >
                            <div className="event-title">{slot.title}</div>
                            <div className="event-time">{`${formatSlotTime(start)} - ${formatSlotTime(end)}`}</div>
                            <div className="event-meta">
                              <span className={`status-dot ${dotClass}`}></span>
                              <span>{slot.patientName || (slot.status === 'available' ? 'Available' : 'Blocked')}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Checkbox filters footer */}
        <div className="legend-section">
          <div className="legend-filters">
            {Object.keys(activeFilters).map((cat, idx) => {
              const labelMap = {
                consultation: "Consultation",
                surgery: "Surgery",
                followup: "Follow-up",
                tests: "Tests / ECG",
                ward_rounds: "Ward Rounds"
              };
              return (
                <label key={idx} className="legend-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={activeFilters[cat]} 
                    onChange={(e) => {
                      setActiveFilters({ ...activeFilters, [cat]: e.target.checked });
                    }}
                    className="form-check-input" 
                  />
                  <span>{labelMap[cat]}</span>
                </label>
              );
            })}
          </div>
          
          <div className="legend-status">
            <div className="status-indicator-item">
              <span className="status-dot dot-booked"></span>
              <span>Booked</span>
            </div>
            <div className="status-indicator-item">
              <span class="status-dot dot-available"></span>
              <span>Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Slot (Conditional Render styling bootstrap) */}
      {isAddOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} tabindex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                <h5 className="modal-title fw-bold"><i className="bi bi-calendar-plus-fill me-2"></i>Add Schedule Slot</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsAddOpen(false)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleSaveSlot}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Slot Title / Procedure</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Heart Consultation" 
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Category</label>
                      <select 
                        className="form-select" 
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        required
                      >
                        <option value="consultation">Consultation</option>
                        <option value="surgery">Surgery</option>
                        <option value="followup">Follow-up</option>
                        <option value="tests">Tests / ECG</option>
                        <option value="ward_rounds">Ward Rounds</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Date</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Start Time</label>
                      <input 
                        type="time" 
                        className="form-control" 
                        value={formStart}
                        onChange={(e) => setFormStart(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">End Time</label>
                      <input 
                        type="time" 
                        className="form-control" 
                        value={formEnd}
                        onChange={(e) => setFormEnd(e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Patient Name (Optional)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. John Doe"
                        value={formPatient}
                        onChange={(e) => setFormPatient(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Status</label>
                      <select 
                        className="form-select" 
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value)}
                        required
                      >
                        <option value="booked">Booked (Standard)</option>
                        <option value="available">Available Slot</option>
                        <option value="urgent">Urgent Priority</option>
                        <option value="priority">High Priority</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '8px' }} onClick={() => setIsAddOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-bold px-4 py-2" style={{ borderRadius: '8px' }}>Save Slot</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Slot Details */}
      {isViewOpen && selectedSlot && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} tabindex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header bg-light border-0 py-3" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                <h5 className="modal-title fw-bold text-dark"><i className="bi bi-info-circle-fill text-primary me-2"></i>Slot Details</h5>
                <button type="button" className="btn-close" onClick={() => setIsViewOpen(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-4">
                  <div className="text-uppercase text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    {selectedSlot.type.replace('_', ' ')}
                  </div>
                  <h4 className="fw-bold mb-2 text-primary">{selectedSlot.title}</h4>
                  <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.9rem' }}>
                    <i className="bi bi-clock"></i>
                    <span>{`${new Date(selectedSlot.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} @ ${formatSlotTime(new Date(selectedSlot.startTime))} - ${formatSlotTime(new Date(selectedSlot.endTime))}`}</span>
                  </div>
                </div>
                
                <div className="p-3 bg-light rounded-3 mb-2" style={{ fontSize: '0.95rem' }}>
                  {selectedSlot.patientName ? (
                    <span><strong>Patient:</strong> {selectedSlot.patientName} ({selectedSlot.status})</span>
                  ) : (
                    <span><strong>Status:</strong> {selectedSlot.status}</span>
                  )}
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0 d-flex justify-content-between">
                <button 
                  type="button" 
                  className="btn btn-outline-danger fw-bold px-4 py-2" 
                  style={{ borderRadius: '8px' }}
                  onClick={() => handleDeleteSlot(selectedSlot.id)}
                >
                  <i className="bi bi-trash3-fill me-1"></i> Delete Slot
                </button>
                <button type="button" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '8px' }} onClick={() => setIsViewOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SchedulePage;
