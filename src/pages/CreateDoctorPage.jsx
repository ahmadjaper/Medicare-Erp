import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { doctors } from '../data/doctorsData';
import '../assets/css/doctors.css';

function CreateDoctorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const selectedDoc = isEditMode ? doctors.find(d => d.id === id) : null;

  // Form Field States
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    department: '',
    specialty: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    joinDate: '',
    employmentType: '',
    status: 'Active',
    username: '',
    password: ''
  });

  // Pre-fill form fields when in Edit Mode
  useEffect(() => {
    if (isEditMode && selectedDoc) {
      // Split name into first and last name
      const nameWithoutDr = selectedDoc.name ? selectedDoc.name.replace(/^Dr\.\s+/, '') : '';
      const parts = nameWithoutDr.split(' ');
      const firstName = parts[0] || '';
      const lastName = parts.slice(1).join(' ') || '';

      // Parse experience and fee
      const experienceNum = selectedDoc.experience ? (parseInt(selectedDoc.experience) || '') : '';
      const feeNum = selectedDoc.consultationFee ? (parseInt(selectedDoc.consultationFee.replace('$', '')) || '') : '';

      setFormData({
        firstName,
        lastName,
        email: selectedDoc.email || `${selectedDoc.id.toLowerCase()}@medicore.com`,
        phone: selectedDoc.phone || '',
        dob: selectedDoc.dob || '1985-05-12',
        gender: selectedDoc.gender || 'Male',
        department: selectedDoc.department || '',
        specialty: selectedDoc.specialty || '',
        qualification: selectedDoc.qualification || 'MD, PhD, Board Certified',
        experience: experienceNum,
        consultationFee: feeNum,
        joinDate: selectedDoc.joinDate || '2018-07-01',
        employmentType: selectedDoc.employmentType || 'Full Time',
        status: selectedDoc.status || 'Active',
        username: selectedDoc.username || (selectedDoc.name ? selectedDoc.name.toLowerCase().replace(/[^a-z0-9]/g, '') : ''),
        password: '' // Optional password
      });
    }
  }, [isEditMode, selectedDoc]);

  // Validation Error States
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Input Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when typing/selecting
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Form Submission Validator
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate Required Fields (password is optional in Edit Mode)
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'gender',
      'department', 'specialty', 'qualification', 'experience',
      'consultationFee', 'joinDate', 'employmentType', 'username'
    ];
    if (!isEditMode) {
      requiredFields.push('password');
    }

    requiredFields.forEach(field => {
      if (!formData[field] || !formData[field].toString().trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    // Email Pattern Validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please fix the validation errors in red before submitting.");
      return;
    }

    if (isEditMode) {
      // Find and update the existing doctor in doctors array
      const index = doctors.findIndex(d => d.id === id);
      if (index !== -1) {
        doctors[index] = {
          ...doctors[index],
          name: `Dr. ${formData.firstName} ${formData.lastName}`,
          department: formData.department,
          specialty: formData.specialty,
          phone: formData.phone,
          experience: `${formData.experience} years`,
          consultationFee: `$${formData.consultationFee}`,
          status: formData.status || 'Active',
          initials: `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase(),
          email: formData.email,
          dob: formData.dob,
          gender: formData.gender,
          qualification: formData.qualification,
          joinDate: formData.joinDate,
          employmentType: formData.employmentType,
          username: formData.username
        };
        
        // Update password only if a new value is entered
        if (formData.password) {
          doctors[index].password = formData.password;
        }

        alert(`Success: Doctor record for ${doctors[index].name} has been updated.`);
        navigate(`/doctors/details/${id}`);
      } else {
        alert("Error: Doctor record not found.");
        navigate('/doctors');
      }
    } else {
      // Mock Save Operation (Append to doctors in-memory array)
      const newDocId = `DOC-${1000 + doctors.length + 1}`;
      const newDoctor = {
        id: newDocId,
        name: `Dr. ${formData.firstName} ${formData.lastName}`,
        department: formData.department,
        specialty: formData.specialty,
        phone: formData.phone,
        experience: `${formData.experience} years`,
        consultationFee: `$${formData.consultationFee}`,
        status: formData.status || 'Active',
        avatar: null,
        initials: `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase(),
        email: formData.email,
        dob: formData.dob,
        gender: formData.gender,
        qualification: formData.qualification,
        joinDate: formData.joinDate,
        employmentType: formData.employmentType,
        username: formData.username,
        password: formData.password
      };

      doctors.push(newDoctor);

      alert(`Success: Doctor record created for ${newDoctor.name} with ID ${newDoctor.id}`);
      navigate('/doctors');
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      navigate(`/doctors/details/${id}`);
    } else {
      navigate('/doctors');
    }
  };

  return (
    <>
      {/* Top Navbar & Header Breadcrumbs */}
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted" style={{ cursor: 'pointer' }} onClick={() => navigate('/doctors')}>Doctors</span>
            <span className="mx-1">/</span>
            {isEditMode && (
              <>
                <span className="text-muted" style={{ cursor: 'pointer' }} onClick={handleCancel}>Doctor Details</span>
                <span className="mx-1">/</span>
              </>
            )}
            <span className="text-dark fw-bold">{isEditMode ? 'Edit Doctor' : 'Create Doctor'}</span>
          </nav>
        </div>
        <TopNavbar showUserRole={true} />
      </div>

      {/* Page Header Bar with Action Buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn btn-link p-0 text-dark" 
            onClick={handleCancel}
            title={isEditMode ? "Go back to Doctor Details" : "Go back to Doctors List"}
          >
            <i className="bi bi-arrow-left fs-3"></i>
          </button>
          <div>
            <h1 className="page-title mb-1" style={{ fontSize: '1.75rem' }}>{isEditMode ? 'Edit Doctor' : 'Create Doctor'}</h1>
            <div className="text-muted" style={{ fontSize: '0.85rem' }}>
              {isEditMode 
                ? `Modify details and credentials for ${selectedDoc?.name || 'the medical professional'}.`
                : 'Add a new doctor to the hospital management system.'
              }
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-primary" onClick={handleCancel} style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            {isEditMode ? 'Save Changes' : 'Create Doctor'}
          </button>
        </div>
      </div>

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="row g-4 mb-5">
        
        {/* Left Column (Personal + Employment) */}
        <div className="col-lg-7 d-flex flex-column gap-4">
          
          {/* Personal Information */}
          <div className="dashboard-card p-4">
            <h5 className="mb-4" style={{ fontWeight: 700 }}>Personal Information</h5>
            
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label font-weight-bold" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  First Name <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  name="firstName"
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px' }}
                />
                {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Last Name <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  name="lastName"
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px' }}
                />
                {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
              </div>

              <div className="col-12">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Email <span className="text-danger">*</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px' }}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="col-12">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Phone <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  name="phone"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px' }}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Date of Birth
                </label>
                <input 
                  type="date" 
                  name="dob"
                  className="form-control"
                  value={formData.dob}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px' }}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Gender <span className="text-danger">*</span>
                </label>
                <select 
                  name="gender"
                  className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                  value={formData.gender}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px', cursor: 'pointer' }}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
              </div>
            </div>
          </div>
          
          {/* Employment Information */}
          <div className="dashboard-card p-4">
            <h5 className="mb-4" style={{ fontWeight: 700 }}>Employment Information</h5>
            
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Join Date <span className="text-danger">*</span>
                </label>
                <input 
                  type="date" 
                  name="joinDate"
                  className={`form-control ${errors.joinDate ? 'is-invalid' : ''}`}
                  value={formData.joinDate}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px' }}
                />
                {errors.joinDate && <div className="invalid-feedback">{errors.joinDate}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Employment Type <span className="text-danger">*</span>
                </label>
                <select 
                  name="employmentType"
                  className={`form-select ${errors.employmentType ? 'is-invalid' : ''}`}
                  value={formData.employmentType}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px', cursor: 'pointer' }}
                >
                  <option value="">Select employment type</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                </select>
                {errors.employmentType && <div className="invalid-feedback">{errors.employmentType}</div>}
              </div>

              <div className="col-12">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Status <span className="text-danger">*</span>
                </label>
                <select 
                  name="status"
                  className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                  value={formData.status}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px', cursor: 'pointer' }}
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.status && <div className="invalid-feedback">{errors.status}</div>}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Professional + Account) */}
        <div className="col-lg-5 d-flex flex-column gap-4">
          
          {/* Professional Information */}
          <div className="dashboard-card p-4">
            <h5 className="mb-4" style={{ fontWeight: 700 }}>Professional Information</h5>
            
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Department <span className="text-danger">*</span>
                </label>
                <select 
                  name="department"
                  className={`form-select ${errors.department ? 'is-invalid' : ''}`}
                  value={formData.department}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px', cursor: 'pointer' }}
                >
                  <option value="">Select department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Gastroenterology">Gastroenterology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Surgery">Surgery</option>
                </select>
                {errors.department && <div className="invalid-feedback">{errors.department}</div>}
              </div>

              <div className="col-12">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Specialty <span className="text-danger">*</span>
                </label>
                <select 
                  name="specialty"
                  className={`form-select ${errors.specialty ? 'is-invalid' : ''}`}
                  value={formData.specialty}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px', cursor: 'pointer' }}
                >
                  <option value="">Select specialty</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Gastroenterologist">Gastroenterologist</option>
                  <option value="Oncologist">Oncologist</option>
                  <option value="General Surgeon">General Surgeon</option>
                </select>
                {errors.specialty && <div className="invalid-feedback">{errors.specialty}</div>}
              </div>

              <div className="col-12">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Qualification <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  name="qualification"
                  className={`form-control ${errors.qualification ? 'is-invalid' : ''}`}
                  placeholder="Enter qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px' }}
                />
                {errors.qualification && <div className="invalid-feedback">{errors.qualification}</div>}
              </div>

              <div className="col-12">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Experience (Years) <span className="text-danger">*</span>
                </label>
                <input 
                  type="number" 
                  name="experience"
                  className={`form-control ${errors.experience ? 'is-invalid' : ''}`}
                  placeholder="Enter experience"
                  value={formData.experience}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px' }}
                />
                {errors.experience && <div className="invalid-feedback">{errors.experience}</div>}
              </div>

              <div className="col-12">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Consultation Fee <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0" style={{ height: '42px' }}>$</span>
                  <input 
                    type="number" 
                    name="consultationFee"
                    className={`form-control border-start-0 ${errors.consultationFee ? 'is-invalid' : ''}`}
                    placeholder="Enter consultation fee"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    style={{ backgroundColor: '#f8fafc', height: '42px' }}
                  />
                  {errors.consultationFee && <div className="invalid-feedback d-block">{errors.consultationFee}</div>}
                </div>
              </div>
            </div>
          </div>
          
          {/* Account Information */}
          <div className="dashboard-card p-4">
            <h5 className="mb-4" style={{ fontWeight: 700 }}>Account Information</h5>
            
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Username <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  name="username"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px' }}
                />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Password {!isEditMode && <span className="text-danger">*</span>}
                </label>
                <div className="position-relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    className={`form-control pe-5 ${errors.password ? 'is-invalid' : ''}`}
                    placeholder={isEditMode ? "Enter new password (optional)" : "Enter password"}
                    value={formData.password}
                    onChange={handleChange}
                    style={{ backgroundColor: '#f8fafc', height: '42px' }}
                  />
                  <button
                    type="button"
                    className="btn border-0 position-absolute end-0 top-50 translate-middle-y me-1 text-muted"
                    onClick={() => setShowPassword(p => !p)}
                    style={{ height: '36px' }}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                  {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                </div>
              </div>
            </div>
          </div>

        </div>

      </form>
    </>
  );
}

export default CreateDoctorPage;
