import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { doctors } from '../data/doctorsData';
import '../assets/css/doctors.css';

function CreateAppointmentPage() {
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    phone: '',
    department: '',
    doctorId: '',
    type: 'Consultation',
    date: '',
    time: ''
  });

  const [errors, setErrors] = useState({});

  // Covered departments list derived dynamically from doctors data
  const departmentsList = [...new Set(doctors.map(d => d.department))];

  // List of doctors filtered by the selected department
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  // Filter doctors list when selected department changes
  useEffect(() => {
    if (formData.department) {
      const filtered = doctors.filter(doc => doc.department === formData.department && doc.status === 'Active');
      setFilteredDoctors(filtered);
      // Clear selected doctor if it belongs to a different department
      setFormData(prev => ({
        ...prev,
        doctorId: ''
      }));
    } else {
      setFilteredDoctors([]);
    }
  }, [formData.department]);

  // Input change handler
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

  // Cancel Handler
  const handleCancel = () => {
    navigate('/appointments');
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate Required Fields
    const requiredFields = [
      'patientName', 'patientId', 'phone', 'department', 'doctorId', 'type', 'date', 'time'
    ];

    requiredFields.forEach(field => {
      if (!formData[field] || !formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please fix the validation errors in red before booking.");
      return;
    }

    const selectedDoc = doctors.find(d => d.id === formData.doctorId);
    const successMessage = `Success: Appointment booked successfully!
- Patient: ${formData.patientName} (${formData.patientId})
- Doctor: ${selectedDoc?.name || ''} (${formData.department})
- Type: ${formData.type}
- Schedule: ${formData.date} at ${formData.time}
- Status: Scheduled`;

    alert(successMessage);
    navigate('/appointments');
  };

  return (
    <>
      {/* Top Navbar & Header Breadcrumbs */}
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted" style={{ cursor: 'pointer' }} onClick={handleCancel}>Appointments</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Book Appointment</span>
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
            title="Go back to Appointments List"
          >
            <i className="bi bi-arrow-left fs-3"></i>
          </button>
          <div>
            <h1 className="page-title mb-1" style={{ fontSize: '1.75rem' }}>Book Appointment</h1>
            <div className="text-muted" style={{ fontSize: '0.85rem' }}>
              Schedule a patient visit with a medical specialist.
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-primary" onClick={handleCancel} style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            Book Appointment
          </button>
        </div>
      </div>

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="row g-4 mb-5">
        
        {/* Left Column (Patient Details) */}
        <div className="col-lg-6">
          <div className="dashboard-card p-4 h-100">
            <h5 className="mb-4" style={{ fontWeight: 700 }}>Patient Information</h5>
            
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Patient Name <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  name="patientName"
                  className={`form-control ${errors.patientName ? 'is-invalid' : ''}`}
                  placeholder="Enter patient full name"
                  value={formData.patientName}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px' }}
                />
                {errors.patientName && <div className="invalid-feedback">{errors.patientName}</div>}
              </div>

              <div className="col-12">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Patient ID <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  name="patientId"
                  className={`form-control ${errors.patientId ? 'is-invalid' : ''}`}
                  placeholder="Enter Patient ID (e.g. PAT-1201)"
                  value={formData.patientId}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px' }}
                />
                {errors.patientId && <div className="invalid-feedback">{errors.patientId}</div>}
              </div>

              <div className="col-12">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Phone Number <span className="text-danger">*</span>
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
            </div>
          </div>
        </div>

        {/* Right Column (Appointment Details) */}
        <div className="col-lg-6">
          <div className="dashboard-card p-4 h-100">
            <h5 className="mb-4" style={{ fontWeight: 700 }}>Appointment Details</h5>
            
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
                  {departmentsList.map((dept, idx) => (
                    <option key={idx} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <div className="invalid-feedback">{errors.department}</div>}
              </div>

              <div className="col-12">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Assigned Doctor <span className="text-danger">*</span>
                </label>
                <select 
                  name="doctorId"
                  className={`form-select ${errors.doctorId ? 'is-invalid' : ''}`}
                  value={formData.doctorId}
                  onChange={handleChange}
                  disabled={!formData.department}
                  style={{ backgroundColor: '#f8fafc', height: '42px', cursor: formData.department ? 'pointer' : 'not-allowed' }}
                >
                  <option value="">{formData.department ? 'Select doctor' : 'Select department first'}</option>
                  {filteredDoctors.map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.name}</option>
                  ))}
                </select>
                {errors.doctorId && <div className="invalid-feedback">{errors.doctorId}</div>}
              </div>

              <div className="col-12">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Appointment Type <span className="text-danger">*</span>
                </label>
                <select 
                  name="type"
                  className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                  value={formData.type}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px', cursor: 'pointer' }}
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Surgery">Surgery</option>
                </select>
                {errors.type && <div className="invalid-feedback">{errors.type}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Appointment Date <span className="text-danger">*</span>
                </label>
                <input 
                  type="date" 
                  name="date"
                  className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                  value={formData.date}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px' }}
                />
                {errors.date && <div className="invalid-feedback">{errors.date}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Appointment Time <span className="text-danger">*</span>
                </label>
                <input 
                  type="time" 
                  name="time"
                  className={`form-control ${errors.time ? 'is-invalid' : ''}`}
                  value={formData.time}
                  onChange={handleChange}
                  style={{ backgroundColor: '#f8fafc', height: '42px' }}
                />
                {errors.time && <div className="invalid-feedback">{errors.time}</div>}
              </div>

              <div className="col-12">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Status
                </label>
                <input 
                  type="text" 
                  className="form-control"
                  value="Scheduled"
                  disabled
                  style={{ backgroundColor: '#e2e8f0', height: '42px', cursor: 'not-allowed', fontWeight: 600 }}
                />
              </div>
            </div>
          </div>
        </div>

      </form>
    </>
  );
}

export default CreateAppointmentPage;
