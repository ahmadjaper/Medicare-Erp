import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultAvatar from '../assets/img/doctor-avatar.png';

const UserContext = createContext();

const initialDefaultProfile = {
  fullName: 'Admin User',
  email: 'admin.user@medicore.com',
  phone: '+20 101 234 5678',
  department: 'Administration',
  jobTitle: 'System Administrator',
  avatar: defaultAvatar
};

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(() => {
    const local = localStorage.getItem('erp_user_profile');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      } catch(e) {
        return initialDefaultProfile;
      }
    }
    return initialDefaultProfile;
  });

  useEffect(() => {
    localStorage.setItem('erp_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const updateProfile = (newProfileData) => {
    setUserProfile(prev => ({ ...prev, ...newProfileData }));
  };

  return (
    <UserContext.Provider value={{ userProfile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
