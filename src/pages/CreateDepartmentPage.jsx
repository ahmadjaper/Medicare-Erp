import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { useErpStore } from '../store/erpStore';
import { useRole } from '../context/RoleContext';

function CreateDepartmentPage() {
  const navigate = useNavigate();
  const { currentRole } = useRole();
  const { doctors, departments, addDepartment } = useErpStore();

  // Form states
  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [description, setDescription] = useState("");
  const [headDoctorId, setHeadDoctorId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [subDepts, setSubDepts] = useState([""]); // Start with one empty sub-department row

  // Search filter for Doctor dropdown search
  const [searchDoctorQuery, setSearchDoctorQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Errors state
  const [errors, setErrors] = useState({});

  // Clean form errors when fields change
  useEffect(() => {
    if (deptName) setErrors(prev => ({ ...prev, name: null }));
    if (deptCode) setErrors(prev => ({ ...prev, code: null }));
  }, [deptName, deptCode]);

  // Doctor search match
  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchDoctorQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchDoctorQuery.toLowerCase())
  );

  // Selected doctor display label
  const selectedDoctorObj = doctors.find(d => d.id === headDoctorId);
  const doctorSelectLabel = selectedDoctorObj 
    ? `${selectedDoctorObj.name} (${selectedDoctorObj.specialty})`
    : "Select a doctor...";

  // Repeater Handlers
  const handleAddSubDeptRow = () => {
    setSubDepts(prev => [...prev, ""]);
  };

  const handleSubDeptChange = (index, value) => {
    setSubDepts(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
    setErrors(prev => ({ ...prev, subDepts: null }));
  };

  const handleDeleteSubDeptRow = (index) => {
    setSubDepts(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  // Submit Handler
  const handleCreateSubmit = (e) => {
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
      // Check if duplicate code exists
      const isDuplicate = departments.some(dept => dept.code.toUpperCase() === trimmedCode);
      if (isDuplicate) {
        newErrors.code = "Department code already exists.";
      }
    }

    // Validate sub-departments
    const filteredSubDepts = subDepts.map(s => s.trim()).filter(Boolean);
    const uniqueSubDepts = new Set(filteredSubDepts);
    if (filteredSubDepts.length !== uniqueSubDepts.size) {
      newErrors.subDepts = "Duplicate sub-department names are not allowed.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to top or first error
      return;
    }

    // Resolve head doctor detail
    const assignedDoctor = doctors.find(d => d.id === headDoctorId);

    // Call state manager to persist data
    addDepartment({
      name: trimmedName,
      code: trimmedCode,
      description: description.trim(),
      headDoctorId: headDoctorId || null,
      headName: assignedDoctor ? assignedDoctor.name : "Unassigned",
      headTitle: assignedDoctor ? assignedDoctor.specialty : "Department Head",
      status: isActive ? "Active" : "Inactive",
    }, filteredSubDepts, currentRole);

    navigate("/departments");
  };

  return (
    <>
      <style>{`
        .create-dept-container {
          font-family: 'Inter', sans-serif;
          background-color: #f8f9fa;
          color: #0f172a;
        }
        .create-dept-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 1.75rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04);
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
          background-color: #f8f9fa;
          transition: border-color 0.2s, background-color 0.2s;
        }
        .form-input-box:focus {
          border-color: #0963e2;
          background-color: #ffffff;
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
          background-color: #f8f9fa;
          resize: vertical;
          min-height: 5rem;
          transition: border-color 0.2s, background-color 0.2s;
        }
        .form-textarea-box:focus {
          border-color: #0963e2;
          background-color: #ffffff;
        }
        .form-error-msg {
          font-size: 0.75rem;
          color: #ef4444;
          margin-top: 4px;
          display: block;
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
          background-color: #f8f9fa;
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

        /* Toggle switch */
        .switch-toggle-custom {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .switch-btn {
          position: relative;
          display: inline-block;
          width: 2.75rem;
          height: 1.5rem;
        }
        .switch-btn input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .switch-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #cbd5e1;
          transition: .4s;
          border-radius: 2rem;
        }
        .switch-slider:before {
          position: absolute;
          content: "";
          height: 1.15rem;
          width: 1.15rem;
          left: 0.18rem;
          bottom: 0.18rem;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .switch-slider {
          background-color: #0963e2;
        }
        input:checked + .switch-slider:before {
          transform: translateX(1.2rem);
        }
        .switch-status-label {
          font-size: 0.875rem;
          font-weight: 700;
          color: #64748b;
        }
        .switch-status-label.active {
          color: #0963e2;
        }
        .switch-helper-text {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 4px;
        }

        /* Repeater List */
        .subdept-repeater-box {
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .subdept-repeater-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .trash-btn-repeater {
          width: 2.5rem;
          height: 2.5rem;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ef4444;
          cursor: pointer;
          transition: background 0.2s;
        }
        .trash-btn-repeater:hover {
          background: #fef2f2;
        }
        .link-add-row {
          color: #0963e2;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 2px;
        }
        .link-add-row:hover {
          text-decoration: underline;
        }

        /* Buttons footer */
        .form-footer-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.5rem;
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
      `}</style>

      <div className="create-dept-container">
        
        {/* Top Navbar Section */}
        <div className="top-navbar mb-4">
          <div>
            <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
              <span className="text-muted">Management</span>
              <span className="mx-1">/</span>
              <span className="text-muted" style={{ cursor: 'pointer' }} onClick={() => navigate('/departments')}>Departments</span>
              <span className="mx-1">/</span>
              <span className="text-dark fw-bold">Create</span>
            </nav>
          </div>
          <TopNavbar showUserRole={true} />
        </div>

        {/* Title & Subtitle */}
        <div className="mb-4 text-start">
          <h1 className="page-title mb-1" style={{ fontSize: '2rem', fontWeight: 800 }}>Create Department</h1>
          <p className="text-muted mb-0">Add a new operational department to the hospital network.</p>
        </div>

        {/* Card Form container */}
        <div className="create-dept-card text-start">
          <form onSubmit={handleCreateSubmit}>
            
            {/* SECTION 1: BASIC INFORMATION */}
            <div>
              <h3 className="form-section-header">Basic Information</h3>
              <hr className="form-section-divider" />
              
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label-req">Department Name <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className={`form-input-box ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="e.g. Cardiology"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                  />
                  {errors.name && <span className="form-error-msg">{errors.name}</span>}
                </div>

                <div className="col-md-6">
                  <label className="form-label-req">Department Code</label>
                  <input 
                    type="text" 
                    className={`form-input-box ${errors.code ? 'is-invalid' : ''}`}
                    placeholder="E.G. CARD"
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                  />
                  {errors.code && <span className="form-error-msg">{errors.code}</span>}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label-req">Description</label>
                <textarea 
                  className="form-textarea-box"
                  placeholder="Provide a brief overview of the department's focus..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* SECTION 2: MANAGEMENT & STATUS */}
            <div className="mt-4">
              <h3 className="form-section-header">Management & Status</h3>
              <hr className="form-section-divider" />

              <div className="row g-3 mb-3 align-items-start">
                {/* Department Head Selector */}
                <div className="col-md-6 doctor-dropdown-wrapper">
                  <label className="form-label-req">Department Head</label>
                  
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
                        placeholder="Search doctor name or specialty..."
                        value={searchDoctorQuery}
                        onChange={(e) => setSearchDoctorQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()} // Prevent closing trigger
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
                          -- Unassigned / Select doctor --
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

                {/* Status Toggle Switch */}
                <div className="col-md-6">
                  <label className="form-label-req">Department Status</label>
                  
                  <div className="switch-toggle-custom mt-2">
                    <label className="switch-btn">
                      <input 
                        type="checkbox" 
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                      />
                      <span className="switch-slider"></span>
                    </label>
                    <span className={`switch-status-label ${isActive ? 'active' : ''}`}>
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="switch-helper-text">
                    Inactive departments will not appear in scheduling systems.
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: SUB-DEPARTMENTS */}
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h3 className="form-section-header mb-0">Sub-Departments</h3>
                <span className="link-add-row" onClick={handleAddSubDeptRow}>
                  <i className="bi bi-plus-lg"></i> Add Row
                </span>
              </div>
              <hr className="form-section-divider" style={{ marginTop: '0.25rem' }} />

              <div className="subdept-repeater-box">
                {subDepts.map((sub, idx) => (
                  <div key={idx} className="subdept-repeater-row">
                    <input 
                      type="text" 
                      className="form-input-box" 
                      placeholder="Sub-department name (e.g. Pediatric Cardiology)"
                      value={sub}
                      onChange={(e) => handleSubDeptChange(idx, e.target.value)}
                    />
                    {subDepts.length > 1 && (
                      <button 
                        type="button" 
                        className="trash-btn-repeater" 
                        aria-label="Delete Row"
                        onClick={() => handleDeleteSubDeptRow(idx)}
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    )}
                  </div>
                ))}
                {errors.subDepts && <span className="form-error-msg">{errors.subDepts}</span>}
              </div>
            </div>

            {/* Form Footer Actions */}
            <div className="form-footer-actions">
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
                <i className="bi bi-check-lg" style={{ fontSize: '0.95rem' }}></i> Create Department
              </button>
            </div>

          </form>
        </div>

      </div>
    </>
  );
}

export default CreateDepartmentPage;
