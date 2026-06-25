import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import InventoryStatsCards from '../components/inventory/InventoryStatsCards';
import InventoryFilters from '../components/inventory/InventoryFilters';
import InventoryTable from '../components/inventory/InventoryTable';
import { getMockInventoryData, calculateStatus } from '../services/mockInventoryData';
import { useRole } from '../context/RoleContext';

function InventoryPage() {
  const { hasPermission } = useRole();
  const [inventoryData, setInventoryData] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    // Load mock data on mount
    setInventoryData(getMockInventoryData());
  }, []);

  // Get unique options for filters
  const categories = [...new Set(inventoryData.map(item => item.category))];
  const suppliers = [...new Set(inventoryData.map(item => item.supplier))];
  const statuses = ['In Stock', 'Low Stock', 'Out Of Stock'];

  // Apply filters and search
  const filteredData = useMemo(() => {
    return inventoryData.filter(item => {
      const matchSearch = searchTerm === '' || 
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = selectedCategory === '' || item.category === selectedCategory;
      const matchSupplier = selectedSupplier === '' || item.supplier === selectedSupplier;
      
      const calculatedStatus = calculateStatus(item.stockQuantity);
      const matchStatus = selectedStatus === '' || calculatedStatus === selectedStatus;

      return matchSearch && matchCategory && matchSupplier && matchStatus;
    });
  }, [inventoryData, searchTerm, selectedCategory, selectedSupplier, selectedStatus]);

  const handleExport = () => {
    if (!hasPermission('Inventory', 'export')) return;
    
    const csvContent = [
      ['Item Name', 'SKU', 'Category', 'Department', 'Supplier', 'Stock Quantity', 'Unit', 'Unit Price', 'Status', 'Expiry Date'],
      ...filteredData.map(item => [
        `"${item.itemName}"`,
        `"${item.sku}"`,
        `"${item.category}"`,
        `"${item.department || 'N/A'}"`,
        `"${item.supplier || 'N/A'}"`,
        item.stockQuantity,
        `"${item.unit}"`,
        item.unitPrice || 0,
        `"${calculateStatus(item.stockQuantity)}"`,
        `"${item.expiryDate || 'N/A'}"`
      ])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'inventory_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Inventory Management</span>
          </nav>
        </div>
        <TopNavbar 
          searchPlaceholder="Search inventory..." 
          onSearchChange={setSearchTerm} 
        />
      </div>

      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h1 className="page-title mb-1">Inventory Overview</h1>
          <p className="text-muted mb-0" style={{fontSize: '0.9rem'}}>Manage and track all hospital assets and supplies.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          {hasPermission('Inventory', 'create') && (
            <Link 
              to="/inventory/add"
              className="btn btn-primary px-4 fw-semibold shadow-sm"
            >
              + Add Inventory Item
            </Link>
          )}
          <div className="dropdown position-relative">
            <button 
              className={`btn btn-light border ${isDropdownOpen ? 'show' : ''}`}
              type="button" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              aria-expanded={isDropdownOpen}
            >
              <i className="bi bi-three-dots-vertical"></i>
            </button>
            <ul className={`dropdown-menu dropdown-menu-end shadow-sm ${isDropdownOpen ? 'show' : ''}`} style={{fontSize: '0.9rem', position: 'absolute', right: 0, top: '100%', zIndex: 1050, display: isDropdownOpen ? 'block' : 'none'}}>
              <li>
                <Link to="/inventory/history" className="dropdown-item d-flex align-items-center gap-2">
                  <i className="bi bi-clock-history"></i> Stock Movement History
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <InventoryStatsCards data={inventoryData} />

      <div className="dashboard-card p-4 mb-4">
        <InventoryFilters 
          categories={categories}
          suppliers={suppliers}
          statuses={statuses}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSupplier={selectedSupplier}
          setSelectedSupplier={setSelectedSupplier}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          onExport={hasPermission('Inventory', 'export') ? handleExport : undefined}
        />
        
        <InventoryTable data={filteredData} />
      </div>
    </>
  );
}

export default InventoryPage;
