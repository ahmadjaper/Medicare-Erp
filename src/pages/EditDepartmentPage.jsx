import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { useErpStore } from '../store/erpStore';
import { useRole } from '../context/RoleContext';

function EditDepartmentPage() {
  const { id } = useParams(); // Department Code (ID) from URL path
  const navigate = useNavigate();
  const { currentRole } = useRole();

  const {
    departments,
    doctors,
    subDepartments,
    updateDepartment,
    addSubDepartment,
    updateSubDepartment,
    deleteSubDepartment
  } = useErpStore();

  // Find target department
  const deptData = departments.find(d => d.id === id);

  // Form states
  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [description, setDescription] = useState("");
  const [headDoctorId, setHeadDoctorId] = useState("");
  const [status, setStatus] = useState("Active");

  // Sub-departments modal states
  const [showSubDeptModal, setShowSubDeptModal] = useState(false);
  const [editingSubDept, setEditingSubDept] = useState(null); // if null, we are adding. if object, editing.
  const [subDeptName, setSubDeptName] = useState("");
  const [subDeptCode, setSubDeptCode] = useState("");

  // Search filter for Doctor dropdown search
  const [searchDoctorQuery, setSearchDoctorQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Error States
  const [errors, setErrors] = useState({});
  const [subErrors, setSubErrors] = useState({});

  // Delete sub-department confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subDeptToDelete, setSubDeptToDelete] = useState(null);

  // Load department data into form states on mount or change
  useEffect(() => {
    if (deptData) {
      setDeptName(deptData.name);
      setDeptCode(deptData.code);
      setDescription(deptData.description || "");
      setHeadDoctorId(deptData.headDoctorId || "");
      setStatus(deptData.status || "Active");
    }
  }, [deptData]);

  // If department not found
  if (!deptData) {
    return (
      <div className="p-4 text-center text-danger fw-bold">
        Error: Department record not found.
      </div>
    );
  }

  // Doctors list matches
  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchDoctorQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchDoctorQuery.toLowerCase())
  );

  const selectedDoctorObj = doctors.find(d => d.id === headDoctorId);
  const doctorSelectLabel = selectedDoctorObj 
    ? `${selectedDoctorObj.name} (${selectedDoctorObj.specialty})`
    : "Select a doctor...";

  // Load only sub-departments belonging to this department
  const departmentSubs = (subDepartments || []).filter(sub => sub.departmentId === id);

  // Auto-generate sub-department code suffix helper
  const handleSubDeptNameChange = (val) => {
    setSubDeptName(val);
    setSubErrors(prev => ({ ...prev, name: null }));
    
    // Auto-generate helper code
    const cleanName = val.replace(/[^a-zA-Z ]/g, "");
    const words = cleanName.trim().split(/\s+/);
    let suffix = "";
    if (words.length >= 2) {
      suffix = words.map(w => w[0]).join("").toUpperCase();
    } else if (words.length === 1 && words[0].length > 0) {
      suffix = words[0].slice(0, 3).toUpperCase();
    } else {
      suffix = "";
    }
    setSubDeptCode(suffix ? `${deptCode}-${suffix}` : "");
  };

  // Open Sub-department modal for adding
  const handleOpenAddSubDept = () => {
    setEditingSubDept(null);
    setSubDeptName("");
    setSubDeptCode("");
    setSubErrors({});
    setShowSubDeptModal(true);
  };

  // Open Sub-department modal for editing
  const handleOpenEditSubDept = (sub) => {
    setEditingSubDept(sub);
    setSubDeptName(sub.name);
    setSubDeptCode(sub.code);
    setSubErrors({});
    setShowSubDeptModal(true);
  };

  // Submit Sub-department save (Create / Update)
  const handleSubDeptSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const trimmedName = subDeptName.trim();
    const trimmedCode = subDeptCode.trim().toUpperCase();

    if (!trimmedName) {
      newErrors.name = "Sub-department name is required.";
    }

    if (!trimmedCode) {
      newErrors.code = "Sub-department code is required.";
    }

    // Check for duplicates within this department
    const isDuplicateName = departmentSubs.some(sub => 
      sub.name.toLowerCase() === trimmedName.toLowerCase() && 
      (!editingSubDept || sub.id !== editingSubDept.id)
    );
    if (isDuplicateName) {
      newErrors.name = "A sub-department with this name already exists in this department.";
    }

    const isDuplicateCode = (subDepartments || []).some(sub => 
      sub.code.toUpperCase() === trimmedCode && 
      (!editingSubDept || sub.id !== editingSubDept.id)
    );
    if (isDuplicateCode) {
      newErrors.code = "This sub-department code already exists in the system.";
    }

    if (Object.keys(newErrors).length > 0) {
      setSubErrors(newErrors);
      return;
    }

    if (editingSubDept) {
      // Edit mode
      updateSubDepartment(editingSubDept.id, trimmedName, trimmedCode);
    } else {
      // Add mode
      addSubDepartment(id, trimmedName, trimmedCode);
    }

    setShowSubDeptModal(false);
  };

  // Delete Sub-department handler
  const handleDeleteSubDept = (sub) => {
    setSubDeptToDelete(sub);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSubDept = () => {
    if (subDeptToDelete) {
      deleteSubDepartment(subDeptToDelete.id);
      setShowDeleteConfirm(false);
      setSubDeptToDelete(null);
    }
  };

  // Save Department Changes Submit
  const handleSaveDepartment = (e) => {
    e.preventDefault();
    const newErrors = {};

    const trimmedName = deptName.trim();
    const trimmedCode = deptCode.trim().toUpperCase();

    if (!trimmedName) {
      newErrors.name = "Department name is required.";
    }

    if (!trimmedCode) {
      newErrors.code = "Department code is required.";
    } else {
      // Check if duplicate code exists on another department
      const isDuplicate = departments.some(dept => dept.id !== id && dept.code.toUpperCase() === trimmedCode);
      if (isDuplicate) {
        newErrors.code = "Department code already exists.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const assignedDoctor = doctors.find(d => d.id === headDoctorId);

    // Call update department action
    updateDepartment(id, {
      name: trimmedName,
      code: trimmedCode,
      description: description.trim(),
      headDoctorId: headDoctorId || null,
      headName: assignedDoctor ? assignedDoctor.name : "Unassigned",
      headTitle: assignedDoctor ? assignedDoctor.specialty : "Department Head",
      status: status
    });

    // Add system notification instead of browser alert
    useErpStore.getState().addAlert({
      title: "Department Updated",
      type: "system",
      desc: `Department ${trimmedName} updated successfully.`,
      category: "success"
    });
    
    navigate("/departments");
  };

  return (
    <>
      <style>{`
        .edit-dept-container {
          font-family: 'Inter', sans-serif;
          background-color: #f8f9fa;
          color: #0f172a;
        }
        .edit-dept-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 1.75rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          margin-bottom: 1.5rem;
        }
        .form-section-header {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .form-section-divider {
          border: 0;
          border-top: 1px solid #e2e8f0;
          margin-top: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .form-label-req {
          font-size: 0.8rem;
          font-weight: 700;
          color: #475569;
          margin-bottom: 0.35rem;
          display: block;
        }
        .form-input-box {
          width: 100%;
          height: 2.5rem;
          padding: 0 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #0f172a;
          outline: none;
          background-color: #ffffff;
          transition: border-color 0.2s;
        }
        .form-input-box:focus {
          border-color: #0963e2;
        }
        .form-input-box.is-invalid {
          border-color: #ef4444;
          background-color: #fef2f2;
        }
        .form-textarea-box {
          width: 100%;
          padding: 0.625rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #0f172a;
          outline: none;
          background-color: #ffffff;
          resize: vertical;
          min-height: 5rem;
          transition: border-color 0.2s;
        }
        .form-textarea-box:focus {
          border-color: #0963e2;
        }
        .form-error-msg {
          font-size: 0.75rem;
          color: #ef4444;
          margin-top: 4px;
          display: block;
        }
        .input-subtext {
          font-size: 0.72rem;
          color: #64748b;
          margin-top: 4px;
        }

        /* Searchable Doctor Dropdown */
        .doctor-dropdown-wrapper {
          position: relative;
        }
        .doctor-dropdown-select-trigger {
          width: 100%;
          height: 2.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          background-color: #ffffff;
          padding: 0 0.75rem;
          font-size: 0.875rem;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }
        .doctor-dropdown-panel {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 4px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
          z-index: 100;
          padding: 0.5rem;
        }
        .doctor-dropdown-search-input {
          width: 100%;
          height: 2rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.25rem;
          padding: 0 0.5rem;
          font-size: 0.8rem;
          outline: none;
          margin-bottom: 0.5rem;
        }
        .doctor-dropdown-list {
          max-height: 180px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .doctor-dropdown-item {
          padding: 0.5rem;
          font-size: 0.8rem;
          color: #334155;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .doctor-dropdown-item:hover {
          background-color: #f1f5f9;
        }
        .doctor-dropdown-item.selected {
          background-color: #eff6ff;
          color: #0963e2;
          font-weight: 600;
        }

        /* Status Radios */
        .status-radios-flex {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .status-radio-option {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
        }
        .status-radio-option input {
          cursor: pointer;
        }

        /* Sub-departments List Card */
        .subdept-card-container {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          overflow: hidden;
        }
        .subdept-card-header {
          padding: 1.25rem 1.75rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .subdept-card-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
        .subdept-card-subtitle {
          font-size: 0.78rem;
          color: #64748b;
          margin-top: 2px;
          margin-bottom: 0;
        }
        .btn-add-subdept {
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          font-weight: 600;
          font-size: 0.8rem;
          padding: 0.4rem 0.85rem;
          border-radius: 0.375rem;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-add-subdept:hover {
          background-color: #f1f5f9;
        }
        
        .subdept-list-body {
          display: flex;
          flex-direction: column;
        }
        .subdept-row-item {
          padding: 1rem 1.75rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background-color 0.2s;
        }
        .subdept-row-item:last-child {
          border-bottom: 0;
        }
        .subdept-row-item:hover {
          background-color: #f8f9fa;
        }
        .subdept-item-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 2px;
        }
        .subdept-item-code {
          font-size: 0.72rem;
          color: #64748b;
          text-transform: uppercase;
        }
        .subdept-row-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .subdept-action-icon {
          font-size: 1rem;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.15s;
        }
        .subdept-action-icon:hover {
          color: #0f172a;
        }
        .subdept-action-icon.trash:hover {
          color: #ef4444;
        }

        /* Page header custom styling */
        .page-back-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .page-back-arrow {
          font-size: 1.5rem;
          color: #0f172a;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: transform 0.2s;
        }
        .page-back-arrow:hover {
          transform: translateX(-3px);
        }
        .page-title-group {
          text-align: left;
        }
        .page-main-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          line-height: 1.2;
        }
        .page-sub-title {
          font-size: 0.85rem;
          color: #64748b;
          margin: 2px 0 0 0;
        }
        
        .footer-action-panel {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.75rem;
        }

        /* Modal specific styling */
        .modal-subdept-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.4);
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .modal-subdept-content {
          background: #ffffff;
          border-radius: 0.5rem;
          max-width: 460px;
          width: 100%;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .modal-subdept-header {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #e2e8f0;
          background-color: #f8f9fa;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-subdept-body {
          padding: 1.25rem;
          text-align: left;
        }
        .modal-subdept-footer {
          padding: 0.875rem 1.25rem;
          border-top: 1px solid #e2e8f0;
          background-color: #f8f9fa;
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        .btn-cancel-action {
          height: 2.5rem;
          padding: 0 1.25rem;
          border: 1px solid #cbd5e1;
          border-radius: 0.375rem;
          background-color: #ffffff;
          color: #475569;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-cancel-action:hover {
          background-color: #f1f5f9;
        }
        .btn-create-action {
          height: 2.5rem;
          padding: 0 1.25rem;
          background-color: #0963e2;
          color: #ffffff;
          border: none;
          border-radius: 0.375rem;
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-create-action:hover {
          background-color: #074eb5;
        }
        .btn-cancel-custom {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
        }
        .btn-cancel-custom:hover {
          background: #f1f5f9;
        }
        .btn-submit-custom {
          background: #0963e2;
          color: #ffffff;
          border: none;
          border-radius: 0.375rem;
          padding: 0.5rem 1.25rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-submit-custom:hover {
          background: #074eb5;
        }
      `}</style>

      <div className="edit-dept-container">
        
        {/* Top Navbar Header */}
        <div className="top-navbar mb-4">
          <div>
            <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
              <span className="text-muted">Management</span>
              <span className="mx-1">/</span>
              <span className="text-muted" style={{ cursor: 'pointer' }} onClick={() => navigate('/departments')}>Departments</span>
              <span className="mx-1">/</span>
              <span className="text-dark fw-bold">Edit</span>
            </nav>
          </div>
          <TopNavbar showUserRole={true} />
        </div>

        {/* Dynamic Page Title & Back Trigger */}
        <div className="page-back-header">
          <span className="page-back-arrow" onClick={() => navigate('/departments')}>
            <i className="bi bi-arrow-left"></i>
          </span>
          <div className="page-title-group">
            <h1 className="page-main-title">Edit Department</h1>
            <p className="page-sub-title">{deptName}</p>
          </div>
        </div>

        {/* Card 1: Department Details Form */}
        <div className="edit-dept-card text-start">
          <form onSubmit={handleSaveDepartment}>
            <h2 className="subdept-card-title mb-1" style={{ fontSize: '1.2rem' }}>Department Details</h2>
            <p className="subdept-card-subtitle mb-4">Update basic information and leadership for this department.</p>

            <div className="mb-3">
              <label className="form-label-req">Department Name <span className="text-danger">*</span></label>
              <input 
                type="text" 
                className={`form-input-box ${errors.name ? 'is-invalid' : ''}`}
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                required
              />
              {errors.name && <span className="form-error-msg">{errors.name}</span>}
            </div>

            <div className="row g-3 mb-3">
              {/* Department Code */}
              <div className="col-md-6">
                <label className="form-label-req">Department Code <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className={`form-input-box ${errors.code ? 'is-invalid' : ''}`}
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  required
                />
                <span className="input-subtext">Used for internal referencing (e.g., NEUR-001).</span>
                {errors.code && <span className="form-error-msg">{errors.code}</span>}
              </div>

              {/* Department Head (Searchable Selection Dropdown) */}
              <div className="col-md-6 doctor-dropdown-wrapper">
                <label className="form-label-req">Head of Department</label>
                
                <div 
                  className="doctor-dropdown-select-trigger" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{doctorSelectLabel}</span>
                  <i className="bi bi-chevron-down text-muted"></i>
                </div>

                {isDropdownOpen && (
                  <div className="doctor-dropdown-panel">
                    <input 
                      type="text" 
                      className="doctor-dropdown-search-input" 
                      placeholder="Search doctor..."
                      value={searchDoctorQuery}
                      onChange={(e) => setSearchDoctorQuery(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="doctor-dropdown-list">
                      <div 
                        className={`doctor-dropdown-item ${!headDoctorId ? 'selected' : ''}`}
                        onClick={() => {
                          setHeadDoctorId("");
                          setIsDropdownOpen(false);
                          setSearchDoctorQuery("");
                        }}
                      >
                        -- Unassigned --
                      </div>
                      {filteredDoctors.map(doc => (
                        <div 
                          key={doc.id}
                          className={`doctor-dropdown-item ${headDoctorId === doc.id ? 'selected' : ''}`}
                          onClick={() => {
                            setHeadDoctorId(doc.id);
                            setIsDropdownOpen(false);
                            setSearchDoctorQuery("");
                          }}
                        >
                          {doc.name} ({doc.specialty})
                        </div>
                      ))}
                      {filteredDoctors.length === 0 && (
                        <div className="p-2 text-center text-muted" style={{ fontSize: '0.75rem' }}>No doctors found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Operational Status radios */}
            <div className="mb-3">
              <label className="form-label-req">Operational Status</label>
              <div className="status-radios-flex mt-2">
                <label className="status-radio-option">
                  <input 
                    type="radio" 
                    name="operationalStatus"
                    value="Active"
                    checked={status === "Active"}
                    onChange={() => setStatus("Active")}
                  />
                  Active
                </label>
                <label className="status-radio-option">
                  <input 
                    type="radio" 
                    name="operationalStatus"
                    value="Inactive"
                    checked={status === "Inactive"}
                    onChange={() => setStatus("Inactive")}
                  />
                  Inactive
                </label>
              </div>
              {status === "Inactive" && (
                <div className="switch-helper-text text-danger mt-1">
                  Inactive departments will not appear in scheduling systems.
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label-req">Description</label>
              <textarea 
                className="form-textarea-box"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Form Footer Action Buttons */}
            <div className="footer-action-panel">
              <button 
                type="button" 
                className="btn-cancel-action"
                onClick={() => navigate('/departments')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-create-action"
              >
                <i className="bi bi-check-lg" style={{ fontSize: '0.95rem' }}></i> Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Card 2: Sub-Departments Dynamic Card */}
        <div className="subdept-card-container text-start">
          <div className="subdept-card-header">
            <div>
              <h3 className="subdept-card-title">Sub-Departments</h3>
              <p className="subdept-card-subtitle">Manage specialized units within {deptName}.</p>
            </div>
            <button className="btn-add-subdept" onClick={handleOpenAddSubDept}>
              <i className="bi bi-plus-lg"></i> Add Sub-Dept
            </button>
          </div>

          <div className="subdept-list-body">
            {departmentSubs.map((sub) => (
              <div key={sub.id} className="subdept-row-item">
                <div>
                  <div className="subdept-item-name">{sub.name}</div>
                  <div className="subdept-item-code">Code: {sub.code}</div>
                </div>
                <div className="subdept-row-actions">
                  <i 
                    className="bi bi-pencil subdept-action-icon" 
                    title="Edit Sub-department"
                    onClick={() => handleOpenEditSubDept(sub)}
                  ></i>
                  <i 
                    className="bi bi-trash3 subdept-action-icon trash" 
                    title="Delete Sub-department"
                    onClick={() => handleDeleteSubDept(sub)}
                  ></i>
                </div>
              </div>
            ))}
            {departmentSubs.length === 0 && (
              <div className="text-center py-4 text-muted" style={{ fontSize: '0.85rem' }}>
                No sub-departments defined for this department.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Sub-department Add / Edit Modal */}
      {showSubDeptModal && (
        <div className="modal-subdept-backdrop" onClick={() => setShowSubDeptModal(false)}>
          <div className="modal-subdept-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-subdept-header">
              <h5 className="modal-custom-title">
                <i className="bi bi-building-add" style={{ color: '#0963e2' }}></i> {editingSubDept ? "Modify Sub-Department" : "Add Sub-Department"}
              </h5>
              <button className="btn-close" aria-label="Close" onClick={() => setShowSubDeptModal(false)}></button>
            </div>
            <form onSubmit={handleSubDeptSubmit}>
              <div className="modal-subdept-body">
                <div className="form-group-custom">
                  <label className="form-label-custom">Sub-Department Name <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className={`form-input-box ${subErrors.name ? 'is-invalid' : ''}`}
                    placeholder="Sub-department name (e.g. Stroke Center)"
                    value={subDeptName}
                    onChange={(e) => handleSubDeptNameChange(e.target.value)}
                    required
                  />
                  {subErrors.name && <span className="form-error-msg">{subErrors.name}</span>}
                </div>

                <div className="form-group-custom mt-3">
                  <label className="form-label-custom">Sub-Department Code <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className={`form-input-box ${subErrors.code ? 'is-invalid' : ''}`}
                    placeholder="e.g. NEUR-STRK"
                    value={subDeptCode}
                    onChange={(e) => setSubDeptCode(e.target.value.toUpperCase())}
                    required
                  />
                  {subErrors.code && <span className="form-error-msg">{subErrors.code}</span>}
                </div>
              </div>
              <div className="modal-subdept-footer">
                <button type="button" className="btn-cancel-custom" onClick={() => setShowSubDeptModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit-custom">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-subdept-backdrop" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-subdept-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-subdept-header">
              <h5 className="modal-custom-title" style={{ color: '#ef4444', margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                <i className="bi bi-exclamation-triangle-fill" style={{ marginRight: '6px' }}></i> Remove Sub-Department
              </h5>
              <button className="btn-close" aria-label="Close" onClick={() => setShowDeleteConfirm(false)}></button>
            </div>
            <div className="modal-subdept-body">
              <p className="mb-0 text-dark" style={{ fontSize: '0.875rem' }}>
                Are you sure you want to remove the sub-department <strong>{subDeptToDelete?.name}</strong>?
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-subdept-footer">
              <button type="button" className="btn-cancel-custom" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button 
                type="button" 
                className="btn-submit-custom" 
                style={{ backgroundColor: '#ef4444' }}
                onClick={confirmDeleteSubDept}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EditDepartmentPage;
