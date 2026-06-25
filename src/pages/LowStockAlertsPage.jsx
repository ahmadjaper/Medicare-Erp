import React from 'react';
import TopNavbar from '../components/TopNavbar';
import { useErpStore } from '../store/erpStore';

function LowStockAlertsPage() {
  const { inventory } = useErpStore();

  const lowStockItems = inventory.filter(item => item.stock <= item.threshold);

  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Inventory</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Low Stock Alerts</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="mb-4">
        <h1 className="page-title">Low Stock Alerts</h1>
      </div>

      <div className="dashboard-card p-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.9rem' }}>
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ fontWeight: 600 }}>Item ID</th>
                <th scope="col" style={{ fontWeight: 600 }}>Item Name</th>
                <th scope="col" style={{ fontWeight: 600 }}>Category</th>
                <th scope="col" style={{ fontWeight: 600 }}>Current Stock</th>
                <th scope="col" style={{ fontWeight: 600 }}>Alert Threshold</th>
                <th scope="col" style={{ fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map((item) => {
                const isCritical = item.stock <= item.threshold * 0.5;
                return (
                  <tr key={item.id}>
                    <td className="fw-bold text-primary">{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td className="fw-bold text-danger">{item.stock} {item.unit}</td>
                    <td>{item.threshold} {item.unit}</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: isCritical ? '#fef2f2' : '#fffbeb',
                          color: isCritical ? '#ef4444' : '#d97706',
                          border: `1px solid ${isCritical ? '#fca5a5' : '#fde047'}`
                        }}
                      >
                        {isCritical ? "CRITICAL LOW" : "WARNING"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {lowStockItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-success fw-semibold">
                    <i className="bi bi-check-circle-fill me-2"></i> All inventory levels are above alert thresholds.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default LowStockAlertsPage;
