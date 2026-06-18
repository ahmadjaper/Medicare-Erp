import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
  const location = useLocation();

  // Close sidebar drawer on route navigation change (for mobile views)
  useEffect(() => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar && sidebar.classList.contains("show")) {
      sidebar.classList.remove("show");
    }
  }, [location]);

  return (
    <div className="d-flex w-100">
      {/* Shared Left Sidebar Navigation */}
      <Sidebar />

      {/* Shared Main Content Shell Wrapper */}
      <main className="main-wrapper flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
        
        {/* Top Toggler Bar (Visible on mobile/tablet viewports only) */}
        <div className="d-flex justify-content-between align-items-center mb-4 d-lg-none bg-white p-3 border rounded-3">
          <button 
            className="sidebar-toggler" 
            id="sidebar-toggler" 
            aria-label="Toggle Navigation"
            onClick={(e) => {
              e.stopPropagation();
              const sidebar = document.getElementById("sidebar");
              if (sidebar) sidebar.classList.toggle("show");
            }}
          >
            <i className="bi bi-list fs-4"></i>
          </button>
          <div className="brand-title-mobile fs-5 fw-bold text-primary" style={{ letterSpacing: '-0.02em' }}>MediCore ERP</div>
        </div>

        {/* Active Child Route View Mount */}
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
