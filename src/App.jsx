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

// Placeholder & List Pages
import DashboardPage from './pages/DashboardPage';
import DepartmentsPage from './pages/DepartmentsPage';
import EmployeesPage from './pages/EmployeesPage';
import DoctorsPage from './pages/DoctorsPage';
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
import SuppliesPage from './pages/SuppliesPage';
import RevenuePage from './pages/RevenuePage';
import UsersPage from './pages/UsersPage';
import UserDetailsPage from './pages/UserDetailsPage';
import EditUserPage from './pages/EditUserPage';
import RolesPage from './pages/RolesPage';
import SettingsPage from './pages/SettingsPage';
import DoctorAvailabilityPage from './pages/DoctorAvailabilityPage';
import AddInventoryPage from './pages/AddInventoryPage';
import AccessDeniedPage from './pages/AccessDeniedPage';

function RoleProtectedRoute({ children, moduleName }) {
  const { hasPermission } = useRole();
  
  if (moduleName && !hasPermission(moduleName, 'view')) {
    return <Navigate to="/access-denied" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/access-denied" element={<AccessDeniedPage />} />
      {/* Mount Layout as the parent shell wrapper */}
      <Route path="/" element={<Layout />}>
        {/* Default route path redirects to Dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Approved Modules */}
        <Route path="dashboard" element={
          <RoleProtectedRoute moduleName="Dashboard">
            <DashboardPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="departments" element={
          <RoleProtectedRoute moduleName="Departments">
            <DepartmentsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="employees" element={
          <RoleProtectedRoute moduleName="Employees">
            <EmployeesPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="doctors" element={
          <RoleProtectedRoute moduleName="Doctors">
            <DoctorsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="appointments" element={
          <RoleProtectedRoute moduleName="Appointments">
            <AppointmentsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="appointments/details" element={
          <RoleProtectedRoute moduleName="Appointments">
            <ApptDetailsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="schedules" element={
          <RoleProtectedRoute moduleName="Appointments">
            <SchedulePage />
          </RoleProtectedRoute>
        } />
        
        <Route path="inventory" element={
          <RoleProtectedRoute moduleName="Inventory">
            <InventoryPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="inventory/add" element={
          <RoleProtectedRoute moduleName="Inventory">
            <AddInventoryPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="inventory/:id" element={
          <RoleProtectedRoute moduleName="Inventory">
            <ItemDetailsPage />
          </RoleProtectedRoute>
        } />

        <Route path="inventory/:id/edit" element={
          <RoleProtectedRoute moduleName="Inventory">
            <EditItemPage />
          </RoleProtectedRoute>
        } />

        <Route path="inventory/history" element={
          <RoleProtectedRoute moduleName="Inventory">
            <StockMovementHistoryPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="inventory/low-stock-alerts" element={
          <RoleProtectedRoute moduleName="Inventory">
            <LowStockAlertsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="supplies" element={
          <RoleProtectedRoute moduleName="Inventory">
            <SuppliesPage />
          </RoleProtectedRoute>
        } />

        <Route path="suppliers" element={
          <RoleProtectedRoute moduleName="Inventory">
            <SuppliersPage />
          </RoleProtectedRoute>
        } />

        <Route path="suppliers/add" element={
          <RoleProtectedRoute moduleName="Inventory">
            <AddSupplierPage />
          </RoleProtectedRoute>
        } />

        <Route path="suppliers/:id" element={
          <RoleProtectedRoute moduleName="Inventory">
            <SupplierDetailsPage />
          </RoleProtectedRoute>
        } />

        <Route path="suppliers/:id/edit" element={
          <RoleProtectedRoute moduleName="Inventory">
            <EditSupplierPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="revenue" element={
          <RoleProtectedRoute moduleName="Reports">
            <RevenuePage />
          </RoleProtectedRoute>
        } />
        
        <Route path="analytics" element={
          <RoleProtectedRoute moduleName="Reports">
            <PerformancePage />
          </RoleProtectedRoute>
        } />
        
        <Route path="users-roles" element={
          <RoleProtectedRoute moduleName="Settings">
            <UsersPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="users-roles/:id" element={
          <RoleProtectedRoute moduleName="Settings">
            <UserDetailsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="users-roles/:id/edit" element={
          <RoleProtectedRoute moduleName="Settings">
            <EditUserPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="roles" element={
          <RoleProtectedRoute moduleName="Settings">
            <RolesPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="settings" element={
          <RoleProtectedRoute moduleName="Settings">
            <SettingsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="settings/:tab" element={
          <RoleProtectedRoute moduleName="Settings">
            <SettingsPage />
          </RoleProtectedRoute>
        } />
        
        <Route path="doctor-availability" element={
          <RoleProtectedRoute moduleName="Doctors">
            <DoctorAvailabilityPage />
          </RoleProtectedRoute>
        } />

        {/* Legacy redirect routes */}
        <Route path="schedule" element={<Navigate to="/schedules" replace />} />
        <Route path="performance" element={<Navigate to="/analytics" replace />} />
        <Route path="appointment" element={<Navigate to="/appointments/details" replace />} />
        
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
