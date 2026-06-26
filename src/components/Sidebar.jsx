import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useErpStore } from '../store/erpStore';

function Sidebar() {
  const location = useLocation();
  const { currentRole } = useRole();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    useErpStore.getState().showToast("Logging out of ERP...", "info");
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
              to="/schedules" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-calendar3"></i> Schedules
            </NavLink>
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
            <NavLink 
              to="/patients" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-person-heart"></i> Patients
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
              <i className="bi bi-clipboard-pulse"></i> Supplies
            </NavLink>
            <NavLink 
              to="/suppliers" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-truck"></i> Suppliers
            </NavLink>
            <NavLink 
              to="/low-stock-alerts" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-exclamation-triangle"></i> Low Stock Alerts
            </NavLink>

            <div className="nav-section-title">Finance & Analytics</div>
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
              <i className="bi bi-person-gear"></i> Users & Roles
            </NavLink>
            <NavLink 
              to="/permissions" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-shield-lock"></i> Permissions
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
              to="/patients" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-person-heart"></i> Patients
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
