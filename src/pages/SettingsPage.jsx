import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { useRole } from '../context/RoleContext';
import RolesTabContent from '../components/settings/RolesTabContent';
import ProfileTabContent from '../components/settings/ProfileTabContent';

function SettingsPage() {
  const navigate = useNavigate();
  const { tab } = useParams();
  
  const validTabs = ['roles', 'permissions', 'profile', 'notification'];
  const activeTab = validTabs.includes(tab) ? tab : 'roles';

  const { permissions, updateRolePermissions } = useRole();
  
  // Notification Settings State
  const initialSettings = {
    emailAppointments: true,
    emailLowStock: true,
    emailSystem: true,
    inAppEmployee: false,
    inAppReport: true,
    inAppChats: true
  };
  
  const [savedSettings, setSavedSettings] = useState(() => {
    const local = localStorage.getItem('erp_notification_settings');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        return { ...initialSettings, ...parsed };
      } catch (e) {
        return initialSettings;
      }
    }
    return initialSettings;
  });
  
  const [currentSettings, setCurrentSettings] = useState(savedSettings);
  const [showSuccess, setShowSuccess] = useState(false);

  // Permissions Settings State
  const [selectedRole, setSelectedRole] = useState('HR');
  const [localPermissions, setLocalPermissions] = useState(() => {
    return JSON.parse(JSON.stringify(permissions[selectedRole] || {}));
  });
  const [isPermissionsDirty, setIsPermissionsDirty] = useState(false);

  useEffect(() => {
    if (!isPermissionsDirty) {
      setLocalPermissions(JSON.parse(JSON.stringify(permissions[selectedRole] || {})));
    }
  }, [selectedRole, permissions]);

  // Dirty checks
  const isNotificationsDirty = Object.keys(initialSettings).some(
    key => currentSettings[key] !== savedSettings[key]
  );
  
  const isAnyDirty = isNotificationsDirty || isPermissionsDirty;

  // Prevent browser window close/refresh if unsaved
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isAnyDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isAnyDirty]);

  const handleTabChange = (tabId) => {
    if (isAnyDirty) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to switch tabs and discard them?")) {
        return;
      }
      // Reset states
      setCurrentSettings(savedSettings);
      setLocalPermissions(JSON.parse(JSON.stringify(permissions[selectedRole] || {})));
      setIsPermissionsDirty(false);
    }
    navigate(`/settings/${tabId}`);
  };

  // --- Notification Handlers ---
  const handleToggle = (key) => {
    setCurrentSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotifications = () => {
    const validatedSettings = { ...initialSettings, ...currentSettings };
    setSavedSettings(validatedSettings);
    setCurrentSettings(validatedSettings);
    localStorage.setItem('erp_notification_settings', JSON.stringify(validatedSettings));
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancelNotifications = () => {
    setCurrentSettings(savedSettings);
  };

  // --- Permissions Handlers ---
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    if (isPermissionsDirty) {
      if (!window.confirm("You have unsaved permissions changes. Are you sure you want to switch roles and discard them?")) {
        return;
      }
    }
    setSelectedRole(newRole);
    setLocalPermissions(JSON.parse(JSON.stringify(permissions[newRole] || {})));
    setIsPermissionsDirty(false);
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
    updateRolePermissions(selectedRole, localPermissions);
    setIsPermissionsDirty(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancelPermissions = () => {
    setLocalPermissions(JSON.parse(JSON.stringify(permissions[selectedRole] || {})));
    setIsPermissionsDirty(false);
  };

  const renderPermissionIcon = (state) => {
    if (state === 'allowed') return <i className="bi bi-check2 text-success fs-5"></i>;
    if (state === 'denied') return <i className="bi bi-x-lg text-danger"></i>;
    if (state === 'view_only') return <i className="bi bi-eye text-muted"></i>;
    return null;
  };

  const tabs = [
    { id: 'roles', label: 'Roles Management' },
    { id: 'permissions', label: 'Permissions Matrix' },
    { id: 'profile', label: 'Profile Settings' },
    { id: 'notification', label: 'Notification Settings' }
  ];

  const modulesList = ['Dashboard', 'Employees', 'Departments', 'Doctors', 'Appointments', 'Patients', 'Inventory', 'Reports', 'Settings'];
  const actionsList = ['view', 'create', 'edit', 'delete', 'export'];

  return (
    <>
      <div className="top-navbar mb-4">
        <TopNavbar />
      </div>

      <div className="mb-4">
        <h1 className="fw-bold mb-1" style={{ color: '#1a1f36', fontSize: '1.8rem' }}>Settings</h1>
        <p className="text-muted" style={{ fontSize: '0.95rem' }}>Manage system users, roles and permissions</p>
      </div>

      {/* Custom Tabs Navigation */}
      <div className="border-bottom mb-4">
        <ul className="nav nav-tabs border-bottom-0 gap-4" style={{fontSize: '0.95rem', fontWeight: '500'}}>
          {tabs.map(tab => (
            <li className="nav-item" key={tab.id}>
              <button 
                className={`nav-link px-0 pb-3 border-0 bg-transparent text-muted ${activeTab === tab.id ? 'active fw-bold' : ''}`}
                style={{ 
                  color: activeTab === tab.id ? '#0d6efd' : '#6c757d',
                  borderBottom: activeTab === tab.id ? '2px solid #0d6efd' : '2px solid transparent',
                  borderRadius: 0
                }}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Success Message Alert */}
      {showSuccess && (
        <div className="alert alert-success d-flex align-items-center shadow-sm border-0 rounded-3 mb-4" role="alert">
          <i className="bi bi-check-circle-fill fs-5 me-3"></i>
          <div>
            <strong>Success!</strong> Your changes have been saved successfully.
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="tab-content pb-5">
        {activeTab === 'profile' ? (
          <ProfileTabContent />
        ) : activeTab === 'roles' ? (
          <RolesTabContent />
        ) : activeTab === 'permissions' ? (
          <div className="card border rounded-4 shadow-sm" style={{borderColor: '#e2e8f0'}}>
            <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center rounded-top-4">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '32px', height: '32px', fontSize: '0.9rem'}}>
                  3
                </div>
                <div>
                  <h5 className="fw-bold mb-0" style={{color: '#1a1f36'}}>Permissions Matrix</h5>
                  <div className="text-muted" style={{fontSize: '0.85rem'}}>Manage role permissions for system modules</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted" style={{fontSize: '0.9rem'}}>Select Role</span>
                <select 
                  className="form-select" 
                  value={selectedRole} 
                  onChange={handleRoleChange}
                  style={{width: '180px'}}
                >
                  {useRole().rolesList.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="card-body p-0">
              <div className="d-flex justify-content-end gap-3 p-3 bg-light border-bottom text-muted" style={{fontSize: '0.85rem'}}>
                <div className="d-flex align-items-center gap-1"><i className="bi bi-check2 text-success fs-5"></i> Allowed</div>
                <div className="d-flex align-items-center gap-1"><i className="bi bi-x-lg text-danger"></i> Denied</div>
                <div className="d-flex align-items-center gap-1"><i className="bi bi-eye"></i> View Only</div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover mb-0" style={{fontSize: '0.95rem'}}>
                  <thead className="table-light text-muted font-monospace" style={{fontSize: '0.85rem'}}>
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
              
              <div className="p-4 border-top d-flex justify-content-between align-items-center bg-light rounded-bottom-4">
                <div className="text-muted" style={{fontSize: '0.9rem'}}>
                  Showing permissions for role: <span className="fw-bold text-dark">{selectedRole}</span>
                </div>
                <div className="d-flex gap-3">
                  <button 
                    className="btn btn-white border fw-semibold px-4" 
                    onClick={handleCancelPermissions}
                    disabled={!isPermissionsDirty}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary fw-semibold px-4" 
                    onClick={handleSavePermissions}
                    disabled={!isPermissionsDirty}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'notification' ? (
          <div>
            <div className="d-flex align-items-center mb-2">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{width: '32px', height: '32px', fontSize: '0.9rem'}}>
                5
              </div>
              <h4 className="fw-bold mb-0" style={{color: '#1a1f36'}}>Notification Settings</h4>
            </div>
            <p className="text-muted mb-4" style={{marginLeft: '48px', fontSize: '0.95rem'}}>Manage how you receive system notifications</p>

            <div className="card border rounded-4 shadow-sm" style={{borderColor: '#e2e8f0'}}>
              <div className="card-body p-0">
                
                {/* Email Notifications Section */}
                <div className="p-4 p-md-5">
                  <h6 className="text-muted fw-bold mb-4" style={{letterSpacing: '1px', fontSize: '0.8rem'}}>EMAIL NOTIFICATIONS</h6>
                  
                  {/* Item 1 */}
                  <div className="d-flex justify-content-between align-items-start mb-4 pb-4 border-bottom">
                    <div className="d-flex gap-3">
                      <div className="bg-primary bg-opacity-10 text-primary rounded p-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                        <i className="bi bi-calendar-check fs-5"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1" style={{color: '#1a1f36'}}>Appointment Confirmations</h6>
                        <div className="text-muted small">Receive emails for new appointments and changes</div>
                      </div>
                    </div>
                    <div className="form-check form-switch mt-1">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        style={{width: '40px', height: '20px', cursor: 'pointer'}}
                        checked={currentSettings.emailAppointments}
                        onChange={() => handleToggle('emailAppointments')}
                      />
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="d-flex justify-content-between align-items-start mb-4 pb-4 border-bottom">
                    <div className="d-flex gap-3">
                      <div className="bg-primary bg-opacity-10 text-primary rounded p-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                        <i className="bi bi-box-seam fs-5"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1" style={{color: '#1a1f36'}}>Low Stock Alerts</h6>
                        <div className="text-muted small">Receive alerts for low inventory items</div>
                      </div>
                    </div>
                    <div className="form-check form-switch mt-1">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        style={{width: '40px', height: '20px', cursor: 'pointer'}}
                        checked={currentSettings.emailLowStock}
                        onChange={() => handleToggle('emailLowStock')}
                      />
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex gap-3">
                      <div className="bg-primary bg-opacity-10 text-primary rounded p-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                        <i className="bi bi-exclamation-triangle fs-5"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1" style={{color: '#1a1f36'}}>System Alerts</h6>
                        <div className="text-muted small">Important system updates and announcements</div>
                      </div>
                    </div>
                    <div className="form-check form-switch mt-1">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        style={{width: '40px', height: '20px', cursor: 'pointer'}}
                        checked={currentSettings.emailSystem}
                        onChange={() => handleToggle('emailSystem')}
                      />
                    </div>
                  </div>
                </div>

                <hr className="m-0" />

                {/* In-App Notifications Section */}
                <div className="p-4 p-md-5">
                  <h6 className="text-muted fw-bold mb-4" style={{letterSpacing: '1px', fontSize: '0.8rem'}}>IN-APP NOTIFICATIONS</h6>
                  
                  {/* Item 4 */}
                  <div className="d-flex justify-content-between align-items-start mb-4 pb-4 border-bottom">
                    <div className="d-flex gap-3">
                      <div className="bg-primary bg-opacity-10 text-primary rounded p-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                        <i className="bi bi-person-badge fs-5"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1" style={{color: '#1a1f36'}}>New Employee Updates</h6>
                        <div className="text-muted small">Receive notifications for new staff onboarding</div>
                      </div>
                    </div>
                    <div className="form-check form-switch mt-1">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        style={{width: '40px', height: '20px', cursor: 'pointer'}}
                        checked={currentSettings.inAppEmployee}
                        onChange={() => handleToggle('inAppEmployee')}
                      />
                    </div>
                  </div>

                  {/* Item 5 */}
                  <div className="d-flex justify-content-between align-items-start mb-4 pb-4 border-bottom">
                    <div className="d-flex gap-3">
                      <div className="bg-primary bg-opacity-10 text-primary rounded p-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                        <i className="bi bi-bar-chart fs-5"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1" style={{color: '#1a1f36'}}>Report Summaries</h6>
                        <div className="text-muted small">Receive periodic automated report summaries</div>
                      </div>
                    </div>
                    <div className="form-check form-switch mt-1">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        style={{width: '40px', height: '20px', cursor: 'pointer'}}
                        checked={currentSettings.inAppReport}
                        onChange={() => handleToggle('inAppReport')}
                      />
                    </div>
                  </div>

                  {/* Item 6 */}
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex gap-3">
                      <div className="bg-primary bg-opacity-10 text-primary rounded p-2 d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                        <i className="bi bi-chat-square-text fs-5"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1" style={{color: '#1a1f36'}}>Internal Chats</h6>
                        <div className="text-muted small">Enable in-app notifications for staff messages</div>
                      </div>
                    </div>
                    <div className="form-check form-switch mt-1">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        role="switch" 
                        style={{width: '40px', height: '20px', cursor: 'pointer'}}
                        checked={currentSettings.inAppChats}
                        onChange={() => handleToggle('inAppChats')}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 p-md-5 border-top d-flex justify-content-end gap-3 bg-light rounded-bottom-4">
                  <button 
                    className="btn btn-white border fw-semibold px-4" 
                    onClick={handleCancelNotifications}
                    disabled={!isNotificationsDirty}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary fw-semibold px-4" 
                    onClick={handleSaveNotifications}
                    disabled={!isNotificationsDirty}
                  >
                    Save Preferences
                  </button>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-5 text-center">
              <i className="bi bi-tools fs-1 text-muted mb-3 d-block"></i>
              <h5 className="fw-bold">Module under construction</h5>
              <p className="text-muted">The {tabs.find(t => t.id === activeTab)?.label} section is currently being updated.</p>
              <button className="btn btn-outline-primary mt-2" onClick={() => setActiveTab('permissions')}>
                Go back to Permissions Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SettingsPage;
