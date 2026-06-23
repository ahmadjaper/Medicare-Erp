import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const isDoctorsActive = location.pathname.startsWith('/doctors');

  const handleLogout = (e) => {
    e.preventDefault();
    alert("Logging out of ERP...");
  };

  return (
    <nav className="sidebar" id="sidebar">
      <div className="brand-area">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-hospital-fill fs-4 text-primary"></i>
          <div>
            <div className="brand-title">MediCore ERP</div>
            <div className="brand-subtitle">Hospital Management</div>
          </div>
        </div>
      </div>
      
      <div className="flex-grow-1 overflow-y-auto">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-speedometer2"></i> Dashboard
        </NavLink>

        <NavLink 
          to="/departments" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-building"></i> Departments
        </NavLink>

        <NavLink 
          to="/employees" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-people"></i> Employees
        </NavLink>

        <NavLink 
          to="/doctors" 
          className={`nav-link ${isDoctorsActive ? 'active' : ''}`}
        >
          <i className="bi bi-person-badge-fill"></i> Doctors
        </NavLink>

        <NavLink 
          to="/schedules" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-calendar3"></i> Schedules
        </NavLink>

        <NavLink 
          to="/appointments" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-calendar-check-fill"></i> Appointments
        </NavLink>

        <NavLink 
          to="/patients" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-person"></i> Patients
        </NavLink>

        <NavLink 
          to="/inventory" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-box-seam"></i> Inventory
        </NavLink>

        <NavLink 
          to="/suppliers" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-truck"></i> Suppliers
        </NavLink>

        <NavLink 
          to="/revenue" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-wallet2"></i> Revenue
        </NavLink>

        <NavLink 
          to="/analytics" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-bar-chart"></i> Analytics
        </NavLink>

        <NavLink 
          to="/users-roles" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-shield-lock"></i> Users & Roles
        </NavLink>
      </div>
      
      <div className="sidebar-footer">
        <a href="#" className="nav-link nav-link-logout" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i> Logout
        </a>
      </div>
    </nav>
  );
}

export default Sidebar;
