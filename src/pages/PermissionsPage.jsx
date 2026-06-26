import React from 'react';
import TopNavbar from '../components/TopNavbar';

function PermissionsPage() {
  const roles = [
    {
      name: "Admin",
      description: "Full access to configure, operate, and manage all hospital ERP modules.",
      modules: ["Dashboard", "Departments", "Employees", "Doctors", "Appointments", "Schedules", "Doctor Availability", "Inventory", "Suppliers", "Low Stock Alerts", "Revenue & Expenses", "Analytics", "Users & Roles", "Permissions", "Settings"]
    },
    {
      name: "HR",
      description: "Access to staff records, doctor schedules, departments, and basic settings.",
      modules: ["Dashboard", "Departments", "Employees", "Doctors", "Schedules", "Settings"]
    },
    {
      name: "Receptionist",
      description: "Access to patient appointments scheduling, doctor availability logs, and basic settings.",
      modules: ["Dashboard", "Appointments", "Doctor Availability", "Settings"]
    }
  ];

  const allModules = [
    "Dashboard", "Departments", "Employees", "Doctors", "Appointments", "Schedules", "Doctor Availability", "Inventory", "Suppliers", "Low Stock Alerts", "Revenue & Expenses", "Analytics", "Users & Roles", "Permissions", "Settings"
  ];

  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Administration</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Permissions</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="mb-4">
        <h1 className="page-title">Role Permissions & Policies</h1>
      </div>

      <div className="dashboard-card p-4">
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center mb-0" style={{ fontSize: '0.85rem' }}>
            <thead className="table-light">
              <tr>
                <th scope="col" className="text-start" style={{ fontWeight: 600, width: '250px' }}>Module / Route</th>
                {roles.map((r, i) => (
                  <th key={i} scope="col" style={{ fontWeight: 600 }}>
                    {r.name} Role
                    <div className="text-muted fw-normal" style={{ fontSize: '0.7rem' }}>{r.description}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allModules.map((module, mIdx) => (
                <tr key={mIdx}>
                  <td className="text-start fw-bold text-dark">{module}</td>
                  {roles.map((r, rIdx) => {
                    const hasAccess = r.modules.includes(module);
                    return (
                      <td key={rIdx}>
                        {hasAccess ? (
                          <span className="text-success fw-bold">
                            <i className="bi bi-check-circle-fill me-1"></i> Authorized
                          </span>
                        ) : (
                          <span className="text-danger fw-semibold">
                            <i className="bi bi-x-circle me-1"></i> Restricted
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default PermissionsPage;
