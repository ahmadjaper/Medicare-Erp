import React from 'react';

function InventoryStatsCards({ data }) {
  const stats = {
    total: data.length,
    medicines: data.filter(item => item.category === 'Medicine').length,
    medicalSupplies: data.filter(item => item.category === 'Medical Supplies').length,
    equipment: data.filter(item => item.category === 'Equipment').length,
    labSupplies: data.filter(item => item.category === 'Lab Supplies').length
  };

  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-md">
        <div className="dashboard-card p-3 d-flex flex-column justify-content-between h-100">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className="text-muted text-uppercase fw-semibold" style={{fontSize: '0.8rem', letterSpacing: '0.5px'}}>Total Items</span>
            <div className="bg-primary bg-opacity-10 rounded p-1 text-primary">
              <i className="bi bi-stack" style={{fontSize: '1rem'}}></i>
            </div>
          </div>
          <h2 className="mb-0 fw-bold">{stats.total.toLocaleString()}</h2>
        </div>
      </div>
      <div className="col-12 col-md">
        <div className="dashboard-card p-3 d-flex flex-column justify-content-between h-100">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className="text-muted text-uppercase fw-semibold" style={{fontSize: '0.8rem', letterSpacing: '0.5px'}}>Medicines</span>
            <div className="bg-primary bg-opacity-10 rounded p-1 text-primary">
              <i className="bi bi-capsule" style={{fontSize: '1rem'}}></i>
            </div>
          </div>
          <h2 className="mb-0 fw-bold">{stats.medicines.toLocaleString()}</h2>
        </div>
      </div>
      <div className="col-12 col-md">
        <div className="dashboard-card p-3 d-flex flex-column justify-content-between h-100">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className="text-muted text-uppercase fw-semibold" style={{fontSize: '0.8rem', letterSpacing: '0.5px'}}>Med Supplies</span>
            <div className="bg-primary bg-opacity-10 rounded p-1 text-primary">
              <i className="bi bi-bandaid" style={{fontSize: '1rem'}}></i>
            </div>
          </div>
          <h2 className="mb-0 fw-bold">{stats.medicalSupplies.toLocaleString()}</h2>
        </div>
      </div>
      <div className="col-12 col-md">
        <div className="dashboard-card p-3 d-flex flex-column justify-content-between h-100">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className="text-muted text-uppercase fw-semibold" style={{fontSize: '0.8rem', letterSpacing: '0.5px'}}>Equipment</span>
            <div className="bg-primary bg-opacity-10 rounded p-1 text-primary">
              <i className="bi bi-heart-pulse" style={{fontSize: '1rem'}}></i>
            </div>
          </div>
          <h2 className="mb-0 fw-bold">{stats.equipment.toLocaleString()}</h2>
        </div>
      </div>
      <div className="col-12 col-md">
        <div className="dashboard-card p-3 d-flex flex-column justify-content-between h-100">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className="text-muted text-uppercase fw-semibold" style={{fontSize: '0.8rem', letterSpacing: '0.5px'}}>Lab Supplies</span>
            <div className="bg-primary bg-opacity-10 rounded p-1 text-primary">
              <i className="bi bi-droplet" style={{fontSize: '1rem'}}></i>
            </div>
          </div>
          <h2 className="mb-0 fw-bold">{stats.labSupplies.toLocaleString()}</h2>
        </div>
      </div>
    </div>
  );
}

export default InventoryStatsCards;
