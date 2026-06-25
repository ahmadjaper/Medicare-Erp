import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { useErpStore } from '../store/erpStore';

function CreateEmployeePage() {
  const navigate = useNavigate();
  const { employees, departments, addEmployee } = useErpStore();

  // Roles and Designations
  const rolesList = ["Admin", "HR", "Receptionist", "Staff"];
  const designationsList = ["Doctor", "Nurse", "Manager", "Technician", "Specialist", "Coordinator"];
  const employmentTypes = ["Full Time", "Part Time", "Contract", "Intern"];

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    department: "",
    designation: "",
    role: "",
    employmentType: "",
    joiningDate: "",
    salary: "",
    reportsTo: "",
    status: "Active",
    username: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.designation) newErrors.designation = "Designation is required";
    if (!formData.role) newErrors.role = "System Role is required";
    
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Form is valid, build employee object
      const newEmployee = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
        address: formData.address,
        department: formData.department,
        designation: formData.designation,
        role: formData.role,
        employmentType: formData.employmentType,
        joiningDate: formData.joiningDate,
        salary: formData.salary,
        reportsTo: formData.reportsTo,
        status: formData.status,
        username: formData.username,
        // Typically password isn't saved directly in the employee object in plaintext,
        // but for this mock implementation we include it as part of credentials.
        password: formData.password 
      };

      addEmployee(newEmployee);
      navigate('/employees');
    } else {
      window.scrollTo(0, 0); // scroll to top to see errors
    }
  };

  return (
    <>
      {/* Top Navbar Section */}
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb" style={{ fontSize: '0.82rem' }}>
            <span className="text-muted" style={{ cursor: 'pointer' }} onClick={() => navigate('/employees')}>Employees</span>
            <span className="mx-1.5 text-muted">&gt;</span>
            <span className="text-muted fw-semibold">Create Employee</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="mb-4">
        <h1 className="page-title mb-1" style={{ fontSize: '1.75rem', fontWeight: 700 }}>Create Employee</h1>
        <p className="text-muted mb-0">Add a new employee to the hospital management system.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-12 col-xl-7 d-flex flex-column gap-4">
            {/* Personal Information */}
            <div className="card dashboard-card p-4 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <h6 className="fw-bold text-dark mb-4 uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>PERSONAL INFORMATION</h6>
              
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>First Name <span className="text-danger">*</span></label>
                  <input type="text" className={`form-control bg-light border-0 ${errors.firstName ? 'is-invalid' : ''}`} name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter first name" />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Last Name <span className="text-danger">*</span></label>
                  <input type="text" className={`form-control bg-light border-0 ${errors.lastName ? 'is-invalid' : ''}`} name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter last name" />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
                <div className="col-12">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Email Address <span className="text-danger">*</span></label>
                  <input type="email" className={`form-control bg-light border-0 ${errors.email ? 'is-invalid' : ''}`} name="email" value={formData.email} onChange={handleChange} placeholder="john.doe@medicore.com" />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Phone Number <span className="text-danger">*</span></label>
                  <input type="text" className={`form-control bg-light border-0 ${errors.phone ? 'is-invalid' : ''}`} name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Gender</label>
                  <select className="form-select bg-light border-0" name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Date of Birth</label>
                  <input type="date" className="form-control bg-light border-0 text-muted" name="dob" value={formData.dob} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Residential Address</label>
                  <textarea className="form-control bg-light border-0" rows="2" name="address" value={formData.address} onChange={handleChange} placeholder="Enter full address"></textarea>
                </div>
              </div>
            </div>

            {/* Account Credentials */}
            <div className="card dashboard-card p-4 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <h6 className="fw-bold text-dark mb-4 uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>ACCOUNT CREDENTIALS</h6>
              
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Username <span className="text-danger">*</span></label>
                  <input type="text" className={`form-control bg-light border-0 ${errors.username ? 'is-invalid' : ''}`} name="username" value={formData.username} onChange={handleChange} placeholder="Enter username" />
                  {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Password <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <input type={showPassword ? "text" : "password"} className={`form-control bg-light border-0 ${errors.password ? 'is-invalid' : ''}`} name="password" value={formData.password} onChange={handleChange} placeholder="Create password" />
                    <span className="input-group-text bg-light border-0 text-muted" style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </span>
                    {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-12 col-xl-5">
            {/* Employment Details */}
            <div className="card dashboard-card p-4 border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <h6 className="fw-bold text-dark mb-4 uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>EMPLOYMENT DETAILS</h6>
              
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Department <span className="text-danger">*</span></label>
                  <select className={`form-select bg-light border-0 ${errors.department ? 'is-invalid' : ''}`} name="department" value={formData.department} onChange={handleChange}>
                    <option value="">Select department</option>
                    {departments.map((d, i) => (
                      <option key={i} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                  {errors.department && <div className="invalid-feedback">{errors.department}</div>}
                </div>
                
                <div className="col-12">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Designation <span className="text-danger">*</span></label>
                  <select className={`form-select bg-light border-0 ${errors.designation ? 'is-invalid' : ''}`} name="designation" value={formData.designation} onChange={handleChange}>
                    <option value="">Select designation</option>
                    {designationsList.map((desig, i) => (
                      <option key={i} value={desig}>{desig}</option>
                    ))}
                  </select>
                  {errors.designation && <div className="invalid-feedback">{errors.designation}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>System Role <span className="text-danger">*</span></label>
                  <select className={`form-select bg-light border-0 ${errors.role ? 'is-invalid' : ''}`} name="role" value={formData.role} onChange={handleChange}>
                    <option value="">Select system role</option>
                    {rolesList.map((r, i) => (
                      <option key={i} value={r}>{r}</option>
                    ))}
                  </select>
                  {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Employment Type</label>
                  <select className="form-select bg-light border-0" name="employmentType" value={formData.employmentType} onChange={handleChange}>
                    <option value="">Select</option>
                    {employmentTypes.map((type, i) => (
                      <option key={i} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-12 col-sm-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Joining Date</label>
                  <input type="date" className="form-control bg-light border-0 text-muted" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Salary</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0 text-muted">$</span>
                    <input type="number" className="form-control bg-light border-0" name="salary" value={formData.salary} onChange={handleChange} placeholder="0.00" />
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>Reports To</label>
                  <select className="form-select bg-light border-0" name="reportsTo" value={formData.reportsTo} onChange={handleChange}>
                    <option value="">Select manager</option>
                    {employees.map((emp, i) => (
                      <option key={i} value={emp.name}>{emp.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 mt-4">
                  <label className="form-label text-muted fw-semibold mb-2" style={{ fontSize: '0.85rem' }}>Initial Status</label>
                  <div className="d-flex gap-4">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="status" id="statusActive" value="Active" checked={formData.status === "Active"} onChange={handleChange} />
                      <label className="form-check-label text-dark fw-semibold" htmlFor="statusActive" style={{ fontSize: '0.9rem' }}>Active</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="status" id="statusInactive" value="Inactive" checked={formData.status === "Inactive"} onChange={handleChange} />
                      <label className="form-check-label text-muted fw-semibold" htmlFor="statusInactive" style={{ fontSize: '0.9rem' }}>Inactive</label>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="d-flex justify-content-end gap-3 mt-4 border-top pt-4">
          <button type="button" className="btn btn-outline-secondary fw-bold px-4" onClick={() => navigate('/employees')} style={{ height: '42px', borderRadius: '6px' }}>Cancel</button>
          <button type="submit" className="btn btn-primary fw-bold px-4 d-flex align-items-center gap-2" style={{ height: '42px', borderRadius: '6px' }}>
            <i className="bi bi-person-plus"></i> Create Employee
          </button>
        </div>
      </form>
    </>
  );
}

export default CreateEmployeePage;
