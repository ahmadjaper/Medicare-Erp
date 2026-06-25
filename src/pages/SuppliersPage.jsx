import React from 'react';
import TopNavbar from '../components/TopNavbar';
import { useErpStore } from '../store/erpStore';

function SuppliersPage() {
  const { suppliers } = useErpStore();

  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Inventory</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Suppliers</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="mb-4">
        <h1 className="page-title">Suppliers Directory</h1>
      </div>

      <div className="dashboard-card p-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.9rem' }}>
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ fontWeight: 600 }}>Supplier Name</th>
                <th scope="col" style={{ fontWeight: 600 }}>Category</th>
                <th scope="col" style={{ fontWeight: 600 }}>Contact Info</th>
                <th scope="col" style={{ fontWeight: 600 }}>Email Address</th>
                <th scope="col" style={{ fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier, idx) => (
                <tr key={idx}>
                  <td className="fw-bold text-dark">{supplier.name}</td>
                  <td>{supplier.suppliesCategory}</td>
                  <td>{supplier.contact}</td>
                  <td>{supplier.email}</td>
                  <td>
                    <span className="badge-active bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded">
                      {supplier.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default SuppliersPage;
