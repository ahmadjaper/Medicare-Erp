import React from 'react';

function DoctorStatCard({ icon, iconColorClass, label, value, percentage }) {
  return (
    <div className="stats-card-custom">
      <div className={`stats-icon-wrapper ${iconColorClass}`}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div className="stats-info">
        <span className="stats-label">{label}</span>
        <div className="stats-value-wrapper">
          <span className="stats-value">{value}</span>
          {percentage && (
            <span className="stats-percentage-badge">{percentage}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorStatCard;
