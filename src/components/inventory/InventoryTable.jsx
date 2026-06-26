import React, { useState } from 'react';
import InventoryActions from './InventoryActions';
import { calculateStatus } from '../../services/mockInventoryData';

function InventoryTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (stock) => {
    const status = calculateStatus(stock);
    if (status === 'In Stock') {
      return <span className="badge rounded-pill bg-success bg-opacity-25 text-success px-3 py-2">In Stock</span>;
    }
    if (status === 'Low Stock') {
      return <span className="badge rounded-pill bg-primary bg-opacity-25 text-primary px-3 py-2">Low Stock</span>;
    }
    return <span className="badge rounded-pill bg-danger bg-opacity-25 text-danger px-3 py-2">Out of Stock</span>;
  };

  return (
    <div className="table-responsive" style={{minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <table className="table table-hover align-middle" style={{fontSize: '0.85rem'}}>
        <thead className="table-light text-muted">
          <tr>
            <th className="fw-semibold">Item Name</th>
            <th className="fw-semibold">SKU</th>
            <th className="fw-semibold">Category</th>
            <th className="fw-semibold">Department</th>
            <th className="fw-semibold">Supplier</th>
            <th className="fw-semibold">Stock</th>
            <th className="fw-semibold">Unit</th>
            <th className="fw-semibold">Status</th>
            <th className="fw-semibold">Expiry Date</th>
            <th className="fw-semibold text-end">Actions</th>
          </tr>
        </thead>
        <tbody className="border-top-0">
          {paginatedData.length > 0 ? (
            paginatedData.map(item => (
              <tr key={item.id}>
                <td className="fw-semibold text-dark">{item.itemName}</td>
                <td className="text-muted" style={{fontFamily: 'monospace'}}>{item.sku}</td>
                <td>{item.category}</td>
                <td>{item.department}</td>
                <td>{item.supplier}</td>
                <td className="fw-semibold">{item.stockQuantity.toLocaleString()}</td>
                <td>{item.unit}</td>
                <td>{getStatusBadge(item.stockQuantity)}</td>
                <td>{item.expiryDate}</td>
                <td className="text-end">
                  <InventoryActions id={item.id} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center py-5 text-muted">
                No inventory items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {data.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
          <span className="text-muted" style={{fontSize: '0.85rem'}}>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, data.length)} of {data.length} entries
          </span>
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                  <i className="bi bi-chevron-left"></i>
                </button>
              </li>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const page = idx + 1;
                // Simple pagination logic for demo
                if (
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                    </li>
                  );
                }
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return <li key={page} className="page-item disabled"><span className="page-link">...</span></li>;
                }
                return null;
              })}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                  <i className="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

export default InventoryTable;
