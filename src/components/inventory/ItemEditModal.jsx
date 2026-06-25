import React, { useState, useEffect } from 'react';

function ItemEditModal({ show, item, onClose, onSave }) {
  const [formData, setFormData] = useState(item || {});

  useEffect(() => {
    if (item) setFormData(item);
  }, [item]);

  if (!show || !item) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Process specific fields to numbers
    const updated = {
      ...formData,
      stockQuantity: Number(formData.stockQuantity || 0),
      reorderPoint: Number(formData.reorderPoint || 0),
      maxCapacity: Number(formData.maxCapacity || 0),
      unitPrice: Number(formData.unitPrice || 0)
    };
    onSave(updated);
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{zIndex: 1040}}></div>
      <div className="modal fade show d-block" tabIndex="-1" style={{zIndex: 1050}}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold">Edit Item Details</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold mb-1">Item Name</label>
                  <input type="text" className="form-control" name="itemName" value={formData.itemName || ''} onChange={handleChange} />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted small fw-bold mb-1">SKU</label>
                  <input type="text" className="form-control" name="sku" value={formData.sku || ''} onChange={handleChange} />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted small fw-bold mb-1">Form</label>
                  <input type="text" className="form-control" name="form" value={formData.form || ''} onChange={handleChange} />
                </div>
                
                <div className="col-md-4">
                  <label className="form-label text-muted small fw-bold mb-1">Category</label>
                  <input type="text" className="form-control" name="category" value={formData.category || ''} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small fw-bold mb-1">Supplier</label>
                  <input type="text" className="form-control" name="supplier" value={formData.supplier || ''} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small fw-bold mb-1">Vendor ID</label>
                  <input type="text" className="form-control" name="vendorId" value={formData.vendorId || ''} onChange={handleChange} />
                </div>

                <div className="col-md-4">
                  <label className="form-label text-muted small fw-bold mb-1">Stock Quantity</label>
                  <input type="number" className="form-control" name="stockQuantity" value={formData.stockQuantity || 0} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small fw-bold mb-1">Reorder Point</label>
                  <input type="number" className="form-control" name="reorderPoint" value={formData.reorderPoint || 0} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small fw-bold mb-1">Max Capacity</label>
                  <input type="number" className="form-control" name="maxCapacity" value={formData.maxCapacity || 0} onChange={handleChange} />
                </div>
                
                <div className="col-md-4">
                  <label className="form-label text-muted small fw-bold mb-1">Unit Price ($)</label>
                  <input type="number" step="0.01" className="form-control" name="unitPrice" value={formData.unitPrice || 0} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small fw-bold mb-1">Unit of Measure</label>
                  <input type="text" className="form-control" name="unit" value={formData.unit || ''} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small fw-bold mb-1">Expiry Date</label>
                  <input type="date" className="form-control" name="expiryDate" value={formData.expiryDate || ''} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="modal-footer border-top-0 pt-0">
              <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
              <button type="button" className="btn btn-primary px-4" onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ItemEditModal;
