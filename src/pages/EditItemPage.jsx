import React, { useState, useEffect, useRef } from 'react';
import TopNavbar from '../components/TopNavbar';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMockInventoryItemById, updateMockInventoryItem } from '../services/mockInventoryData';
import { addMockHistoryEntry } from '../services/mockInventoryHistoryData';

function EditItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const foundItem = getMockInventoryItemById(id);
    if (foundItem) {
      setFormData({
        ...foundItem,
        status: foundItem.status || 'Operational', // default if missing
        description: foundItem.description || '',
      });
      setImagePreview(foundItem.image || '');
    } else {
      navigate('/inventory');
    }
  }, [id, navigate]);

  if (!formData) return <div className="p-5 text-center">Loading...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a fake preview URL
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setFormData(prev => ({ ...prev, image: url }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.itemName?.trim()) newErrors.itemName = "Item Name is required";
    if (!formData.category?.trim()) newErrors.category = "Category is required";
    if (!formData.manufacturer?.trim()) newErrors.manufacturer = "Manufacturer is required";
    
    // Add more specific validations if needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    // Save changes
    updateMockInventoryItem(id, formData);
    
    // Create audit record
    addMockHistoryEntry({
      item: { name: formData.itemName, id: formData.sku, category: formData.category, unit: formData.unit },
      type: 'Adjustment',
      qtyChange: 0,
      performedBy: { name: 'Current User', initials: 'CU' },
      sourceDestination: 'Manual Edit'
    });

    navigate(`/inventory/${id}`);
  };

  const handleMaintenance = () => {
    // Quick action: Mark for Maintenance
    const updated = { ...formData, status: 'Under Maintenance' };
    setFormData(updated);
    
    // Update immediately in store
    updateMockInventoryItem(id, { status: 'Under Maintenance' });
    
    // Create audit record
    addMockHistoryEntry({
      item: { name: formData.itemName, id: formData.sku, category: formData.category, unit: formData.unit },
      type: 'Adjustment',
      qtyChange: 0,
      performedBy: { name: 'Current User', initials: 'CU' },
      sourceDestination: 'Marked for Maintenance'
    });
  };

  // Determine warranty status based on expiration
  const getWarrantyStatus = (dateStr) => {
    if (!dateStr) return { text: 'Unknown', color: 'text-muted' };
    const exp = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Expired', color: 'text-danger' };
    if (diffDays <= 30) return { text: 'Expiring Soon', color: 'text-warning' };
    return { text: 'Active', color: 'text-success' };
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Operational': return <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-1"><i className="bi bi-circle-fill me-2" style={{fontSize: '0.4rem', verticalAlign: 'middle'}}></i>Operational</span>;
      case 'Under Maintenance': return <span className="badge rounded-pill bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-3 py-1"><i className="bi bi-wrench me-2"></i>Under Maintenance</span>;
      case 'Out of Stock': return <span className="badge rounded-pill bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-3 py-1"><i className="bi bi-exclamation-circle me-2"></i>Out of Stock</span>;
      default: return <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1">{status}</span>;
    }
  };

  const warrantyState = getWarrantyStatus(formData.warrantyExpiration);

  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Inventory</span>
            <span className="mx-1 text-muted">›</span>
            <span className="text-muted">{formData.category}</span>
            <span className="mx-1 text-muted">›</span>
            <Link to={`/inventory/${id}`} className="text-muted text-decoration-none">Item Details</Link>
            <span className="mx-1 text-muted">›</span>
            <span className="text-dark fw-bold">Edit Item</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <h1 className="fw-bold mb-0 me-3" style={{color: '#1a1f36'}}>Edit Details: {formData.itemName}</h1>
          <span className="badge bg-light text-dark border px-3 py-2 fw-semibold" style={{letterSpacing: '0.5px'}}>ID: {formData.sku}</span>
        </div>
        
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <button className="btn btn-white border shadow-sm fw-semibold px-4 py-2" onClick={() => navigate(`/inventory/${id}`)}>
            Cancel
          </button>
          <button className="btn btn-dark shadow-sm fw-semibold d-flex align-items-center px-4 py-2" onClick={handleSave}>
            <i className="bi bi-save me-2"></i> Save Changes
          </button>
        </div>
      </div>

      <div className="row g-4 mb-5">
        {/* Left Column - Forms */}
        <div className="col-12 col-lg-8">
          
          {/* General Information */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <i className="bi bi-info-circle text-primary me-2 fs-5"></i>
                <h5 className="fw-bold mb-0" style={{color: '#1a1f36'}}>General Information</h5>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Item Name</label>
                <input type="text" className={`form-control bg-light ${errors.itemName ? 'is-invalid' : ''}`} name="itemName" value={formData.itemName} onChange={handleChange} />
                {errors.itemName && <div className="invalid-feedback">{errors.itemName}</div>}
              </div>
              
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">Category</label>
                  <select className={`form-select bg-light ${errors.category ? 'is-invalid' : ''}`} name="category" value={formData.category} onChange={handleChange}>
                    <option value="">Select Category...</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Medical Supplies">Medical Supplies</option>
                    <option value="Lab Supplies">Lab Supplies</option>
                  </select>
                  {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small fw-bold">Manufacturer</label>
                  <input type="text" className={`form-control bg-light ${errors.manufacturer ? 'is-invalid' : ''}`} name="manufacturer" value={formData.manufacturer || ''} onChange={handleChange} />
                  {errors.manufacturer && <div className="invalid-feedback">{errors.manufacturer}</div>}
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Description</label>
                <textarea className="form-control bg-light" name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
              </div>
            </div>
          </div>

          {/* Dynamic Category Forms */}
          {formData.category === 'Equipment' && (
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <i className="bi bi-geo-alt text-primary me-2 fs-5"></i>
                  <h5 className="fw-bold mb-0" style={{color: '#1a1f36'}}>Tracking & Assignment</h5>
                </div>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Serial Number</label>
                    <input type="text" className="form-control bg-light" name="serialNumber" value={formData.serialNumber || ''} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Asset Tag</label>
                    <input type="text" className="form-control bg-light" name="assetTag" value={formData.assetTag || ''} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Assigned Department</label>
                    <select className="form-select bg-light" name="departmentAssignment" value={formData.departmentAssignment || ''} onChange={handleChange}>
                      <option value="">Select...</option>
                      <option value="Radiology">Radiology</option>
                      <option value="Emergency">Emergency</option>
                      <option value="ICU">ICU</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Location / Room</label>
                    <input type="text" className="form-control bg-light" name="location" value={formData.location || ''} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData.category === 'Medicine' && (
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <i className="bi bi-capsule text-primary me-2 fs-5"></i>
                  <h5 className="fw-bold mb-0" style={{color: '#1a1f36'}}>Medical Details</h5>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Dosage</label>
                    <input type="text" className="form-control bg-light" name="dosage" value={formData.dosage || ''} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Form</label>
                    <input type="text" className="form-control bg-light" name="form" value={formData.form || ''} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Batch Number</label>
                    <input type="text" className="form-control bg-light" name="batchNumber" value={formData.batchNumber || ''} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Expiry Date</label>
                    <input type="date" className="form-control bg-light" name="expiryDate" value={formData.expiryDate || ''} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData.category === 'Medical Supplies' && (
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <i className="bi bi-box-seam text-primary me-2 fs-5"></i>
                  <h5 className="fw-bold mb-0" style={{color: '#1a1f36'}}>Supply Details</h5>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Material</label>
                    <input type="text" className="form-control bg-light" name="material" value={formData.material || ''} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Sterility</label>
                    <select className="form-select bg-light" name="sterility" value={formData.sterility || ''} onChange={handleChange}>
                      <option value="">Select...</option>
                      <option value="Sterile">Sterile</option>
                      <option value="Non-Sterile">Non-Sterile</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Packaging Type</label>
                    <input type="text" className="form-control bg-light" name="packagingType" value={formData.packagingType || ''} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Usage Notes</label>
                    <input type="text" className="form-control bg-light" name="usageNotes" value={formData.usageNotes || ''} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData.category === 'Lab Supplies' && (
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <i className="bi bi-droplet text-primary me-2 fs-5"></i>
                  <h5 className="fw-bold mb-0" style={{color: '#1a1f36'}}>Laboratory Specs</h5>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Sample Type</label>
                    <input type="text" className="form-control bg-light" name="sampleType" value={formData.sampleType || ''} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted small fw-bold">Hazard Classification</label>
                    <input type="text" className="form-control bg-light" name="hazardClassification" value={formData.hazardClassification || ''} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column - Status & Lifecycle */}
        <div className="col-12 col-lg-4">
          
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <h4 className="fw-bold mb-0" style={{color: '#1a1f36'}}>Current<br/>Status</h4>
                {getStatusBadge(formData.status)}
              </div>
              
              <div className="bg-light rounded-3 overflow-hidden position-relative mb-4" style={{height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Item" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                ) : (
                  <div className="text-center text-muted">
                    <i className="bi bi-image fs-1 opacity-50 mb-2 d-block"></i>
                    <span className="small">No Image</span>
                  </div>
                )}
                <div className="position-absolute bottom-0 end-0 p-2">
                  <input type="file" ref={fileInputRef} className="d-none" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
                  <button className="btn btn-sm btn-light border shadow-sm" onClick={() => fileInputRef.current?.click()}>
                    <i className="bi bi-camera"></i>
                  </button>
                </div>
              </div>

              {formData.category === 'Equipment' && (
                <>
                  <div className="text-muted small fw-bold mb-2">Quick Actions</div>
                  <button className="btn btn-outline-danger w-100 fw-semibold bg-danger bg-opacity-10 py-2 d-flex justify-content-between align-items-center" onClick={handleMaintenance}>
                    Mark for Maintenance
                    <i className="bi bi-wrench"></i>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <i className="bi bi-patch-check text-primary me-2 fs-5"></i>
                <h5 className="fw-bold mb-0" style={{color: '#1a1f36'}}>Lifecycle &<br/>Warranty</h5>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Maintenance Schedule</label>
                <select className="form-select bg-light" name="maintenanceSchedule" value={formData.maintenanceSchedule || ''} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Bi-Annual">Bi-Annual</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">Last Serviced</label>
                <input type="date" className="form-control bg-light" name="lastServiced" value={formData.lastServiced || ''} onChange={handleChange} />
              </div>

              <div className="mb-1">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label text-muted small fw-bold mb-0">Warranty Expiration</label>
                  <span className={`small fw-bold ${warrantyState.color}`}>{warrantyState.text}</span>
                </div>
                <input type="date" className="form-control bg-light mt-1" name="warrantyExpiration" value={formData.warrantyExpiration || ''} onChange={handleChange} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default EditItemPage;
