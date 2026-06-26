import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { RoleProvider, useRole } from './context/RoleContext';
import { UserProvider } from './context/UserContext';
import { UsersManagementProvider } from './context/UsersManagementContext';
import Layout from './components/Layout';

// Existing Pages
import SchedulePage from './pages/SchedulePage';
import PerformancePage from './pages/PerformancePage';
import ApptDetailsPage from './pages/ApptDetailsPage';
import CreateAppointmentPage from './pages/CreateAppointmentPage';

// Placeholder & List Pages
import DashboardPage from './pages/DashboardPage';
import DepartmentsPage from './pages/DepartmentsPage';
import EmployeesPage from './pages/EmployeesPage';
import DoctorsPage from './pages/DoctorsPage';
import CreateDoctorPage from './pages/CreateDoctorPage';
import AppointmentsPage from './pages/AppointmentsPage';
import InventoryPage from './pages/InventoryPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import EditItemPage from './pages/EditItemPage';
import StockMovementHistoryPage from './pages/StockMovementHistoryPage';
import LowStockAlertsPage from './pages/LowStockAlertsPage';
import SuppliersPage from './pages/SuppliersPage';
import AddSupplierPage from './pages/AddSupplierPage';
import SupplierDetailsPage from './pages/SupplierDetailsPage';
import EditSupplierPage from './pages/EditSupplierPage';
import RevenuePage from './pages/RevenuePage';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import SettingsPage from './pages/SettingsPage';
import DoctorAvailabilityPage from './pages/DoctorAvailabilityPage';

// New Pages
import PermissionsPage from './pages/PermissionsPage';
import CreateDepartmentPage from './pages/CreateDepartmentPage';
import EditDepartmentPage from './pages/EditDepartmentPage';

import DepartmentDashboardPage from './pages/DepartmentDashboardPage';
import CreateEmployeePage from './pages/CreateEmployeePage';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';
import EditEmployeePage from './pages/EditEmployeePage';
import AttendanceOverviewPage from './pages/AttendanceOverviewPage';

const ROLE_ROUTES = {
  Admin: [
    '/dashboard', '/departments', '/departments/create', '/departments/:id/edit', '/departments/:departmentId', '/employees', '/employees/create', '/employees/:id/edit', '/employees/:id', '/attendance-overview', '/doctors', 
    '/appointments', '/appointments/details/:id', '/schedules', 
    '/inventory', '/suppliers', '/low-stock-alerts', '/revenue', '/analytics', 
    '/users', '/roles', '/permissions', '/settings', '/doctor-availability'
  ],
  HR: [
    '/dashboard', '/departments', '/departments/create', '/departments/:id/edit', '/departments/:departmentId', '/employees', '/employees/create', '/employees/:id/edit', '/employees/:id', '/attendance-overview', '/doctors', 
    '/schedules', '/settings'
  ],
  Receptionist: [
    '/dashboard', '/appointments', '/appointments/details/:id', 
    '/doctor-availability', '/settings'
  ]
};

function RoleProtectedRoute({ children }) {
  const { currentRole } = useRole();
  const location = useLocation();
  
  const allowedRoutes = ROLE_ROUTES[currentRole] || [];
  const currentPath = location.pathname;
  
  const isAllowed = allowedRoutes.some(route => {
    if (route.includes(':')) {
      const regexPath = new RegExp('^' + route.replace(/:[^\s/]+/g, '[^/]+') + '$');
      return regexPath.test(currentPath);
    }
    return currentPath === route;
  });
  
  if (!isAllowed) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Mount Layout as the parent shell wrapper */}
      <Route path="/" element={<Layout />}>
        {/* Default route path redirects to Dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Approved Modules */}
        <Route path="dashboard" element={
          <RoleProtectedRoute>
            <DashboardPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="departments" element={
          <RoleProtectedRoute>
            <DepartmentsPage />
          </RoleProtectedRoute>
        } />

        <Route path="departments/create" element={
          <RoleProtectedRoute>
            <CreateDepartmentPage />
          </RoleProtectedRoute>
        } />

        <Route path="departments/:id/edit" element={
          <RoleProtectedRoute>
            <EditDepartmentPage />
          </RoleProtectedRoute>
        } />

        <Route path="departments/:departmentId" element={
          <RoleProtectedRoute>
            <DepartmentDashboardPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="employees" element={
          <RoleProtectedRoute>
            <EmployeesPage />
          </RoleProtectedRoute>
        } />

        <Route path="employees/create" element={
          <RoleProtectedRoute>
            <CreateEmployeePage />
          </RoleProtectedRoute>
        } />

        <Route path="employees/:id/edit" element={
          <RoleProtectedRoute>
            <EditEmployeePage />
          </RoleProtectedRoute>
        } />

        <Route path="employees/:id" element={
          <RoleProtectedRoute>
            <EmployeeDetailsPage />
          </RoleProtectedRoute>
        } />

        <Route path="attendance-overview" element={
          <RoleProtectedRoute>
            <AttendanceOverviewPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="doctors" element={
          <RoleProtectedRoute>
            <DoctorsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="appointments" element={
          <RoleProtectedRoute>
            <AppointmentsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="appointments/details/:id" element={
          <RoleProtectedRoute>
            <ApptDetailsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="schedules" element={
          <RoleProtectedRoute>
            <SchedulePage />
          </RoleProtectedRoute>
        } />
        
        <Route path="inventory" element={
          <RoleProtectedRoute>
            <InventoryPage />
          </RoleProtectedRoute>
        } />

        <Route path="suppliers" element={
          <RoleProtectedRoute>
            <SuppliersPage />
          </RoleProtectedRoute>
        } />

        <Route path="low-stock-alerts" element={
          <RoleProtectedRoute>
            <LowStockAlertsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="revenue" element={
          <RoleProtectedRoute>
            <RevenuePage />
          </RoleProtectedRoute>
        } />
        
        <Route path="analytics" element={
          <RoleProtectedRoute>
            <PerformancePage />
          </RoleProtectedRoute>
        } />
        
        <Route path="users" element={
          <RoleProtectedRoute>
            <UsersPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="roles" element={
          <RoleProtectedRoute>
            <RolesPage />
          </RoleProtectedRoute>
        } />

        <Route path="permissions" element={
          <RoleProtectedRoute>
            <PermissionsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="settings" element={
          <RoleProtectedRoute>
            <SettingsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="doctor-availability" element={
          <RoleProtectedRoute>
            <DoctorAvailabilityPage />
          </RoleProtectedRoute>
        } />

        {/* Legacy redirect routes */}
        <Route path="schedule" element={<Navigate to="/schedules" replace />} />
        <Route path="performance" element={<Navigate to="/analytics" replace />} />
        <Route path="appointment" element={<Navigate to="/appointments" replace />} />
        
        {/* Fallback catch-all redirects back to Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <UsersManagementProvider>
        <RoleProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </RoleProvider>
      </UsersManagementProvider>
    </UserProvider>
  );
}

export default App;
