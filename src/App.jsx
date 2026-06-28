import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider, useRole } from './context/RoleContext';
import { UserProvider } from './context/UserContext';
import { UsersManagementProvider } from './context/UsersManagementContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

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
import DoctorDetailsPage from './pages/DoctorDetailsPage';
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

import AddInventoryPage from './pages/AddInventoryPage';
import UsersRolesPage from './pages/UsersRolesPage';
import UserDetailsPage from './pages/UserDetailsPage';
import EditUserPage from './pages/EditUserPage';

// Removed incorrect guessed imports since they are actually InventoryPage and UsersPage

import DepartmentDashboardPage from './pages/DepartmentDashboardPage';
import CreateEmployeePage from './pages/CreateEmployeePage';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';
import EditEmployeePage from './pages/EditEmployeePage';
import AttendanceOverviewPage from './pages/AttendanceOverviewPage';

const ROLE_ROUTES = {
  Admin: [
    '/dashboard', '/departments', '/departments/create', '/departments/:id/edit', '/departments/:departmentId', '/employees', '/employees/create', '/employees/:id/edit', '/employees/:id', '/attendance-overview', '/doctors', '/doctors/create', '/doctors/:id/edit', '/doctors/details/:id', '/schedules/:id', 
    '/appointments', '/appointments/create', '/appointments/details/:id', '/schedules', 
    '/inventory', '/inventory/add', '/inventory/history', '/inventory/:id', '/inventory/:id/edit', '/suppliers', '/suppliers/add', '/suppliers/:id', '/suppliers/:id/edit', '/low-stock-alerts', '/revenue', '/analytics', 
    '/users', '/roles', '/users-roles', '/users-roles/:id', '/users-roles/:id/edit', '/permissions', '/settings', '/settings/:tab', '/doctor-availability',
    '/inventory-management', '/user-administration'
  ],
  HR: [
    '/dashboard', '/departments', '/departments/create', '/departments/:id/edit', '/departments/:departmentId', '/employees', '/employees/create', '/employees/:id/edit', '/employees/:id', '/attendance-overview', '/doctors', '/doctors/create', '/doctors/:id/edit', '/doctors/details/:id', '/schedules/:id', 
    '/schedules', '/settings', '/settings/:tab'
  ],
  Receptionist: [
    '/dashboard', '/appointments', '/appointments/create', '/appointments/details/:id', 
    '/doctor-availability', '/settings', '/settings/:tab'
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
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Mount Layout as the parent shell wrapper, protected by Auth */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
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
        
        <Route path="doctors/create" element={
          <RoleProtectedRoute>
            <CreateDoctorPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="doctors/:id/edit" element={
          <RoleProtectedRoute>
            <CreateDoctorPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="doctors/details/:id" element={
          <RoleProtectedRoute>
            <DoctorDetailsPage />
          </RoleProtectedRoute>
        } />

        <Route path="appointments" element={
          <RoleProtectedRoute>
            <AppointmentsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="appointments/create" element={
          <RoleProtectedRoute>
            <CreateAppointmentPage />
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
        
        <Route path="schedules/:id" element={
          <RoleProtectedRoute>
            <SchedulePage />
          </RoleProtectedRoute>
        } />

        <Route path="inventory" element={
          <RoleProtectedRoute>
            <InventoryPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="inventory/add" element={
          <RoleProtectedRoute>
            <AddInventoryPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="inventory/history" element={
          <RoleProtectedRoute>
            <StockMovementHistoryPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="inventory/:id" element={
          <RoleProtectedRoute>
            <ItemDetailsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="inventory/:id/edit" element={
          <RoleProtectedRoute>
            <EditItemPage />
          </RoleProtectedRoute>
        } />

        <Route path="suppliers" element={
          <RoleProtectedRoute>
            <SuppliersPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="suppliers/add" element={
          <RoleProtectedRoute>
            <AddSupplierPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="suppliers/:id" element={
          <RoleProtectedRoute>
            <SupplierDetailsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="suppliers/:id/edit" element={
          <RoleProtectedRoute>
            <EditSupplierPage />
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
        
        <Route path="users-roles" element={
          <RoleProtectedRoute>
            <UsersRolesPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="users-roles/:id" element={
          <RoleProtectedRoute>
            <UserDetailsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="users-roles/:id/edit" element={
          <RoleProtectedRoute>
            <EditUserPage />
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
        
        <Route path="settings/:tab" element={
          <RoleProtectedRoute>
            <SettingsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="doctor-availability" element={
          <RoleProtectedRoute>
            <DoctorAvailabilityPage />
          </RoleProtectedRoute>
        } />

        <Route path="inventory-management" element={
          <RoleProtectedRoute>
            <InventoryPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="user-administration" element={
          <RoleProtectedRoute>
            <UsersPage />
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
    <AuthProvider>
      <UserProvider>
        <UsersManagementProvider>
          <RoleProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </RoleProvider>
        </UsersManagementProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
