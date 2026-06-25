import React, { useState } from 'react';
import { useUsersManagement } from '../../context/UsersManagementContext';
import { useRole } from '../../context/RoleContext';

function UserFormModal({ onClose }) {
  const { addUser } = useUsersManagement();
  const { rolesList } = useRole();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    linkedEmployee: '',
    role: '',
    department: '',
    phone: '',
    password: '',
    confirmPassword: '',
    status: 'Active'
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setError('');
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.username || !formData.role || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    addUser(formData);
    onClose();
  };

  return (
    <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055}} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 shadow">
          <div className="modal-header border-bottom p-4">
            <h5 className="modal-title fw-bold">Add New User</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4 bg-light bg-opacity-50">
            
            {error && (
              <div className="alert alert-danger py-2 small rounded-3 mb-4">{error}</div>
            )}

            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Full Name <span className="text-danger">*</span></label>
                <input type="text" className="form-control rounded-3" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. John Doe" />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Email Address <span className="text-danger">*</span></label>
                <input type="email" className="form-control rounded-3" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. user@medicore.com" />
              </div>

              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Username <span className="text-danger">*</span></label>
                <input type="text" className="form-control rounded-3" name="username" value={formData.username} onChange={handleChange} placeholder="e.g. john.doe" />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Phone Number</label>
                <input type="text" className="form-control rounded-3" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
              </div>

              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Role <span className="text-danger">*</span></label>
                <select className="form-select rounded-3" name="role" value={formData.role} onChange={handleChange}>
                  <option value="">Select Role...</option>
                  {rolesList.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Department</label>
                <input type="text" className="form-control rounded-3" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Cardiology" />
              </div>

              <div className="col-md-12">
                <label className="form-label text-muted small fw-bold">Linked Employee / Doctor Profile</label>
                <input type="text" className="form-control rounded-3" name="linkedEmployee" value={formData.linkedEmployee} onChange={handleChange} placeholder="Search employees..." />
                <div className="form-text">Link this account to an existing HR or Doctor profile.</div>
              </div>

              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Password <span className="text-danger">*</span></label>
                <input type="password" className="form-control rounded-3" name="password" value={formData.password} onChange={handleChange} placeholder="Create password" />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Confirm Password <span className="text-danger">*</span></label>
                <input type="password" className="form-control rounded-3" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" />
              </div>

              <div className="col-md-6">
                <label className="form-label text-muted small fw-bold">Initial Status</label>
                <select className="form-select rounded-3" name="status" value={formData.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

          </div>
          <div className="modal-footer border-top p-4 bg-white">
            <button type="button" className="btn btn-white border fw-semibold rounded-3 px-4" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary fw-semibold rounded-3 px-4" onClick={handleSave}>Create User</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserFormModal;
