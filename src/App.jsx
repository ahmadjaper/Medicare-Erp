import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import PatientsPage from './pages/PatientsPage';
import InventoryPage from './pages/InventoryPage';
import SuppliersPage from './pages/SuppliersPage';
import RevenuePage from './pages/RevenuePage';
import UsersRolesPage from './pages/UsersRolesPage';
import DoctorDetailsPage from './pages/DoctorDetailsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mount Layout as the parent shell wrapper */}
        <Route path="/" element={<Layout />}>
          {/* Default route path redirects to Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Approved Modules */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          
          {/* Doctors Section */}
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="doctors/create" element={<CreateDoctorPage />} />
          <Route path="doctors/details/:id" element={<DoctorDetailsPage />} />
          <Route path="doctors/:id/edit" element={<CreateDoctorPage />} />
          <Route path="doctors/:id/performance" element={<PerformancePage />} />
          <Route path="doctors/:id/schedule" element={<SchedulePage />} />
          
          <Route path="schedules" element={<SchedulePage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="appointments/create" element={<CreateAppointmentPage />} />
          <Route path="appointments/details" element={<Navigate to="/appointments/details/APT-1001" replace />} />
          <Route path="appointments/details/:id" element={<ApptDetailsPage />} />
          <Route path="patients" element={<PatientsPage />} />
          
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="revenue" element={<RevenuePage />} />
          <Route path="analytics" element={<PerformancePage />} />
          <Route path="users-roles" element={<UsersRolesPage />} />

          {/* Legacy redirect routes */}
          <Route path="schedule" element={<Navigate to="/schedules" replace />} />
          <Route path="performance" element={<Navigate to="/analytics" replace />} />
          <Route path="appointment" element={<Navigate to="/appointments/details" replace />} />
          
          {/* Fallback catch-all redirects back to Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
