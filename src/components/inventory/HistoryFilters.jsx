import React from 'react';

function HistoryFilters({
  dateRange, setDateRange,
  selectedCategory, setSelectedCategory,
  selectedType, setSelectedType,
  categories,
  types,
  onClear,
  onApply
}) {
  return (
    <div className="dashboard-card p-3 mb-4">
      <div className="row g-3 align-items-end">
        <div className="col-md-3">
          <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Date Range</label>
          <div className="input-group input-group-sm border-secondary-subtle">
            <span className="input-group-text bg-white"><i className="bi bi-calendar"></i></span>
            <input 
              type="text" 
              className="form-control form-control-sm border-start-0" 
              placeholder="Oct 01 - Oct 31, 2023"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />
          </div>
        </div>
        
        <div className="col-md-3">
          <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Category</label>
          <select 
            className="form-select form-select-sm border-secondary-subtle"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Transaction Type</label>
          <select 
            className="form-select form-select-sm border-secondary-subtle"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            {types.map((type, idx) => (
              <option key={idx} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3 d-flex justify-content-end gap-2">
          <button className="btn btn-sm btn-light border px-3 fw-semibold text-muted" onClick={onClear}>Clear</button>
          <button className="btn btn-sm btn-primary px-4 fw-semibold" onClick={onApply}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
}

export default HistoryFilters;
