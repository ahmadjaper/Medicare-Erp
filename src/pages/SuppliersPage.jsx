import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { useErpStore } from '../store/erpStore';

function SuppliersPage() {
  const navigate = useNavigate();
  const { suppliers } = useErpStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Suppliers');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Enrich store suppliers to match the required visual fields
  const enrichedSuppliers = useMemo(() => {
    return suppliers.map((s, idx) => ({
      id: s.id || `SPL-120${idx + 1}`,
      name: s.name,
      contactPerson: s.contactPerson || "Representative Agent",
      email: s.email,
      phone: s.phone || s.contact || "+1 (555) 000-0000",
      categories: s.categories || [s.suppliesCategory || "General Supplies"],
      items: s.items || (20 + idx * 15),
      recentActivity: s.recentActivity || "Delivery arrived 2 days ago",
      status: s.status === "Preferred" ? "Active" : (s.status || "Active")
    }));
  }, [suppliers]);

  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  useEffect(() => {
    let result = enrichedSuppliers;

    // Tab Filtering
    if (activeTab !== 'All Suppliers') {
      result = result.filter(s => s.status === activeTab);
    }

    // Search Filtering
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(lowerQuery) || 
        s.id.toLowerCase().includes(lowerQuery) ||
        s.contactPerson.toLowerCase().includes(lowerQuery) ||
        s.email.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredSuppliers(result);
    setCurrentPage(1); // Reset to first page on filter change
  }, [activeTab, searchQuery, enrichedSuppliers]);

  // Pagination Logic
  const totalItems = filteredSuppliers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-1"><i className="bi bi-circle-fill me-2" style={{fontSize: '0.4rem', verticalAlign: 'middle'}}></i>Active</span>;
    }
    if (status === 'Inactive') {
      return <span className="badge rounded-pill bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 px-3 py-1"><i className="bi bi-circle-fill me-2" style={{fontSize: '0.4rem', verticalAlign: 'middle'}}></i>Inactive</span>;
    }
    return <span className="badge rounded-pill bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-3 py-1"><i className="bi bi-circle-fill me-2" style={{fontSize: '0.4rem', verticalAlign: 'middle'}}></i>{status}</span>;
  };

  return (
    <>
      <div className="top-navbar mb-4">
        <div className="search-bar w-50">
          <i className="bi bi-search text-muted"></i>
          <input 
            type="text" 
            className="form-control bg-light border-0" 
            placeholder="Search suppliers, items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <TopNavbar />
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2">
        <div>
          <h1 className="fw-bold mb-1" style={{color: '#1a1f36'}}>Suppliers</h1>
          <p className="text-muted mb-0">Manage hospital vendors, contracts, and supply chains.</p>
        </div>
        
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <div className="dropdown">
            <button className="btn btn-white border shadow-sm fw-semibold d-flex align-items-center px-4 py-2" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="bi bi-filter me-2"></i> Filter
            </button>
            <ul className="dropdown-menu shadow-sm">
              <li><h6 className="dropdown-header">Filter by Status</h6></li>
              <li><button className="dropdown-item" onClick={() => setActiveTab('All Suppliers')}>All</button></li>
              <li><button className="dropdown-item" onClick={() => setActiveTab('Active')}>Active</button></li>
              <li><button className="dropdown-item" onClick={() => setActiveTab('Inactive')}>Inactive</button></li>
            </ul>
          </div>
          <button className="btn btn-dark shadow-sm fw-semibold d-flex align-items-center px-4 py-2" onClick={() => navigate('/suppliers/add')}>
            <i className="bi bi-plus-lg me-2"></i> Add Supplier
          </button>
        </div>
      </div>

      <div className="card border shadow-sm rounded-4 mb-4">
        
        {/* Tabs & Meta Info */}
        <div className="d-flex justify-content-between align-items-center border-bottom px-4 pt-3 pb-0">
          <ul className="nav nav-tabs border-bottom-0 gap-4" style={{fontSize: '0.95rem', fontWeight: '500'}}>
            {['All Suppliers', 'Active'].map(tab => (
              <li className="nav-item" key={tab}>
                <button 
                  className={`nav-link px-0 pb-3 border-0 bg-transparent text-muted ${activeTab === tab ? 'active fw-bold' : ''}`}
                  style={{ 
                    color: activeTab === tab ? '#1a1f36' : '',
                    borderBottom: activeTab === tab ? '2px solid #0d6efd' : '2px solid transparent',
                    borderRadius: 0
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'All Suppliers' && activeTab === tab ? (
                    <span className="badge bg-primary rounded-pill px-3 py-2">{tab}</span>
                  ) : (
                    tab
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="text-muted small">
            Showing {totalItems > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, totalItems)} of {enrichedSuppliers.length} vendors
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 custom-table">
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3 text-muted fw-semibold small text-uppercase" style={{letterSpacing: '0.5px'}}>Supplier Name</th>
                <th className="py-3 text-muted fw-semibold small text-uppercase" style={{letterSpacing: '0.5px'}}>Contact Person</th>
                <th className="py-3 text-muted fw-semibold small text-uppercase" style={{letterSpacing: '0.5px'}}>Email / Phone</th>
                <th className="py-3 text-muted fw-semibold small text-uppercase" style={{letterSpacing: '0.5px'}}>Categories</th>
                <th className="py-3 text-muted fw-semibold small text-uppercase" style={{letterSpacing: '0.5px'}}>Items</th>
                <th className="py-3 text-muted fw-semibold small text-uppercase" style={{letterSpacing: '0.5px'}}>Recent Activity</th>
                <th className="py-3 text-muted fw-semibold small text-uppercase" style={{letterSpacing: '0.5px'}}>Status</th>
                <th className="px-4 py-3 text-muted fw-semibold small text-uppercase text-end" style={{letterSpacing: '0.5px'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? currentItems.map((supplier) => (
                <tr key={supplier.id}>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center">
                      <div className="rounded-2 d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px', backgroundColor: '#eef2f6', color: '#1a1f36', fontWeight: 'bold'}}>
                        {getInitials(supplier.name)}
                      </div>
                      <div>
                        <div className="fw-bold" style={{color: '#1a1f36'}}>{supplier.name}</div>
                        <div className="text-muted small">ID: {supplier.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="text-dark">{supplier.contactPerson.split(' ')[0]}</div>
                    <div className="text-dark">{supplier.contactPerson.split(' ')[1] || ""}</div>
                  </td>
                  <td className="py-3">
                    <div className="text-dark mb-1">{supplier.email}</div>
                    <div className="text-muted small">{supplier.phone}</div>
                  </td>
                  <td className="py-3">
                    <div className="d-flex flex-column gap-1 align-items-start">
                      {supplier.categories.map((cat, i) => (
                        <span key={i} className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2 py-1" style={{fontSize: '0.7rem', fontWeight: '600'}}>
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 text-dark fw-medium">
                    {supplier.items.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <div className="text-dark mb-1">{supplier.recentActivity.split(' ').slice(0, 3).join(' ')}</div>
                    <div className="text-muted small">{supplier.recentActivity.split(' ').slice(3).join(' ')}</div>
                  </td>
                  <td className="py-3">
                    {getStatusBadge(supplier.status)}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button className="btn btn-sm btn-light border text-muted" onClick={() => navigate(`/suppliers/${supplier.id}`)}>
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-light border text-muted" onClick={() => navigate(`/suppliers/${supplier.id}/edit`)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    No suppliers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="card-footer bg-white border-top px-4 py-3 d-flex justify-content-between align-items-center rounded-bottom-4">
          <button 
            className="btn btn-white border shadow-sm text-muted fw-medium px-3" 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="d-flex gap-1">
            {[...Array(Math.min(3, totalPages))].map((_, i) => (
              <button 
                key={i} 
                className={`btn ${currentPage === i + 1 ? 'btn-primary shadow-sm' : 'btn-white border-0 text-muted'} px-3`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            {totalPages > 3 && <span className="px-2 text-muted align-self-end mb-1">...</span>}
          </div>

          <button 
            className="btn btn-white border shadow-sm text-muted fw-medium px-4" 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default SuppliersPage;
