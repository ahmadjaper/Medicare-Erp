import React from 'react';
import TopNavbar from '../components/TopNavbar';

function DoctorsPage() {
  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Management</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Doctors</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="mb-4">
        <h1 className="page-title">Doctors</h1>
      </div>

      <div className="dashboard-card p-4">
        <div className="text-center py-5">
          <i className="bi bi-person-badge fs-1 text-primary mb-3 d-block"></i>
          <h4>Doctor Management</h4>
          <p className="text-muted">
            Doctor management module will be implemented here.
          </p>
        </div>
      </div>
    </>
  );
}

export default DoctorsPage;
