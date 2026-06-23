import React from 'react';

function DeleteDoctorModal({ doctor, isOpen, onClose, onConfirm }) {
  if (!isOpen || !doctor) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
          <div className="modal-header bg-light border-0 py-3" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
            <h5 className="modal-title fw-bold text-dark">
              <i className="bi bi-exclamation-triangle-fill text-danger me-2"></i>Delete Doctor Profile
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          
          <div className="modal-body p-4">
            <p className="mb-3 text-muted" style={{ fontSize: '0.9rem' }}>
              Are you sure you want to permanently delete this doctor's profile?
            </p>
            
            <div className="p-3 bg-light rounded-3 mb-3 border">
              <div className="row g-2" style={{ fontSize: '0.85rem' }}>
                <div className="col-12">
                  <span className="text-muted small d-block fw-semibold" style={{ fontSize: '0.75rem' }}>DOCTOR ID</span>
                  <strong className="text-dark">{doctor.id}</strong>
                </div>
                <div className="col-12 mt-2">
                  <span className="text-muted small d-block fw-semibold" style={{ fontSize: '0.75rem' }}>DOCTOR NAME</span>
                  <strong className="text-primary">{doctor.name}</strong>
                </div>
                <div className="col-12 mt-2">
                  <span className="text-muted small d-block fw-semibold" style={{ fontSize: '0.75rem' }}>DEPARTMENT</span>
                  <strong className="text-dark">{doctor.department} — {doctor.specialty}</strong>
                </div>
              </div>
            </div>
            
            <div className="alert alert-danger d-flex align-items-start gap-2 mb-0" role="alert" style={{ borderRadius: '8px' }}>
              <i className="bi bi-exclamation-octagon-fill fs-5 mt-0 text-danger"></i>
              <div>
                <strong className="d-block" style={{ fontSize: '0.85rem' }}>Warning</strong>
                <span style={{ fontSize: '0.8rem' }}>
                  This action is irreversible. All appointment records, schedules, and performance history associated with this doctor will be permanently removed.
                </span>
              </div>
            </div>
          </div>
          
          <div className="modal-footer border-0 p-4 pt-0 d-flex justify-content-end gap-2">
            <button 
              type="button" 
              className="btn btn-light fw-bold px-4 py-2" 
              style={{ borderRadius: '8px', fontSize: '0.9rem' }} 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-danger fw-bold px-4 py-2" 
              style={{ borderRadius: '8px', fontSize: '0.9rem' }} 
              onClick={onConfirm}
            >
              Delete Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteDoctorModal;
