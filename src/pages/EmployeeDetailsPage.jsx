import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { getEmployeeById } from '../services/api';
import { useErpStore } from '../store/erpStore';

function EmployeeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    getEmployeeById(id).then(emp => {
      setEmployee(emp);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <>
        <div className="top-navbar mb-4">
          <div>
            <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
              <span className="text-muted">Employees</span>
              <span className="mx-1">&gt;</span>
              <span className="text-dark fw-bold">Not Found</span>
            </nav>
          </div>
          <TopNavbar />
        </div>
        <div className="alert alert-danger" role="alert">
          Employee with ID {id} was not found.
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/employees')}>
          Back to Employees
        </button>
      </>
    );
  }

  // Get status color tag
  const getStatusTagClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-success-subtle text-success';
      case 'On Leave':
        return 'bg-warning-subtle text-warning';
      case 'Inactive':
      case 'Suspended':
        return 'bg-danger-subtle text-danger';
      default:
        return 'bg-secondary-subtle text-secondary';
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const tabs = ['Overview', 'Employment', 'Documents', 'Certificates', 'Skills', 'Emergency Contact'];

  // Dynamic deterministic fallback generator based on Employee ID
  const getHash = (str) => {
    let hash = 0;
    if (!str) return 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };
  
  const empHash = getHash(employee.id);

  const safeEducation = employee.education?.length > 0 ? employee.education : [
    { year: "2012 - 2016", degree: empHash % 2 === 0 ? `Master's in ${employee.department || 'Healthcare'}` : `MBA in ${employee.department || 'Management'}`, institution: "Cityville University" },
    { year: "2008 - 2012", degree: "Bachelor Degree", institution: "State University" }
  ];

  const safeExperience = employee.experience?.length > 0 ? employee.experience : [
    { year: "2021 - Present", title: employee.designation || 'Staff', company: "MediCore Hospital" },
    { year: "2018 - 2021", title: `Senior Specialist`, company: "City Health Center" },
    { year: "2016 - 2018", title: `Assistant`, company: "Wellness Hospital" }
  ];

  // Generate relevant skills based on department
  const hrSkills = ["Recruitment", "Employee Relations", "Performance Management", "Communication", "Problem Solving"];
  const techSkills = ["Software Development", "System Administration", "Network Security", "Technical Support", "Database Management"];
  const financeSkills = ["Budgeting", "Financial Analysis", "Accounting", "Risk Management", "Compliance"];
  const medicalSkills = ["Patient Care", "Medical Diagnostics", "Clinical Operations", "Treatment Planning", "Emergency Response"];
  
  let baseSkills = medicalSkills;
  const dept = employee.department?.toLowerCase() || '';
  if (dept.includes("hr") || dept.includes("human")) baseSkills = hrSkills;
  else if (dept.includes("it") || dept.includes("tech") || dept.includes("information")) baseSkills = techSkills;
  else if (dept.includes("finance") || dept.includes("account")) baseSkills = financeSkills;
  else if (dept.includes("operations") || dept.includes("admin")) baseSkills = ["Process Optimization", "Logistics", "Facility Management", "Team Leadership", "Communication"];

  const safeSkills = employee.skills?.length > 0 ? employee.skills : [
    baseSkills[empHash % baseSkills.length],
    baseSkills[(empHash + 1) % baseSkills.length],
    baseSkills[(empHash + 2) % baseSkills.length],
    baseSkills[(empHash + 3) % baseSkills.length]
  ];

  const safeDocuments = employee.documents?.length > 0 ? employee.documents : [
    { name: "Employment Contract", type: "PDF", size: `${(empHash % 5) + 1}.${empHash % 9} MB`, date: employee.joiningDate.split(' ')[0] + ' ' + employee.joiningDate.split(' ')[2] },
    { name: "National ID Copy", type: "PDF", size: `${(empHash % 3) + 1}.${(empHash + 5) % 9} MB`, date: employee.joiningDate.split(' ')[0] + ' ' + employee.joiningDate.split(' ')[2] },
    ...(empHash % 2 === 0 ? [{ name: "Medical Clearance", type: "PDF", size: `0.${empHash % 9} MB`, date: employee.joiningDate.split(' ')[0] + ' ' + employee.joiningDate.split(' ')[2] }] : [])
  ];

  const safeCertificates = employee.certificates?.length > 0 ? employee.certificates : [
    { name: `${employee.department || 'Professional'} Certification`, issuer: "Global Health Board", year: 2018 + (empHash % 6) },
    { name: "Advanced Training Program", issuer: "MediCore Academy", year: 2020 + (empHash % 4) }
  ];

  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez"];
  const emergencyName = employee.emergencyContactName || `${lastNames[empHash % lastNames.length]} Family`;
  const emergencyRelation = employee.emergencyContactRelation || (empHash % 2 === 0 ? "Spouse" : "Parent");
  
  // Pad hash to ensure enough digits for phone
  const hashStr = (empHash * 12345).toString().padStart(8, '0');
  const emergencyPhone = employee.emergencyContactPhone || `+1 (555) 01${hashStr.substring(0, 2)}-${hashStr.substring(2, 6)}`;

  const handleViewDoc = (name) => {
    useErpStore.getState().showToast(`Document viewer initialized for: ${name}`, "info");
  };

  const handleDownloadDoc = (name) => {
    useErpStore.getState().showToast(`Starting secure download for: ${name}`, "info");
  };

  const handleDeleteProfile = () => {
    useErpStore.getState().deleteEmployee(employee.id);
    useErpStore.getState().showToast("Employee deleted successfully!", "success");
    navigate('/employees');
  };

  return (
    <>
      {/* Top Navbar Section */}
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb" style={{ fontSize: '0.85rem' }}>
            <span className="text-muted" style={{ cursor: 'pointer' }} onClick={() => navigate('/employees')}>Employees</span>
            <span className="mx-1.5 text-muted">&gt;</span>
            <span className="text-primary fw-bold" style={{ cursor: 'pointer' }}>Employee Profile</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h1 className="page-title mb-0" style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Employee Profile</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary d-flex align-items-center gap-2 fw-semibold px-3 py-1.5" style={{ borderRadius: '6px' }} onClick={() => navigate(`/employees/${id}/edit`)}>
            <i className="bi bi-pencil"></i> Edit Profile
          </button>
          <div className="dropdown">
            <button className="btn btn-primary d-flex align-items-center justify-content-center" data-bs-toggle="dropdown" aria-expanded="false" style={{ width: '38px', borderRadius: '6px' }}>
              <i className="bi bi-three-dots-vertical"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ borderRadius: '8px', fontSize: '0.9rem' }}>
              <li>
                <button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => window.print()}>
                  <i className="bi bi-printer text-primary"></i> Print Details
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger d-flex align-items-center gap-2 py-2 fw-semibold hover-bg-light" onClick={handleDeleteProfile}>
                  <i className="bi bi-trash3"></i> Delete Employee
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="card bg-white border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '12px' }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
          
          {/* Left Side: Avatar & Info */}
          <div className="d-flex align-items-center gap-4">
            <div className="position-relative">
              <div className="avatar-placeholder rounded bg-light text-primary d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>
                {getInitials(employee.name)}
              </div>
              <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-white border-2 rounded-circle" style={{ transform: 'translate(25%, 25%)' }}></span>
            </div>
            
            <div>
              <h2 className="fw-bold text-dark mb-1" style={{ fontSize: '1.75rem', letterSpacing: '-0.5px' }}>{employee.name}</h2>
              <div className="fw-semibold text-primary mb-3" style={{ fontSize: '0.95rem' }}>{employee.designation}</div>
              
              <div className="d-flex flex-wrap gap-3 text-muted" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                <span className="d-flex align-items-center gap-1.5 bg-light px-2 py-1 rounded">
                  <i className="bi bi-person-badge"></i> {employee.id}
                </span>
                <span className="d-flex align-items-center gap-1.5 bg-light px-2 py-1 rounded">
                  <i className="bi bi-building"></i> {employee.department}
                </span>
                <span className="d-flex align-items-center gap-1.5 bg-light px-2 py-1 rounded">
                  <i className="bi bi-geo-alt"></i> {employee.address || 'Admin Building'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Status & Joined */}
          <div className="d-flex gap-5 border-start ps-5 py-2">
            <div className="d-flex flex-column gap-1">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>Status</span>
              <span className={`badge px-3 py-1.5 rounded-pill ${getStatusTagClass(employee.status)}`} style={{ fontSize: '0.8rem' }}>
                {employee.status}
              </span>
            </div>
            <div className="d-flex flex-column gap-1">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>Joined</span>
              <div className="fw-bold text-dark" style={{ fontSize: '1rem' }}>
                {employee.joiningDate.split(' ')[0]} <br/> {employee.joiningDate.split(' ').slice(1).join(' ')}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-bottom border-2 mb-4 d-flex gap-4 overflow-auto" style={{ paddingBottom: '2px' }}>
        {tabs.map((tab) => (
          <button 
            key={tab}
            className={`btn btn-link text-decoration-none px-0 py-2 fw-bold text-nowrap position-relative`}
            onClick={() => setActiveTab(tab)}
            style={{ 
              color: activeTab === tab ? '#0d6efd' : '#6c757d',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            {tab}
            {activeTab === tab && (
              <div className="position-absolute bottom-0 start-0 w-100 bg-primary" style={{ height: '3px', borderRadius: '3px 3px 0 0', transform: 'translateY(2px)' }}></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="tab-content text-start">
        {activeTab === 'Overview' && (
          <div className="row g-4">
            {/* Left Column */}
            <div className="col-12 col-xl-5 d-flex flex-column gap-4">
              <div className="card bg-white border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}>About</h6>
                <p className="text-muted mb-4" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                  {employee.about || `Dedicated ${employee.department} professional with extensive experience.`}
                </p>
                <hr className="text-muted opacity-25 my-0 mb-3" />
                
                <div className="d-flex flex-column gap-3" style={{ fontSize: '0.85rem' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted fw-semibold">Email</span>
                    <span className="fw-bold text-dark">{employee.email}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted fw-semibold">Phone</span>
                    <span className="fw-bold text-dark">{employee.phone}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted fw-semibold">Date of Birth</span>
                    <span className="fw-bold text-dark">{employee.dob}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted fw-semibold">Gender</span>
                    <span className="fw-bold text-dark">{employee.gender}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted fw-semibold">Nationality</span>
                    <span className="fw-bold text-dark">{employee.nationality || 'American'}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted fw-semibold">Language</span>
                    <span className="fw-bold text-dark">{employee.language || 'English'}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted fw-semibold">Marital Status</span>
                    <span className="fw-bold text-dark">{employee.maritalStatus || (empHash % 3 === 0 ? 'Single' : 'Married')}</span>
                  </div>
                </div>
              </div>
              
              {/* Skills Card in Overview (per design) */}
              <div className="card bg-white border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                <h6 className="fw-bold text-dark mb-3" style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}>Skills</h6>
                <div className="d-flex flex-wrap gap-2">
                  {safeSkills.map((skill, idx) => (
                    <span key={idx} className="badge px-3 py-2 fw-semibold" style={{ backgroundColor: '#e2e8f0', color: '#1e293b', fontSize: '0.8rem', borderRadius: '20px' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Timelines */}
            <div className="col-12 col-xl-7">
              <div className="card bg-white border-0 shadow-sm p-4 h-100" style={{ borderRadius: '12px' }}>
                <div className="row">
                  {/* Education Timeline */}
                  <div className="col-12 col-md-6 mb-4 mb-md-0 border-end border-light">
                    <h6 className="fw-bold text-dark d-flex align-items-center gap-2 mb-4" style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                      <i className="bi bi-mortarboard text-muted"></i> Education
                    </h6>
                    <div className="timeline-wrapper position-relative ps-3">
                      <div className="bg-light position-absolute top-0 bottom-0 start-0" style={{ width: '2px' }}></div>
                      
                      {safeEducation.map((edu, idx) => (
                        <div key={idx} className="position-relative mb-4" style={{ zIndex: 2 }}>
                          <span className="position-absolute bg-primary rounded-circle" style={{ top: 4, left: -16, width: '8px', height: '8px' }}></span>
                          <div className="badge bg-primary-subtle text-primary fw-semibold px-2 py-1 mb-2" style={{ fontSize: '0.7rem' }}>{edu.year}</div>
                          <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{edu.degree}</div>
                          <div className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>{edu.institution}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience Timeline */}
                  <div className="col-12 col-md-6 ps-md-4">
                    <h6 className="fw-bold text-dark d-flex align-items-center gap-2 mb-4" style={{ fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                      <i className="bi bi-briefcase text-muted"></i> Experience
                    </h6>
                    <div className="timeline-wrapper position-relative ps-3">
                      <div className="bg-light position-absolute top-0 bottom-0 start-0" style={{ width: '2px' }}></div>
                      
                      {safeExperience.map((exp, idx) => (
                        <div key={idx} className="position-relative mb-4" style={{ zIndex: 2 }}>
                          <span className="position-absolute bg-secondary rounded-circle" style={{ top: 4, left: -16, width: '8px', height: '8px' }}></span>
                          <div className="badge bg-light text-secondary fw-semibold border px-2 py-1 mb-2" style={{ fontSize: '0.7rem' }}>{exp.year}</div>
                          <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{exp.title}</div>
                          <div className="text-muted mt-1" style={{ fontSize: '0.8rem' }}>{exp.company}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Employment' && (
          <div className="card bg-white border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
            <h6 className="fw-bold text-dark mb-4 border-bottom pb-3">Employment Details</h6>
            <div className="row g-4" style={{ fontSize: '0.9rem' }}>
              <div className="col-12 col-sm-6 col-lg-3">
                <span className="text-muted d-block mb-1 fw-semibold">Department</span>
                <span className="fw-bold text-dark">{employee.department}</span>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <span className="text-muted d-block mb-1 fw-semibold">Designation</span>
                <span className="fw-bold text-dark">{employee.designation}</span>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <span className="text-muted d-block mb-1 fw-semibold">Employment Type</span>
                <span className="fw-bold text-dark">{employee.employmentType || 'Full-Time'}</span>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <span className="text-muted d-block mb-1 fw-semibold">Salary Grade</span>
                <span className="fw-bold text-dark">{employee.salaryGrade || 'Grade 10'}</span>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <span className="text-muted d-block mb-1 fw-semibold">Joining Date</span>
                <span className="fw-bold text-dark">{employee.joiningDate}</span>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <span className="text-muted d-block mb-1 fw-semibold">Manager (Reports To)</span>
                <span className="fw-bold text-primary">{employee.reportsTo || 'N/A'}</span>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <span className="text-muted d-block mb-1 fw-semibold">Work Location</span>
                <span className="fw-bold text-dark">{employee.address || 'Admin Building'}</span>
              </div>
              <div className="col-12 col-sm-6 col-lg-3">
                <span className="text-muted d-block mb-1 fw-semibold">Employee Status</span>
                <span className={`badge px-2 py-1 ${getStatusTagClass(employee.status)}`}>{employee.status}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Skills' && (
          <div className="card bg-white border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
            <h6 className="fw-bold text-dark mb-4 border-bottom pb-3">Professional Skills</h6>
            <div className="d-flex flex-wrap gap-2">
              {safeSkills.map((skill, idx) => (
                <span key={idx} className="badge px-3 py-2 fw-semibold" style={{ backgroundColor: '#e2e8f0', color: '#1e293b', fontSize: '0.85rem', borderRadius: '20px' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Documents' && (
          <div className="card bg-white border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
            <h6 className="fw-bold text-dark mb-4 border-bottom pb-3">Employee Documents</h6>
            <div className="row g-3">
              {safeDocuments.map((doc, idx) => (
                <div key={idx} className="col-12 col-md-6 col-xl-4">
                  <div className="d-flex align-items-center justify-content-between border rounded p-3 bg-light bg-opacity-50 hover-bg-light transition-all">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-danger-subtle text-danger rounded d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-file-earmark-pdf-fill fs-5"></i>
                      </div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{doc.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{doc.size} • {doc.date}</div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-light text-primary border" onClick={() => handleViewDoc(doc.name)} title="View Document"><i className="bi bi-eye"></i></button>
                      <button className="btn btn-sm btn-light text-dark border" onClick={() => handleDownloadDoc(doc.name)} title="Download Document"><i className="bi bi-download"></i></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Certificates' && (
          <div className="card bg-white border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
            <h6 className="fw-bold text-dark mb-4 border-bottom pb-3">Certificates & Awards</h6>
            <div className="row g-3">
              {safeCertificates.map((cert, idx) => (
                <div key={idx} className="col-12 col-md-6 col-xl-4">
                  <div className="d-flex align-items-center justify-content-between border rounded p-3 bg-light bg-opacity-50 hover-bg-light transition-all">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-warning-subtle text-warning rounded d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-award-fill fs-5"></i>
                      </div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>{cert.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{cert.issuer} • {cert.year}</div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-light text-primary border" onClick={() => handleViewDoc(cert.name)} title="View Certificate"><i className="bi bi-eye"></i></button>
                      <button className="btn btn-sm btn-light text-dark border" onClick={() => handleDownloadDoc(cert.name)} title="Download Certificate"><i className="bi bi-download"></i></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Emergency Contact' && (
          <div className="card bg-white border-0 shadow-sm p-4" style={{ borderRadius: '12px', maxWidth: '600px' }}>
            <h6 className="fw-bold text-dark mb-4 border-bottom pb-3">Emergency Contact Information</h6>
            <div className="d-flex flex-column gap-3" style={{ fontSize: '0.9rem' }}>
              <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-light">
                <span className="text-muted fw-semibold">Contact Name</span>
                <span className="fw-bold text-dark">{emergencyName}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-light">
                <span className="text-muted fw-semibold">Relationship</span>
                <span className="fw-bold text-dark">{emergencyRelation}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-light">
                <span className="text-muted fw-semibold">Phone Number</span>
                <span className="fw-bold text-dark">{emergencyPhone}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center py-2">
                <span className="text-muted fw-semibold">Address</span>
                <span className="fw-bold text-dark">{employee.address || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div className="toast show align-items-center bg-white border shadow" role="alert" style={{ borderRadius: '8px' }}>
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center gap-2 fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>
                <i className="bi bi-info-circle-fill text-primary fs-5"></i>
                {toastMessage}
              </div>
              <button type="button" className="btn-close me-3 m-auto" onClick={() => setToastMessage("")}></button>
            </div>
            <div className="progress" style={{ height: '3px' }}>
              <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary w-100"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmployeeDetailsPage;
