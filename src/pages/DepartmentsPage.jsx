import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { useErpStore } from '../store/erpStore';
import { getScheduleSlots } from '../services/api';
import doctorAvatar from '../assets/img/doctor-avatar.png';

function DepartmentsPage() {
  const navigate = useNavigate();
  const {
    departments,
    doctors,
    subDepartments,
    appointments,
    addDepartment,
    updateDepartment,
    deleteDepartment
  } = useErpStore();

  // Search/Filter/Sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Name A-Z");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add/Edit Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [targetDeptId, setTargetDeptId] = useState(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formHeadName, setFormHeadName] = useState("");
  const [formSubDepts, setFormSubDepts] = useState("2");
  const [formStatus, setFormStatus] = useState("Active");
  const [formDesc, setFormDesc] = useState("");

  // View Modal state
  const [viewingDept, setViewingDept] = useState(null);

  // Deletion Modal states
  const [deptToDelete, setDeptToDelete] = useState(null);
  const [dependencyWarning, setDependencyWarning] = useState(null);
  const [scheduleSlots, setScheduleSlots] = useState([]);

  // Fetch schedule slots on mount
  useEffect(() => {
    getScheduleSlots().then(slots => setScheduleSlots(slots || []));
  }, []);

  // Submit Handlers
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (departments.some(d => d.code.toUpperCase() === formCode.toUpperCase())) {
      useErpStore.getState().addAlert({
        title: "Duplicate Code",
        type: "system",
        desc: "A department with this code already exists.",
        category: "danger"
      });
      return;
    }
    const doctorObj = doctors.find(d => d.name === formHeadName) || {};
    addDepartment({
      name: formName,
      code: formCode,
      headName: formHeadName,
      headTitle: doctorObj.specialty || "Department Head",
      subDeptsCount: parseInt(formSubDepts),
      status: formStatus,
      description: formDesc || "Hospital medical services"
    });
    setShowAddModal(false);
    resetForm();
    useErpStore.getState().addAlert({
      title: "Department Created",
      type: "system",
      desc: "Department created successfully!",
      category: "success"
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const doctorObj = doctors.find(d => d.name === formHeadName) || {};
    updateDepartment(targetDeptId, {
      name: formName,
      code: formCode,
      headName: formHeadName,
      headTitle: doctorObj.specialty || "Department Head",
      subDeptsCount: parseInt(formSubDepts),
      status: formStatus,
      description: formDesc
    });
    setShowEditModal(false);
    resetForm();
    useErpStore.getState().addAlert({
      title: "Department Updated",
      type: "system",
      desc: "Department updated successfully!",
      category: "success"
    });
  };

  const handleDeleteClick = (id, name) => {
    const dept = departments.find(d => d.id === id);
    if (!dept) return;

    const deptName = (dept.name || "").toLowerCase();
    const deptCode = (dept.code || "").toLowerCase();

    // 1. Linked Doctors
    const linkedDoctors = doctors.filter(doc => {
      const specialty = (doc.specialty || "").toLowerCase();
      return specialty.includes(deptName) || 
             specialty.includes(deptCode) || 
             doc.id === dept.headDoctorId;
    });

    // 2. Linked Sub-departments
    const linkedSubDepts = (subDepartments || []).filter(sub => sub.departmentId === id);

    // 3. Linked Appointments
    const doctorIds = linkedDoctors.map(d => d.id);
    const doctorNames = linkedDoctors.map(d => d.name);
    const linkedAppointments = appointments.filter(appt => 
      doctorIds.includes(appt.doctorId) || 
      doctorNames.includes(appt.doctorName)
    );

    // 4. Linked Schedules
    const linkedSchedules = scheduleSlots.filter(slot => 
      doctorNames.includes(slot.doctorName)
    );

    setDeptToDelete({
      ...dept,
      warnings: {
        doctorsCount: linkedDoctors.length,
        subDeptsCount: linkedSubDepts.length,
        apptsCount: linkedAppointments.length,
        schedulesCount: linkedSchedules.length
      }
    });
  };

  const handleConfirmDelete = () => {
    if (deptToDelete) {
      deleteDepartment(deptToDelete.id);
      setDeptToDelete(null);
    }
  };

  const openEditModal = (dept) => {
    setTargetDeptId(dept.id);
    setFormName(dept.name);
    setFormCode(dept.code);
    setFormHeadName(dept.headName);
    setFormSubDepts(dept.subDeptsCount.toString());
    setFormStatus(dept.status);
    setFormDesc(dept.description);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormName("");
    setFormCode("");
    setFormHeadName("");
    setFormSubDepts("2");
    setFormStatus("Active");
    setFormDesc("");
    setTargetDeptId(null);
  };

  // KPIs Calculations
  const totalDepts = departments.length;
  const activeDepts = departments.filter(d => d.status === "Active").length;
  const totalSubDepts = departments.reduce((acc, curr) => acc + curr.subDeptsCount, 0);
  
  // Department Heads count is the unique count of heads assigned
  const uniqueHeads = new Set(departments.map(d => d.headName).filter(Boolean)).size;

  // Filter & Sort Logic
  const filteredDepts = departments
    .filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.code.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter === "Active" || statusFilter === "Inactive") {
        matchesStatus = d.status === statusFilter;
      } else if (statusFilter === "HasSubDepts") {
        matchesStatus = d.subDeptsCount > 0;
      } else if (statusFilter === "HasHead") {
        matchesStatus = Boolean(d.headName && d.headName !== "Unassigned");
      }
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOption === "Name A-Z") {
        return a.name.localeCompare(b.name);
      } else if (sortOption === "Name Z-A") {
        return b.name.localeCompare(a.name);
      } else if (sortOption === "Most Employees") {
        return b.employeesCount - a.employeesCount;
      }
      return 0;
    });

  // Pagination calculations
  const totalItems = filteredDepts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDepts = filteredDepts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {/* Top Header Section */}
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Management</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Departments</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      {/* Title & Add Actions */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="page-title mb-1">Departments</h1>
          <p className="text-muted mb-0">Manage hospital departments and their information</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary fw-bold" onClick={() => navigate('/departments/create')} style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <i className="bi bi-plus-lg"></i> Add Department
          </button>
        </div>
      </div>

      {/* KPI Overview Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card dashboard-card p-3 border-0 shadow-sm hover-bg-light" style={{ cursor: 'pointer' }} onClick={() => setStatusFilter("All")}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Total Departments</span>
                <div className="fs-3 fw-bold text-dark mt-1" style={{ fontWeight: 800 }}>{totalDepts}</div>
              </div>
              <div className="p-2 rounded bg-primary-subtle text-primary">
                <i className="bi bi-building fs-5"></i>
              </div>
            </div>
            <div className="mt-2 text-success" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-arrow-up-short"></i> +1 this month
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card dashboard-card p-3 border-0 shadow-sm hover-bg-light" style={{ cursor: 'pointer' }} onClick={() => setStatusFilter("Active")}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Active Departments</span>
                <div className="fs-3 fw-bold text-dark mt-1" style={{ fontWeight: 800 }}>{activeDepts}</div>
              </div>
              <div className="p-2 rounded bg-success-subtle text-success">
                <i className="bi bi-activity fs-5"></i>
              </div>
            </div>
            <div className="mt-2 text-muted" style={{ fontSize: '0.75rem' }}>
              {((activeDepts / totalDepts) * 100 || 0).toFixed(1)}% of total
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className={`card dashboard-card p-3 border-0 shadow-sm hover-bg-light ${statusFilter === 'HasSubDepts' ? 'border-info border-2' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setStatusFilter("HasSubDepts")}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Total Sub Departments</span>
                <div className="fs-3 fw-bold text-dark mt-1" style={{ fontWeight: 800 }}>{totalSubDepts}</div>
              </div>
              <div className="p-2 rounded bg-info-subtle text-info">
                <i className="bi bi-diagram-3 fs-5"></i>
              </div>
            </div>
            <div className="mt-2 text-success" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-arrow-up-short"></i> +3 this month
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className={`card dashboard-card p-3 border-0 shadow-sm hover-bg-light ${statusFilter === 'HasHead' ? 'border-warning border-2' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setStatusFilter("HasHead")}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Department Heads</span>
                <div className="fs-3 fw-bold text-dark mt-1" style={{ fontWeight: 800 }}>{uniqueHeads}</div>
              </div>
              <div className="p-2 rounded bg-warning-subtle text-warning">
                <i className="bi bi-people fs-5"></i>
              </div>
            </div>
            <div className="mt-2 text-muted" style={{ fontSize: '0.75rem' }}>
              Assigned heads
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card dashboard-card p-4">
        {/* Table Filters Toolbar */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <h2 className="fs-6 fw-bold text-uppercase text-muted mb-0" style={{ letterSpacing: '0.05em' }}>Departments List</h2>
          
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="search-wrapper position-relative text-start">
              <i className="bi bi-search"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                style={{ width: '220px', paddingLeft: '2rem' }}
              />
            </div>

            {/* Filter Dropdown */}
            <div className="dropdown">
              <button className="btn btn-sm btn-outline-secondary dropdown-toggle px-3" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ height: '32px' }}>
                <i className="bi bi-funnel"></i> Filter: {statusFilter === "HasSubDepts" ? "Has Sub-Departments" : statusFilter === "HasHead" ? "Has Assigned Head" : statusFilter}
              </button>
              <ul className="dropdown-menu border-0 shadow-sm" style={{ borderRadius: '8px' }}>
                {["All", "Active", "Inactive", "HasSubDepts", "HasHead"].map((st, i) => (
                  <li key={i}>
                    <a 
                      className={`dropdown-item ${statusFilter === st ? 'active bg-primary' : ''}`} 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setStatusFilter(st); setCurrentPage(1); }}
                    >
                      {st === "HasSubDepts" ? "Has Sub-Departments" : st === "HasHead" ? "Has Assigned Head" : st}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sort Dropdown */}
            <div className="dropdown">
              <button className="btn btn-sm btn-outline-secondary dropdown-toggle px-3" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ height: '32px' }}>
                <i className="bi bi-sort-alpha-down"></i> Sort: {sortOption}
              </button>
              <ul className="dropdown-menu border-0 shadow-sm" style={{ borderRadius: '8px' }}>
                {["Name A-Z", "Name Z-A", "Most Employees"].map((so, i) => (
                  <li key={i}><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setSortOption(so); setCurrentPage(1); }}>{so}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.88rem' }}>
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ fontWeight: 600 }}>Department Name</th>
                <th scope="col" style={{ fontWeight: 600 }}>Code</th>
                <th scope="col" style={{ fontWeight: 600 }}>Head of Department</th>
                <th scope="col" style={{ fontWeight: 600 }}>Sub Departments</th>
                <th scope="col" style={{ fontWeight: 600 }}>Employees</th>
                <th scope="col" style={{ fontWeight: 600 }}>Status</th>
                <th scope="col" className="text-end" style={{ fontWeight: 600, width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDepts.map((dept) => (
                <tr key={dept.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3" 
                         style={{ cursor: 'pointer' }} 
                         onClick={() => navigate(`/departments/${dept.id}`)}
                         title={`Go to ${dept.name} Dashboard`}>
                      <div className="p-2 rounded bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <i className={`bi bi-${dept.icon || 'building'} fs-5`}></i>
                      </div>
                      <div>
                        <div className="fw-bold text-primary" style={{ textDecoration: 'none' }}>
                          <span className="dept-name-link" style={{ borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.borderBottom = '1px solid #0d6efd'}
                                onMouseLeave={(e) => e.currentTarget.style.borderBottom = '1px solid transparent'}>
                            {dept.name}
                          </span>
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{dept.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="fw-bold text-muted">{dept.code}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={doctorAvatar} className="rounded-circle border" alt="Head avatar" style={{ width: '30px', height: '30px', objectFit: 'cover' }} />
                      <div>
                        <div className="fw-semibold text-dark">{dept.headName}</div>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{dept.headTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-center">{dept.subDeptsCount}</td>
                  <td className="text-center">{dept.employeesCount || 0}</td>
                  <td>
                    <span className={`badge border-0 rounded px-2 py-1 fw-bold ${dept.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`} style={{ fontSize: '0.7rem' }}>
                      <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
                      {dept.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-1">
                      <button className="btn btn-sm btn-outline-primary px-2 py-1" style={{ fontSize: '0.72rem' }} onClick={() => navigate(`/departments/${dept.id}`)}>
                        <i className="bi bi-box-arrow-up-right"></i> View
                      </button>
                      <button className="btn btn-sm btn-outline-secondary px-2 py-1" style={{ fontSize: '0.72rem' }} onClick={() => navigate(`/departments/${dept.id}/edit`)}>
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger px-2 py-1" style={{ fontSize: '0.72rem' }} onClick={() => handleDeleteClick(dept.id, dept.name)}>
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedDepts.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No departments found matching your criteria.
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} departments
            </div>
            
            <nav aria-label="Page navigation" className="my-auto">
              <ul className="pagination pagination-sm mb-0 gap-1">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link border rounded" onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </button>
                </li>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
                    <button className="page-link border rounded px-3" onClick={() => handlePageChange(idx + 1)}>
                      {idx + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link border rounded" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Modal: Add Department */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 1050 }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                <h5 className="modal-title fw-bold"><i className="bi bi-building-add me-2"></i>Add Hospital Department</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Department Name</label>
                    <input type="text" className="form-control" placeholder="e.g. Pulmonology" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                  </div>
                  
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Department Code</label>
                      <input type="text" className="form-control" placeholder="e.g. PULM" value={formCode} onChange={(e) => setFormCode(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Status</label>
                      <select className="form-select" value={formStatus} onChange={(e) => setFormStatus(e.target.value)} required>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Department Head</label>
                      <select className="form-select" value={formHeadName} onChange={(e) => setFormHeadName(e.target.value)} required>
                        <option value="">-- Choose Head Doctor --</option>
                        {doctors.map(doc => (
                          <option key={doc.id} value={doc.name}>{doc.name} ({doc.specialty})</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Sub Departments count</label>
                      <input type="number" className="form-control" placeholder="e.g. 2" value={formSubDepts} onChange={(e) => setFormSubDepts(e.target.value)} required />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Description / Specialty focus</label>
                    <input type="text" className="form-control" placeholder="Brief description of medical specialty" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} required />
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '8px' }} onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-bold px-4 py-2" style={{ borderRadius: '8px' }}>Create Department</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Department */}
      {showEditModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 1050 }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                <h5 className="modal-title fw-bold"><i className="bi bi-building-gear me-2"></i>Modify Department Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => { setShowEditModal(false); resetForm(); }} aria-label="Close"></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Department Name</label>
                    <input type="text" className="form-control" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                  </div>
                  
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Department Code</label>
                      <input type="text" className="form-control" value={formCode} onChange={(e) => setFormCode(e.target.value)} disabled />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Status</label>
                      <select className="form-select" value={formStatus} onChange={(e) => setFormStatus(e.target.value)} required>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Department Head</label>
                      <select className="form-select" value={formHeadName} onChange={(e) => setFormHeadName(e.target.value)} required>
                        <option value="">-- Choose Head Doctor --</option>
                        {doctors.map(doc => (
                          <option key={doc.id} value={doc.name}>{doc.name} ({doc.specialty})</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Sub Departments count</label>
                      <input type="number" className="form-control" value={formSubDepts} onChange={(e) => setFormSubDepts(e.target.value)} required />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Description / Specialty focus</label>
                    <input type="text" className="form-control" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} required />
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '8px' }} onClick={() => { setShowEditModal(false); resetForm(); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-bold px-4 py-2" style={{ borderRadius: '8px' }}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Department Overlay Details */}
      {viewingDept && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 1050 }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header bg-light border-0 py-3" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                <h5 className="modal-title fw-bold text-dark"><i className="bi bi-info-circle-fill text-primary me-2"></i>Department Overview</h5>
                <button type="button" className="btn-close" onClick={() => setViewingDept(null)} aria-label="Close"></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="p-3 rounded bg-primary-subtle text-primary d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                    <i className={`bi bi-${viewingDept.icon || 'building'} fs-3`}></i>
                  </div>
                  <div>
                    <h3 className="fw-bold mb-1 text-dark">{viewingDept.name} ({viewingDept.code})</h3>
                    <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{viewingDept.description}</p>
                  </div>
                </div>

                <div className="p-3 bg-light rounded-3 mb-3" style={{ fontSize: '0.9rem' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Head of Department:</span>
                    <span className="fw-bold text-dark">{viewingDept.headName} ({viewingDept.headTitle})</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Sub Departments count:</span>
                    <span className="fw-bold text-dark">{viewingDept.subDeptsCount}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Status:</span>
                    <span className={`fw-bold ${viewingDept.status === 'Active' ? 'text-success' : 'text-danger'}`}>{viewingDept.status}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button type="button" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '8px' }} onClick={() => setViewingDept(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deptToDelete && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 1050 }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header bg-danger text-white border-0 py-3" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                <h5 className="modal-title fw-bold"><i className="bi bi-exclamation-triangle-fill me-2"></i>Delete Department</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setDeptToDelete(null)} aria-label="Close"></button>
              </div>
              <div className="modal-body p-4 text-start">
                <p className="text-dark mb-3" style={{ fontSize: '0.95rem' }}>
                  Are you sure you want to delete the department <strong>{deptToDelete.name}</strong>?
                </p>
                
                {deptToDelete.warnings && (deptToDelete.warnings.doctorsCount > 0 || deptToDelete.warnings.subDeptsCount > 0 || deptToDelete.warnings.apptsCount > 0 || deptToDelete.warnings.schedulesCount > 0) && (
                  <div className="p-3 bg-warning-subtle rounded-3 mb-3 border border-warning" style={{ fontSize: '0.9rem' }}>
                    <div className="fw-bold text-dark mb-2"><i className="bi bi-exclamation-circle-fill text-warning me-2"></i>Warning: Active Dependencies</div>
                    {deptToDelete.warnings.doctorsCount > 0 && <div className="text-muted"><i className="bi bi-people me-2"></i>Linked Doctors: <strong>{deptToDelete.warnings.doctorsCount}</strong></div>}
                    {deptToDelete.warnings.subDeptsCount > 0 && <div className="text-muted"><i className="bi bi-building me-2"></i>Sub-Departments: <strong>{deptToDelete.warnings.subDeptsCount}</strong></div>}
                    {deptToDelete.warnings.apptsCount > 0 && <div className="text-muted"><i className="bi bi-calendar-event me-2"></i>Appointments: <strong>{deptToDelete.warnings.apptsCount}</strong></div>}
                    {deptToDelete.warnings.schedulesCount > 0 && <div className="text-muted"><i className="bi bi-calendar3 me-2"></i>Schedules: <strong>{deptToDelete.warnings.schedulesCount}</strong></div>}
                  </div>
                )}
                <p className="text-danger fw-bold mb-0" style={{ fontSize: '0.9rem' }}>This action cannot be undone.</p>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button type="button" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '8px' }} onClick={() => setDeptToDelete(null)}>Cancel</button>
                <button type="button" className="btn btn-danger fw-bold px-4 py-2" style={{ borderRadius: '8px' }} onClick={handleConfirmDelete}>Force Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DepartmentsPage;
