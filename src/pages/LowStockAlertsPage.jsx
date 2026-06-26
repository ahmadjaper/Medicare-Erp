import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { useErpStore } from '../store/erpStore';
import SupplierContactModal from '../components/inventory/SupplierContactModal';
import EmailSupplierModal from '../components/inventory/EmailSupplierModal';
import UrgentReorderModal from '../components/inventory/UrgentReorderModal';

function LowStockAlertsPage() {
  const { inventory } = useErpStore();
  
  // Filter and Pagination state
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modal states
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);

  // Generate alerts dynamically from store inventory
  const alerts = useMemo(() => {
    const generatedAlerts = inventory.map(item => {
      let status = 'Normal';
      const stock = item.stock;
      const reorder = item.threshold;
      
      if (stock === 0) {
        status = 'Out of Stock';
      } else if (stock <= reorder * 0.5) {
        status = 'Critical';
      } else if (stock <= reorder) {
        status = 'Low Stock';
      }

      // Calculate suggested reorder quantity
      const suggestedQty = reorder > 0 ? Math.max(0, Math.ceil(reorder * 1.5 - stock)) : 100;

      return {
        ...item,
        stockQuantity: stock,
        reorderPoint: reorder,
        alertStatus: status,
        suggestedQty
      };
    }).filter(item => item.alertStatus !== 'Normal');

    // Sort by severity: Out of Stock -> Critical -> Low Stock
    return [...generatedAlerts].sort((a, b) => {
      const severity = { 'Out of Stock': 3, 'Critical': 2, 'Low Stock': 1 };
      return severity[b.alertStatus] - severity[a.alertStatus];
    });
  }, [inventory]);

  // Card Values
  const outOfStockCount = alerts.filter(a => a.alertStatus === 'Out of Stock').length;
  const criticalCount = alerts.filter(a => a.alertStatus === 'Critical').length;
  const lowStockCount = alerts.filter(a => a.alertStatus === 'Low Stock').length;
  const totalAlerts = alerts.length;

  // Filtering
  const filteredAlerts = useMemo(() => {
    if (statusFilter === 'All Statuses') return alerts;
    return alerts.filter(a => a.alertStatus === statusFilter);
  }, [alerts, statusFilter]);

  // Pagination
  const totalFiltered = filteredAlerts.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAlerts = filteredAlerts.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Item Name,SKU,Category,Stock,Reorder Point,Status,Suggested Qty\n"
      + filteredAlerts.map(e => `${e.name},${e.id},${e.category},${e.stockQuantity},${e.reorderPoint},${e.alertStatus},${e.suggestedQty}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "low_stock_alerts.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkReorder = () => {
    if (alerts.length > 0) {
      setSelectedItem(alerts[0]);
      setShowReorderModal(true);
    }
  };

  const openActionModal = (item, actionType) => {
    setSelectedItem(item);
    if (actionType === 'contact') setShowSupplierModal(true);
    if (actionType === 'email') setShowEmailModal(true);
    if (actionType === 'reorder') setShowReorderModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Critical':
        return <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2 fw-semibold border border-danger-subtle"><span className="me-1">●</span> Critical</span>;
      case 'Low Stock':
        return <span className="badge rounded-pill bg-warning-subtle text-warning px-3 py-2 fw-semibold border border-warning-subtle"><span className="me-1">●</span> Low Stock</span>;
      case 'Out of Stock':
        return <span className="badge rounded-pill bg-secondary-subtle text-secondary px-3 py-2 fw-semibold border border-secondary-subtle"><span className="me-1">⊘</span> Out of Stock</span>;
      default:
        return null;
    }
  };

  const getActionButton = (item) => {
    switch (item.alertStatus) {
      case 'Critical':
        return (
          <div className="d-flex flex-column align-items-end">
            <button className="btn btn-danger btn-sm w-100 mb-1 fw-medium shadow-sm" onClick={() => openActionModal(item, 'contact')}>
              <i className="bi bi-telephone-fill me-1"></i> Contact Supplier
            </button>
            <span className="text-muted" style={{fontSize: '0.75rem'}}>Suggest: {item.suggestedQty} {item.unit}</span>
          </div>
        );
      case 'Low Stock':
        return (
          <div className="d-flex flex-column align-items-end">
            <button className="btn btn-light border btn-sm w-100 mb-1 fw-medium shadow-sm" onClick={() => openActionModal(item, 'email')}>
              <i className="bi bi-envelope me-1"></i> Email Supplier
            </button>
            <span className="text-muted" style={{fontSize: '0.75rem'}}>Suggest: {item.suggestedQty} {item.unit}</span>
          </div>
        );
      case 'Out of Stock':
        return (
          <div className="d-flex flex-column align-items-end">
            <button className="btn btn-dark btn-sm w-100 mb-1 fw-medium shadow-sm" onClick={() => openActionModal(item, 'reorder')}>
              <i className="bi bi-exclamation-triangle-fill me-1"></i> Urgent Order
            </button>
            <span className="text-muted" style={{fontSize: '0.75rem'}}>Suggest: {item.suggestedQty} {item.unit}</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getProgressBar = (stock, reorderPoint, status) => {
    let colorClass = 'bg-warning';
    if (status === 'Critical') colorClass = 'bg-danger';
    if (status === 'Out of Stock') colorClass = 'bg-secondary';

    const percentage = reorderPoint > 0 ? Math.min((stock / reorderPoint) * 100, 100) : 0;
    
    return (
      <div className="progress mt-1" style={{height: '4px', width: '80px'}}>
        <div className={`progress-bar ${colorClass}`} role="progressbar" style={{width: `${percentage}%`}} aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    );
  };

  const getIconForCategory = (category) => {
    const catMap = {
      'PPE': 'bi-mask',
      'Fluids': 'bi-droplet-half',
      'Consumables': 'bi-bandaid',
      'Pharmacy': 'bi-capsule',
      'Equipment': 'bi-heart-pulse',
      'Blood Bank': 'bi-droplet-fill',
      'Supplies': 'bi-box-seam',
      'Beds': 'bi-h-square'
    };
    return catMap[category] || 'bi-box-seam';
  };

  return (
    <div className="pb-4">
      <div className="top-navbar mb-4 d-print-none">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <Link to="/inventory" className="text-muted text-decoration-none">Inventory</Link>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Low Stock Alerts</span>
          </nav>
        </div>
        <TopNavbar showUserRole={true} />
      </div>

      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h1 className="fw-bold mb-2" style={{color: '#1a1f36', fontSize: '2.2rem'}}>Attention Required</h1>
          <p className="text-muted mb-0" style={{fontSize: '1rem'}}>Monitor and manage critical inventory levels across all departments.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-white border fw-semibold shadow-sm d-flex align-items-center gap-2 px-3" onClick={handleExport}>
            <i className="bi bi-download"></i> Export Report
          </button>
          <button className="btn btn-dark fw-semibold shadow-sm d-flex align-items-center gap-2 px-3" onClick={handleBulkReorder}>
            <i className="bi bi-cart-plus"></i> Bulk Reorder
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-danger-subtle h-100 shadow-sm" style={{backgroundColor: '#fffcfc'}}>
            <div className="card-body position-relative">
              <span className="position-absolute top-0 end-0 mt-3 me-3 badge bg-danger rounded-pill px-3 py-1 fw-bold" style={{fontSize: '0.7rem', letterSpacing: '1px'}}>URGENT</span>
              <div className="mb-3">
                <div className="bg-danger-subtle text-danger rounded d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                </div>
              </div>
              <h2 className="fw-bold mb-1" style={{fontSize: '2.5rem', color: '#1a1f36'}}>{criticalCount.toString().padStart(2, '0')}</h2>
              <p className="text-muted mb-0 fw-medium" style={{fontSize: '0.9rem'}}>Critical Level Items</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-warning-subtle h-100 shadow-sm" style={{backgroundColor: '#fffdf6'}}>
            <div className="card-body">
              <div className="mb-3">
                <div className="bg-warning-subtle text-warning rounded d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-graph-down-arrow fs-5"></i>
                </div>
              </div>
              <h2 className="fw-bold mb-1" style={{fontSize: '2.5rem', color: '#1a1f36'}}>{lowStockCount.toString().padStart(2, '0')}</h2>
              <p className="text-muted mb-0 fw-medium" style={{fontSize: '0.9rem'}}>Low Stock Warning</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-secondary-subtle h-100 shadow-sm" style={{backgroundColor: '#f8f9fa'}}>
            <div className="card-body">
              <div className="mb-3">
                <div className="bg-secondary-subtle text-secondary rounded d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-slash-circle fs-5"></i>
                </div>
              </div>
              <h2 className="fw-bold mb-1" style={{fontSize: '2.5rem', color: '#1a1f36'}}>{outOfStockCount.toString().padStart(2, '0')}</h2>
              <p className="text-muted mb-0 fw-medium" style={{fontSize: '0.9rem'}}>Out of Stock</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100" style={{backgroundColor: '#ffffff'}}>
            <div className="card-body">
              <div className="mb-3">
                <div className="bg-dark text-white rounded d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-card-checklist fs-5"></i>
                </div>
              </div>
              <h2 className="fw-bold mb-1" style={{fontSize: '2.5rem', color: '#1a1f36'}}>{totalAlerts.toString().padStart(2, '0')}</h2>
              <p className="text-muted mb-0 fw-medium" style={{fontSize: '0.9rem'}}>Total Active Alerts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Table Card */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold" style={{color: '#1a1f36'}}>Inventory Requiring Action</h5>
          <div className="d-flex align-items-center gap-2 border rounded px-2 py-1 bg-light">
            <i className="bi bi-filter text-muted"></i>
            <select 
              className="form-select form-select-sm border-0 bg-transparent shadow-none p-0 pe-3 text-dark fw-medium" 
              style={{cursor: 'pointer'}}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Critical">Critical</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-muted" style={{fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px'}}>
              <tr>
                <th className="fw-semibold border-0 py-3 ps-4" style={{width: '35%'}}>Item Details</th>
                <th className="fw-semibold border-0 py-3" style={{width: '15%'}}>Category</th>
                <th className="fw-semibold border-0 py-3" style={{width: '20%'}}>Stock / Reorder Pt.</th>
                <th className="fw-semibold border-0 py-3" style={{width: '15%'}}>Status</th>
                <th className="fw-semibold border-0 py-3 text-end pe-4" style={{width: '15%'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentAlerts.length > 0 ? (
                currentAlerts.map(item => (
                  <tr key={item.id}>
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-light text-primary rounded p-2 d-flex align-items-center justify-content-center" style={{width: '42px', height: '42px'}}>
                          <i className={`bi ${getIconForCategory(item.category)} fs-5`}></i>
                        </div>
                        <div>
                          <div className="fw-bold text-dark mb-1">{item.name}</div>
                          <div className="text-muted" style={{fontSize: '0.8rem'}}>SKU: {item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted fw-medium">{item.category}</td>
                    <td>
                      <div className="d-flex align-items-baseline gap-1">
                        <span className={`fw-bold ${item.alertStatus === 'Out of Stock' ? 'text-secondary' : item.alertStatus === 'Critical' ? 'text-danger' : 'text-dark'}`}>{item.stockQuantity} {item.unit}</span>
                        <span className="text-muted" style={{fontSize: '0.85rem'}}>/ {item.reorderPoint} {item.unit}</span>
                      </div>
                      {getProgressBar(item.stockQuantity, item.reorderPoint, item.alertStatus)}
                    </td>
                    <td>
                      {getStatusBadge(item.alertStatus)}
                    </td>
                    <td className="pe-4 py-3">
                      {getActionButton(item)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <i className="bi bi-check-circle fs-1 text-success opacity-50 mb-3 d-block"></i>
                    No alerts found for the selected filter. Everything looks good!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer bg-white border-top py-3 d-flex justify-content-between align-items-center">
            <div className="text-muted" style={{fontSize: '0.85rem'}}>
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalFiltered)} of {totalFiltered} alerts
            </div>
            <div className="d-flex gap-1">
              <button 
                className="btn btn-sm btn-light border text-muted px-2" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button 
                className="btn btn-sm btn-light border text-dark px-2" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showSupplierModal && (
        <SupplierContactModal 
          item={selectedItem} 
          onClose={() => setShowSupplierModal(false)} 
        />
      )}
      
      {showEmailModal && (
        <EmailSupplierModal 
          item={selectedItem} 
          onClose={() => setShowEmailModal(false)} 
        />
      )}
      
      {showReorderModal && (
        <UrgentReorderModal 
          item={selectedItem} 
          onClose={() => setShowReorderModal(false)} 
        />
      )}
    </div>
  );
}

export default LowStockAlertsPage;
