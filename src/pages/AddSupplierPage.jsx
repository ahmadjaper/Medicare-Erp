import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { addMockSupplier } from '../services/mockSupplierData';

function AddSupplierPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    id: `SUP-${Math.floor(100 + Math.random() * 900)}`,
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    categories: '',
    status: 'Active',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Supplier Name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact Person is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    
    const newSupplier = {
      ...formData,
      categories: formData.categories.split(',').map(c => c.trim().toUpperCase()).filter(c => c),
      items: 0,
      recentActivity: 'Just Added',
    };
    
    addMockSupplier(newSupplier);
    navigate('/suppliers');
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
            <span className="text-dark fw-bold">Add Supplier</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2">
        <div>
          <h1 className="fw-bold mb-0" style={{color: '#1a1f36'}}>Add New Supplier</h1>
        </div>
        
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <button className="btn btn-white border shadow-sm fw-semibold px-4 py-2" onClick={() => navigate('/suppliers')}>
            Cancel
          </button>
          <button className="btn btn-dark shadow-sm fw-semibold d-flex align-items-center px-4 py-2" onClick={handleSave}>
            <i className="bi bi-save me-2"></i> Save Supplier
          </button>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-5">
        <div className="card-body p-4 p-md-5">
          <div className="row g-4">
            
            <div className="col-12 col-md-6">
              <label className="form-label text-muted small fw-bold">Supplier Name *</label>
              <input type="text" className={`form-control bg-light ${errors.name ? 'is-invalid' : ''}`} name="name" value={formData.name} onChange={handleChange} placeholder="e.g. MedPharma Global" />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            
            <div className="col-12 col-md-6">
              <label className="form-label text-muted small fw-bold">Supplier ID</label>
              <input type="text" className="form-control bg-light" name="id" value={formData.id} readOnly />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label text-muted small fw-bold">Contact Person *</label>
              <input type="text" className={`form-control bg-light ${errors.contactPerson ? 'is-invalid' : ''}`} name="contactPerson" value={formData.contactPerson} onChange={handleChange} placeholder="e.g. Sarah Jenkins" />
              {errors.contactPerson && <div className="invalid-feedback">{errors.contactPerson}</div>}
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label text-muted small fw-bold">Email *</label>
              <input type="email" className={`form-control bg-light ${errors.email ? 'is-invalid' : ''}`} name="email" value={formData.email} onChange={handleChange} placeholder="email@company.com" />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label text-muted small fw-bold">Phone Number *</label>
              <input type="text" className={`form-control bg-light ${errors.phone ? 'is-invalid' : ''}`} name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>

            <div className="col-12">
              <label className="form-label text-muted small fw-bold">Address</label>
              <input type="text" className="form-control bg-light" name="address" value={formData.address} onChange={handleChange} placeholder="Full business address" />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label text-muted small fw-bold">Categories (Comma separated)</label>
              <input type="text" className="form-control bg-light" name="categories" value={formData.categories} onChange={handleChange} placeholder="e.g. PHARMACEUTICALS, SURGICAL" />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label text-muted small fw-bold">Initial Status</label>
              <select className="form-select bg-light" name="status" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label text-muted small fw-bold">Internal Notes</label>
              <textarea className="form-control bg-light" name="notes" rows="3" value={formData.notes} onChange={handleChange} placeholder="Contract details, payment terms, etc."></textarea>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default AddSupplierPage;
