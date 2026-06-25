import React from 'react';

function InventoryFilters({
  categories,
  suppliers,
  statuses,
  selectedCategory,
  setSelectedCategory,
  selectedSupplier,
  setSelectedSupplier,
  selectedStatus,
  setSelectedStatus,
  onExport
}) {
  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 border-bottom pb-3">
      <div className="d-flex align-items-center gap-3 flex-wrap">
        <div className="d-flex align-items-center gap-2 text-muted pe-3 border-end">
          <i className="bi bi-filter"></i>
          <span className="fw-semibold">Filters</span>
        </div>
        
        <select 
          className="form-select form-select-sm border-secondary-subtle" 
          style={{ width: '150px' }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
        
        <select 
          className="form-select form-select-sm border-secondary-subtle" 
          style={{ width: '150px' }}
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
        >
          <option value="">All Suppliers</option>
          {suppliers.map((sup, idx) => (
            <option key={idx} value={sup}>{sup}</option>
          ))}
        </select>

        <select 
          className="form-select form-select-sm border-secondary-subtle" 
          style={{ width: '150px' }}
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statuses.map((stat, idx) => (
            <option key={idx} value={stat}>{stat}</option>
          ))}
        </select>
      </div>

      <div>
        <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2" onClick={onExport} title="Export to CSV">
          <i className="bi bi-download"></i>
        </button>
      </div>
    </div>
  );
}

export default InventoryFilters;
