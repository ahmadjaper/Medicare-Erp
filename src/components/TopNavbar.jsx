import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useUser } from '../context/UserContext';
import { useErpStore } from '../store/erpStore';
import doctorAvatar from '../assets/img/doctor-avatar.png';

function TopNavbar({ showUserRole = true }) {
  const { currentRole, setCurrentRole } = useRole();
  const { userProfile } = useUser();
  const navigate = useNavigate();

  const {
    patients,
    doctors,
    appointments,
    alerts,
    messages,
    markAlertRead,
    markAllAlertsRead,
    markMessageRead,
    markAllMessagesRead,
    exportReport
  } = useErpStore();

  const [searchVal, setSearchVal] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const msgRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    // Focus search input on Ctrl K
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("navbar-search");
        if (searchInput) searchInput.focus();
      }
    };
    
    // Close dropdowns on outside click
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (msgRef.current && !msgRef.current.contains(event.target)) {
        setShowMessages(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const userAvatar = userProfile?.avatar || doctorAvatar;
  const userFullName = userProfile?.fullName || "Admin User";
  const userJobTitle = userProfile?.jobTitle || "System Administrator";

  // Real-time search matching
  const matchingPatients = searchVal
    ? patients.filter(p => p.name.toLowerCase().includes(searchVal.toLowerCase()) || p.id.toLowerCase().includes(searchVal.toLowerCase()))
    : [];
  
  const matchingDoctors = searchVal
    ? doctors.filter(d => d.name.toLowerCase().includes(searchVal.toLowerCase()) || d.specialty.toLowerCase().includes(searchVal.toLowerCase()))
    : [];

  const matchingAppointments = searchVal
    ? appointments.filter(a => a.id.toLowerCase().includes(searchVal.toLowerCase()) || a.patientName.toLowerCase().includes(searchVal.toLowerCase()))
    : [];

  const hasSearchResults = matchingPatients.length > 0 || matchingDoctors.length > 0 || matchingAppointments.length > 0;

  const unreadAlertsCount = alerts.filter(a => !a.read).length;
  const unreadMessagesCount = messages.filter(m => !m.read).length;

  const handleExport = (format) => {
    exportReport(format);
  };

  return (
    <div className="top-navbar-actions text-end d-flex align-items-center justify-content-end gap-2 ms-auto position-relative">
      
      {/* Real-time Search wrapper */}
      <div ref={searchRef} className="search-wrapper position-relative text-start">
        <i className="bi bi-search"></i>
        <input 
          type="text" 
          className="search-input" 
          id="navbar-search" 
          placeholder="Search patients, doctors, appointments..." 
          value={searchVal}
          onChange={(e) => {
            setSearchVal(e.target.value);
            setShowSearchResults(true);
          }}
          onFocus={() => setShowSearchResults(true)}
        />
        <span className="search-kbd">Ctrl K</span>

        {/* Real-time Search Dropdown Panel */}
        {showSearchResults && searchVal && (
          <div className="card shadow-lg border-secondary-subtle position-absolute top-100 start-0 mt-1 p-2 overflow-y-auto" style={{ zIndex: 1000, maxHeight: '350px', width: '380px', borderRadius: '8px' }}>
            <div className="px-2 py-1 text-muted border-bottom fw-bold" style={{ fontSize: '0.75rem' }}>Search Results</div>
            
            {hasSearchResults ? (
              <>
                {/* Patients results */}
                {matchingPatients.length > 0 && (
                  <div className="mt-2">
                    <div className="text-primary fw-semibold px-2 mb-1" style={{ fontSize: '0.75rem' }}>Patients</div>
                    {matchingPatients.map(p => (
                      <div key={p.id} className="p-2 border-bottom hover-bg-light cursor-pointer rounded" onClick={() => { navigate('/patients'); setShowSearchResults(false); setSearchVal(""); }} style={{ fontSize: '0.8rem', cursor: 'pointer' }}>
                        <div className="fw-bold">{p.name}</div>
                        <div className="text-muted">{p.id} • {p.gender} • {p.phone}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Doctors results */}
                {matchingDoctors.length > 0 && (
                  <div className="mt-2">
                    <div className="text-success fw-semibold px-2 mb-1" style={{ fontSize: '0.75rem' }}>Doctors</div>
                    {matchingDoctors.map(d => (
                      <div key={d.id} className="p-2 border-bottom hover-bg-light cursor-pointer rounded" onClick={() => { navigate('/doctors'); setShowSearchResults(false); setSearchVal(""); }} style={{ fontSize: '0.8rem', cursor: 'pointer' }}>
                        <div className="fw-bold">{d.name}</div>
                        <div className="text-muted">{d.specialty} • {d.room}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Appointments results */}
                {matchingAppointments.length > 0 && (
                  <div className="mt-2">
                    <div className="text-warning fw-semibold px-2 mb-1" style={{ fontSize: '0.75rem' }}>Appointments</div>
                    {matchingAppointments.map(a => (
                      <div key={a.id} className="p-2 border-bottom hover-bg-light cursor-pointer rounded" onClick={() => { navigate('/appointments/details'); setShowSearchResults(false); setSearchVal(""); }} style={{ fontSize: '0.8rem', cursor: 'pointer' }}>
                        <div className="fw-bold">{a.id} - {a.patientName}</div>
                        <div className="text-muted">With {a.doctorName} @ {a.time} ({a.status})</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="p-3 text-center text-muted" style={{ fontSize: '0.8rem' }}>No results match "{searchVal}"</div>
            )}
          </div>
        )}
      </div>

      {/* Notifications trigger button */}
      <div className="position-relative" ref={notifRef}>
        <button 
          className="btn-notification" 
          aria-label="Notifications" 
          onClick={() => {
            setShowNotifications(!showNotifications);
            setShowMessages(false);
            setShowUserMenu(false);
          }}
        >
          <i className="bi bi-bell"></i>
          {unreadAlertsCount > 0 && (
            <span className="badge bg-danger rounded-circle position-absolute top-0 start-50 translate-middle-y px-1" style={{ fontSize: '0.6rem' }}>
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown Panel */}
        {showNotifications && (
          <div className="card shadow-lg border-secondary-subtle position-absolute end-0 mt-2 p-2" style={{ zIndex: 1000, width: '300px', borderRadius: '8px' }}>
            <div className="d-flex justify-content-between align-items-center px-2 py-1 border-bottom">
              <span className="fw-bold text-dark" style={{ fontSize: '0.8rem' }}>System Updates & Alerts</span>
              <button className="btn btn-link p-0 text-decoration-none fw-bold" style={{ fontSize: '0.7rem' }} onClick={markAllAlertsRead}>Clear All</button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '250px' }}>
              {alerts.map(a => (
                <div 
                  key={a.id} 
                  className={`p-2 border-bottom rounded hover-bg-light cursor-pointer ${!a.read ? 'bg-light-subtle fw-semibold border-start border-3 border-primary' : ''}`}
                  onClick={() => { markAlertRead(a.id); useErpStore.getState().showToast(a.desc, "info"); }}
                  style={{ fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  <div className="d-flex justify-content-between">
                    <span className="text-dark">{a.title}</span>
                    <span className="text-muted" style={{ fontSize: '0.65rem' }}>{a.timeLabel}</span>
                  </div>
                  <div className="text-muted text-truncate">{a.desc}</div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="p-3 text-center text-muted" style={{ fontSize: '0.75rem' }}>No new notifications</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Messages trigger button */}
      <div className="position-relative" ref={msgRef}>
        <button 
          className="btn-notification" 
          aria-label="Messages" 
          onClick={() => {
            setShowMessages(!showMessages);
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        >
          <i className="bi bi-chat"></i>
          {unreadMessagesCount > 0 && (
            <span className="badge bg-primary rounded-circle position-absolute top-0 start-50 translate-middle-y px-1" style={{ fontSize: '0.6rem' }}>
              {unreadMessagesCount}
            </span>
          )}
        </button>

        {/* Messages Dropdown Panel */}
        {showMessages && (
          <div className="card shadow-lg border-secondary-subtle position-absolute end-0 mt-2 p-2" style={{ zIndex: 1000, width: '300px', borderRadius: '8px' }}>
            <div className="d-flex justify-content-between align-items-center px-2 py-1 border-bottom">
              <span className="fw-bold text-dark" style={{ fontSize: '0.8rem' }}>ERP Inbox</span>
              <button className="btn btn-link p-0 text-decoration-none fw-bold" style={{ fontSize: '0.7rem' }} onClick={markAllMessagesRead}>Mark Read</button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '250px' }}>
              {messages.map(m => (
                <div 
                  key={m.id} 
                  className={`p-2 border-bottom rounded hover-bg-light cursor-pointer ${!m.read ? 'bg-light-subtle fw-semibold border-start border-3 border-success' : ''}`}
                  onClick={() => { markMessageRead(m.id); useErpStore.getState().showToast(`Message from ${m.sender}: "${m.content}"`, "info"); }}
                  style={{ fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  <div className="d-flex justify-content-between">
                    <span className="text-dark">{m.sender}</span>
                    <span className="text-muted" style={{ fontSize: '0.65rem' }}>{m.time}</span>
                  </div>
                  <div className="text-muted text-truncate">{m.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Export Report Actions */}
      <div className="dropdown">
        <button className="btn btn-sm btn-primary px-3 fw-bold" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ height: '32px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <i className="bi bi-box-arrow-up-right"></i> Export Report
        </button>
        <ul className="dropdown-menu border-0 shadow-sm" style={{ borderRadius: '8px', zIndex: 1010 }}>
          <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleExport('csv'); }}>Download CSV</a></li>
          <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleExport('pdf'); }}>Download PDF Summary</a></li>
        </ul>
      </div>
      
      {showUserRole && (
        <div className="d-flex align-items-center gap-2">
          <div className="navbar-user-text d-none d-md-block text-start me-1">
            <div className="navbar-user-name" style={{ fontSize: '0.8rem', fontWeight: 700 }}>{userFullName}</div>
            <div className="navbar-user-role" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{userJobTitle}</div>
          </div>
          <select 
            value={currentRole} 
            onChange={(e) => {
              setCurrentRole(e.target.value);
              navigate('/dashboard');
            }}
            className="form-select form-select-sm border-secondary-subtle"
            style={{ width: '135px', fontSize: '0.8rem', height: '32px', cursor: 'pointer' }}
          >
            <option value="Admin">Admin Role</option>
            <option value="HR">HR Role</option>
            <option value="Receptionist">Receptionist Role</option>
          </select>
        </div>
      )}
      
      <div className="position-relative" ref={userMenuRef}>
        <img 
          src={userAvatar} 
          className="navbar-user-avatar" 
          alt="Logged User Avatar" 
          title="View User Profile" 
          style={{ cursor: 'pointer', width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }}
          onClick={() => setShowUserMenu(!showUserMenu)}
        />

        {showUserMenu && (
          <div className="card shadow-lg border-secondary-subtle position-absolute end-0 mt-2 p-2" style={{ zIndex: 1000, width: '200px', borderRadius: '8px' }}>
            <div className="px-3 py-2 border-bottom text-start">
              <div className="fw-bold">{userFullName}</div>
              <div className="text-muted small">{userJobTitle}</div>
            </div>
            <div className="d-flex flex-column text-start mt-1">
              <button className="btn btn-sm text-start hover-bg-light" style={{ fontSize: '0.8rem' }} onClick={() => { navigate('/settings?tab=profile'); setShowUserMenu(false); }}><i className="bi bi-person me-2"></i> My Profile</button>
              <button className="btn btn-sm text-start hover-bg-light" style={{ fontSize: '0.8rem' }} onClick={() => { navigate('/settings'); setShowUserMenu(false); }}><i className="bi bi-gear me-2"></i> Settings</button>
              <hr className="dropdown-divider my-1" />
              <button className="btn btn-sm text-start text-danger hover-bg-light" style={{ fontSize: '0.8rem' }} onClick={() => { useErpStore.getState().showToast("Logging out...", "info"); setShowUserMenu(false); }}><i className="bi bi-box-arrow-right me-2"></i> Logout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopNavbar;
