import React from 'react';
import { useUsersManagement } from '../../context/UsersManagementContext';

function UserStatsCards() {
  const { stats } = useUsersManagement();

  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card shadow-sm border-0 rounded-3 h-100">
          <div className="card-body p-4 d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted fw-bold" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>TOTAL USERS</span>
              <div className="bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                <i className="bi bi-people-fill"></i>
              </div>
            </div>
            <div className="fs-1 fw-bold text-dark">{stats.totalUsers}</div>
          </div>
        </div>
      </div>
      
      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card shadow-sm border-0 rounded-3 h-100">
          <div className="card-body p-4 d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted fw-bold" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>ACTIVE</span>
              <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                <i className="bi bi-check-circle"></i>
              </div>
            </div>
            <div className="fs-1 fw-bold text-dark">{stats.activeUsers}</div>
          </div>
        </div>
      </div>
      
      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card shadow-sm border-0 rounded-3 h-100">
          <div className="card-body p-4 d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted fw-bold" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>INACTIVE</span>
              <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                <i className="bi bi-x-circle"></i>
              </div>
            </div>
            <div className="fs-1 fw-bold text-dark">{stats.inactiveUsers}</div>
          </div>
        </div>
      </div>
      
      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card shadow-sm border-0 rounded-3 h-100">
          <div className="card-body p-4 d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted fw-bold" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>DOCTORS APP ACCESS</span>
              <div className="bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                <i className="bi bi-phone"></i>
              </div>
            </div>
            <div className="fs-1 fw-bold text-dark">{stats.doctorsAppAccess}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserStatsCards;
