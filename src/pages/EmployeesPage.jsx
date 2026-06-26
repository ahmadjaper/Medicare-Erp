import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { useErpStore } from '../store/erpStore';

function EmployeesPage() {
  const navigate = useNavigate();
  const { employees, departments, addEmployee, deleteEmployee } = useErpStore();

  // Search/Filters/Sorting States
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [shiftFilter, setShiftFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Name A-Z");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals States
  const [showAddModal, setShowAddModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Add Form States
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formDept, setFormDept] = useState("");
  const [formDesignation, setFormDesignation] = useState("");
  const [formRole, setFormRole] = useState("Staff");
  const [formShift, setFormShift] = useState("Morning");
  const [formStatus, setFormStatus] = useState("Active");
  const [formAddress, setFormAddress] = useState("");
  const [formJoiningDate, setFormJoiningDate] = useState(new Date().toISOString().split('T')[0]);

  // Statistics
  const totalCount = employees.length;
  const activeCount = employees.filter(e => e.status === "Active").length;
  const leaveCount = employees.filter(e => e.status === "On Leave").length;
  const inactiveCount = employees.filter(e => e.status === "Inactive").length;

  const activePct = totalCount > 0 ? ((activeCount / totalCount) * 100).toFixed(1) : "0.0";
  const leavePct = totalCount > 0 ? ((leaveCount / totalCount) * 100).toFixed(1) : "0.0";
  const inactivePct = totalCount > 0 ? ((inactiveCount / totalCount) * 100).toFixed(1) : "0.0";

  // Available Roles
  const rolesList = ["Doctor", "Nurse", "Receptionist", "HR", "Finance", "IT", "Operations", "Pharmacist", "Lab Technician", "Staff"];
  const shiftsList = ["Morning", "Evening", "Night"];

  // Handlers
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPhone || !formDept || !formDesignation) {
      useErpStore.getState().showToast("Please fill all required fields.", "danger");
      return;
    }

    addEmployee({
      name: formName,
      email: formEmail,
      phone: formPhone,
      department: formDept,
      designation: formDesignation,
      role: formRole,
      shift: formShift,
      status: formStatus,
      address: formAddress,
      joiningDate: formJoiningDate
    });

    setShowAddModal(false);
    resetForm();
    useErpStore.getState().showToast("Employee registered successfully!", "success");
  };

  const handleDeleteConfirm = () => {
    if (employeeToDelete) {
      deleteEmployee(employeeToDelete.id);
      setEmployeeToDelete(null);
      useErpStore.getState().showToast("Employee deleted successfully!", "success");
    }
  };

  const resetForm = () => {
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormDept("");
    setFormDesignation("");
    setFormRole("Staff");
    setFormShift("Morning");
    setFormStatus("Active");
    setFormAddress("");
    setFormJoiningDate(new Date().toISOString().split('T')[0]);
  };

  // Filter & Sort Logic
  const filteredEmployees = employees
    .filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            emp.phone.includes(searchQuery) ||
                            emp.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = deptFilter === "All" || emp.department.toLowerCase() === deptFilter.toLowerCase();
      const matchesRole = roleFilter === "All" || emp.role.toLowerCase() === roleFilter.toLowerCase();
      const matchesStatus = statusFilter === "All" || emp.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesShift = shiftFilter === "All" || emp.shift.toLowerCase() === shiftFilter.toLowerCase();

      return matchesSearch && matchesDept && matchesRole && matchesStatus && matchesShift;
    })
    .sort((a, b) => {
      if (sortOption === "Name A-Z") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "Name Z-A") {
        return b.name.localeCompare(a.name);
      } else if (sortOption === "Joining Date Newest") {
        return new Date(b.joiningDate) - new Date(a.joiningDate);
      } else if (sortOption === "Joining Date Oldest") {
        return new Date(a.joiningDate) - new Date(b.joiningDate);
      }
      return 0;
    });

  // Pagination Logic
  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {/* Top Navbar Section */}
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Management</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Employees</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      {/* Header and buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="page-title mb-1">Employees</h1>
          <p className="text-muted mb-0">Manage hospital employees and their information</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary fw-bold" onClick={() => navigate('/attendance-overview')} style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="bi bi-clock-history"></i> Attendance Overview
          </button>
          <button className="btn btn-primary fw-bold" onClick={() => navigate('/employees/create')} style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="bi bi-plus-lg"></i> Add Employee
          </button>
        </div>
      </div>

      {/* KPIs Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card dashboard-card p-3 border-0 shadow-sm hover-bg-light" style={{ cursor: 'pointer' }} onClick={() => setStatusFilter("All")}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Total Employees</span>
                <div className="fs-3 fw-bold text-dark mt-1" style={{ fontWeight: 800 }}>{totalCount}</div>
              </div>
              <div className="p-2 rounded bg-primary-subtle text-primary">
                <i className="bi bi-people fs-5"></i>
              </div>
            </div>
            <div className="mt-2 text-success" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-arrow-up-short"></i> +5 this month
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card dashboard-card p-3 border-0 shadow-sm hover-bg-light" style={{ cursor: 'pointer' }} onClick={() => setStatusFilter("Active")}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Active Employees</span>
                <div className="fs-3 fw-bold text-dark mt-1" style={{ fontWeight: 800 }}>{activeCount}</div>
              </div>
              <div className="p-2 rounded bg-success-subtle text-success">
                <i className="bi bi-person-check fs-5"></i>
              </div>
            </div>
            <div className="mt-2 text-success" style={{ fontSize: '0.75rem' }}>
              {activePct}% of total
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card dashboard-card p-3 border-0 shadow-sm hover-bg-light" style={{ cursor: 'pointer' }} onClick={() => setStatusFilter("On Leave")}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>On Leave</span>
                <div className="fs-3 fw-bold text-dark mt-1" style={{ fontWeight: 800 }}>{leaveCount}</div>
              </div>
              <div className="p-2 rounded bg-warning-subtle text-warning">
                <i className="bi bi-calendar-x fs-5"></i>
              </div>
            </div>
            <div className="mt-2 text-muted" style={{ fontSize: '0.75rem' }}>
              {leavePct}% of total
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card dashboard-card p-3 border-0 shadow-sm hover-bg-light" style={{ cursor: 'pointer' }} onClick={() => setStatusFilter("Inactive")}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Inactive Employees</span>
                <div className="fs-3 fw-bold text-dark mt-1" style={{ fontWeight: 800 }}>{inactiveCount}</div>
              </div>
              <div className="p-2 rounded bg-danger-subtle text-danger">
                <i className="bi bi-person-x fs-5"></i>
              </div>
            </div>
            <div className="mt-2 text-muted" style={{ fontSize: '0.75rem' }}>
              {inactivePct}% of total
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card dashboard-card p-4">
        {/* Table Toolbar */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div className="search-wrapper position-relative text-start">
            <i className="bi bi-search"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{ width: '260px', paddingLeft: '2rem' }}
            />
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Department Filter */}
            <select className="form-select form-select-sm" value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }} style={{ width: '130px', height: '32px' }}>
              <option value="All">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>

            {/* Role Filter */}
            <select className="form-select form-select-sm" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }} style={{ width: '110px', height: '32px' }}>
              <option value="All">All Roles</option>
              {rolesList.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select className="form-select form-select-sm" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} style={{ width: '110px', height: '32px' }}>
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Shift Filter */}
            <select className="form-select form-select-sm" value={shiftFilter} onChange={(e) => { setShiftFilter(e.target.value); setCurrentPage(1); }} style={{ width: '100px', height: '32px' }}>
              <option value="All">All Shifts</option>
              {shiftsList.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>

            {/* Sorting */}
            <select className="form-select form-select-sm" value={sortOption} onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }} style={{ width: '140px', height: '32px' }}>
              <option value="Name A-Z">Sort: Name A-Z</option>
              <option value="Name Z-A">Sort: Name Z-A</option>
              <option value="Joining Date Newest">Sort: Date Newest</option>
              <option value="Joining Date Oldest">Sort: Date Oldest</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.88rem' }}>
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ fontWeight: 600 }}>Employee</th>
                <th scope="col" style={{ fontWeight: 600 }}>Employee ID</th>
                <th scope="col" style={{ fontWeight: 600 }}>Department</th>
                <th scope="col" style={{ fontWeight: 600 }}>Designation</th>
                <th scope="col" style={{ fontWeight: 600 }}>Role</th>
                <th scope="col" style={{ fontWeight: 600 }}>Status</th>
                <th scope="col" className="text-end" style={{ fontWeight: 600, width: '160px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold border border-primary-subtle" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                        {emp.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div 
                        className="fw-semibold text-primary" 
                        style={{ cursor: 'pointer', textDecoration: 'underline' }} 
                        onClick={() => navigate(`/employees/${emp.id}`)}
                      >
                        {emp.name}
                      </div>
                    </div>
                  </td>
                  <td className="fw-bold text-muted">{emp.id}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.role}</td>
                  <td>
                    <span className={`badge border-0 rounded px-2 py-1 fw-bold ${emp.status === 'Active' ? 'bg-success-subtle text-success' : emp.status === 'On Leave' ? 'bg-warning-subtle text-warning' : 'bg-danger-subtle text-danger'}`} style={{ fontSize: '0.7rem' }}>
                      <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
                      {emp.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-1">
                      <button className="btn btn-sm btn-outline-primary px-2 py-1" style={{ fontSize: '0.72rem' }} onClick={() => navigate(`/employees/${emp.id}`)}>
                        👁 View
                      </button>
                      <button className="btn btn-sm btn-outline-danger px-2 py-1" style={{ fontSize: '0.72rem' }} onClick={() => setEmployeeToDelete(emp)}>
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedEmployees.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No employees found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top flex-wrap gap-2">
            <div className="text-muted" style={{ fontSize: '0.8rem' }}>
              Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, totalItems)} of {totalItems} employees
            </div>
            
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-1.5" style={{ fontSize: '0.8rem' }}>
                <span className="text-muted">Rows per page:</span>
                <select 
                  className="form-select form-select-sm" 
                  value={rowsPerPage} 
                  onChange={(e) => { setRowsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
                  style={{ width: '70px', height: '28px', padding: '2px 8px' }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <nav aria-label="Page navigation" className="my-auto">
                <ul className="pagination pagination-sm mb-0 gap-1">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link border rounded" onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </button>
                  </li>
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    // Simple page rendering rules to fit width
                    if (idx + 1 === 1 || idx + 1 === totalPages || Math.abs(idx + 1 - currentPage) <= 1) {
                      return (
                        <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                          <button className="page-link border rounded px-3" onClick={() => handlePageChange(idx + 1)}>
                            {idx + 1}
                          </button>
                        </li>
                      );
                    } else if (idx + 1 === 2 || idx + 1 === totalPages - 1) {
                      return <li key={idx} className="page-item disabled"><span className="page-link border rounded">...</span></li>;
                    }
                    return null;
                  })}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link border rounded" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Employee */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 1050 }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                <h5 className="modal-title fw-bold"><i className="bi bi-person-plus-fill me-2"></i>Register New Employee</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Full Name *</label>
                    <input type="text" className="form-control" placeholder="e.g. Johnathan Doe" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                  </div>
                  
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Email Address *</label>
                      <input type="email" className="form-control" placeholder="name@medicore.com" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Phone Number *</label>
                      <input type="text" className="form-control" placeholder="+1 (555) 000-0000" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} required />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Department *</label>
                      <select className="form-select" value={formDept} onChange={(e) => setFormDept(e.target.value)} required>
                        <option value="">-- Choose Dept --</option>
                        {departments.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Designation *</label>
                      <input type="text" className="form-control" placeholder="e.g. Staff Nurse, Lead Accountant" value={formDesignation} onChange={(e) => setFormDesignation(e.target.value)} required />
                    </div>
                  </div>
                  
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">System Role *</label>
                      <select className="form-select" value={formRole} onChange={(e) => setFormRole(e.target.value)} required>
                        {rolesList.map((r, i) => (
                          <option key={i} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Status *</label>
                      <select className="form-select" value={formStatus} onChange={(e) => setFormStatus(e.target.value)} required>
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Shift Schedule *</label>
                      <select className="form-select" value={formShift} onChange={(e) => setFormShift(e.target.value)} required>
                        {shiftsList.map((s, i) => (
                          <option key={i} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Joining Date *</label>
                      <input type="date" className="form-control" value={formJoiningDate} onChange={(e) => setFormJoiningDate(e.target.value)} required />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Residential Address</label>
                    <textarea className="form-control" rows="2" placeholder="Street details, City" value={formAddress} onChange={(e) => setFormAddress(e.target.value)}></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '8px' }} onClick={() => { setShowAddModal(false); resetForm(); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-bold px-4 py-2" style={{ borderRadius: '8px' }}>Register Employee</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {employeeToDelete && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 1050 }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header bg-danger text-white border-0 py-3" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                <h5 className="modal-title fw-bold"><i className="bi bi-exclamation-triangle-fill me-2"></i>Delete Employee</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setEmployeeToDelete(null)} aria-label="Close"></button>
              </div>
              <div className="modal-body p-4 text-start">
                <p className="text-dark mb-3" style={{ fontSize: '0.95rem' }}>
                  Are you sure you want to delete this employee?
                </p>
                <div className="p-3 bg-light rounded-3 mb-3 border">
                  <div className="fw-bold text-dark">{employeeToDelete.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>ID: {employeeToDelete.id} | Department: {employeeToDelete.department}</div>
                </div>
                <p className="text-danger fw-bold mb-0" style={{ fontSize: '0.9rem' }}>This action cannot be undone.</p>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button type="button" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '8px' }} onClick={() => setEmployeeToDelete(null)}>Cancel</button>
                <button type="button" className="btn btn-danger fw-bold px-4 py-2" style={{ borderRadius: '8px' }} onClick={handleDeleteConfirm}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmployeesPage;
