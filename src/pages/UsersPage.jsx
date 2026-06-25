import React, { useState } from 'react';
import TopNavbar from '../components/TopNavbar';
import { useUsersManagement } from '../context/UsersManagementContext';
import UserStatsCards from '../components/users/UserStatsCards';
import UsersFilters from '../components/users/UsersFilters';
import UsersTable from '../components/users/UsersTable';
import UserFormModal from '../components/users/UserFormModal';

function UsersPage() {
  const { usersList, deleteUser } = useUsersManagement();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter Logic
  const filteredUsers = usersList.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query) ||
      user.department?.toLowerCase().includes(query) ||
      user.linkedEmployee?.toLowerCase().includes(query)
    );
  });

  const handleDeleteClick = (user) => {
    if (window.confirm(`Are you sure you want to delete the user account for ${user.fullName}?`)) {
      deleteUser(user.id);
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Email,Full Name,Role,Department,Status,Last Login\n"
      + filteredUsers.map(e => `${e.id},${e.email},${e.fullName},${e.role},${e.department},${e.status},${e.lastLogin}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Administration</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Users & Roles</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h1 className="page-title mb-2">Users Management</h1>
          <p className="text-muted mb-0">Manage system users, roles and permissions</p>
        </div>
        <button className="btn btn-primary fw-semibold px-4 rounded-3 shadow-sm d-flex align-items-center gap-2" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-lg"></i> Add User
        </button>
      </div>

      <div className="alert alert-primary bg-primary bg-opacity-10 border-primary border-opacity-25 d-flex align-items-center mb-4 rounded-3 py-3" role="alert">
        <i className="bi bi-info-circle-fill text-primary fs-5 me-3"></i>
        <div>
          <strong>Note:</strong> Only Admin, HR, Receptionists, and Doctors can have system access accounts. Other employees are managed in the HR system.
        </div>
      </div>

      <UserStatsCards />

      <div className="card border rounded-4 shadow-sm" style={{borderColor: '#e2e8f0'}}>
        <UsersFilters 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          handleExport={handleExport}
        />
        
        <UsersTable 
          users={filteredUsers} 
          onDeleteClick={handleDeleteClick} 
        />
      </div>

      {showAddModal && <UserFormModal onClose={() => setShowAddModal(false)} />}
    </>
  );
}

export default UsersPage;
