import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { getMockSupplierById } from '../services/mockSupplierData';
import { getMockInventoryData } from '../services/mockInventoryData';

function SupplierDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [supplier, setSupplier] = useState(null);
  const [suppliedItems, setSuppliedItems] = useState([]);

  useEffect(() => {
    const found = getMockSupplierById(id);
    if (found) {
      setSupplier(found);
      
      // Fetch inventory items related to this supplier
      const allInventory = getMockInventoryData();
      // Match by exact name or vendor ID
      const relatedItems = allInventory.filter(
        item => item.supplier === found.name || item.vendorId === found.id
      );
      setSuppliedItems(relatedItems);
    } else {
      navigate('/suppliers');
    }
  }, [id, navigate]);

  if (!supplier) return <div className="p-5 text-center">Loading...</div>;

  const getStatusBadge = (status) => {
    if (status === 'Active') return <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1">Active</span>;
    if (status === 'Inactive') return <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3 py-1">Inactive</span>;
    return <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3 py-1">{status}</span>;
  };

  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Inventory</span>
            <span className="mx-1 text-muted">›</span>
            <Link to="/suppliers" className="text-muted text-decoration-none">Suppliers</Link>
            <span className="mx-1 text-muted">›</span>
            <span className="text-dark fw-bold">Supplier Details</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <div className="rounded-3 d-flex align-items-center justify-content-center me-3" style={{width: '56px', height: '56px', backgroundColor: '#eef2f6', color: '#1a1f36', fontWeight: 'bold', fontSize: '1.2rem'}}>
            {supplier.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="fw-bold mb-1" style={{color: '#1a1f36'}}>{supplier.name}</h1>
            <div className="d-flex gap-3 align-items-center">
              <span className="text-muted small">ID: {supplier.id}</span>
              {getStatusBadge(supplier.status)}
            </div>
          </div>
        </div>
        
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <button className="btn btn-white border shadow-sm fw-semibold px-4 py-2" onClick={() => navigate('/suppliers')}>
            <i className="bi bi-arrow-left me-2"></i> Back
          </button>
          <button className="btn btn-dark shadow-sm fw-semibold d-flex align-items-center px-4 py-2" onClick={() => navigate(`/suppliers/${supplier.id}/edit`)}>
            <i className="bi bi-pencil me-2"></i> Edit Supplier
          </button>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-12 col-lg-4">
          
          {/* Supplier Info Card */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4" style={{color: '#1a1f36'}}>Contact Information</h5>
              
              <div className="mb-3">
                <div className="text-muted small fw-bold mb-1">Primary Contact</div>
                <div className="text-dark fw-medium">{supplier.contactPerson}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small fw-bold mb-1">Email Address</div>
                <div className="text-dark"><i className="bi bi-envelope me-2 text-muted"></i>{supplier.email}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small fw-bold mb-1">Phone Number</div>
                <div className="text-dark"><i className="bi bi-telephone me-2 text-muted"></i>{supplier.phone}</div>
              </div>
              <div className="mb-3">
                <div className="text-muted small fw-bold mb-1">Business Address</div>
                <div className="text-dark"><i className="bi bi-geo-alt me-2 text-muted"></i>{supplier.address || 'No address provided'}</div>
              </div>
            </div>
          </div>

          {/* Categories Card */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3" style={{color: '#1a1f36'}}>Approved Categories</h5>
              <div className="d-flex flex-wrap gap-2">
                {supplier.categories.map((cat, i) => (
                  <span key={i} className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold">
                    {cat}
                  </span>
                ))}
              </div>
              
              <hr className="my-4" />
              
              <h5 className="fw-bold mb-3" style={{color: '#1a1f36'}}>Internal Notes</h5>
              <p className="text-muted small mb-0">{supplier.notes || 'No internal notes recorded.'}</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          {/* Inventory Integration */}
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4 d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={{color: '#1a1f36'}}>Products Supplied ({suppliedItems.length})</h5>
              </div>
              
              {suppliedItems.length > 0 ? (
                <div className="table-responsive flex-grow-1">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="py-3 text-muted fw-semibold small text-uppercase" style={{letterSpacing: '0.5px'}}>Item Details</th>
                        <th className="py-3 text-muted fw-semibold small text-uppercase" style={{letterSpacing: '0.5px'}}>Category</th>
                        <th className="py-3 text-muted fw-semibold small text-uppercase" style={{letterSpacing: '0.5px'}}>Stock Level</th>
                        <th className="py-3 text-muted fw-semibold small text-uppercase text-end" style={{letterSpacing: '0.5px'}}>Unit Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppliedItems.map(item => (
                        <tr key={item.id} className="cursor-pointer" onClick={() => navigate(`/inventory/${item.sku}`)}>
                          <td className="py-3">
                            <div className="fw-bold text-dark">{item.itemName}</div>
                            <div className="text-muted small">SKU: {item.sku}</div>
                          </td>
                          <td className="py-3 text-dark">{item.category}</td>
                          <td className="py-3">
                            <span className={`badge rounded-pill ${item.stockQuantity > item.reorderPoint ? 'bg-success' : item.stockQuantity > 0 ? 'bg-warning' : 'bg-danger'} bg-opacity-10 px-3 py-1`}
                                  style={{color: item.stockQuantity > item.reorderPoint ? '#198754' : item.stockQuantity > 0 ? '#ffc107' : '#dc3545'}}>
                              {item.stockQuantity} {item.unit}
                            </span>
                          </td>
                          <td className="py-3 text-end fw-medium text-dark">
                            ${parseFloat(item.unitPrice || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center py-5">
                  <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-3" style={{width: '64px', height: '64px'}}>
                    <i className="bi bi-box-seam text-muted fs-3"></i>
                  </div>
                  <h6 className="fw-bold text-dark">No Products Found</h6>
                  <p className="text-muted small max-w-sm mb-0">There are currently no inventory items mapped to this supplier.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SupplierDetailsPage;
