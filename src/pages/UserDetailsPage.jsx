import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { useUsersManagement } from '../context/UsersManagementContext';
import { useRole } from '../context/RoleContext';

function UserDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usersList, updateUserStatus, deleteUser, resetPassword } = useUsersManagement();
  const { permissions, rolesList } = useRole();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const found = usersList.find(u => u.id === id);
    if (found) {
      setUser(found);
    } else {
      navigate('/users-roles');
    }
  }, [id, usersList, navigate]);

  if (!user) return null;

  const roleData = rolesList.find(r => r.name === user.role);
  const userPermissions = permissions[user.role] || {};

  const getAvatarInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (role) => {
    switch(role) {
      case 'Admin': return 'bg-dark';
      case 'HR': return 'bg-info';
      case 'Doctor': return 'bg-success';
      case 'Receptionist': return 'bg-primary';
      default: return 'bg-secondary';
    }
  };

  const handleStatusToggle = () => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    updateUserStatus(user.id, newStatus);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete ${user.fullName}?`)) {
      deleteUser(user.id);
      navigate('/users-roles');
    }
  };

  const handleResetPassword = () => {
    if (window.confirm(`Send password reset email to ${user.email}?`)) {
      alert("Password reset link sent successfully.");
    }
  };

  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted cursor-pointer" onClick={() => navigate('/users-roles')}>Users & Roles</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">User Details</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <h1 className="page-title mb-0">User Profile</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-white border fw-semibold shadow-sm text-dark d-flex align-items-center gap-2" onClick={handleResetPassword}>
            <i className="bi bi-key"></i> Reset Password
          </button>
          <button className="btn btn-white border fw-semibold shadow-sm text-dark d-flex align-items-center gap-2" onClick={() => navigate(`/users-roles/${user.id}/edit`)}>
            <i className="bi bi-pencil"></i> Edit User
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: User Info */}
        <div className="col-12 col-lg-4">
          <div className="card border rounded-4 shadow-sm mb-4" style={{borderColor: '#e2e8f0'}}>
            <div className="card-body p-4 text-center">
              <div className={`text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow mx-auto mb-3 ${getAvatarColor(user.role)}`} style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                {getAvatarInitials(user.fullName)}
              </div>
              <h4 className="fw-bold mb-1">{user.fullName}</h4>
              <p className="text-muted mb-2">{user.email}</p>
              
              <div className="mt-3 d-flex justify-content-center gap-2">
                <span className={`badge rounded-pill ${user.status === 'Active' ? 'bg-success text-success bg-opacity-10 border border-success border-opacity-25' : 'bg-danger text-danger bg-opacity-10 border border-danger border-opacity-25'} px-3 py-2`} style={{fontSize: '0.8rem'}}>
                  {user.status}
                </span>
                <span className="badge rounded-pill bg-light text-dark border px-3 py-2" style={{fontSize: '0.8rem'}}>
                  {user.role}
                </span>
              </div>
            </div>
            <div className="card-footer bg-white border-top p-0">
              <div className="d-flex flex-column">
                <button 
                  className={`btn rounded-0 p-3 text-start fw-semibold ${user.status === 'Active' ? 'text-warning' : 'text-success'}`}
                  onClick={handleStatusToggle}
                >
                  <i className={`bi ${user.status === 'Active' ? 'bi-pause-circle' : 'bi-play-circle'} me-2`}></i> 
                  {user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                </button>
                <button 
                  className="btn rounded-0 p-3 text-start fw-semibold text-danger border-top"
                  onClick={handleDelete}
                >
                  <i className="bi bi-trash me-2"></i> Delete User
                </button>
              </div>
            </div>
          </div>

          <div className="card border rounded-4 shadow-sm" style={{borderColor: '#e2e8f0'}}>
            <div className="card-header bg-white border-bottom p-4 rounded-top-4">
              <h6 className="fw-bold mb-0">Account Information</h6>
            </div>
            <div className="card-body p-4">
              <div className="mb-3">
                <label className="text-muted small fw-bold d-block mb-1">Username</label>
                <div className="text-dark">{user.username}</div>
              </div>
              <div className="mb-3">
                <label className="text-muted small fw-bold d-block mb-1">Phone Number</label>
                <div className="text-dark">{user.phone || 'Not provided'}</div>
              </div>
              <div className="mb-3">
                <label className="text-muted small fw-bold d-block mb-1">Department</label>
                <div className="text-dark">{user.department || 'Not assigned'}</div>
              </div>
              <div className="mb-3">
                <label className="text-muted small fw-bold d-block mb-1">Linked Employee</label>
                <div className="text-dark">{user.linkedEmployee || 'Not linked'}</div>
              </div>
              <div className="mb-3">
                <label className="text-muted small fw-bold d-block mb-1">Created At</label>
                <div className="text-dark">{user.createdAt}</div>
              </div>
              <div>
                <label className="text-muted small fw-bold d-block mb-1">Last Login</label>
                <div className="text-dark">{user.lastLogin}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Permissions Matrix */}
        <div className="col-12 col-lg-8">
          <div className="card border rounded-4 shadow-sm h-100" style={{borderColor: '#e2e8f0'}}>
            <div className="card-header bg-white border-bottom p-4 rounded-top-4 d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-bold mb-1">Assigned Permissions</h6>
                <p className="text-muted small mb-0">Permissions are inherited from the <strong>{user.role}</strong> role.</p>
              </div>
              <button className="btn btn-sm btn-light border" onClick={() => navigate('/settings/roles')}>
                Manage Role
              </button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light text-muted" style={{fontSize: '0.8rem'}}>
                    <tr>
                      <th className="ps-4 py-3">Module</th>
                      <th className="text-center py-3">View</th>
                      <th className="text-center py-3">Create</th>
                      <th className="text-center py-3">Edit</th>
                      <th className="text-center py-3">Delete</th>
                      <th className="text-center py-3">Export</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(userPermissions).length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          No permissions assigned to this role.
                        </td>
                      </tr>
                    ) : (
                      Object.keys(userPermissions).map(moduleName => (
                        <tr key={moduleName}>
                          <td className="ps-4 py-3 fw-medium text-dark">{moduleName}</td>
                          {['view', 'create', 'edit', 'delete', 'export'].map(action => {
                            const state = userPermissions[moduleName][action];
                            return (
                              <td key={action} className="text-center py-3">
                                {state === 'allowed' ? <i className="bi bi-check2 text-success fs-5"></i> : 
                                 state === 'denied' ? <i className="bi bi-x-lg text-danger"></i> : 
                                 <i className="bi bi-eye text-muted"></i>}
                              </td>
                            )
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDetailsPage;
