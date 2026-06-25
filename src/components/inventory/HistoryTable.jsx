import React, { useState } from 'react';

function HistoryTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getTypeBadge = (type) => {
    if (type === 'Incoming') {
      return (
        <span className="badge rounded-pill bg-success bg-opacity-25 text-success px-3 py-2">
          <i className="bi bi-arrow-down-short fw-bold"></i> Incoming
        </span>
      );
    }
    if (type === 'Outgoing') {
      return (
        <span className="badge rounded-pill bg-danger bg-opacity-25 text-danger px-3 py-2">
          <i className="bi bi-arrow-up-short fw-bold"></i> Outgoing
        </span>
      );
    }
    return (
      <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 border border-primary-subtle border-opacity-50">
        <i className="bi bi-arrow-left-right fw-bold" style={{fontSize: '0.8rem'}}></i> Adjustment
      </span>
    );
  };

  const getQtyChangeText = (qty, unit) => {
    if (qty > 0) {
      return <div className="text-success fw-bold">+{qty.toLocaleString()}<br/><span className="fw-normal text-muted" style={{fontSize: '0.8rem'}}>{unit}</span></div>;
    }
    return <div className="text-danger fw-bold">{qty.toLocaleString()}<br/><span className="fw-normal text-muted" style={{fontSize: '0.8rem'}}>{unit}</span></div>;
  };

  const getInitialAvatar = (initials) => {
    return (
      <div className="d-flex align-items-center justify-content-center bg-dark text-white rounded-circle fw-bold shadow-sm" style={{width: '28px', height: '28px', fontSize: '0.7rem'}}>
        {initials}
      </div>
    );
  };

  return (
    <div className="dashboard-card p-0 d-flex flex-column justify-content-between">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0" style={{fontSize: '0.85rem'}}>
          <thead className="table-light text-muted border-bottom">
            <tr>
              <th className="fw-semibold ps-4 py-3 border-0">Timestamp</th>
              <th className="fw-semibold py-3 border-0">Item Name</th>
              <th className="fw-semibold py-3 border-0">Category</th>
              <th className="fw-semibold py-3 border-0">Type</th>
              <th className="fw-semibold py-3 border-0 text-center">Qty Change</th>
              <th className="fw-semibold py-3 border-0">Performed By</th>
              <th className="fw-semibold py-3 border-0 pe-4">Source / Destination</th>
            </tr>
          </thead>
          <tbody className="border-top-0">
            {paginatedData.length > 0 ? (
              paginatedData.map(record => (
                <tr key={record.id}>
                  <td className="ps-4 text-muted">
                    <div className="text-dark">{record.timestamp.split(' ')[0]}</div>
                    <div style={{fontSize: '0.8rem'}}>{record.timestamp.split(' ')[1]}</div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-light rounded p-2 text-muted border">
                        <i className={`bi ${record.item.category === 'Laboratory' ? 'bi-droplet' : record.item.category === 'Pharmaceuticals' ? 'bi-capsule' : record.item.category === 'PPE' ? 'bi-person-badge' : 'bi-box-seam'}`}></i>
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{record.item.name}</div>
                        <div className="text-muted" style={{fontSize: '0.8rem'}}>ID: {record.item.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-muted">{record.item.category}</td>
                  <td>{getTypeBadge(record.type)}</td>
                  <td className="text-center">{getQtyChangeText(record.qtyChange, record.item.unit)}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {getInitialAvatar(record.performedBy.initials)}
                      <div className="text-muted">
                        <div className="text-dark fw-semibold">{record.performedBy.name.split(' ')[0]}</div>
                        <div style={{fontSize: '0.8rem'}}>{record.performedBy.name.split(' ')[1]}</div>
                      </div>
                    </div>
                  </td>
                  <td className="pe-4 text-muted">
                    {record.sourceDestination.split('(')[0]}<br/>
                    {record.sourceDestination.includes('(') && <span style={{fontSize: '0.8rem'}}>({record.sourceDestination.split('(')[1]}</span>}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-5 text-muted">
                  No stock movement records found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center p-3 px-4 border-top">
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
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(page)}>{page}</button>
                  </li>
                );
              }
              if (page === currentPage - 2 || page === currentPage + 2) {
                return <li key={page} className="page-item disabled"><span className="page-link border-0">...</span></li>;
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
    </div>
  );
}

export default HistoryTable;
