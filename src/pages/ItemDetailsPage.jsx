import React, { useState, useEffect } from 'react';
import TopNavbar from '../components/TopNavbar';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMockInventoryItemById, updateMockInventoryItem, deleteMockInventoryItem } from '../services/mockInventoryData';
import { getMockHistoryData, addMockHistoryEntry } from '../services/mockInventoryHistoryData';
import ItemDetailsOverview from '../components/inventory/ItemDetailsOverview';
import ItemReorderModal from '../components/inventory/ItemReorderModal';
import HistoryTable from '../components/inventory/HistoryTable';

function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [movements, setMovements] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Fetch item data
    const foundItem = getMockInventoryItemById(id);
    if (foundItem) {
      setItem(foundItem);
      // Fetch movements associated with this item ID or name
      const allMovements = getMockHistoryData();
      const itemMovements = allMovements.filter(m => m.item.id === foundItem.sku || m.item.name === foundItem.itemName);
      setMovements(itemMovements);
    } else {
      navigate('/inventory');
    }
  }, [id, navigate]);

  if (!item) return <div className="p-5 text-center">Loading...</div>;

  const handleReorderSave = (data) => {
    // 1. Update stock
    const newStock = item.stockQuantity + data.quantity;
    const saved = updateMockInventoryItem(id, { stockQuantity: newStock });
    if (saved) setItem(saved);
    
    // 2. Add movement
    const newMovement = addMockHistoryEntry({
      item: { name: item.itemName, id: item.sku, category: item.category, unit: item.unit },
      type: 'Incoming',
      qtyChange: data.quantity,
      performedBy: { name: 'Admin System', initials: 'AS' },
      sourceDestination: data.supplier || 'Reorder Restock'
    });
    
    setMovements(prev => [newMovement, ...prev]);
    setShowReorderModal(false);
  };

  const handleDelete = () => {
    deleteMockInventoryItem(id);
    navigate('/inventory');
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'movements', label: 'Stock Movement' },
    { id: 'batch', label: 'Batch & Expiry' },
    { id: 'purchase', label: 'Purchase History' },
    { id: 'analytics', label: 'Usage Analytics' }
  ];

  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Inventory</span>
            <span className="mx-1 text-muted">›</span>
            <span className="text-muted">{item.category}</span>
            <span className="mx-1 text-muted">›</span>
            <span className="text-dark fw-bold">Item Details</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      {/* Dynamic Item Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2">
        <div>
          <div className="d-flex align-items-center mb-2">
            <h1 className="fw-bold mb-0 me-3" style={{color: '#1a1f36'}}>{item.itemName}</h1>
            <span className={`badge rounded-pill ${item.stockQuantity > 0 ? 'bg-primary bg-opacity-10 text-primary' : 'bg-danger bg-opacity-10 text-danger'} px-3 py-2 fw-semibold`}>
              {item.stockQuantity > 0 ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="d-flex text-muted gap-4" style={{fontSize: '0.9rem', fontFamily: 'monospace'}}>
            <span><i className="bi bi-grid-3x3-gap me-1"></i> SKU: {item.sku}</span>
            <span><i className="bi bi-capsule me-1"></i> Form: {item.form || 'N/A'}</span>
            <span><i className="bi bi-box me-1"></i> UOM: {item.unit}</span>
          </div>
        </div>
        
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <button className="btn btn-white border shadow-sm fw-semibold d-flex align-items-center px-3 py-2" onClick={() => navigate(`/inventory/${id}/edit`)}>
            <i className="bi bi-pencil me-2"></i> Edit Item
          </button>
          <button className="btn btn-primary shadow-sm fw-semibold d-flex align-items-center px-3 py-2" onClick={() => setShowReorderModal(true)}>
            <i className="bi bi-cart-plus me-2"></i> Reorder Stock
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-bottom mb-4">
        <ul className="nav nav-tabs border-bottom-0 gap-4" style={{fontSize: '0.95rem', fontWeight: '500'}}>
          {tabs.map(tab => (
            <li className="nav-item" key={tab.id}>
              <button 
                className={`nav-link px-0 pb-3 border-0 bg-transparent text-muted ${activeTab === tab.id ? 'active fw-bold' : ''}`}
                style={{ 
                  color: activeTab === tab.id ? '#1a1f36' : '',
                  borderBottom: activeTab === tab.id ? '2px solid #0d6efd' : '2px solid transparent',
                  borderRadius: 0
                }}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="tab-content pb-5">
        {activeTab === 'overview' && (
          <ItemDetailsOverview item={item} movements={movements} onTabChange={setActiveTab} />
        )}
        
        {activeTab === 'movements' && (
          <HistoryTable data={movements} />
        )}
        
        {activeTab === 'batch' && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Batch & Expiry Information</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Batch Number</th>
                      <th>Quantity</th>
                      <th>Expiry Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-semibold">B-{item.sku}-001</td>
                      <td>{item.stockQuantity}</td>
                      <td>{item.expiryDate || 'N/A'}</td>
                      <td>
                        <span className={`badge ${item.stockQuantity > 0 ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'} rounded-pill px-3 py-2`}>
                          {item.stockQuantity > 0 ? 'Good' : 'Expired/Depleted'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'purchase' && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Purchase History</h5>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>PO Number</th>
                      <th>Supplier</th>
                      <th>Date</th>
                      <th>Quantity</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-semibold">PO-2026-041</td>
                      <td>{item.supplier}</td>
                      <td>2026-05-15</td>
                      <td>{item.stockQuantity}</td>
                      <td>${(item.unitPrice * item.stockQuantity || 0).toFixed(2)}</td>
                      <td><span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">Received</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Usage Analytics</h5>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="p-4 bg-light rounded-4 border text-center">
                    <h3 className="fw-bold text-primary mb-1">{movements.filter(m => m.type === 'Outgoing').reduce((sum, m) => sum + Math.abs(m.qtyChange), 0)}</h3>
                    <div className="text-muted small">Total Dispensed (All Time)</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-4 bg-light rounded-4 border text-center">
                    <h3 className="fw-bold text-success mb-1">{movements.filter(m => m.type === 'Incoming').reduce((sum, m) => sum + m.qtyChange, 0)}</h3>
                    <div className="text-muted small">Total Received (All Time)</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-4 bg-light rounded-4 border text-center">
                    <h3 className="fw-bold text-warning mb-1">{Math.round((item.stockQuantity / (item.maxCapacity || 1)) * 100)}%</h3>
                    <div className="text-muted small">Average Capacity Utilization</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="border-top pt-4 mb-5 d-flex justify-content-end">
        <button className="btn btn-outline-danger fw-semibold" onClick={() => setShowDeleteConfirm(true)}>
          <i className="bi bi-trash me-2"></i> Delete Item
        </button>
      </div>

      {/* Modals */}
      <ItemReorderModal show={showReorderModal} item={item} onClose={() => setShowReorderModal(false)} onSave={handleReorderSave} />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div className="modal-backdrop fade show" style={{zIndex: 1040}}></div>
          <div className="modal fade show d-block" tabIndex="-1" style={{zIndex: 1050}}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header border-bottom-0 pb-0">
                  <h5 className="modal-title fw-bold text-danger">Delete Item</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(false)}></button>
                </div>
                <div className="modal-body py-4">
                  <p className="mb-0">Are you sure you want to permanently delete <strong>{item.itemName}</strong>? This action cannot be undone and will remove all associated stock history.</p>
                </div>
                <div className="modal-footer border-top-0 pt-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                  <button type="button" className="btn btn-danger px-4" onClick={handleDelete}>Yes, Delete Item</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ItemDetailsPage;

