import React, { useState } from 'react';

function ItemReorderModal({ show, item, onClose, onSave }) {
  const [quantity, setQuantity] = useState(0);
  const [supplier, setSupplier] = useState(item?.supplier || '');
  const [notes, setNotes] = useState('');

  if (!show || !item) return null;

  const handleSave = () => {
    onSave({
      quantity: Number(quantity),
      supplier,
      notes
    });
    // Reset form after save
    setQuantity(0);
    setNotes('');
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{zIndex: 1040}}></div>
      <div className="modal fade show d-block" tabIndex="-1" style={{zIndex: 1050}}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold">Reorder Stock</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold mb-1">Item to Reorder</label>
                <div className="fw-semibold">{item.itemName} ({item.sku})</div>
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold mb-1">Quantity to Order</label>
                <input type="number" className="form-control" value={quantity} onChange={e => setQuantity(e.target.value)} min="1" />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold mb-1">Supplier</label>
                <input type="text" className="form-control" value={supplier} onChange={e => setSupplier(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold mb-1">Notes / Reference</label>
                <textarea className="form-control" rows="3" value={notes} onChange={e => setNotes(e.target.value)} placeholder="E.g. PO-4501"></textarea>
              </div>
            </div>
            <div className="modal-footer border-top-0 pt-0">
              <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
              <button type="button" className="btn btn-primary px-4" onClick={handleSave} disabled={quantity <= 0}>Confirm Reorder</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ItemReorderModal;
