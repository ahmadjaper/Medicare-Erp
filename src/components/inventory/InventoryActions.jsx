import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteMockInventoryItem } from '../../services/mockInventoryData';
import { useRole } from '../../context/RoleContext';

function InventoryActions({ id }) {
  const navigate = useNavigate();
  const { hasPermission } = useRole();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteMockInventoryItem(id);
      // Trigger a reload or UI update in a real app.
      // Here we just reload the page for simplicity since state is global/mocked.
      window.location.reload();
    }
  };

  return (
    <div className="dropdown position-relative">
      <button 
        className={`btn btn-sm btn-light border ${isOpen ? 'show' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        <i className="bi bi-three-dots-vertical"></i>
      </button>
      <ul className={`dropdown-menu dropdown-menu-end shadow-sm ${isOpen ? 'show' : ''}`} style={{ position: 'absolute', right: 0, top: '100%', zIndex: 1050, display: isOpen ? 'block' : 'none' }}>
        <li>
          <Link to={`/inventory/${id}`} className="dropdown-item d-flex align-items-center gap-2">
            <i className="bi bi-eye"></i> View Details
          </Link>
        </li>
        {hasPermission('Inventory', 'edit') && (
          <li>
            <Link to={`/inventory/${id}/edit`} className="dropdown-item d-flex align-items-center gap-2">
              <i className="bi bi-pencil"></i> Edit Item
            </Link>
          </li>
        )}
        {hasPermission('Inventory', 'delete') && (
          <>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={handleDelete}>
                <i className="bi bi-trash"></i> Delete
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default InventoryActions;
