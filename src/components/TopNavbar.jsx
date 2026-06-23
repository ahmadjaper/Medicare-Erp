import React, { useEffect } from 'react';
import doctorAvatar from '../assets/img/doctor-avatar.png';

function TopNavbar({ showUserRole = true }) {
  
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

  return (
    <div className="top-navbar-actions text-end d-flex align-items-center justify-content-end gap-2 ms-auto">
      <div className="search-wrapper position-relative text-start">
        <i className="bi bi-search"></i>
        <input 
          type="text" 
          className="search-input" 
          id="navbar-search" 
          placeholder="Search doctors... Ctrl + K" 
          onKeyDown={(e) => {
            if (e.key === 'Enter') alert(`Searching for: ${e.target.value}`);
          }}
        />
      </div>
      
      <button 
        className="btn-notification" 
        aria-label="Notifications" 
        onClick={() => alert("Notifications: You have no new notifications.")}
      >
        <i className="bi bi-bell"></i>
        <span className="alert-dot"></span>
      </button>
      
      {showUserRole && (
        <div className="navbar-user-text d-none d-md-block text-start me-1">
          <div className="navbar-user-name" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Admin User</div>
          <div className="navbar-user-role" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>System Administrator</div>
        </div>
      )}
      
      <img 
        src={doctorAvatar} 
        className="navbar-user-avatar" 
        alt="Logged User Avatar" 
        title="View User Profile" 
        onClick={() => alert("Opening user configuration dropdown...")}
      />
    </div>
  );
}

export default TopNavbar;
