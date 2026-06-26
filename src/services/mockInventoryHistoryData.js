const items = [
  { name: "Lidocaine HCl 2%", id: "PH-0921", category: "Pharmaceuticals", unit: "vials" },
  { name: "N95 Respirator Masks", id: "PP-1104", category: "PPE", unit: "boxes" },
  { name: "0.9% Sodium Chloride", id: "LB-3392", category: "Laboratory", unit: "bags" },
  { name: "Sterile Gauze Pads", id: "SG-0012", category: "Surgical Supplies", unit: "packs" },
  { name: "Amoxicillin 500mg", id: "MED-AMX-001", category: "Pharmaceuticals", unit: "boxes" },
  { name: "Surgical Masks", id: "SUP-MSK", category: "PPE", unit: "cartons" },
  { name: "Digital Thermometers", id: "EQP-THM-04", category: "Equipment", unit: "units" },
  { name: "Ibuprofen 200mg", id: "MED-IBU-200", category: "Pharmaceuticals", unit: "boxes" },
  { name: "Sterile Syringes 5ml", id: "SUP-SYR-005", category: "Medical Supplies", unit: "packs" },
  { name: "Wheelchairs", id: "EQP-WHL-01", category: "Equipment", unit: "units" },
  { name: "Blood Collection Tubes", id: "LAB-TUB-01", category: "Laboratory", unit: "packs" },
  { name: "Paracetamol 500mg", id: "MED-PAR-500", category: "Pharmaceuticals", unit: "boxes" },
  { name: "Latex Examination Gloves", id: "SUP-GLV-01", category: "PPE", unit: "cartons" },
  { name: "Insulin Syringes", id: "SUP-INS-01", category: "Medical Supplies", unit: "packs" }
];

const types = ['Incoming', 'Outgoing', 'Adjustment'];
const performBys = [
  { name: 'Sarah Miller', initials: 'SM' },
  { name: 'David Ross', initials: 'DR' },
  { name: 'Admin System', initials: 'AJ' },
  { name: 'John Doe', initials: 'JD' },
  { name: 'Jane Smith', initials: 'JS' }
];
const sources = [
  'MedSupply Co. (PO-4421)',
  'ICU Ward B',
  'Audit Correction (Exp)',
  'Global Med Inc. (PO-4420)',
  'Emergency Dept',
  'Pharmacy Storage A',
  'Pediatrics Ward',
  'BioLab Solutions (PO-1102)'
];

let cachedData = null;

export const getMockHistoryData = () => {
  if (cachedData) return cachedData;
  
  const data = [];
  
  // Base date for generating random timestamps
  const baseTime = new Date().getTime();

  for (let i = 0; i < 50; i++) {
    const item = items[Math.floor(Math.random() * items.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const performedBy = performBys[Math.floor(Math.random() * performBys.length)];
    const sourceDest = sources[Math.floor(Math.random() * sources.length)];
    
    // Generate a timestamp within the last 15 days
    const timestamp = new Date(baseTime - Math.floor(Math.random() * 15 * 24 * 60 * 60 * 1000));
    
    let qtyChange = 0;
    if (type === 'Incoming') {
      qtyChange = Math.floor(Math.random() * 900) + 100; // 100 to 1000
    } else if (type === 'Outgoing') {
      qtyChange = -(Math.floor(Math.random() * 190) + 10); // -10 to -200
    } else {
      qtyChange = Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 1 : -(Math.floor(Math.random() * 20) + 1);
    }

    data.push({
      id: i + 1,
      timestamp: timestamp.toISOString().replace('T', ' ').substring(0, 19),
      item: {
        name: item.name,
        id: item.id,
        category: item.category,
        unit: item.unit
      },
      type: type,
      qtyChange: qtyChange,
      performedBy: performedBy,
      sourceDestination: sourceDest
    });
  }

  // Sort by newest first
  cachedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return cachedData;
};

export const addMockHistoryEntry = (entry) => {
  if (!cachedData) getMockHistoryData();
  const newEntry = {
    ...entry,
    id: cachedData.length > 0 ? Math.max(...cachedData.map(d => d.id)) + 1 : 1,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  cachedData.unshift(newEntry);
  return newEntry;
};

