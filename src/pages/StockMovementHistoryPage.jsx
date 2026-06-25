import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import HistoryFilters from '../components/inventory/HistoryFilters';
import HistoryTable from '../components/inventory/HistoryTable';
import { getMockHistoryData } from '../services/mockInventoryHistoryData';

function StockMovementHistoryPage() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  
  // Filter state
  const [dateRange, setDateRange] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  // Filters to apply
  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: '',
    category: '',
    type: ''
  });

  useEffect(() => {
    setHistoryData(getMockHistoryData());
  }, []);

  const categories = [...new Set(historyData.map(record => record.item.category))];
  const types = ['Incoming', 'Outgoing', 'Adjustment'];

  const handleApply = () => {
    setAppliedFilters({
      dateRange: dateRange,
      category: selectedCategory,
      type: selectedType
    });
  };

  const handleClear = () => {
    setDateRange('');
    setSelectedCategory('');
    setSelectedType('');
    setAppliedFilters({
      dateRange: '',
      category: '',
      type: ''
    });
  };

  const filteredData = useMemo(() => {
    return historyData.filter(record => {
      // Basic date filter logic if implemented correctly. We mock it for the demo string "Oct 01 - Oct 31, 2023"
      // Real implementation would parse dates. We just skip filtering by date unless strict matching is needed.
      const matchCategory = appliedFilters.category === '' || record.item.category === appliedFilters.category;
      const matchType = appliedFilters.type === '' || record.type === appliedFilters.type;
      return matchCategory && matchType;
    });
  }, [historyData, appliedFilters]);

  const handleExportCSV = () => {
    if (filteredData.length === 0) return;
    
    const headers = ['Timestamp', 'Item Name', 'Item ID', 'Category', 'Type', 'Qty Change', 'Unit', 'Performed By', 'Source/Destination'];
    const csvRows = [headers.join(',')];
    
    filteredData.forEach(record => {
      const row = [
        `"${record.timestamp}"`,
        `"${record.item.name}"`,
        `"${record.item.id}"`,
        `"${record.item.category}"`,
        `"${record.type}"`,
        `"${record.qtyChange}"`,
        `"${record.item.unit}"`,
        `"${record.performedBy.name}"`,
        `"${record.sourceDestination}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Stock_Movement_History_${new Date().getTime()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-section">
      <div className="top-navbar mb-4 d-print-none">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Inventory</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Stock Movement History</span>
          </nav>
        </div>
        <TopNavbar showUserRole={false} />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="page-title mb-1 d-flex align-items-center gap-2">
            Stock Movement History
          </h1>
          <p className="text-muted mb-0" style={{fontSize: '0.9rem'}}>Detailed audit log of all inventory transactions.</p>
        </div>
        <div className="d-flex align-items-center gap-2 d-print-none">
          <button className="btn btn-primary fw-semibold d-flex align-items-center gap-2 shadow-sm px-3" onClick={() => navigate('/inventory/low-stock-alerts')}>
            <i className="bi bi-bell-fill"></i> Low Stock Alerts
          </button>
          <button className="btn btn-light border fw-semibold d-flex align-items-center gap-2 shadow-sm px-3" onClick={handleExportCSV}>
            <i className="bi bi-download"></i> Export CSV
          </button>
          <button className="btn btn-dark fw-semibold d-flex align-items-center gap-2 shadow-sm px-3" onClick={handlePrint}>
            <i className="bi bi-printer"></i> Print Report
          </button>
        </div>
      </div>

      <div className="d-print-none">
        <HistoryFilters 
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          categories={categories}
          types={types}
          onClear={handleClear}
          onApply={handleApply}
        />
      </div>

      <HistoryTable data={filteredData} />
    </div>
  );
}

export default StockMovementHistoryPage;
