import React from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

function Sidebar() {
  const { currentRole, hasPermission } = useRole();

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
        {/* Main Application Navigation */}
        {hasPermission('Dashboard', 'view') && (
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-speedometer2"></i> Dashboard
          </NavLink>
        )}
        {hasPermission('Departments', 'view') && (
          <NavLink to="/departments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-building"></i> Departments
          </NavLink>
        )}
        {hasPermission('Employees', 'view') && (
          <NavLink to="/employees" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-people"></i> Employees
          </NavLink>
        )}
        {hasPermission('Doctors', 'view') && (
          <NavLink to="/doctors" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-person-badge"></i> Doctors
          </NavLink>
        )}
        {hasPermission('Appointments', 'view') && (
          <NavLink to="/appointments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-calendar-check"></i> Appointments
          </NavLink>
        )}
        {hasPermission('Patients', 'view') && (
          <NavLink to="/patients" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-person-vcard"></i> Patients
          </NavLink>
        )}
        {hasPermission('Appointments', 'view') && (
          <NavLink to="/schedules" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-calendar3"></i> Schedules
          </NavLink>
        )}
        {hasPermission('Inventory', 'view') && (
          <NavLink to="/inventory" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-box-seam"></i> Inventory
          </NavLink>
        )}

        {hasPermission('Inventory', 'view') && (
          <NavLink to="/suppliers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-truck"></i> Suppliers
          </NavLink>
        )}
        {hasPermission('Settings', 'view') && (
          <NavLink to="/users-roles" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-person-gear"></i> Users & Roles
          </NavLink>
        )}
        {hasPermission('Settings', 'view') && (
          <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="bi bi-gear"></i> Settings
          </NavLink>
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
