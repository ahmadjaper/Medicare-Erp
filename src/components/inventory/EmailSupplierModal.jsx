import React, { useState, useEffect } from 'react';
import { getMockSuppliers } from '../../services/mockSupplierData';

function EmailSupplierModal({ item, onClose }) {
  const [supplier, setSupplier] = useState(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (item) {
      const suppliers = getMockSuppliers();
      const found = suppliers.find(s => s.vendorId === item.vendorId || s.name === item.supplier);
      setSupplier(found);
      
      setSubject(`Low Stock Notification: ${item.name} (SKU: ${item.sku})`);
      setMessage(`Dear ${found ? found.contactPerson : 'Supplier'},\n\nThis is an automated notification from MediCore ERP.\n\nOur inventory for ${item.name} has fallen to ${item.stockQuantity} ${item.unit}, which is below our reorder point of ${item.reorderPoint} ${item.unit}.\n\nPlease prepare to receive a formal purchase order for approximately ${item.suggestedQty || 100} units shortly.\n\nThank you,\nMediCore Inventory Team`);
    }
  }, [item]);

  if (!item) return null;

  const handleSend = () => {
    alert(`Email sent to ${supplier ? supplier.email : 'contact@supplier.com'}!`);
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
      <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1055 }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-primary text-white border-0">
              <h5 className="modal-title d-flex align-items-center gap-2">
                <i className="bi bi-envelope-paper"></i> Email Supplier
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            <div className="modal-body p-4">
              <form>
                <div className="mb-3 row">
                  <label className="col-sm-2 col-form-label text-muted fw-semibold text-end">To:</label>
                  <div className="col-sm-10">
                    <input type="email" className="form-control bg-light" readOnly value={supplier ? supplier.email : 'contact@supplier.com'} />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-2 col-form-label text-muted fw-semibold text-end">Subject:</label>
                  <div className="col-sm-10">
                    <input 
                      type="text" 
                      className="form-control" 
                      value={subject} 
                      onChange={(e) => setSubject(e.target.value)} 
                    />
                  </div>
                </div>
                <div className="mb-3 row">
                  <label className="col-sm-2 col-form-label text-muted fw-semibold text-end">Message:</label>
                  <div className="col-sm-10">
                    <textarea 
                      className="form-control" 
                      rows="8" 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer bg-light border-0">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
              <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={handleSend}>
                <i className="bi bi-send"></i> Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmailSupplierModal;
