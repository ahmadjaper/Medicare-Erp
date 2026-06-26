import React, { createContext, useContext, useState, useEffect } from 'react';

const UsersManagementContext = createContext();

const defaultUsers = [
  {
    id: 'USR-001',
    email: 'admin.user@medicore.com',
    fullName: 'Admin User',
    username: 'admin.user',
    linkedEmployee: 'Eleanor Pena',
    role: 'Admin',
    department: 'Administration',
    status: 'Active',
    lastLogin: '12 May 2024, 10:30 AM',
    createdAt: '01 Jan 2024',
    phone: '+20 101 234 5678'
  },
  {
    id: 'USR-002',
    email: 'hr.user@medicore.com',
    fullName: 'HR User',
    username: 'hr.user',
    linkedEmployee: 'Albert Flores',
    role: 'HR',
    department: 'Human Resources',
    status: 'Active',
    lastLogin: '12 May 2024, 09:15 AM',
    createdAt: '15 Feb 2024',
    phone: '+20 102 345 6789'
  },
  {
    id: 'USR-003',
    email: 'reception.user@medicore.com',
    fullName: 'Reception User',
    username: 'reception.user',
    linkedEmployee: 'Bessie Cooper',
    role: 'Receptionist',
    department: 'Front Office',
    status: 'Active',
    lastLogin: '12 May 2024, 11:20 AM',
    createdAt: '10 Mar 2024',
    phone: '+20 103 456 7890'
  },
  {
    id: 'USR-004',
    email: 'dr.sarah@medicore.com',
    fullName: 'Dr. Sarah Johnson',
    username: 'dr.sarah',
    linkedEmployee: 'Dr. Sarah Johnson',
    role: 'Doctor',
    department: 'Cardiology',
    status: 'Inactive',
    lastLogin: '—',
    createdAt: '05 Apr 2024',
    phone: '+20 104 567 8901'
  },
  {
    id: 'USR-005',
    email: 'dr.ahmed@medicore.com',
    fullName: 'Dr. Ahmed Ali',
    username: 'dr.ahmed',
    linkedEmployee: 'Dr. Ahmed Ali',
    role: 'Doctor',
    department: 'Orthopedics',
    status: 'Active',
    lastLogin: '12 May 2024, 08:50 AM',
    createdAt: '20 Apr 2024',
    phone: '+20 105 678 9012'
  }
];

export const UsersManagementProvider = ({ children }) => {
  const [usersList, setUsersList] = useState(() => {
    const localData = localStorage.getItem('erp_users_list');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        return defaultUsers;
      }
    }
    return defaultUsers;
  });

  useEffect(() => {
    localStorage.setItem('erp_users_list', JSON.stringify(usersList));
  }, [usersList]);

  const addUser = (newUser) => {
    const userWithId = {
      ...newUser,
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastLogin: '—',
    };
    setUsersList([userWithId, ...usersList]);
  };

  const updateUser = (id, updatedData) => {
    setUsersList(usersList.map(user => user.id === id ? { ...user, ...updatedData } : user));
  };

  const deleteUser = (id) => {
    setUsersList(usersList.filter(user => user.id !== id));
  };

  const updateUserStatus = (id, newStatus) => {
    setUsersList(usersList.map(user => user.id === id ? { ...user, status: newStatus } : user));
  };

  // Compute Statistics
  const totalUsers = usersList.length;
  const activeUsers = usersList.filter(u => u.status === 'Active').length;
  const inactiveUsers = usersList.filter(u => u.status === 'Inactive' || u.status === 'Suspended').length;
  const doctorsAppAccess = usersList.filter(u => u.role === 'Doctor').length;

  return (
    <UsersManagementContext.Provider value={{
      usersList,
      addUser,
      updateUser,
      deleteUser,
      updateUserStatus,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        doctorsAppAccess
      }
    }}>
      {children}
    </UsersManagementContext.Provider>
  );
};

export const useUsersManagement = () => {
  const context = useContext(UsersManagementContext);
  if (!context) {
    throw new Error('useUsersManagement must be used within a UsersManagementProvider');
  }
  return context;
};
