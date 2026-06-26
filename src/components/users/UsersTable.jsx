import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UsersTable({ users, onDeleteClick }) {
  const navigate = useNavigate();

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  
  const currentUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const renderStatusBadge = (status) => {
    let badgeClass = '';
    switch(status) {
      case 'Active': badgeClass = 'bg-success bg-opacity-10 text-success border border-success border-opacity-25'; break;
      case 'Inactive': badgeClass = 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25'; break;
      case 'Suspended': badgeClass = 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25'; break;
      default: badgeClass = 'bg-secondary text-white';
    }
    return <span className={`badge rounded-pill ${badgeClass} fw-semibold px-3 py-2`} style={{fontSize: '0.75rem'}}>{status}</span>;
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0" style={{fontSize: '0.9rem'}}>
          <thead className="table-light text-muted" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>
            <tr>
              <th className="ps-4 py-3 border-bottom-0 fw-bold">USER</th>
              <th className="py-3 border-bottom-0 fw-bold">LINKED EMPLOYEE/DOCTOR</th>
              <th className="py-3 border-bottom-0 fw-bold">ROLE</th>
              <th className="py-3 border-bottom-0 fw-bold">DEPARTMENT</th>
              <th className="py-3 border-bottom-0 fw-bold">STATUS</th>
              <th className="py-3 border-bottom-0 fw-bold">LAST LOGIN</th>
              <th className="pe-4 py-3 border-bottom-0 fw-bold text-end">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-5 text-muted">
                  <i className="bi bi-inbox fs-1 d-block mb-3 opacity-50"></i>
                  No users found matching your criteria.
                </td>
              </tr>
            ) : currentUsers.map((user) => (
              <tr key={user.id}>
                <td className="ps-4 py-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className={`text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm ${getAvatarColor(user.role)}`} style={{width: '40px', height: '40px', fontSize: '0.9rem'}}>
                      {getAvatarInitials(user.fullName)}
                    </div>
                    <div>
                      <div className="fw-bold text-dark">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-muted">{user.linkedEmployee}</td>
                <td className="py-3 fw-medium text-dark">{user.role}</td>
                <td className="py-3 text-muted">{user.department}</td>
                <td className="py-3">{renderStatusBadge(user.status)}</td>
                <td className="py-3 text-muted">{user.lastLogin}</td>
                <td className="pe-4 py-3 text-end">
                  <div className="dropdown">
                    <button className="btn btn-sm btn-light rounded-circle" type="button" data-bs-toggle="dropdown">
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                      <li>
                        <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => navigate(`/users-roles/${user.id}`)}>
                          <i className="bi bi-eye text-muted"></i> View User
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => navigate(`/users-roles/${user.id}/edit`)}>
                          <i className="bi bi-pencil text-muted"></i> Edit User
                        </button>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item d-flex align-items-center gap-2 text-danger" onClick={() => onDeleteClick(user)}>
                          <i className="bi bi-trash"></i> Delete User
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center p-3 border-top bg-light bg-opacity-50">
        <div className="text-muted small">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, users.length)} to {Math.min(currentPage * itemsPerPage, users.length)} of {users.length} users
        </div>
        <div className="d-flex gap-1">
          <button 
            className="btn btn-sm btn-white border px-2" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i} 
              className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-white border'}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button 
            className="btn btn-sm btn-white border px-2" 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </>
  );
}

export default UsersTable;
