import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import DoctorStatCard from '../components/DoctorStatCard';
import DoctorsTable from '../components/DoctorsTable';
import DeleteDoctorModal from '../components/DeleteDoctorModal';
import { doctors, doctorStatistics } from '../data/doctorsData';
import '../assets/css/doctors.css';

function DoctorsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [doctorsList, setDoctorsList] = useState(doctors);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const handleDeleteConfirm = () => {
    if (!doctorToDelete) return;
    
    const index = doctors.findIndex(doc => doc.id === doctorToDelete.id);
    if (index !== -1) {
      const deletedDoc = doctors[index];
      doctors.splice(index, 1);
      
      // Update statistics in-place
      if (deletedDoc.status === 'Active') {
        doctorStatistics.active = Math.max(0, doctorStatistics.active - 1);
      } else if (deletedDoc.status === 'On Leave') {
        doctorStatistics.onLeave = Math.max(0, doctorStatistics.onLeave - 1);
      }
      doctorStatistics.total = Math.max(0, doctorStatistics.total - 1);
      
      setDoctorsList([...doctors]);
      alert(`Success: Doctor record for ${deletedDoc.name} has been deleted.`);
    }
    setDoctorToDelete(null);
  };

  // Filter logic combining Search, Department, and Status
  const filteredDoctors = doctorsList.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.id.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesDepartment = selectedDepartment === 'All' || doc.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All' || doc.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <>
      {/* Top Navbar & Header Breadcrumbs */}
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Management</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Doctors</span>
          </nav>
        </div>
        <TopNavbar showUserRole={true} />
      </div>

      {/* Main Title Row & Actions */}
      <div className="mb-4">
        <h1 className="page-title mb-1">Doctors</h1>
        <div className="text-muted" style={{ fontSize: '0.9rem' }}>
          Manage hospital doctors and specialists
        </div>
      </div>

      {/* Statistics Row */}
      <div className="stats-card-container mb-4">
        <DoctorStatCard 
          icon="bi-people" 
          iconColorClass="icon-blue" 
          label="TOTAL DOCTORS" 
          value={doctorStatistics.total} 
        />
        <DoctorStatCard 
          icon="bi-person-check" 
          iconColorClass="icon-green" 
          label="ACTIVE DOCTORS" 
          value={doctorStatistics.active} 
        />
        <DoctorStatCard 
          icon="bi-calendar-minus" 
          iconColorClass="icon-orange" 
          label="ON LEAVE" 
          value={doctorStatistics.onLeave} 
        />
        <DoctorStatCard 
          icon="bi-building" 
          iconColorClass="icon-gray" 
          label="DEPARTMENTS COVERED" 
          value={doctorStatistics.departmentsCovered} 
        />
      </div>

      {/* Toolbar / Action Bar */}
      <div className="dashboard-card p-3 mb-4">
        <div className="row g-3 align-items-center">
          {/* Search Input */}
          <div className="col-md-4">
            <div className="position-relative">
              <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                className="form-control ps-5" 
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.9rem', height: '40px' }}
              />
            </div>
          </div>
          
          {/* Department Filter */}
          <div className="col-md-3">
            <select 
              className="form-select" 
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{ fontSize: '0.9rem', height: '40px', cursor: 'pointer' }}
            >
              <option value="All">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Gastroenterology">Gastroenterology</option>
              <option value="Oncology">Oncology</option>
              <option value="Surgery">Surgery</option>
            </select>
          </div>
          
          {/* Status Filter */}
          <div className="col-md-3">
            <select 
              className="form-select" 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ fontSize: '0.9rem', height: '40px', cursor: 'pointer' }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          
          {/* Add Doctor Button */}
          <div className="col-md-2 text-md-end">
            <button 
              className="btn-medicore w-100 justify-content-center" 
              onClick={() => navigate('/doctors/create')}
              style={{ height: '40px' }}
            >
              <i className="bi bi-plus-lg"></i> Add Doctor
            </button>
          </div>
        </div>
      </div>

      {/* Doctors Table Grid */}
      <DoctorsTable doctorsList={filteredDoctors} onDeleteDoctor={(doc) => setDoctorToDelete(doc)} />

      {/* Delete Doctor Confirmation Modal */}
      <DeleteDoctorModal 
        doctor={doctorToDelete}
        isOpen={!!doctorToDelete}
        onClose={() => setDoctorToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}

export default DoctorsPage;
