import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DoctorsTable({ doctorsList, onDeleteDoctor }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  
  // Calculate index range
  const totalItems = doctorsList.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = doctorsList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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
    <div className="dashboard-card overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.85rem' }}>
          <thead className="table-header-custom">
            <tr>
              <th scope="col">DOCTOR ID</th>
              <th scope="col">DOCTOR NAME</th>
              <th scope="col">DEPARTMENT</th>
              <th scope="col">SPECIALTY</th>
              <th scope="col">PHONE</th>
              <th scope="col">EXPERIENCE</th>
              <th scope="col">CONSULTATION FEE</th>
              <th scope="col">STATUS</th>
              <th scope="col">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((doc) => (
              <tr key={doc.id} className="table-row-custom">
                <td className="fw-bold text-muted">{doc.id}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    {doc.avatar ? (
                      <img 
                        src={doc.avatar} 
                        alt={doc.name} 
                        className="doctor-table-avatar"
                        style={{ width: '30px', height: '30px' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'inline-flex';
                        }}
                      />
                    ) : null}
                    <span 
                      className="avatar-initials"
                      style={{ 
                        display: doc.avatar ? 'none' : 'inline-flex',
                        width: '30px',
                        height: '30px',
                        fontSize: '0.75rem'
                      }}
                    >
                      {doc.initials}
                    </span>
                    <span className="doctor-name-text">{doc.name}</span>
                  </div>
                </td>
                <td>{doc.department}</td>
                <td>{doc.specialty}</td>
                <td className="text-muted">{doc.phone}</td>
                <td>{doc.experience}</td>
                <td className="fw-bold">{doc.consultationFee}</td>
                <td>
                  <span className={`status-pill ${getStatusClass(doc.status)}`}>
                    {doc.status}
                  </span>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <button 
                      className="btn btn-sm btn-link p-0 text-primary" 
                      title="View Details"
                      onClick={() => navigate(`/doctors/details/${doc.id}`)}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button 
                      className="btn btn-sm btn-link p-0 text-secondary" 
                      title="Edit"
                      onClick={() => navigate(`/doctors/${doc.id}/edit`)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button 
                      className="btn btn-sm btn-link p-0 text-danger" 
                      title="Delete"
                      onClick={() => onDeleteDoctor && onDeleteDoctor(doc)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4 text-muted">
                  No doctors found matching the search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <div className="pagination-container">
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} doctors
          </div>
          
          <div className="pagination-controls">
            <button 
              className="pagination-btn" 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              <i className="bi bi-chevron-left"></i>
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`pagination-btn ${currentPage === index + 1 ? 'pagination-btn-active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button 
              className="pagination-btn" 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorsTable;
