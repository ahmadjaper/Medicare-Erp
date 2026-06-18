import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

function Sidebar() {
  const { currentRole } = useRole();

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
        {/* Dashboard is visible to all roles */}
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className="bi bi-speedometer2"></i> Dashboard
        </NavLink>

        {/* ADMIN ROLE SIDEBAR */}
        {currentRole === 'Admin' && (
          <>
            <div className="nav-section-title">Management</div>
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
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-person-badge"></i> Doctors
            </NavLink>

            <div className="nav-section-title">Operations</div>
            <NavLink 
              to="/appointments" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-calendar-check"></i> Appointments
            </NavLink>
            <NavLink 
              to="/schedules" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-calendar3"></i> Schedules
            </NavLink>
            <NavLink 
              to="/doctor-availability" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-clock-history"></i> Doctor Availability
            </NavLink>

            <div className="nav-section-title">Inventory</div>
            <NavLink 
              to="/inventory" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-box-seam"></i> Inventory
            </NavLink>
            <NavLink 
              to="/supplies" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-truck"></i> Supplies
            </NavLink>

            <div className="nav-section-title">Finance</div>
            <NavLink 
              to="/revenue" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-wallet2"></i> Revenue & Expenses
            </NavLink>
            <NavLink 
              to="/analytics" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-bar-chart"></i> Analytics
            </NavLink>

            <div className="nav-section-title">Administration</div>
            <NavLink 
              to="/users" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-person-gear"></i> Users
            </NavLink>
            <NavLink 
              to="/roles" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-shield-lock"></i> Roles & Permissions
            </NavLink>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-gear"></i> Settings
            </NavLink>
          </>
        )}

        {/* HR ROLE SIDEBAR */}
        {currentRole === 'HR' && (
          <>
            <div className="nav-section-title">Management</div>
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
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-person-badge"></i> Doctors
            </NavLink>

            <div className="nav-section-title">Operations</div>
            <NavLink 
              to="/schedules" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-calendar3"></i> Schedules
            </NavLink>

            <div className="nav-section-title">Settings</div>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-gear"></i> Settings
            </NavLink>
          </>
        )}

        {/* RECEPTIONIST ROLE SIDEBAR */}
        {currentRole === 'Receptionist' && (
          <>
            <div className="nav-section-title">Operations</div>
            <NavLink 
              to="/appointments" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-calendar-check"></i> Appointments
            </NavLink>
            <NavLink 
              to="/doctor-availability" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-clock-history"></i> Doctor Availability
            </NavLink>

            <div className="nav-section-title">Settings</div>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-gear"></i> Settings
            </NavLink>
          </>
        )}
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
