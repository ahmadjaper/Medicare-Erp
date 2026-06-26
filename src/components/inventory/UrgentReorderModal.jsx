import React, { useState, useEffect } from 'react';
import { getMockSuppliers } from '../../services/mockSupplierData';

function UrgentReorderModal({ item, onClose }) {
  const [supplier, setSupplier] = useState(null);
  const [qty, setQty] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      const suppliers = getMockSuppliers();
      const found = suppliers.find(s => s.vendorId === item.vendorId || s.name === item.supplier);
      setSupplier(found);
      setQty(item.suggestedQty || 100);
    }
  }, [item]);

  if (!item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      alert(`Successfully created purchase order for ${qty} units of ${item.name}!`);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
      <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-dark text-white border-0">
              <h5 className="modal-title d-flex align-items-center gap-2">
                <i className="bi bi-cart-plus-fill text-warning"></i> Urgent Reorder
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body p-4">
                <div className="alert alert-warning border-0 d-flex gap-3 mb-4">
                  <i className="bi bi-exclamation-triangle-fill fs-4 flex-shrink-0"></i>
                  <div>
                    <strong>Critical Action Required</strong>
                    <div style={{ fontSize: '0.85rem' }}>This item is completely out of stock or critically low. Approving this order will instantly notify the supplier.</div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>Item Details</label>
                  <div className="p-3 bg-light border rounded">
                    <div className="fw-bold fs-5 text-dark mb-1">{item.name}</div>
                    <div className="text-muted d-flex justify-content-between">
                      <span>SKU: {item.sku}</span>
                      <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
                        Current Stock: {item.stockQuantity} {item.unit}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>Supplier</label>
                  <input type="text" className="form-control bg-light" value={supplier ? supplier.name : item.supplier} readOnly />
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>Order Quantity ({item.unit})</label>
                  <div className="input-group">
                    <button className="btn btn-outline-secondary px-3" type="button" onClick={() => setQty(Math.max(1, qty - 10))}>-</button>
                    <input 
                      type="number" 
                      className="form-control text-center fw-bold fs-5" 
                      value={qty} 
                      onChange={(e) => setQty(parseInt(e.target.value) || 0)} 
                      min="1"
                    />
                    <button className="btn btn-outline-secondary px-3" type="button" onClick={() => setQty(qty + 10)}>+</button>
                  </div>
                  <div className="form-text text-success d-flex align-items-center gap-1 mt-2">
                    <i className="bi bi-check-circle-fill"></i> Matches suggested reorder quantity based on max capacity ({item.maxCapacity}).
                  </div>
                </div>
                
                <div className="mb-2">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>Delivery Priority</label>
                  <select className="form-select border-warning shadow-sm">
                    <option>Standard (3-5 Days)</option>
                    <option>Expedited (1-2 Days)</option>
                    <option>Overnight / Urgent (Next Morning)</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer bg-light border-0">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="btn btn-dark d-flex align-items-center gap-2 px-4 shadow-sm" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><span className="spinner-border spinner-border-sm" aria-hidden="true"></span> Processing...</>
                  ) : (
                    <><i className="bi bi-cart-check"></i> Place Urgent Order</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UrgentReorderModal;
