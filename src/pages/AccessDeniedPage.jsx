import React from 'react';
import { Link } from 'react-router-dom';

function AccessDeniedPage() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="text-center p-5 bg-white rounded shadow-sm">
        <i className="bi bi-shield-lock text-danger" style={{ fontSize: '4rem' }}></i>
        <h1 className="mt-3 fw-bold">Access Denied</h1>
        <p className="text-muted">You do not have permission to view this module.</p>
        <Link to="/dashboard" className="btn btn-primary mt-3">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default AccessDeniedPage;
