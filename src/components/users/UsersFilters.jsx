import React from 'react';

function UsersFilters({ searchQuery, setSearchQuery, handleExport }) {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-0 p-3 border-bottom">
      <div className="position-relative" style={{maxWidth: '350px', width: '100%'}}>
        <i className="bi bi-search position-absolute text-muted" style={{top: '50%', transform: 'translateY(-50%)', left: '15px'}}></i>
        <input 
          type="text" 
          className="form-control bg-light rounded-2 ps-5" 
          placeholder="Search users..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="d-flex gap-2">
        <button className="btn btn-white border fw-semibold rounded-2 d-flex align-items-center gap-2 text-dark">
          <i className="bi bi-filter"></i> Filter
        </button>
        <button className="btn btn-white border fw-semibold rounded-2 d-flex align-items-center gap-2 text-dark" onClick={handleExport}>
          <i className="bi bi-download"></i> Export
        </button>
      </div>
    </div>
  );
}

export default UsersFilters;
