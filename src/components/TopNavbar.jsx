import React, { useEffect } from 'react';
import doctorAvatar from '../assets/img/doctor-avatar.png';
import { useRole } from '../context/RoleContext';

function TopNavbar({ showUserRole = true }) {
  const { currentRole, setCurrentRole } = useRole();
  
  useEffect(() => {
    // Focus search input on Ctrl K
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("navbar-search");
        if (searchInput) searchInput.focus();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Set user display text based on current role
  let userName = "Admin User";
  let userRoleLabel = "System Administrator";
  
  if (currentRole === 'HR') {
    userName = "HR Manager";
    userRoleLabel = "Human Resources";
  } else if (currentRole === 'Receptionist') {
    userName = "Receptionist User";
    userRoleLabel = "Front Desk Operations";
  }

  return (
    <div className="top-navbar-actions text-end d-flex align-items-center justify-content-end gap-2 ms-auto">
      <div className="search-wrapper position-relative text-start">
        <i className="bi bi-search"></i>
        <input 
          type="text" 
          className="search-input" 
          id="navbar-search" 
          placeholder="Search..." 
          onKeyDown={(e) => {
            if (e.key === 'Enter') alert(`Searching for: ${e.target.value}`);
          }}
        />
        <span className="search-kbd">Ctrl K</span>
      </div>
      
      <button 
        className="btn-notification" 
        aria-label="Notifications" 
        onClick={() => alert("Notifications: You have no new notifications.")}
      >
        <i className="bi bi-bell"></i>
        <span className="alert-dot" style={{ display: 'none' }}></span>
      </button>
      
      {showUserRole && (
        <div className="d-flex align-items-center gap-2">
          <div className="navbar-user-text d-none d-md-block text-start me-1">
            <div className="navbar-user-name" style={{ fontSize: '0.8rem', fontWeight: 700 }}>{userName}</div>
            <div className="navbar-user-role" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{userRoleLabel}</div>
          </div>
          <select 
            value={currentRole} 
            onChange={(e) => setCurrentRole(e.target.value)}
            className="form-select form-select-sm border-secondary-subtle"
            style={{ width: '135px', fontSize: '0.8rem', height: '32px', cursor: 'pointer' }}
          >
            <option value="Admin">Admin Role</option>
            <option value="HR">HR Role</option>
            <option value="Receptionist">Receptionist Role</option>
          </select>
        </div>
      )}
      
      <img 
        src={doctorAvatar} 
        className="navbar-user-avatar" 
        alt="Logged User Avatar" 
        title="View User Profile" 
        onClick={() => alert(`Logged in as: ${userName} (${userRoleLabel})`)}
      />
    </div>
  );
}

export default TopNavbar;
