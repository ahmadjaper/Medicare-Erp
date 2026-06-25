import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { useUsersManagement } from '../context/UsersManagementContext';
import { useRole } from '../context/RoleContext';

function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usersList, updateUser } = useUsersManagement();
  const { rolesList } = useRole();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    linkedEmployee: '',
    role: '',
    department: '',
    phone: '',
    status: 'Active'
  });

  const [error, setError] = useState('');

  useEffect(() => {
    const user = usersList.find(u => u.id === id);
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        username: user.username || '',
        linkedEmployee: user.linkedEmployee || '',
        role: user.role || '',
        department: user.department || '',
        phone: user.phone || '',
        status: user.status || 'Active'
      });
    } else {
      navigate('/users-roles');
    }
  }, [id, usersList, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setError('');
    
    if (!formData.fullName || !formData.email || !formData.username || !formData.role) {
      setError('Please fill in all required fields (Name, Email, Username, Role).');
      return;
    }

    updateUser(id, formData);
    navigate('/users-roles');
  };

  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted cursor-pointer" onClick={() => navigate('/users-roles')}>Users & Roles</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Edit User</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title mb-0">Edit User: {formData.fullName}</h1>
      </div>

      <div className="card border rounded-4 shadow-sm" style={{borderColor: '#e2e8f0'}}>
        <div className="card-body p-4 p-md-5">
          {error && (
            <div className="alert alert-danger py-2 small rounded-3 mb-4">{error}</div>
          )}

          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <label className="form-label text-muted small fw-bold">Full Name <span className="text-danger">*</span></label>
              <input type="text" className="form-control rounded-3" name="fullName" value={formData.fullName} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted small fw-bold">Email Address <span className="text-danger">*</span></label>
              <input type="email" className="form-control rounded-3" name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label text-muted small fw-bold">Username <span className="text-danger">*</span></label>
              <input type="text" className="form-control rounded-3" name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted small fw-bold">Phone Number</label>
              <input type="text" className="form-control rounded-3" name="phone" value={formData.phone} onChange={handleChange} />
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
              <input type="text" className="form-control rounded-3" name="department" value={formData.department} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label text-muted small fw-bold">Linked Employee / Doctor Profile</label>
              <input type="text" className="form-control rounded-3" name="linkedEmployee" value={formData.linkedEmployee} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label text-muted small fw-bold">Status</label>
              <select className="form-select rounded-3" name="status" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="border-top pt-4 d-flex justify-content-end gap-3">
            <button className="btn btn-white border fw-semibold rounded-3 px-4" onClick={() => navigate('/users-roles')}>Cancel</button>
            <button className="btn btn-primary fw-semibold rounded-3 px-4" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditUserPage;
