import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useErpStore } from '../store/erpStore';

function Layout() {
  const location = useLocation();
  const { globalToast, hideToast } = useErpStore();

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

      {/* Global Toast Notification Container */}
      {globalToast && (
        <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: 9999 }}>
          <div className="toast show align-items-center bg-white border-0 shadow-lg" role="alert" style={{ borderRadius: '12px', minWidth: '300px' }}>
            <div className="d-flex p-1">
              <div className="toast-body d-flex align-items-center gap-3 fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>
                <div className={`rounded-circle d-flex align-items-center justify-content-center bg-${globalToast.type}-subtle text-${globalToast.type}`} style={{ width: '32px', height: '32px' }}>
                  <i className={`bi bi-${globalToast.type === 'success' ? 'check-circle-fill' : globalToast.type === 'danger' ? 'exclamation-triangle-fill' : 'info-circle-fill'} fs-5`}></i>
                </div>
                {globalToast.message}
              </div>
              <button type="button" className="btn-close me-3 m-auto" onClick={hideToast}></button>
            </div>
            <div className="progress bg-transparent" style={{ height: '4px', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
              <div className={`progress-bar progress-bar-animated progress-bar-striped bg-${globalToast.type} w-100`}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;
