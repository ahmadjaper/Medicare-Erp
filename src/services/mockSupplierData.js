let mockSuppliers = [
  {
    id: "SUP-001",
    name: "MedPharma Global",
    contactPerson: "Sarah Jenkins",
    email: "s.jenkins@medpharma.com",
    phone: "+1 (555) 019-2834",
    categories: ["PHARMACEUTICALS", "SURGICAL"],
    items: 1245,
    recentActivity: "Today, 09:41 AM PO Issued",
    status: "Active",
    address: "123 Pharma Way, Medical District, NY 10001",
    notes: "Primary supplier for generic medicines."
  },
  {
    id: "SUP-042",
    name: "SurgiTech Instruments",
    contactPerson: "Marcus Chen",
    email: "m.chen@surgitech.io",
    phone: "+1 (555) 882-1092",
    categories: ["INSTRUMENTS", "IMPLANTS"],
    items: 382,
    recentActivity: "Oct 24, 2023 Delivery Received",
    status: "Active",
    address: "442 Tech Park Blvd, San Jose, CA 95134",
    notes: "Specializes in high-precision surgical tools."
  },
  {
    id: "SUP-118",
    name: "HealthLinx Logistics",
    contactPerson: "Elena Rodriguez",
    email: "contact@healthlinx.net",
    phone: "+1 (555) 304-9981",
    categories: ["CONSUMABLES", "PPE"],
    items: 8405,
    recentActivity: "Sep 15, 2023 Contract Expired",
    status: "Inactive",
    address: "700 Logistics Ave, Dallas, TX 75201",
    notes: "Former PPE bulk supplier. Contract not renewed."
  },
  {
    id: "SUP-089",
    name: "Bio Diagnostix",
    contactPerson: "David Kim",
    email: "dkim@bioxdiag.com",
    phone: "+1 (555) 441-2200",
    categories: ["LABORATORY", "REAGENTS"],
    items: 512,
    recentActivity: "Oct 25, 2023 Invoice Paid",
    status: "Active",
    address: "88 Biotech Lane, Cambridge, MA 02142",
    notes: "Exclusive supplier for PCR and rapid test kits."
  },
  {
    id: "SUP-012",
    name: "Medical Solutions Group",
    contactPerson: "Robert Vance",
    email: "rvance@msg.com",
    phone: "+1 (555) 200-1122",
    categories: ["EQUIPMENT", "MAINTENANCE"],
    items: 45,
    recentActivity: "Nov 01, 2023 Equipment Serviced",
    status: "Active",
    address: "100 Industrial Parkway, Chicago, IL 60601",
    notes: "Provides heavy radiology and ICU equipment."
  },
  {
    id: "SUP-015",
    name: "CarePlus Supplies",
    contactPerson: "Amanda Stewart",
    email: "astewart@careplus.org",
    phone: "+1 (555) 662-9011",
    categories: ["CONSUMABLES", "WOUND CARE"],
    items: 2100,
    recentActivity: "Oct 30, 2023 PO Issued",
    status: "Pending Review",
    address: "205 Medical Plaza, Miami, FL 33101",
    notes: "Pending ISO certification renewal."
  },
  {
    id: "SUP-022",
    name: "Global Health Devices",
    contactPerson: "Thomas Wright",
    email: "twright@globalhealth.dev",
    phone: "+1 (555) 334-7712",
    categories: ["CARDIOLOGY", "IMPLANTS"],
    items: 89,
    recentActivity: "Sep 20, 2023 Invoice Paid",
    status: "Active",
    address: "12 Heart Center Blvd, Houston, TX 77001",
    notes: "Pacemakers and stents supplier."
  },
  {
    id: "SUP-034",
    name: "Apex Medical Supplies",
    contactPerson: "Lisa Wong",
    email: "lwong@apexmed.com",
    phone: "+1 (555) 998-3321",
    categories: ["ORTHOPEDICS", "INSTRUMENTS"],
    items: 310,
    recentActivity: "Nov 02, 2023 Delivery Received",
    status: "Active",
    address: "800 Ortho Way, Denver, CO 80202",
    notes: ""
  },
  {
    id: "SUP-051",
    name: "PharmaCorp Inc.",
    contactPerson: "James Miller",
    email: "jmiller@pharmacorp.com",
    phone: "+1 (555) 774-1020",
    categories: ["PHARMACEUTICALS", "VACCINES"],
    items: 850,
    recentActivity: "Oct 28, 2023 PO Issued",
    status: "Active",
    address: "500 Vaccine Dr, Atlanta, GA 30301",
    notes: "Primary supplier for flu and COVID vaccines."
  },
  {
    id: "SUP-067",
    name: "OpticLab Inc",
    contactPerson: "Sandra Davis",
    email: "sdavis@opticlab.com",
    phone: "+1 (555) 211-9944",
    categories: ["LABORATORY", "OPTICS"],
    items: 120,
    recentActivity: "Aug 15, 2023 Delivery Received",
    status: "Active",
    address: "30 Visionary Park, Seattle, WA 98101",
    notes: "Microscopes and lenses."
  },
  {
    id: "SUP-072",
    name: "MediEquip Global",
    contactPerson: "Kevin Hughes",
    email: "khughes@mediequip.gl",
    phone: "+1 (555) 883-2001",
    categories: ["EQUIPMENT", "FURNITURE"],
    items: 145,
    recentActivity: "Jul 10, 2023 Contract Expired",
    status: "Inactive",
    address: "15 Global Trade Rd, Newark, NJ 07101",
    notes: ""
  },
  {
    id: "SUP-088",
    name: "HeartTech Solutions",
    contactPerson: "Maria Garcia",
    email: "mgarcia@hearttech.com",
    phone: "+1 (555) 443-8822",
    categories: ["CARDIOLOGY", "EQUIPMENT"],
    items: 54,
    recentActivity: "Nov 03, 2023 Invoice Paid",
    status: "Active",
    address: "77 Cardiac Ave, Phoenix, AZ 85001",
    notes: "ECG machines and defibrillators."
  },
  {
    id: "SUP-091",
    name: "BioLab Solutions",
    contactPerson: "Peter Chen",
    email: "pchen@biolab.com",
    phone: "+1 (555) 551-3090",
    categories: ["LABORATORY", "CONSUMABLES"],
    items: 4500,
    recentActivity: "Oct 22, 2023 Delivery Received",
    status: "Active",
    address: "122 Science Blvd, Madison, WI 53703",
    notes: "Test tubes, specimen containers, pipettes."
  },
  {
    id: "SUP-102",
    name: "LifeSaver Inc.",
    contactPerson: "Angela White",
    email: "awhite@lifesaver.com",
    phone: "+1 (555) 902-1133",
    categories: ["EMERGENCY", "EQUIPMENT"],
    items: 25,
    recentActivity: "Sep 01, 2023 PO Issued",
    status: "Active",
    address: "911 Responder Way, Los Angeles, CA 90001",
    notes: "Crash carts and emergency ventilators."
  },
  {
    id: "SUP-115",
    name: "MedPlus Ltd.",
    contactPerson: "Omar Syed",
    email: "osyed@medplus.ltd",
    phone: "+1 (555) 304-5512",
    categories: ["PHARMACEUTICALS"],
    items: 340,
    recentActivity: "Oct 25, 2023 Quality Check",
    status: "Pending Review",
    address: "40 Health St, Philadelphia, PA 19104",
    notes: "Pending review of batch quality."
  },
  {
    id: "SUP-120",
    name: "MobilityPlus",
    contactPerson: "Rachel Green",
    email: "rgreen@mobilityplus.com",
    phone: "+1 (555) 771-4455",
    categories: ["EQUIPMENT", "PATIENT CARE"],
    items: 85,
    recentActivity: "Oct 18, 2023 Delivery Received",
    status: "Active",
    address: "55 Wheelchair Dr, Detroit, MI 48201",
    notes: "Wheelchairs and crutches."
  },
  {
    id: "SUP-128",
    name: "AirCare Systems",
    contactPerson: "John Baxter",
    email: "jbaxter@aircare.net",
    phone: "+1 (555) 606-2211",
    categories: ["RESPIRATORY", "CONSUMABLES"],
    items: 120,
    recentActivity: "Nov 01, 2023 PO Issued",
    status: "Active",
    address: "20 Oxygen Blvd, Denver, CO 80202",
    notes: "Oxygen cylinders and masks."
  },
  {
    id: "SUP-134",
    name: "MedComfort",
    contactPerson: "Lily Scott",
    email: "lscott@medcomfort.com",
    phone: "+1 (555) 442-9900",
    categories: ["FURNITURE", "PATIENT CARE"],
    items: 50,
    recentActivity: "Aug 20, 2023 Delivery Received",
    status: "Active",
    address: "110 Comfort Lane, Nashville, TN 37201",
    notes: "Hospital beds and mattresses."
  },
  {
    id: "SUP-145",
    name: "GlobalPharma",
    contactPerson: "Ahmed Hassan",
    email: "ahassan@globalpharma.com",
    phone: "+1 (555) 881-3000",
    categories: ["PHARMACEUTICALS", "ONCOLOGY"],
    items: 650,
    recentActivity: "Oct 29, 2023 Invoice Paid",
    status: "Active",
    address: "500 Pharma Plaza, Boston, MA 02108",
    notes: "Specialized oncology drugs."
  },
  {
    id: "SUP-152",
    name: "SurgiTech Plastics",
    contactPerson: "Nina Patel",
    email: "npatel@surgitechplastics.com",
    phone: "+1 (555) 202-8811",
    categories: ["CONSUMABLES", "SURGICAL"],
    items: 1100,
    recentActivity: "Oct 12, 2023 Contract Renewal",
    status: "Pending Review",
    address: "88 Polymer Way, Akron, OH 44301",
    notes: "Reviewing updated pricing terms."
  },
  {
    id: "SUP-166",
    name: "Visionary Medical",
    contactPerson: "Greg House",
    email: "ghouse@visionarymed.com",
    phone: "+1 (555) 991-2244",
    categories: ["OPHTHALMOLOGY", "INSTRUMENTS"],
    items: 75,
    recentActivity: "Jan 15, 2023 Contract Expired",
    status: "Inactive",
    address: "10 Eye Center Rd, Baltimore, MD 21201",
    notes: ""
  },
  {
    id: "SUP-170",
    name: "Pediatric Care Supplies",
    contactPerson: "Emma Watson",
    email: "ewatson@pediatriccare.org",
    phone: "+1 (555) 303-1122",
    categories: ["PEDIATRICS", "CONSUMABLES"],
    items: 420,
    recentActivity: "Oct 05, 2023 Delivery Received",
    status: "Active",
    address: "40 Child Health Ave, Orlando, FL 32801",
    notes: ""
  },
  {
    id: "SUP-182",
    name: "NeoNatal Tech",
    contactPerson: "Chris Evans",
    email: "cevans@neonataltech.com",
    phone: "+1 (555) 404-5566",
    categories: ["PEDIATRICS", "EQUIPMENT"],
    items: 15,
    recentActivity: "Nov 02, 2023 PO Issued",
    status: "Active",
    address: "15 Incubator Dr, San Diego, CA 92101",
    notes: "Incubators and monitors."
  },
  {
    id: "SUP-190",
    name: "Elite Dental Supplies",
    contactPerson: "Sarah Connor",
    email: "sconnor@elitedental.com",
    phone: "+1 (555) 707-8899",
    categories: ["DENTAL", "CONSUMABLES"],
    items: 560,
    recentActivity: "Sep 22, 2023 Invoice Paid",
    status: "Active",
    address: "100 Tooth Fairy Lane, Portland, OR 97201",
    notes: ""
  },
  {
    id: "SUP-200",
    name: "Neuro Instruments Co",
    contactPerson: "Bruce Wayne",
    email: "bwayne@neuroinst.com",
    phone: "+1 (555) 808-1122",
    categories: ["NEUROLOGY", "INSTRUMENTS"],
    items: 110,
    recentActivity: "Oct 27, 2023 Delivery Received",
    status: "Active",
    address: "1 Bat Cave Rd, Gotham, NJ 07102",
    notes: "Advanced neurosurgical drills and scopes."
  }
];

export const getMockSuppliers = () => [...mockSuppliers];

export const getMockSupplierById = (id) => mockSuppliers.find(s => s.id === id);

export const addMockSupplier = (supplier) => {
  mockSuppliers.unshift(supplier);
  return supplier;
};

export const updateMockSupplier = (id, updatedData) => {
  const index = mockSuppliers.findIndex(s => s.id === id);
  if (index !== -1) {
    mockSuppliers[index] = { ...mockSuppliers[index], ...updatedData };
    return mockSuppliers[index];
  }
  return null;
};

export const deleteMockSupplier = (id) => {
  mockSuppliers = mockSuppliers.filter(s => s.id !== id);
};
