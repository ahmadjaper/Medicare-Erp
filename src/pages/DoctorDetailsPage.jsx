import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { doctors } from '../data/doctorsData';
import '../assets/css/doctors.css';

function DoctorDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find doctor by ID
  const doctor = doctors.find(doc => doc.id === id) || doctors[0]; // Fallback to first doctor if not found

  const handleBack = () => {
    navigate('/doctors');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'status-active';
      case 'On Leave':
        return 'status-on-leave';
      case 'Inactive':
        return 'status-inactive';
      default:
        return 'status-inactive';
    }
  };

  return (
    <>
      {/* Top Navbar & Header Breadcrumbs */}
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted" style={{ cursor: 'pointer' }} onClick={handleBack}>Doctors</span>
            <span className="mx-1">/</span>
            <span className="text-muted">Doctor Details</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">{doctor.id}</span>
          </nav>
        </div>
        <TopNavbar showUserRole={true} />
      </div>

      {/* Page Header Bar with Back Arrow */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn btn-link p-0 text-dark" 
            onClick={handleBack}
            title="Go back to Doctors List"
          >
            <i className="bi bi-arrow-left fs-3"></i>
          </button>
          <div>
            <h1 className="page-title mb-1" style={{ fontSize: '1.75rem' }}>Doctor Details</h1>
            <div className="text-muted" style={{ fontSize: '0.85rem' }}>
              Detailed profile and credentials of the medical professional.
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-outline-secondary" onClick={handleBack} style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            Back to List
          </button>
          <button className="btn btn-outline-primary" onClick={() => navigate(`/schedules/${doctor.id}`)} style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            <i className="bi bi-calendar3"></i> View Schedule
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate(`/doctors/${doctor.id}/edit`)} 
            style={{ fontSize: '0.9rem', fontWeight: 600 }}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Details Row */}
      <div className="row g-4 mb-5">
        
        {/* Left Column - Card Profile & Personal Info */}
        <div className="col-lg-5 d-flex flex-column gap-4">
          
          {/* Brief Card Profile */}
          <div className="dashboard-card p-4 text-center">
            <div className="d-flex justify-content-center mb-3">
              {doctor.avatar ? (
                <img 
                  src={doctor.avatar} 
                  alt={doctor.name} 
                  className="rounded-circle border"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline-flex';
                  }}
                />
              ) : null}
              <span 
                className="avatar-initials rounded-circle"
                style={{ 
                  display: doctor.avatar ? 'none' : 'inline-flex',
                  width: '100px',
                  height: '100px',
                  fontSize: '2.5rem',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af'
                }}
              >
                {doctor.initials}
              </span>
            </div>
            
            <h4 className="mb-1" style={{ fontWeight: 700 }}>{doctor.name}</h4>
            <div className="text-primary fw-bold mb-2" style={{ fontSize: '0.95rem' }}>
              {doctor.specialty}
            </div>
            <div className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
              Department: {doctor.department}
            </div>
            <div className="mb-2">
              <span className={`status-pill ${getStatusClass(doctor.status)}`}>
                {doctor.status}
              </span>
            </div>
            <div className="text-muted" style={{ fontSize: '0.8rem' }}>
              ID: {doctor.id}
            </div>
          </div>

          {/* Contact & Personal Info */}
          <div className="dashboard-card p-4">
            <h5 className="mb-4" style={{ fontWeight: 700 }}>Contact & Personal Information</h5>
            
            <div className="d-flex flex-column gap-3" style={{ fontSize: '0.9rem' }}>
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span className="text-muted">Phone Number</span>
                <span className="fw-semibold">{doctor.phone}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span className="text-muted">Email Address</span>
                <span className="fw-semibold">{doctor.email || `${doctor.id.toLowerCase()}@medicore.com`}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span className="text-muted">Gender</span>
                <span className="fw-semibold">{doctor.gender || 'Male'}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Date of Birth</span>
                <span className="fw-semibold">{doctor.dob || '12 May 1985'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Professional Details */}
        <div className="col-lg-7 d-flex flex-column gap-4">
          
          {/* Professional Credentials */}
          <div className="dashboard-card p-4">
            <h5 className="mb-4" style={{ fontWeight: 700 }}>Professional Credentials</h5>
            
            <div className="d-flex flex-column gap-3" style={{ fontSize: '0.9rem' }}>
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span className="text-muted">Department</span>
                <span className="fw-semibold">{doctor.department}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span className="text-muted">Specialty</span>
                <span className="fw-semibold">{doctor.specialty}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span className="text-muted">Qualifications</span>
                <span className="fw-semibold">{doctor.qualification || 'MD, PhD, Board Certified'}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span className="text-muted">Years of Experience</span>
                <span className="fw-semibold">{doctor.experience}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Consultation Fee</span>
                <span className="fw-bold text-success">{doctor.consultationFee}</span>
              </div>
            </div>
          </div>

          {/* Employment details */}
          <div className="dashboard-card p-4">
            <h5 className="mb-4" style={{ fontWeight: 700 }}>Employment Profile</h5>
            
            <div className="d-flex flex-column gap-3" style={{ fontSize: '0.9rem' }}>
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span className="text-muted">Employment Status</span>
                <span className="fw-semibold">{doctor.employmentType || 'Full Time'}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span className="text-muted">Join Date</span>
                <span className="fw-semibold">{doctor.joinDate || '01 July 2018'}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Assigned Ward / Room</span>
                <span className="fw-semibold">Ward 3B, Room 102</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  );
}

export default DoctorDetailsPage;
