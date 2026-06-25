import React, { useState, useEffect } from 'react';
import { getMockSuppliers } from '../../services/mockSupplierData';

function SupplierContactModal({ item, onClose }) {
  const [supplier, setSupplier] = useState(null);

  useEffect(() => {
    if (item) {
      const suppliers = getMockSuppliers();
      // Try to find by vendorId or exact name match
      const found = suppliers.find(s => s.vendorId === item.vendorId || s.name === item.supplier);
      setSupplier(found);
    }
  }, [item]);

  if (!item) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
      <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-primary text-white border-0">
              <h5 className="modal-title d-flex align-items-center gap-2">
                <i className="bi bi-person-vcard"></i> Supplier Contact Info
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            <div className="modal-body p-4">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="bg-light rounded p-3 text-primary d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-building fs-3"></i>
                </div>
                <div>
                  <h4 className="mb-1 fw-bold">{supplier ? supplier.name : item.supplier}</h4>
                  <span className="badge bg-light text-dark border">ID: {item.vendorId || 'N/A'}</span>
                </div>
              </div>
              
              <div className="bg-light rounded p-3 mb-3">
                <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Contact Details</h6>
                
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="text-primary"><i className="bi bi-person-circle fs-5"></i></div>
                  <div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>Contact Person</div>
                    <div className="fw-medium text-dark">{supplier ? supplier.contactPerson : 'Contact representative'}</div>
                  </div>
                </div>
                
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="text-primary"><i className="bi bi-envelope-at fs-5"></i></div>
                  <div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>Email Address</div>
                    <div className="fw-medium text-dark">{supplier ? supplier.email : 'contact@supplier.com'}</div>
                  </div>
                </div>
                
                <div className="d-flex align-items-center gap-3">
                  <div className="text-primary"><i className="bi bi-telephone fs-5"></i></div>
                  <div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>Phone Number</div>
                    <div className="fw-medium text-dark">{supplier ? supplier.phone : '+1 (555) 000-0000'}</div>
                  </div>
                </div>
              </div>
              
              <div className="alert alert-info border-0 d-flex gap-2 mb-0">
                <i className="bi bi-info-circle-fill flex-shrink-0 mt-1"></i>
                <div style={{ fontSize: '0.9rem' }}>
                  Mention you are calling regarding <strong>{item.name}</strong> (SKU: {item.sku}) which currently has {item.stockQuantity} {item.unit} in stock.
                </div>
              </div>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-light" onClick={onClose}>Close</button>
              <button type="button" className="btn btn-primary d-flex align-items-center gap-2">
                <i className="bi bi-telephone-outbound"></i> Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SupplierContactModal;
