import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Default mock users for testing purposes, especially since there is no backend
  const defaultUsers = [
    { email: 'admin@medicare.com', password: 'password123', name: 'Admin User', role: 'Admin' },
    { email: 'hr@medicare.com', password: 'password123', name: 'HR Manager', role: 'HR' },
    { email: 'reception@medicare.com', password: 'password123', name: 'Front Desk', role: 'Receptionist' }
  ];

  useEffect(() => {
    // Initialize users in local storage if not present
    const storedUsers = localStorage.getItem('erp_users');
    if (!storedUsers) {
      localStorage.setItem('erp_users', JSON.stringify(defaultUsers));
    }

    // Check for active session
    const activeSession = localStorage.getItem('erp_active_user');
    if (activeSession) {
      setUser(JSON.parse(activeSession));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const storedUsers = JSON.parse(localStorage.getItem('erp_users')) || defaultUsers;
    const foundUser = storedUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const sessionUser = { email: foundUser.email, name: foundUser.name, role: foundUser.role };
      setUser(sessionUser);
      setIsAuthenticated(true);
      localStorage.setItem('erp_active_user', JSON.stringify(sessionUser));
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const signup = (name, email, password, role) => {
    const storedUsers = JSON.parse(localStorage.getItem('erp_users')) || defaultUsers;
    
    if (storedUsers.some(u => u.email === email)) {
      return { success: false, message: 'User with this email already exists' };
    }

    const newUser = { name, email, password, role };
    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem('erp_users', JSON.stringify(updatedUsers));
    
    // Auto login after signup
    const sessionUser = { email: newUser.email, name: newUser.name, role: newUser.role };
    setUser(sessionUser);
    setIsAuthenticated(true);
    localStorage.setItem('erp_active_user', JSON.stringify(sessionUser));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('erp_active_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
