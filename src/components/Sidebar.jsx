import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

function Sidebar() {
  const location = useLocation();
  const { currentRole } = useRole();

  const handleLogout = (e) => {
    e.preventDefault();
    alert("Logging out of ERP...");
  };

  // Define sidebar menu items mapped strictly to the approved modules and roles
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2', roles: ['Admin', 'HR', 'Receptionist'] },
    { path: '/departments', label: 'Departments', icon: 'bi-building', roles: ['Admin', 'HR'] },
    { path: '/employees', label: 'Employees', icon: 'bi-people', roles: ['Admin', 'HR'] },
    { 
      path: '/doctors', 
      label: 'Doctors', 
      icon: 'bi-person-badge', 
      roles: ['Admin', 'HR'],
      matchPrefix: '/doctors'
    },
    { path: '/schedules', label: 'Schedules', icon: 'bi-calendar3', roles: ['Admin', 'HR'] },
    { 
      path: '/appointments', 
      label: 'Appointments', 
      icon: 'bi-calendar-check', 
      roles: ['Admin', 'Receptionist'],
      matchPrefix: '/appointments'
    },
    { path: '/doctor-availability', label: 'Doctor Availability', icon: 'bi-calendar2-check', roles: ['Admin', 'Receptionist'] },
    { path: '/inventory', label: 'Inventory', icon: 'bi-box-seam', roles: ['Admin'] },
    { path: '/supplies', label: 'Supplies', icon: 'bi-clipboard-pulse', roles: ['Admin'] },
    { path: '/suppliers', label: 'Suppliers', icon: 'bi-truck', roles: ['Admin'], matchPrefix: '/suppliers' },
    { path: '/revenue', label: 'Revenue', icon: 'bi-wallet2', roles: ['Admin'] },
    { path: '/analytics', label: 'Analytics', icon: 'bi-bar-chart', roles: ['Admin'] },
    { path: '/users', label: 'Users', icon: 'bi-people-fill', roles: ['Admin'] },
    { path: '/roles', label: 'Roles & Permissions', icon: 'bi-shield-lock', roles: ['Admin'] },
    { path: '/settings', label: 'Settings', icon: 'bi-gear', roles: ['Admin', 'HR', 'Receptionist'], matchPrefix: '/settings' },
  ];

  // Filter items based on current active role
  const visibleMenuItems = menuItems.filter(item => item.roles.includes(currentRole));

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
        {visibleMenuItems.map((item) => {
          const isActive = item.matchPrefix 
            ? location.pathname.startsWith(item.matchPrefix)
            : location.pathname === item.path;

          return (
            <NavLink 
              key={item.path}
              to={item.path} 
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon}`}></i> {item.label}
            </NavLink>
          );
        })}
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
