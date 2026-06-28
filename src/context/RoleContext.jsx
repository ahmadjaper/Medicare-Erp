import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RoleContext = createContext();

const defaultHRMatrix = {
  Dashboard: { view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  Employees: { view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  Departments: { view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  Doctors: { view: 'allowed', create: 'denied', edit: 'denied', delete: 'denied', export: 'allowed' },
  Appointments: { view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  Patients: { view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  Inventory: { view: 'allowed', create: 'denied', edit: 'denied', delete: 'denied', export: 'allowed' },
  Reports: { view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' },
  Settings: { view: 'denied', create: 'denied', edit: 'denied', delete: 'denied', export: 'denied' },
};

const getRoleDefaults = (role) => {
  if (role === 'HR') return JSON.parse(JSON.stringify(defaultHRMatrix));
  
  const matrix = {};
  const modules = ['Dashboard', 'Employees', 'Departments', 'Doctors', 'Appointments', 'Patients', 'Inventory', 'Reports', 'Settings'];
  
  modules.forEach(mod => {
    if (role === 'Super Admin' || role === 'Admin') {
      matrix[mod] = { view: 'allowed', create: 'allowed', edit: 'allowed', delete: 'allowed', export: 'allowed' };
    } else {
      // Basic defaults for others
      matrix[mod] = { view: 'view_only', create: 'denied', edit: 'denied', delete: 'denied', export: 'denied' };
      if (mod === 'Dashboard') {
        matrix[mod].view = 'allowed';
      }
    }
  });
  
  return matrix;
};

const defaultPermissionsMap = {
  'Super Admin': getRoleDefaults('Super Admin'),
  'Admin': getRoleDefaults('Admin'),
  'HR': getRoleDefaults('HR'),
  'Receptionist': getRoleDefaults('Receptionist'),
  'Doctor': getRoleDefaults('Doctor'),
  'Nurse': getRoleDefaults('Nurse'),
  'Pharmacist': getRoleDefaults('Pharmacist'),
  'Inventory Manager': getRoleDefaults('Inventory Manager')
};

const initialRolesList = [
  { id: 'admin', name: 'Admin', description: 'Full system access and configuration', icon: 'shield-fill', color: 'primary', isSystem: true, usersCount: 3 },
  { id: 'hr', name: 'HR', description: 'Manage employees, departments and HR operations', icon: 'people-fill', color: 'success', isSystem: true, usersCount: 2 },
  { id: 'receptionist', name: 'Receptionist', description: 'Manage appointments, patients and front desk', icon: 'display', color: 'info', isSystem: true, usersCount: 4 },
  { id: 'doctor', name: 'Doctor', description: 'Access to patient appointments and medical records', icon: 'bag-plus-fill', color: 'danger', isSystem: true, usersCount: 12 },
  { id: 'nurse', name: 'Nurse', description: 'Patient care and ward management', icon: 'bandaid-fill', color: 'warning', isSystem: true, usersCount: 8 },
  { id: 'pharmacist', name: 'Pharmacist', description: 'Manage pharmacy and prescriptions', icon: 'capsule', color: 'secondary', isSystem: true, usersCount: 3 },
  { id: 'inventory_manager', name: 'Inventory Manager', description: 'Manage inventory and suppliers', icon: 'box-seam', color: 'dark', isSystem: true, usersCount: 1 }
];

export const RoleProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentRole, setCurrentRole] = useState(user?.role || 'Admin'); // Default is Admin

  useEffect(() => {
    if (user?.role) {
      setCurrentRole(user.role);
    }
  }, [user]);
  
  const [permissions, setPermissions] = useState(() => {
    const local = localStorage.getItem('erp_permissions');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed;
        }
      } catch(e) {
        return defaultPermissionsMap;
      }
    }
    return defaultPermissionsMap;
  });

  const [rolesList, setRolesList] = useState(() => {
    const local = localStorage.getItem('erp_roles_list');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch(e) {
        return initialRolesList;
      }
    }
    return initialRolesList;
  });

  useEffect(() => {
    localStorage.setItem('erp_permissions', JSON.stringify(permissions));
  }, [permissions]);

  useEffect(() => {
    localStorage.setItem('erp_roles_list', JSON.stringify(rolesList));
  }, [rolesList]);

  const updateRolePermissions = (roleName, newPermissionsMatrix) => {
    setPermissions(prev => ({
      ...prev,
      [roleName]: newPermissionsMatrix
    }));
  };

  const addRole = (roleData, initialRolePermissions) => {
    setRolesList(prev => [...prev, roleData]);
    setPermissions(prev => ({
      ...prev,
      [roleData.name]: initialRolePermissions || getRoleDefaults(roleData.name)
    }));
  };

  const editRole = (oldRoleName, newRoleData) => {
    setRolesList(prev => prev.map(r => r.name === oldRoleName ? newRoleData : r));
    
    // If the name changed, we need to migrate permissions
    if (oldRoleName !== newRoleData.name) {
      setPermissions(prev => {
        const newPerms = { ...prev };
        newPerms[newRoleData.name] = newPerms[oldRoleName];
        delete newPerms[oldRoleName];
        return newPerms;
      });
      if (currentRole === oldRoleName) {
        setCurrentRole(newRoleData.name);
      }
    }
  };

  const deleteRole = (roleName) => {
    setRolesList(prev => prev.filter(r => r.name !== roleName));
    setPermissions(prev => {
      const newPerms = { ...prev };
      delete newPerms[roleName];
      return newPerms;
    });
    if (currentRole === roleName) {
      setCurrentRole('Admin');
    }
  };

  const getPermissionState = (module, action) => {
    // Optional fallback mapping
    let mappedModule = module;
    if (module === 'Analytics') mappedModule = 'Reports';
    if (module === 'Schedules') mappedModule = 'Appointments';
    if (module === 'Users & Roles') mappedModule = 'Settings';
    if (module === 'Suppliers' || module === 'Supplies') mappedModule = 'Inventory';

    const rolePerms = permissions[currentRole];
    if (!rolePerms || !rolePerms[mappedModule]) return 'denied';
    
    return rolePerms[mappedModule][action] || 'denied';
  };

  const hasPermission = (module, action) => {
    const state = getPermissionState(module, action);
    // For view, both 'allowed' and 'view_only' are sufficient.
    if (action === 'view') {
      return state === 'allowed' || state === 'view_only';
    }
    // For write actions, only 'allowed' is sufficient.
    return state === 'allowed';
  };

  return (
    <RoleContext.Provider value={{ 
      currentRole, 
      setCurrentRole, 
      permissions, 
      rolesList,
      updateRolePermissions,
      addRole,
      editRole,
      deleteRole,
      hasPermission,
      getPermissionState
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
