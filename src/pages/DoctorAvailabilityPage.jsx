import React from 'react';
import TopNavbar from '../components/TopNavbar';

function DoctorAvailabilityPage() {
  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Operations</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Doctor Availability</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="mb-4">
        <h1 className="page-title">Doctor Availability</h1>
      </div>

      <div className="dashboard-card p-4">
        <div className="text-center py-5">
          <i className="bi bi-clock-history fs-1 text-primary mb-3 d-block"></i>
          <h4>Doctor Availability</h4>
          <p className="text-muted">
            Doctor Availability module will be implemented here.
          </p>
        </div>
      </div>
    </>
  );
}

export default DoctorAvailabilityPage;
