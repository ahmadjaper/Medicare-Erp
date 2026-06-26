import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useUser } from '../context/UserContext';
import doctorAvatar from '../assets/img/doctor-avatar.png';

function TopNavbar({ showUserRole = true, searchPlaceholder = "Search...", onSearchChange }) {
  const { currentRole, setCurrentRole } = useRole();
  const { userProfile } = useUser();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef(null);
  const msgRef = useRef(null);
  const profileRef = useRef(null);
  
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
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      // Blur the input to mimic search action completion
      e.target.blur();
    }
  };

  const userAvatar = userProfile?.avatar || doctorAvatar;
  const userFullName = userProfile?.fullName || "Admin User";
  const userJobTitle = userProfile?.jobTitle || "System Administrator";

  return (
    <div className="top-navbar-actions text-end d-flex align-items-center justify-content-end gap-2 ms-auto">
      <div className="search-wrapper position-relative text-start">
        <i className="bi bi-search"></i>
        <input 
          type="text" 
          className="search-input" 
          id="navbar-search" 
          placeholder={searchPlaceholder} 
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          onKeyDown={handleSearchSubmit}
        />
      </div>
      
      <div className="position-relative" ref={notifRef}>
        <button 
          className="btn-notification" 
          aria-label="Notifications" 
          onClick={() => { setShowNotifications(!showNotifications); setShowMessages(false); setShowProfileMenu(false); }}
        >
          <i className="bi bi-bell"></i>
          <span className="alert-dot" style={{ display: 'none' }}></span>
        </button>
        {showNotifications && (
          <div className="dropdown-menu dropdown-menu-end show shadow-sm" style={{position: 'absolute', right: 0, top: '100%', minWidth: '250px', zIndex: 1050}}>
            <h6 className="dropdown-header">Notifications</h6>
            <div className="dropdown-item text-muted small text-center py-3">
              You have no new notifications.
            </div>
          </div>
        )}
      </div>

      <div className="position-relative" ref={msgRef}>
        <button 
          className="btn-notification" 
          aria-label="Messages" 
          onClick={() => { setShowMessages(!showMessages); setShowNotifications(false); setShowProfileMenu(false); }}
        >
          <i className="bi bi-chat-square-text"></i>
        </button>
        {showMessages && (
          <div className="dropdown-menu dropdown-menu-end show shadow-sm" style={{position: 'absolute', right: 0, top: '100%', minWidth: '250px', zIndex: 1050}}>
            <h6 className="dropdown-header">Messages</h6>
            <div className="dropdown-item text-muted small text-center py-3">
              You have no new messages.
            </div>
          </div>
        )}
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
      
      <div className="position-relative" ref={profileRef}>
        <img 
          src={userAvatar} 
          className="navbar-user-avatar" 
          alt="Logged User Avatar" 
          title="View User Profile" 
          style={{ cursor: 'pointer', width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }}
          onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); setShowMessages(false); }}
        />
        {showProfileMenu && (
          <div className="dropdown-menu dropdown-menu-end show shadow-sm" style={{position: 'absolute', right: 0, top: '100%', minWidth: '200px', zIndex: 1050}}>
            <div className="px-3 py-2 border-bottom">
              <div className="fw-bold">{userFullName}</div>
              <div className="text-muted small">{userJobTitle}</div>
            </div>
            <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => { setShowProfileMenu(false); navigate('/settings?tab=profile'); }}>
              <i className="bi bi-person"></i> My Profile
            </button>
            <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}>
              <i className="bi bi-gear"></i> Settings
            </button>
            <hr className="dropdown-divider" />
            <button className="dropdown-item text-danger d-flex align-items-center gap-2 py-2" onClick={() => { setShowProfileMenu(false); alert('Logging out...'); }}>
              <i className="bi bi-box-arrow-right"></i> Log out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopNavbar;
