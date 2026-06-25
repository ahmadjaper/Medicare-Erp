import React from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateStatus } from '../../services/mockInventoryData';

function ItemDetailsOverview({ item, movements, onTabChange }) {
  const navigate = useNavigate();
  const stockPercentage = item.maxCapacity > 0 ? (item.stockQuantity / item.maxCapacity) * 100 : 0;
  
  // Calculate specific stock status based on reorder point
  let stockStatus = 'Optimal Level';
  let stockStatusClass = 'text-success';
  let stockStatusBg = 'bg-success';
  
  if (item.stockQuantity === 0) {
    stockStatus = 'Out of Stock';
    stockStatusClass = 'text-danger';
    stockStatusBg = 'bg-danger';
  } else if (item.stockQuantity <= item.reorderPoint) {
    stockStatus = 'Low Stock';
    stockStatusClass = 'text-warning';
    stockStatusBg = 'bg-warning';
  }

  const handleSupplierClick = () => {
    if (item.vendorId) {
      navigate(`/suppliers/${item.vendorId}`);
    } else {
      // Fallback if no vendor ID, just go to suppliers list or search
      navigate('/suppliers');
    }
  };

  return (
    <div className="row g-4 mb-4">
      {/* Top Row Cards */}
      <div className="col-12 col-md-4">
        <div className="card h-100 border-0 shadow-sm rounded-4">
          <div className="card-body p-4 position-relative overflow-hidden">
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-box-seam text-muted me-2"></i>
              <span className="text-muted fw-semibold" style={{fontSize: '0.9rem'}}>Current Stock Level</span>
            </div>
            
            <div className="d-flex align-items-baseline mb-2">
              <h2 className="fw-bold mb-0 me-2" style={{fontSize: '2.5rem', color: '#1a1f36'}}>{item.stockQuantity.toLocaleString()}</h2>
              <span className="text-muted fw-semibold">{item.unit || 'Boxes'}</span>
            </div>
            
            <div className="d-flex align-items-center mb-4">
              <span className={`badge bg-opacity-25 ${stockStatusBg} ${stockStatusClass} rounded-pill px-2 py-1`}>
                <i className="bi bi-circle-fill me-1" style={{fontSize: '0.5rem', verticalAlign: 'middle'}}></i> 
                {stockStatus}
              </span>
            </div>

            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Reorder Point</span>
              <span className="fw-bold">{item.reorderPoint?.toLocaleString()} {item.unit || 'Boxes'}</span>
            </div>
            <div className="d-flex justify-content-between mb-2 small">
              <span className="text-muted">Max Capacity</span>
              <span className="fw-bold">{item.maxCapacity?.toLocaleString()} {item.unit || 'Boxes'}</span>
            </div>
            
            <div className="progress mt-3" style={{height: '6px', backgroundColor: '#f0f2f5'}}>
              <div className={`progress-bar ${stockStatusBg}`} role="progressbar" style={{width: `${Math.min(stockPercentage, 100)}%`}}></div>
            </div>
            
            {/* Background shape decorative */}
            <div className="position-absolute" style={{right: '-20px', top: '20px', width: '120px', height: '120px', backgroundColor: '#f4f6fc', borderRadius: '20px', zIndex: 0, opacity: 0.8, transform: 'rotate(15deg)'}}></div>
            <div className="position-relative" style={{zIndex: 1}}></div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card h-100 border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-truck text-muted me-2"></i>
              <span className="text-muted fw-semibold" style={{fontSize: '0.9rem'}}>Primary Supplier</span>
            </div>
            
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary bg-opacity-10 rounded p-2 me-3 d-flex align-items-center justify-content-center" style={{width: '48px', height: '48px'}}>
                <i className="bi bi-building text-primary fs-4"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-1" style={{color: '#1a1f36'}}>{item.supplier || 'N/A'}</h6>
                <div className="text-muted small">Vendor ID: {item.vendorId || 'N/A'}</div>
              </div>
            </div>

            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-clock text-muted me-2"></i>
              <span className="text-muted me-2" style={{fontSize: '0.9rem'}}>Lead Time:</span>
              <span className="fw-semibold" style={{fontSize: '0.9rem'}}>{item.leadTime || 'N/A'}</span>
            </div>
            
            <div className="d-flex align-items-center mb-4">
              <i className="bi bi-cash text-muted me-2"></i>
              <span className="text-muted me-2" style={{fontSize: '0.9rem'}}>Unit Price:</span>
              <span className="fw-semibold" style={{fontSize: '0.9rem'}}>${item.unitPrice ? item.unitPrice.toFixed(2) : '0.00'} / {item.unit ? item.unit.split(' ')[0] : 'Unit'}</span>
            </div>

            <button className="btn btn-outline-primary w-100 rounded-3 py-2 fw-semibold" style={{fontSize: '0.85rem'}} onClick={handleSupplierClick}>
              View Supplier Profile
            </button>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card h-100 border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-3">
              <i className="bi bi-house text-muted me-2"></i>
              <span className="text-muted fw-semibold" style={{fontSize: '0.9rem'}}>Storage Location</span>
            </div>
            
            <div className="bg-light rounded-3 p-3 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold text-dark">{item.storageLocation?.warehouse || 'Unassigned'}</span>
                {item.storageLocation?.zone && (
                  <span className="badge border text-muted bg-white fw-normal" style={{fontSize: '0.7rem', letterSpacing: '0.5px'}}>
                    ZONE {item.storageLocation.zone}
                  </span>
                )}
              </div>
              <div className="text-muted small">
                {item.storageLocation ? `Aisle ${item.storageLocation.aisle}, Rack ${item.storageLocation.rack}, Shelf ${item.storageLocation.shelf}` : 'Location details pending'}
              </div>
            </div>

            <div className="mb-2">
              <span className="text-muted fw-semibold" style={{fontSize: '0.85rem'}}>Handling Requirements</span>
            </div>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {item.handlingRequirements && item.handlingRequirements.length > 0 ? (
                item.handlingRequirements.map((req, idx) => {
                  let icon = 'bi-info-circle';
                  if (req.includes('°C') || req.includes('Refrigerated')) icon = 'bi-thermometer-half';
                  else if (req.includes('Dry')) icon = 'bi-droplet-half';
                  else if (req.includes('Hazardous')) icon = 'bi-exclamation-triangle';
                  else if (req.includes('Fragile')) icon = 'bi-box-seam';
                  
                  return (
                    <span key={idx} className="badge rounded-pill bg-secondary bg-opacity-10 text-secondary border px-3 py-2 d-flex align-items-center" style={{fontSize: '0.75rem', fontWeight: '500'}}>
                      <i className={`bi ${icon} me-1`}></i> {req}
                    </span>
                  );
                })
              ) : (
                <span className="text-muted small">Standard handling</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="col-12 col-md-8">
        <div className="card h-100 border-0 shadow-sm rounded-4">
          <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="bi bi-arrow-left-right text-muted me-2"></i>
              <span className="text-muted fw-semibold" style={{fontSize: '0.9rem'}}>Recent Stock Movement</span>
            </div>
            <button className="btn btn-link text-primary text-decoration-none p-0 fw-semibold" style={{fontSize: '0.85rem'}} onClick={() => onTabChange('movements')}>
              View All
            </button>
          </div>
          <div className="card-body p-0 mt-3">
            <div className="table-responsive">
              <table className="table align-middle mb-0" style={{fontSize: '0.85rem'}}>
                <thead className="table-light text-muted">
                  <tr>
                    <th className="px-4 py-3 fw-semibold border-bottom-0">Date</th>
                    <th className="py-3 fw-semibold border-bottom-0">Type</th>
                    <th className="py-3 fw-semibold border-bottom-0">Quantity</th>
                    <th className="py-3 fw-semibold border-bottom-0">Balance</th>
                    <th className="px-4 py-3 fw-semibold border-bottom-0">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.slice(0, 5).map((mov, idx) => (
                    <tr key={mov.id}>
                      <td className="px-4 py-3 border-bottom text-dark">{mov.timestamp}</td>
                      <td className="py-3 border-bottom">
                        {mov.type === 'Outgoing' ? (
                          <span className="badge bg-primary bg-opacity-10 text-primary rounded-1 px-2 py-1">
                            <i className="bi bi-arrow-up-short"></i> Dispense
                          </span>
                        ) : mov.type === 'Incoming' ? (
                          <span className="badge bg-success bg-opacity-10 text-success rounded-1 px-2 py-1">
                            <i className="bi bi-arrow-down-short"></i> Receive
                          </span>
                        ) : (
                          <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-1 px-2 py-1">
                            <i className="bi bi-arrow-left-right"></i> Adjust
                          </span>
                        )}
                      </td>
                      <td className={`py-3 border-bottom fw-bold ${mov.qtyChange > 0 ? 'text-success' : mov.qtyChange < 0 ? 'text-danger' : 'text-muted'}`}>
                        {mov.qtyChange > 0 ? '+' : ''}{mov.qtyChange}
                      </td>
                      <td className="py-3 border-bottom text-dark">
                        {/* Mock calculation for balance display since we don't track historical balance perfectly */}
                        {item.stockQuantity - (idx * 5)} 
                      </td>
                      <td className="px-4 py-3 border-bottom text-muted">
                        {mov.sourceDestination.split(' ')[0]}
                      </td>
                    </tr>
                  ))}
                  {movements.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">No recent movements</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card h-100 border-0 shadow-sm rounded-4">
          <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-calendar-x text-muted me-2"></i>
              <span className="text-muted fw-semibold" style={{fontSize: '0.9rem'}}>Batch & Expiry Alerts</span>
            </div>
          </div>
          <div className="card-body p-4 pt-3">
            {/* Mock Batches */}
            <div className="border rounded-3 p-3 mb-3 bg-white shadow-sm position-relative">
              <div className="d-flex justify-content-between align-items-start mb-1">
                <span className="fw-bold text-dark" style={{fontSize: '0.85rem'}}>Batch #B-882-A</span>
                <span className="text-danger fw-bold" style={{fontSize: '0.8rem'}}>Exp: Dec 2024</span>
              </div>
              <div className="d-flex justify-content-between align-items-end mt-2">
                <span className="text-muted" style={{fontSize: '0.85rem'}}>250 Boxes</span>
                <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 rounded-1">45 Days</span>
              </div>
            </div>

            <div className="border rounded-3 p-3 bg-white shadow-sm position-relative">
              <div className="d-flex justify-content-between align-items-start mb-1">
                <span className="fw-bold text-dark" style={{fontSize: '0.85rem'}}>Batch #B-901-C</span>
                <span className="text-dark fw-bold" style={{fontSize: '0.8rem'}}>Exp: Aug 2025</span>
              </div>
              <div className="d-flex justify-content-between align-items-end mt-2">
                <span className="text-muted" style={{fontSize: '0.85rem'}}>1,000 Boxes</span>
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-1">Safe</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailsOverview;
