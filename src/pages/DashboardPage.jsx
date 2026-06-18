import React from 'react';
import TopNavbar from '../components/TopNavbar';

function DashboardPage() {
  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">MediCore ERP</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Dashboard</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="mb-4">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <div className="dashboard-card p-4">
        <div className="text-center py-5">
          <i className="bi bi-speedometer2 fs-1 text-primary mb-3 d-block"></i>
          <h4>MediCore Dashboard</h4>
          <p className="text-muted">
            Dashboard overview and analytics summaries will be implemented here.
          </p>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
