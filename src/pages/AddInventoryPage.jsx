import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { addMockInventoryItem } from '../services/mockInventoryData';

function AddInventoryPage() {
  const navigate = useNavigate();

  // Basic Info State
  const [category, setCategory] = useState('Medicine');
  const [itemName, setItemName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');

  // Stock Control State
  const [unitPrice, setUnitPrice] = useState('');
  const [initialQty, setInitialQty] = useState('');
  const [uom, setUom] = useState('Box');
  const [lowStockAlert, setLowStockAlert] = useState('');

  // Supplier State
  const [primarySupplier, setPrimarySupplier] = useState('');
  const [supplierCode, setSupplierCode] = useState('');
  const [secondarySuppliers, setSecondarySuppliers] = useState([]);

  // Category Specific State
  const [catSpecifics, setCatSpecifics] = useState({});

  // Image Upload State
  const [uploadedImage, setUploadedImage] = useState(null);

  // Error State
  const [errorMsg, setErrorMsg] = useState('');

  const handleCategorySelect = (selectedCat) => {
    setCategory(selectedCat);
    setCatSpecifics({}); // Reset specific fields when category changes
  };

  const handleSpecificsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCatSpecifics(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSecondarySupplier = () => {
    setSecondarySuppliers(prev => [...prev, '']);
  };

  const handleSecondarySupplierChange = (index, value) => {
    const newSuppliers = [...secondarySuppliers];
    newSuppliers[index] = value;
    setSecondarySuppliers(newSuppliers);
  };

  const handleRemoveSecondarySupplier = (index) => {
    setSecondarySuppliers(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setUploadedImage(URL.createObjectURL(file));
      } else {
        alert("Only JPG, PNG, and WEBP formats are allowed.");
      }
    }
  };

  const handleSave = () => {
    // Validation
    if (!category || !itemName || !sku || !initialQty) {
      setErrorMsg("Please fill in all required fields marked with *");
      window.scrollTo(0, 0);
      return;
    }

    if (parseInt(initialQty) < 0 || (lowStockAlert && parseInt(lowStockAlert) < 0) || (unitPrice && parseFloat(unitPrice) < 0)) {
      setErrorMsg("Quantity, Alert Level, and Unit Price must be positive numbers.");
      window.scrollTo(0, 0);
      return;
    }

    const newItem = {
      itemName,
      sku,
      category: category === 'Medicine' ? 'Medicine' : category === 'Med Supplies' ? 'Medical Supplies' : category === 'Equipment' ? 'Equipment' : 'Lab Supplies',
      department: "General", // Default or you could add a department selector
      supplier: primarySupplier || 'Unknown Supplier',
      stockQuantity: parseInt(initialQty),
      unit: uom,
      expiryDate: catSpecifics.expiryDate || "N/A", // From optional logic if needed
      description,
      unitPrice,
      lowStockAlert,
      catSpecifics,
      secondarySuppliers
    };

    addMockInventoryItem(newItem);
    navigate('/inventory');
  };

  const renderCategorySpecifics = () => {
    switch (category) {
      case 'Medicine':
        return (
          <>
            <div className="col-md-6">
              <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Dosage / Strength</label>
              <input type="text" className="form-control" name="dosage" placeholder="e.g. 500mg, 10ml" value={catSpecifics.dosage || ''} onChange={handleSpecificsChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Form</label>
              <select className="form-select text-muted" name="form" value={catSpecifics.form || ''} onChange={handleSpecificsChange}>
                <option value="">Select form</option>
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
                <option value="Ointment">Ointment</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Manufacturer</label>
              <input type="text" className="form-control" name="manufacturer" placeholder="Manufacturing company" value={catSpecifics.manufacturer || ''} onChange={handleSpecificsChange} />
            </div>
            <div className="col-md-6 d-flex align-items-center">
              <div className="form-check form-switch mt-3">
                <input className="form-check-input" type="checkbox" role="switch" id="rxSwitch" name="prescriptionRequired" checked={catSpecifics.prescriptionRequired || false} onChange={handleSpecificsChange} />
                <label className="form-check-label fw-semibold text-dark ms-2" htmlFor="rxSwitch">Yes, requires Rx</label>
              </div>
            </div>
          </>
        );
      case 'Med Supplies':
        return (
          <>
            <div className="col-md-6">
              <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Material</label>
              <input type="text" className="form-control" name="material" placeholder="e.g. Latex, Cotton" value={catSpecifics.material || ''} onChange={handleSpecificsChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Sterility</label>
              <select className="form-select text-muted" name="sterility" value={catSpecifics.sterility || ''} onChange={handleSpecificsChange}>
                <option value="">Select sterility</option>
                <option value="Sterile">Sterile</option>
                <option value="Non-Sterile">Non-Sterile</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Packaging Type</label>
              <input type="text" className="form-control" name="packagingType" placeholder="e.g. Individually wrapped" value={catSpecifics.packagingType || ''} onChange={handleSpecificsChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Usage Notes</label>
              <input type="text" className="form-control" name="usageNotes" placeholder="e.g. Single use only" value={catSpecifics.usageNotes || ''} onChange={handleSpecificsChange} />
            </div>
          </>
        );
      case 'Equipment':
        return (
          <>
            <div className="col-md-6">
              <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Brand</label>
              <input type="text" className="form-control" name="brand" placeholder="e.g. GE, Philips" value={catSpecifics.brand || ''} onChange={handleSpecificsChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Model Number</label>
              <input type="text" className="form-control" name="modelNumber" placeholder="Model details" value={catSpecifics.modelNumber || ''} onChange={handleSpecificsChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Serial Number</label>
              <input type="text" className="form-control" name="serialNumber" placeholder="Serial tracking code" value={catSpecifics.serialNumber || ''} onChange={handleSpecificsChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Warranty Period</label>
              <input type="text" className="form-control" name="warrantyPeriod" placeholder="e.g. 2 Years" value={catSpecifics.warrantyPeriod || ''} onChange={handleSpecificsChange} />
            </div>
          </>
        );
      case 'Lab Supplies':
        return (
          <>
            <div className="col-md-6">
              <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Storage Requirement</label>
              <input type="text" className="form-control" name="storageReq" placeholder="e.g. 2-8°C" value={catSpecifics.storageReq || ''} onChange={handleSpecificsChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Sample Type</label>
              <input type="text" className="form-control" name="sampleType" placeholder="e.g. Blood, Urine" value={catSpecifics.sampleType || ''} onChange={handleSpecificsChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Batch Number</label>
              <input type="text" className="form-control" name="batchNumber" placeholder="Batch or Lot No." value={catSpecifics.batchNumber || ''} onChange={handleSpecificsChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label text-muted fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Hazard Classification</label>
              <select className="form-select text-muted" name="hazardClass" value={catSpecifics.hazardClass || ''} onChange={handleSpecificsChange}>
                <option value="">Select hazard level</option>
                <option value="None">None</option>
                <option value="Biohazard">Biohazard</option>
                <option value="Chemical">Chemical</option>
                <option value="Flammable">Flammable</option>
              </select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const getSpecificsTitle = () => {
    switch(category) {
      case 'Medicine': return "Medicine Specifics";
      case 'Med Supplies': return "Medical Supply Details";
      case 'Equipment': return "Equipment Details";
      case 'Lab Supplies': return "Lab Supply Details";
      default: return "Category Specifics";
    }
  };

  const getSpecificsIcon = () => {
    switch(category) {
      case 'Medicine': return "bi-sliders2-vertical";
      case 'Med Supplies': return "bi-bandaid";
      case 'Equipment': return "bi-ev-station";
      case 'Lab Supplies': return "bi-droplet-half";
      default: return "bi-card-list";
    }
  };

  return (
    <div className="pb-5">
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Inventory</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Add New Item</span>
          </nav>
        </div>
        <TopNavbar showUserRole={false} />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="page-title mb-1">Add Inventory Item</h1>
          <p className="text-muted mb-0" style={{fontSize: '0.9rem'}}>Register a new product, equipment, or supply into the central catalog.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-light border fw-semibold px-4 shadow-sm text-dark" onClick={() => navigate('/inventory')}>
            Cancel
          </button>
          <button className="btn btn-dark fw-semibold px-4 shadow-sm d-flex align-items-center gap-2" onClick={handleSave}>
            <i className="bi bi-save"></i> Save Item
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="alert alert-danger shadow-sm border-0 d-flex align-items-center gap-2 py-2 mb-4">
          <i className="bi bi-exclamation-triangle-fill"></i> {errorMsg}
        </div>
      )}

      <div className="row g-4">
        {/* Left Column */}
        <div className="col-lg-8">
          
          {/* Basic Information Card */}
          <div className="dashboard-card p-4 mb-4 border-0 shadow-sm" style={{borderRadius: '12px'}}>
            <div className="d-flex align-items-center gap-2 mb-4">
              <i className="bi bi-info-circle text-muted fs-5"></i>
              <h5 className="mb-0 fw-bold">Basic Information</h5>
            </div>
            <hr className="text-muted opacity-25" />

            <div className="mb-4">
              <label className="form-label text-dark fw-semibold mb-2" style={{fontSize: '0.85rem'}}>Item Category <span className="text-danger">*</span></label>
              <div className="row g-3">
                {[
                  { id: 'Medicine', label: 'Medicines', icon: 'bi-capsule' },
                  { id: 'Med Supplies', label: 'Med Supplies', icon: 'bi-bandaid' },
                  { id: 'Equipment', label: 'Equipment', icon: 'bi-heart-pulse' },
                  { id: 'Lab Supplies', label: 'Lab Supplies', icon: 'bi-eyedropper' }
                ].map(cat => (
                  <div className="col-md-3 col-6" key={cat.id}>
                    <div 
                      className={`category-card text-center p-3 border rounded cursor-pointer transition-all ${category === cat.id ? 'border-primary bg-primary bg-opacity-10 text-primary fw-bold shadow-sm' : 'border-secondary-subtle text-muted'}`}
                      onClick={() => handleCategorySelect(cat.id)}
                    >
                      <i className={`bi ${cat.icon} fs-4 d-block mb-1`}></i>
                      <span style={{fontSize: '0.85rem'}}>{cat.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label text-dark fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Item Name <span className="text-danger">*</span></label>
                <input type="text" className="form-control bg-light border-0 py-2" placeholder="e.g. Paracetamol 500mg" value={itemName} onChange={(e) => setItemName(e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label text-dark fw-semibold mb-1" style={{fontSize: '0.85rem'}}>SKU / Barcode <span className="text-danger">*</span></label>
                <div className="position-relative">
                  <input type="text" className="form-control bg-light border-0 py-2 pe-5" placeholder="Scan or enter code" value={sku} onChange={(e) => setSku(e.target.value)} />
                  <i className="bi bi-upc-scan position-absolute text-muted" style={{right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem'}}></i>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label text-dark fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Description</label>
              <textarea className="form-control bg-light border-0 py-2" rows="3" placeholder="Brief details about the item..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
          </div>

          {/* Dynamic Category Specifics Card */}
          <div className="dashboard-card p-4 border-0 shadow-sm" style={{borderRadius: '12px'}}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-primary bg-opacity-10 text-primary rounded p-1 d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                  <i className={`bi ${getSpecificsIcon()}`}></i>
                </div>
                <h5 className="mb-0 fw-bold">{getSpecificsTitle()}</h5>
              </div>
              <span className="badge bg-light text-muted border px-2 py-1">Contextual</span>
            </div>
            <hr className="text-muted opacity-25" />

            <div className="row g-4">
              {renderCategorySpecifics()}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-4">
          
          {/* Stock Control Card */}
          <div className="dashboard-card p-4 mb-4 border-0 shadow-sm" style={{borderRadius: '12px'}}>
            <div className="d-flex align-items-center gap-2 mb-4">
              <i className="bi bi-box-seam text-success fs-5"></i>
              <h5 className="mb-0 fw-bold">Stock Control</h5>
            </div>
            <hr className="text-muted opacity-25" />

            <div className="mb-4">
              <label className="form-label text-dark fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Unit Price (USD)</label>
              <div className="position-relative">
                <span className="position-absolute text-muted" style={{left: '12px', top: '50%', transform: 'translateY(-50%)'}}>$</span>
                <input type="number" className="form-control bg-light border-0 py-2 ps-4" placeholder="0.00" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-6">
                <label className="form-label text-dark fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Initial Qty <span className="text-danger">*</span></label>
                <input type="number" className="form-control bg-light border-0 py-2" placeholder="0" value={initialQty} onChange={(e) => setInitialQty(e.target.value)} />
              </div>
              <div className="col-6">
                <label className="form-label text-dark fw-semibold mb-1" style={{fontSize: '0.85rem'}}>UOM</label>
                <select className="form-select bg-light border-0 py-2" value={uom} onChange={(e) => setUom(e.target.value)}>
                  <option value="Box">Box</option>
                  <option value="Pack">Pack</option>
                  <option value="Piece">Piece</option>
                  <option value="Unit">Unit</option>
                  <option value="Bottle">Bottle</option>
                  <option value="Vial">Vial</option>
                  <option value="Carton">Carton</option>
                </select>
              </div>
            </div>

            <div className="mb-2">
              <label className="form-label text-dark fw-semibold mb-1 d-flex align-items-center gap-1" style={{fontSize: '0.85rem'}}>
                <i className="bi bi-exclamation-triangle"></i> Low Stock Alert Level
              </label>
              <input type="number" className="form-control bg-light border-0 py-2" placeholder="e.g. 50" value={lowStockAlert} onChange={(e) => setLowStockAlert(e.target.value)} />
              <div className="form-text mt-2 text-muted" style={{fontSize: '0.75rem', lineHeight: '1.4'}}>
                System will trigger an alert when stock drops below this threshold.
              </div>
            </div>
          </div>

          {/* Supplier Card */}
          <div className="dashboard-card p-4 mb-4 border-0 shadow-sm" style={{borderRadius: '12px'}}>
            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                <i className="bi bi-truck"></i>
              </div>
              <h5 className="mb-0 fw-bold">Supplier</h5>
            </div>
            <hr className="text-muted opacity-25" />

            <div className="mb-3">
              <label className="form-label text-dark fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Primary Supplier</label>
              <select className="form-select bg-light border-0 py-2" value={primarySupplier} onChange={(e) => setPrimarySupplier(e.target.value)}>
                <option value="">Search suppliers...</option>
                <option value="PharmaCorp Inc.">PharmaCorp Inc.</option>
                <option value="MedEquip Global">MedEquip Global</option>
                <option value="BioLab Solutions">BioLab Solutions</option>
                <option value="CarePlus Supplies">CarePlus Supplies</option>
                <option value="GlobalPharma">GlobalPharma</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label text-dark fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Supplier Item Code</label>
              <input type="text" className="form-control bg-light border-0 py-2" placeholder="Optional" value={supplierCode} onChange={(e) => setSupplierCode(e.target.value)} />
            </div>

            {secondarySuppliers.map((sup, index) => (
              <div className="mb-3 position-relative" key={index}>
                <label className="form-label text-dark fw-semibold mb-1" style={{fontSize: '0.85rem'}}>Secondary Supplier {index + 1}</label>
                <div className="d-flex gap-2">
                  <input type="text" className="form-control bg-light border-0 py-2" placeholder="Supplier name" value={sup} onChange={(e) => handleSecondarySupplierChange(index, e.target.value)} />
                  <button className="btn btn-light text-danger border-0" onClick={() => handleRemoveSecondarySupplier(index)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}

            <button className="btn btn-light border w-100 py-2 fw-semibold text-muted d-flex align-items-center justify-content-center gap-2" style={{borderStyle: 'dashed !important'}} onClick={handleAddSecondarySupplier}>
              <i className="bi bi-plus"></i> Add Secondary Supplier
            </button>
          </div>

          {/* Image Upload Card */}
          <div className="dashboard-card p-4 border-0 shadow-sm text-center" style={{borderRadius: '12px', borderStyle: 'dashed', borderWidth: '2px', borderColor: '#dee2e6', backgroundColor: '#fdfdfd'}}>
            <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '48px', height: '48px'}}>
              <i className="bi bi-camera text-muted fs-4"></i>
            </div>
            
            {uploadedImage ? (
              <div className="position-relative">
                <img src={uploadedImage} alt="Product Preview" className="img-fluid rounded border mb-3" style={{maxHeight: '150px'}} />
                <button className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 rounded-circle" style={{width: '28px', height: '28px', padding: 0}} onClick={() => setUploadedImage(null)}>
                  <i className="bi bi-x"></i>
                </button>
              </div>
            ) : (
              <>
                <p className="fw-semibold text-dark mb-1">Click or drag image here</p>
                <p className="text-muted mb-3" style={{fontSize: '0.8rem'}}>Upload JPG, PNG, or WEBP (Max 5MB)</p>
              </>
            )}
            
            <div className="position-relative overflow-hidden d-inline-block">
              <button className="btn btn-light border px-4 fw-semibold text-dark shadow-sm">
                Browse Files
              </button>
              <input type="file" className="position-absolute opacity-0 start-0 top-0 w-100 h-100" style={{cursor: 'pointer'}} accept="image/jpeg, image/png, image/webp" onChange={handleImageUpload} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddInventoryPage;
