import React, { useState } from 'react';
import { useRole } from '../../context/RoleContext';

function RolesTabContent() {
  const { rolesList, permissions, addRole, editRole, deleteRole, updateRolePermissions } = useRole();

  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All'); // All, System, Custom

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  
  const [selectedRole, setSelectedRole] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({ name: '', description: '', icon: 'person-fill', color: 'primary' });
  
  // Permissions Matrix Edit State
  const [localPermissions, setLocalPermissions] = useState(null);
  const [isPermissionsDirty, setIsPermissionsDirty] = useState(false);

  const modulesList = ['Dashboard', 'Employees', 'Departments', 'Doctors', 'Appointments', 'Patients', 'Inventory', 'Reports', 'Settings'];
  const actionsList = ['view', 'create', 'edit', 'delete', 'export'];

  // -------------------------
  // Computed Data
  // -------------------------
  const filteredRoles = rolesList.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          role.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    
    if (filterType === 'System') return role.isSystem;
    if (filterType === 'Custom') return !role.isSystem;
    return true;
  });

  const getPermissionsCount = (roleName) => {
    const rolePerms = permissions[roleName];
    if (!rolePerms) return 0;
    let count = 0;
    Object.values(rolePerms).forEach(mod => {
      Object.values(mod).forEach(action => {
        if (action === 'allowed' || action === 'view_only') count++;
      });
    });
    return count;
  };

  // -------------------------
  // Handlers
  // -------------------------
  const handleOpenAdd = () => {
    setFormData({ name: '', description: '', icon: 'person-fill', color: 'primary' });
    setShowAddModal(true);
  };

  const handleSaveAdd = () => {
    if (!formData.name.trim()) return alert("Role name is required");
    
    const newRole = {
      id: formData.name.toLowerCase().replace(/\s+/g, '_'),
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      color: formData.color,
      isSystem: false,
      usersCount: 0
    };
    
    addRole(newRole);
    setShowAddModal(false);
  };

  const handleOpenEdit = (role) => {
    setSelectedRole(role);
    setFormData({ name: role.name, description: role.description, icon: role.icon, color: role.color });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!formData.name.trim()) return alert("Role name is required");
    
    const updatedRole = {
      ...selectedRole,
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      color: formData.color
    };
    
    editRole(selectedRole.name, updatedRole);
    setShowEditModal(false);
  };

  const handleDelete = (role) => {
    if (role.isSystem) {
      alert("Cannot delete protected system roles.");
      return;
    }
    if (role.usersCount > 0) {
      alert(`Cannot delete role assigned to ${role.usersCount} active users.`);
      return;
    }
    if (window.confirm(`Are you sure you want to delete the ${role.name} role?`)) {
      deleteRole(role.name);
      setShowEditModal(false);
    }
  };

  const handleOpenPermissions = (role) => {
    setSelectedRole(role);
    setLocalPermissions(JSON.parse(JSON.stringify(permissions[role.name] || {})));
    setIsPermissionsDirty(false);
    setShowPermissionsModal(true);
  };

  const handlePermissionCycle = (mod, action) => {
    if (!localPermissions[mod]) return;
    const currentState = localPermissions[mod][action];
    let nextState = 'allowed';
    if (currentState === 'allowed') nextState = 'denied';
    else if (currentState === 'denied') nextState = 'view_only';
    
    setLocalPermissions(prev => ({
      ...prev,
      [mod]: {
        ...prev[mod],
        [action]: nextState
      }
    }));
    setIsPermissionsDirty(true);
  };

  const handleSavePermissions = () => {
    updateRolePermissions(selectedRole.name, localPermissions);
    setIsPermissionsDirty(false);
    setShowPermissionsModal(false);
  };

  const renderPermissionIcon = (state) => {
    if (state === 'allowed') return <i className="bi bi-check2 text-success fs-5"></i>;
    if (state === 'denied') return <i className="bi bi-x-lg text-danger"></i>;
    if (state === 'view_only') return <i className="bi bi-eye text-muted"></i>;
    return null;
  };

  // -------------------------
  // Renderers
  // -------------------------
  return (
    <div>
      <div className="card border rounded-4 shadow-sm" style={{borderColor: '#e2e8f0'}}>
        <div className="card-header bg-white border-bottom p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center rounded-top-4 gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '32px', height: '32px', fontSize: '0.9rem'}}>
              2
            </div>
            <div>
              <h5 className="fw-bold mb-0" style={{color: '#1a1f36'}}>Roles Management</h5>
              <div className="text-muted" style={{fontSize: '0.85rem'}}>Create and manage user roles</div>
            </div>
          </div>
          <button className="btn btn-primary fw-semibold px-4 rounded-3" onClick={handleOpenAdd}>
            + Add Role
          </button>
        </div>
        
        <div className="card-body p-4 bg-light bg-opacity-50">
          
          {/* Search & Filters */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div className="position-relative" style={{maxWidth: '300px', width: '100%'}}>
              <i className="bi bi-search position-absolute text-muted" style={{top: '50%', transform: 'translateY(-50%)', left: '15px'}}></i>
              <input 
                type="text" 
                className="form-control rounded-pill ps-5 bg-white" 
                placeholder="Search roles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="d-flex gap-2">
              <select className="form-select rounded-pill bg-white" value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{width: '150px'}}>
                <option value="All">All Roles</option>
                <option value="System">System Roles</option>
                <option value="Custom">Custom Roles</option>
              </select>
            </div>
          </div>

          {/* Role Cards Grid */}
          <div className="row g-4">
            {filteredRoles.map(role => (
              <div className="col-12 col-md-6 col-lg-4" key={role.name}>
                <div className="card shadow-sm border-0 h-100 rounded-4" style={{transition: 'transform 0.2s', cursor: 'pointer'}}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className={`bg-${role.color} bg-opacity-10 text-${role.color} rounded p-3 d-inline-flex`}>
                        <i className={`bi bi-${role.icon} fs-4`}></i>
                      </div>
                      <button className="btn btn-sm btn-light rounded-circle" onClick={() => handleOpenEdit(role)} title="Edit Role">
                        <i className="bi bi-pencil"></i>
                      </button>
                    </div>
                    
                    <h5 className="fw-bold mb-2" style={{color: '#1a1f36'}}>{role.name} {role.isSystem && <i className="bi bi-shield-check text-primary fs-6 ms-1" title="System Role"></i>}</h5>
                    <p className="text-muted small mb-4" style={{minHeight: '40px'}}>{role.description}</p>
                    
                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                      <div>
                        <div className="text-muted" style={{fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.5px'}}>USERS</div>
                        <div className="fw-bold fs-5 text-dark">{role.usersCount}</div>
                      </div>
                      <div className="text-end">
                        <div className="text-muted" style={{fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.5px'}}>PERMISSIONS</div>
                        <div className="fw-bold fs-5 text-dark">
                          {role.name === 'Admin' || role.name === 'Super Admin' ? 'Full Access' : getPermissionsCount(role.name)}
                        </div>
                      </div>
                    </div>
                    
                    <button className="btn btn-link p-0 text-decoration-none fw-semibold d-flex align-items-center" onClick={() => handleOpenPermissions(role)}>
                      View Permissions <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredRoles.length === 0 && (
              <div className="col-12 text-center py-5 text-muted">
                <i className="bi bi-search fs-1 mb-3 d-block opacity-50"></i>
                <h5>No roles found</h5>
                <p>Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------- MODALS ------------------------- */}
      
      {/* Add/Edit Role Modal */}
      {(showAddModal || showEditModal) && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom-0 p-4 pb-3">
                <h5 className="modal-title fw-bold">{showAddModal ? 'Create New Role' : 'Edit Role Details'}</h5>
                <button type="button" className="btn-close" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}></button>
              </div>
              <div className="modal-body p-4 pt-0">
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Role Name</label>
                  <input type="text" className="form-control rounded-3" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Finance Manager" disabled={showEditModal && selectedRole?.isSystem}/>
                  {showEditModal && selectedRole?.isSystem && <small className="text-muted">System role names cannot be changed.</small>}
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Description</label>
                  <textarea className="form-control rounded-3" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the responsibilities..."></textarea>
                </div>
                
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label text-muted small fw-bold">Icon</label>
                    <select className="form-select rounded-3" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})}>
                      <option value="person-fill">Person</option>
                      <option value="people-fill">People</option>
                      <option value="shield-fill">Shield</option>
                      <option value="display">Computer</option>
                      <option value="bag-plus-fill">Medical Bag</option>
                      <option value="bandaid-fill">Band-aid</option>
                      <option value="capsule">Pill</option>
                      <option value="box-seam">Box</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label text-muted small fw-bold">Theme Color</label>
                    <select className="form-select rounded-3" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}>
                      <option value="primary">Blue</option>
                      <option value="success">Green</option>
                      <option value="danger">Red</option>
                      <option value="warning">Yellow</option>
                      <option value="info">Light Blue</option>
                      <option value="secondary">Grey</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>

              </div>
              <div className="modal-footer border-top-0 p-4 pt-0 justify-content-between">
                <div>
                  {showEditModal && (
                    <button className="btn btn-outline-danger fw-semibold rounded-3" onClick={() => handleDelete(selectedRole)}>
                      Delete Role
                    </button>
                  )}
                </div>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-light fw-semibold rounded-3" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Cancel</button>
                  <button type="button" className="btn btn-primary fw-semibold rounded-3" onClick={showAddModal ? handleSaveAdd : handleSaveEdit}>Save Role</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Edit Modal */}
      {showPermissionsModal && localPermissions && (
        <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom p-4">
                <div>
                  <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                    <i className={`bi bi-${selectedRole?.icon} text-${selectedRole?.color}`}></i> 
                    {selectedRole?.name} Permissions
                  </h5>
                  <div className="text-muted small mt-1">Click cells to cycle between Allowed, Denied, and View Only</div>
                </div>
                <button type="button" className="btn-close" onClick={() => {
                  if (isPermissionsDirty && !window.confirm("Discard unsaved changes?")) return;
                  setShowPermissionsModal(false);
                }}></button>
              </div>
              
              <div className="modal-body p-0">
                <div className="d-flex justify-content-end gap-3 p-3 bg-light border-bottom text-muted" style={{fontSize: '0.85rem'}}>
                  <div className="d-flex align-items-center gap-1"><i className="bi bi-check2 text-success fs-5"></i> Allowed</div>
                  <div className="d-flex align-items-center gap-1"><i className="bi bi-x-lg text-danger"></i> Denied</div>
                  <div className="d-flex align-items-center gap-1"><i className="bi bi-eye"></i> View Only</div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover mb-0" style={{fontSize: '0.95rem'}}>
                    <thead className="table-light text-muted font-monospace" style={{fontSize: '0.85rem', position: 'sticky', top: 0, zIndex: 1}}>
                      <tr>
                        <th className="px-4 py-3 border-bottom-0">Module</th>
                        {actionsList.map(action => (
                          <th key={action} className="text-center py-3 border-bottom-0 text-capitalize">{action}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {modulesList.map((mod) => (
                        <tr key={mod}>
                          <td className="px-4 py-3 fw-medium text-dark">{mod}</td>
                          {actionsList.map(action => {
                            const state = localPermissions[mod]?.[action] || 'denied';
                            return (
                              <td key={action} className="text-center align-middle py-3">
                                <button 
                                  className="btn btn-sm btn-link p-0 text-decoration-none"
                                  onClick={() => handlePermissionCycle(mod, action)}
                                  style={{ width: '32px', height: '32px' }}
                                >
                                  {renderPermissionIcon(state)}
                                </button>
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="modal-footer border-top p-4 bg-light">
                <button type="button" className="btn btn-white border fw-semibold rounded-3 px-4" onClick={() => {
                  if (isPermissionsDirty && !window.confirm("Discard unsaved changes?")) return;
                  setShowPermissionsModal(false);
                }}>Close</button>
                <button type="button" className="btn btn-primary fw-semibold rounded-3 px-4" disabled={!isPermissionsDirty} onClick={handleSavePermissions}>Save Permissions</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default RolesTabContent;
