import React from 'react';
import TopNavbar from '../components/TopNavbar';

function SettingsPage() {
  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Administration</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Settings</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="mb-4">
        <h1 className="page-title">Settings</h1>
      </div>

      <div className="dashboard-card p-4">
        <div className="text-center py-5">
          <i className="bi bi-gear fs-1 text-primary mb-3 d-block"></i>
          <h4>Settings</h4>
          <p className="text-muted">
            Settings module will be implemented here.
          </p>
        </div>
      </div>
    </>
  );
}

export default SettingsPage;
