import { create } from 'zustand';

// Seed initial data
const initialPatients = [
  {
    id: "PAT-1201",
    name: "John Doe",
    age: 35,
    gender: "Male",
    phone: "+1 (555) 123-4567",
    email: "john.doe@email.com",
    address: "123 Medical Center Dr, Cityville",
    bloodGroup: "O+",
    allergies: "Peanuts, Penicillin",
    history: "Hypertension (controlled)"
  },
  {
    id: "PAT-1202",
    name: "Eleanor Rigby",
    age: 29,
    gender: "Female",
    phone: "+1 (555) 234-5678",
    email: "eleanor.r@email.com",
    address: "456 Abbey Road, London",
    bloodGroup: "A-",
    allergies: "None",
    history: "Asthma"
  },
  {
    id: "PAT-1203",
    name: "Jane Smith",
    age: 42,
    gender: "Female",
    phone: "+1 (555) 345-6789",
    email: "jane.smith@email.com",
    address: "789 Pine Ave, Metro City",
    bloodGroup: "B+",
    allergies: "Sulfonamides",
    history: "None"
  },
  {
    id: "PAT-1204",
    name: "Robert Johnson",
    age: 50,
    gender: "Male",
    phone: "+1 (555) 456-7890",
    email: "robert.j@email.com",
    address: "101 Maple St, Greenfield",
    bloodGroup: "AB+",
    allergies: "Latex",
    history: "Type 2 Diabetes"
  }
];

const initialDoctors = [
  {
    id: "DOC-1001",
    name: "Dr. Sarah Johnson",
    specialty: "Consultant Cardiologist",
    status: "Active",
    phone: "+1 (555) 101-0101",
    email: "sarah.j@medicore.com",
    rating: 4.8,
    reviewsCount: 120,
    onDuty: true,
    room: "Room 205"
  },
  {
    id: "DOC-1002",
    name: "Dr. J. Smith",
    specialty: "Cardiology",
    status: "Active",
    phone: "+1 (555) 102-0202",
    email: "j.smith@medicore.com",
    rating: 4.9,
    reviewsCount: 86,
    onDuty: true,
    room: "Room 204"
  },
  {
    id: "DOC-1003",
    name: "Dr. A. Patel",
    specialty: "General Medicine",
    status: "Active",
    phone: "+1 (555) 103-0303",
    email: "a.patel@medicore.com",
    rating: 4.8,
    reviewsCount: 92,
    onDuty: true,
    room: "Room 101"
  },
  {
    id: "DOC-1004",
    name: "Dr. S. Lee",
    specialty: "Pediatrics",
    status: "Active",
    phone: "+1 (555) 104-0404",
    email: "s.lee@medicore.com",
    rating: 4.7,
    reviewsCount: 74,
    onDuty: true,
    room: "Room 305"
  },
  {
    id: "DOC-1005",
    name: "Dr. M. Davis",
    specialty: "Orthopedics",
    status: "Active",
    phone: "+1 (555) 105-0505",
    email: "m.davis@medicore.com",
    rating: 4.9,
    reviewsCount: 110,
    onDuty: false,
    room: "Room 412"
  },
  {
    id: "DOC-1006",
    name: "Dr. Michael Brown",
    specialty: "Consultant Pulmonologist",
    status: "Active",
    phone: "+1 (555) 106-0606",
    email: "m.brown@medicore.com",
    rating: 4.7,
    reviewsCount: 65,
    onDuty: true,
    room: "Room 110"
  },
  {
    id: "DOC-1007",
    name: "Dr. Emily Davis",
    specialty: "Consultant Neurologist",
    status: "Active",
    phone: "+1 (555) 107-0707",
    email: "e.davis@medicore.com",
    rating: 4.8,
    reviewsCount: 81,
    onDuty: true,
    room: "Room 115"
  },
  {
    id: "DOC-1008",
    name: "Dr. Robert Harrison",
    specialty: "Chief Radiologist",
    status: "Active",
    phone: "+1 (555) 108-0808",
    email: "r.harrison@medicore.com",
    rating: 4.9,
    reviewsCount: 50,
    onDuty: true,
    room: "Room 120"
  },
  {
    id: "DOC-1009",
    name: "Dr. Susan Carter",
    specialty: "Consultant Dermatologist",
    status: "Active",
    phone: "+1 (555) 109-0909",
    email: "s.carter@medicore.com",
    rating: 4.6,
    reviewsCount: 43,
    onDuty: true,
    room: "Room 125"
  },
  {
    id: "DOC-1010",
    name: "Dr. William Vance",
    specialty: "Lead Oncologist",
    status: "Active",
    phone: "+1 (555) 110-1010",
    email: "w.vance@medicore.com",
    rating: 4.9,
    reviewsCount: 72,
    onDuty: true,
    room: "Room 130"
  },
  {
    id: "DOC-1011",
    name: "Dr. Laura Adams",
    specialty: "Consultant Gastroenterologist",
    status: "Active",
    phone: "+1 (555) 111-1111",
    email: "l.adams@medicore.com",
    rating: 4.7,
    reviewsCount: 38,
    onDuty: true,
    room: "Room 135"
  },
  {
    id: "DOC-1012",
    name: "Dr. Karen White",
    specialty: "Chief Gynecologist",
    status: "Active",
    phone: "+1 (555) 112-1212",
    email: "k.white@medicore.com",
    rating: 4.8,
    reviewsCount: 59,
    onDuty: true,
    room: "Room 140"
  },
  {
    id: "DOC-1013",
    name: "Dr. David Clark",
    specialty: "Consultant Ophthalmologist",
    status: "Active",
    phone: "+1 (555) 113-1313",
    email: "d.clark@medicore.com",
    rating: 4.5,
    reviewsCount: 29,
    onDuty: false,
    room: "Room 145"
  }
];

const initialAppointments = [
  {
    id: "APT-1001",
    patientName: "John Doe",
    patientId: "PAT-1201",
    doctorName: "Dr. Sarah Johnson",
    doctorId: "DOC-1001",
    dateTime: "2024-05-22T10:00:00",
    time: "10:00 AM",
    room: "Room 205",
    type: "Consultation",
    status: "CONFIRMED",
    durationMinutes: 30,
    payment: {
      amount: 100.00,
      status: "PAID",
      method: "Credit Card (**** 4242)",
      transactionId: "TXN_982310"
    },
    clinicalNotes: {
      reason: "Chest pain and discomfort during physical activity. Patient reports mild shortness of breath and occasional fatigue over the past 2 weeks.",
      internalNotes: "Patient has mild discomfort occasionally. Monitor ECG results closely. Blood pressure was slightly elevated (140/90) upon arrival."
    },
    timeline: [
      { status: "Appointment Created", timestamp: "18 May 2024, 09:15 AM", actor: "ADMIN USER", completed: true, current: false },
      { status: "Appointment Confirmed", timestamp: "18 May 2024, 09:20 AM", actor: "ADMIN USER", completed: true, current: false },
      { status: "Patient Checked In", timestamp: "22 May 2024, 09:55 AM", actor: "RECEPTION", completed: true, current: true }
    ]
  },
  {
    id: "APT-1002",
    patientName: "Eleanor Rigby",
    patientId: "PAT-1202",
    doctorName: "Dr. J. Smith",
    doctorId: "DOC-1002",
    dateTime: "2024-05-22T09:00:00",
    time: "09:00 AM",
    room: "Room 204",
    type: "Consultation",
    status: "Checked In",
    durationMinutes: 30,
    payment: { amount: 150.00, status: "PAID", method: "Cash", transactionId: "TXN_982311" },
    clinicalNotes: { reason: "Routine cardiology checkup.", internalNotes: "" },
    timeline: [{ status: "Appointment Created", timestamp: "18 May 2024, 09:00 AM", actor: "ADMIN", completed: true, current: true }]
  },
  {
    id: "APT-1003",
    patientName: "John Doe",
    patientId: "PAT-1201",
    doctorName: "Dr. A. Patel",
    doctorId: "DOC-1003",
    dateTime: "2024-05-22T09:30:00",
    time: "09:30 AM",
    room: "Room 101",
    type: "Follow-up",
    status: "Waiting",
    durationMinutes: 15,
    payment: { amount: 50.00, status: "PENDING", method: "-", transactionId: "-" },
    clinicalNotes: { reason: "Cold symptoms.", internalNotes: "" },
    timeline: [{ status: "Appointment Created", timestamp: "18 May 2024, 09:10 AM", actor: "RECEPTION", completed: true, current: true }]
  },
  {
    id: "APT-1004",
    patientName: "Jane Smith",
    patientId: "PAT-1203",
    doctorName: "Dr. S. Lee",
    doctorId: "DOC-1004",
    dateTime: "2024-05-22T10:15:00",
    time: "10:15 AM",
    room: "Room 305",
    type: "Consultation",
    status: "Scheduled",
    durationMinutes: 30,
    payment: { amount: 100.00, status: "PAID", method: "Insurance", transactionId: "TXN_982312" },
    clinicalNotes: { reason: "Pediatric checkup for asthma.", internalNotes: "" },
    timeline: [{ status: "Appointment Created", timestamp: "19 May 2024, 08:30 AM", actor: "ADMIN", completed: true, current: true }]
  },
  {
    id: "APT-1005",
    patientName: "Robert Johnson",
    patientId: "PAT-1204",
    doctorName: "Dr. M. Davis",
    doctorId: "DOC-1005",
    dateTime: "2024-05-22T11:00:00",
    time: "11:00 AM",
    room: "Room 412",
    type: "Consultation",
    status: "Delayed",
    durationMinutes: 45,
    payment: { amount: 200.00, status: "PAID", method: "Credit Card", transactionId: "TXN_982313" },
    clinicalNotes: { reason: "Joint pain assessment.", internalNotes: "" },
    timeline: [{ status: "Appointment Created", timestamp: "19 May 2024, 10:45 AM", actor: "ADMIN", completed: true, current: true }]
  }
];

const initialAlerts = [
  {
    id: 1,
    title: "Blood bank low stock",
    type: "blood_bank",
    desc: "O-Negative supplies are critically low. Please contact suppliers.",
    timeLabel: "10 mins ago",
    read: false,
    category: "critical"
  },
  {
    id: 2,
    title: "Dr. Sarah arrived",
    type: "check_in",
    desc: "Checked in for Cardiology shift.",
    timeLabel: "45 mins ago",
    read: false,
    category: "info"
  },
  {
    id: 3,
    title: "Maintenance completed",
    type: "maintenance",
    desc: "MRI Machine in Room 1A is back online.",
    timeLabel: "2 hours ago",
    read: false,
    category: "success"
  },
  {
    id: 4,
    title: "System Update Scheduled",
    type: "system",
    desc: "ERP system will be down for 15 mins at 2:00 AM.",
    timeLabel: "3 hours ago",
    read: false,
    category: "warning"
  }
];

const initialMessages = [
  {
    id: 1,
    sender: "Dr. Sarah Johnson",
    content: "Can you review the cardiology report for John Doe?",
    time: "5 mins ago",
    read: false
  },
  {
    id: 2,
    sender: "Jane (HR)",
    content: "The schedule for next week is ready.",
    time: "1 hour ago",
    read: true
  },
  {
    id: 3,
    sender: "Reception Desk",
    content: "Emergency walk-in arriving soon in ER.",
    time: "2 hours ago",
    read: false
  }
];

const initialInventory = [
  { id: "INV-001", name: "O-Negative Blood", category: "Blood Bank", stock: 3, unit: "bags", threshold: 10 },
  { id: "INV-002", name: "Syringes (10ml)", category: "Supplies", stock: 1500, unit: "units", threshold: 500 },
  { id: "INV-003", name: "Defibrillator Pads", category: "Equipment", stock: 12, unit: "packs", threshold: 15 },
  { id: "INV-004", name: "Paracetamol Tablets", category: "Pharmacy", stock: 4500, unit: "tablets", threshold: 1000 },
  { id: "INV-005", name: "Available Hospital Beds", category: "Beds", stock: 14, unit: "beds", threshold: 15 }
];

const initialSuppliers = [
  { name: "BioMedical Labs Inc.", contact: "+1 (555) 999-8888", email: "orders@biomed.com", suppliesCategory: "Blood & Plasma", status: "Preferred" },
  { name: "Global Pharma Corp", contact: "+1 (555) 777-6666", email: "sales@globalpharma.com", suppliesCategory: "Pharmaceuticals", status: "Active" },
  { name: "MedTech Supplies Ltd.", contact: "+1 (555) 555-4444", email: "support@medtech.com", suppliesCategory: "Medical Equipment", status: "Active" }
];

const initialEmployees = (() => {
  const firstFive = [
    { 
      id: "EMP-1001", 
      name: "John Doe", 
      department: "Human Resources", 
      designation: "HR Manager", 
      role: "Admin", 
      status: "Active", 
      shift: "Standard Day (09:00 - 17:00)", 
      phone: "+1 (555) 123-4567", 
      email: "john.doe@medicore.com", 
      joiningDate: "15 Jan 2021", 
      address: "Admin Building, Floor 2",
      yearsOfService: "3.2 Yrs",
      attendancePct: "98",
      leaveBalance: "14",
      performanceRating: "4.8",
      employmentType: "Full-Time",
      reportsTo: "Mary Smith",
      teamMembersCount: "12 Direct Reports",
      gender: "Male",
      dob: "1985-06-15",
      bloodGroup: "O+",
      emergencyContactName: "Jane Doe",
      emergencyContactPhone: "+1 (555) 987-6543",
      emergencyContactRelation: "Spouse",
      salaryGrade: "Grade 10",
      contractExpiry: "Permanent",
      recentActivity: [
        { title: "Annual Performance Review Completed", time: "2 days ago", type: "performance" },
        { title: "Leave Request Approved (3 Days)", time: "1 week ago", type: "leave" },
        { title: "Updated Emergency Contact Info", time: "2 weeks ago", type: "profile" }
      ]
    },
    { 
      id: "EMP-1002", 
      name: "Sarah Johnson", 
      department: "Human Resources", 
      designation: "HR Specialist", 
      role: "HR", 
      status: "Active", 
      shift: "Standard Day (09:00 - 17:00)", 
      phone: "+1 (555) 123-4568", 
      email: "sarah.j@medicore.com", 
      joiningDate: "10 Jan 2023", 
      address: "Admin Building, Floor 2",
      yearsOfService: "1.5 Yrs",
      attendancePct: "95",
      leaveBalance: "18",
      performanceRating: "4.5",
      employmentType: "Full-Time",
      reportsTo: "John Doe",
      teamMembersCount: "0 Direct Reports",
      gender: "Female",
      dob: "1990-10-24",
      bloodGroup: "A+",
      emergencyContactName: "Mark Johnson",
      emergencyContactPhone: "+1 (555) 765-4321",
      emergencyContactRelation: "Spouse",
      salaryGrade: "Grade 8",
      contractExpiry: "Permanent",
      recentActivity: [
        { title: "Leave Request Approved (2 Days)", time: "3 days ago", type: "leave" },
        { title: "Completed HR Onboarding Session", time: "1 month ago", type: "performance" }
      ]
    },
    { 
      id: "EMP-1003", 
      name: "Michael Brown", 
      department: "Finance", 
      designation: "Accountant", 
      role: "Finance", 
      status: "Active", 
      shift: "Standard Day (09:00 - 17:00)", 
      phone: "+1 (555) 123-4569", 
      email: "michael.b@medicore.com", 
      joiningDate: "05 Nov 2021", 
      address: "Admin Building, Floor 1",
      yearsOfService: "2.6 Yrs",
      attendancePct: "99",
      leaveBalance: "10",
      performanceRating: "4.9",
      employmentType: "Full-Time",
      reportsTo: "Dr. Sarah Johnson",
      teamMembersCount: "3 Direct Reports",
      gender: "Male",
      dob: "1983-04-12",
      bloodGroup: "B+",
      emergencyContactName: "Mary Brown",
      emergencyContactPhone: "+1 (555) 345-6789",
      emergencyContactRelation: "Spouse",
      salaryGrade: "Grade 9",
      contractExpiry: "Permanent",
      recentActivity: [
        { title: "Quarterly Audit Completed Successfully", time: "1 week ago", type: "performance" },
        { title: "Profile Info Updated", time: "2 weeks ago", type: "profile" }
      ]
    },
    { 
      id: "EMP-1004", 
      name: "Emily Davis", 
      department: "IT", 
      designation: "IT Support", 
      role: "IT", 
      status: "Active", 
      shift: "Standard Day (09:00 - 17:00)", 
      phone: "+1 (555) 123-4570", 
      email: "emily.d@medicore.com", 
      joiningDate: "20 Jun 2023", 
      address: "Tech Annex, Floor 1",
      yearsOfService: "1.0 Yrs",
      attendancePct: "96",
      leaveBalance: "20",
      performanceRating: "4.7",
      employmentType: "Full-Time",
      reportsTo: "David Wilson",
      teamMembersCount: "0 Direct Reports",
      gender: "Female",
      dob: "1994-08-30",
      bloodGroup: "AB-",
      emergencyContactName: "Arthur Davis",
      emergencyContactPhone: "+1 (555) 456-7890",
      emergencyContactRelation: "Father",
      salaryGrade: "Grade 7",
      contractExpiry: "Permanent",
      recentActivity: [
        { title: "Emergency System Patch Applied", time: "5 days ago", type: "performance" },
        { title: "Updated System Permissions Log", time: "3 weeks ago", type: "profile" }
      ]
    },
    { 
      id: "EMP-1005", 
      name: "David Wilson", 
      department: "Operations", 
      designation: "Operations Officer", 
      role: "Operations", 
      status: "Inactive", 
      shift: "Standard Day (09:00 - 17:00)", 
      phone: "+1 (555) 123-4571", 
      email: "david.w@medicore.com", 
      joiningDate: "12 Aug 2020", 
      address: "Main Building, Room 102",
      yearsOfService: "3.8 Yrs",
      attendancePct: "90",
      leaveBalance: "12",
      performanceRating: "4.2",
      employmentType: "Full-Time",
      reportsTo: "Dr. Sarah Johnson",
      teamMembersCount: "15 Direct Reports",
      gender: "Male",
      dob: "1980-12-05",
      bloodGroup: "O-",
      emergencyContactName: "Susan Wilson",
      emergencyContactPhone: "+1 (555) 567-8901",
      emergencyContactRelation: "Spouse",
      salaryGrade: "Grade 11",
      contractExpiry: "Permanent",
      recentActivity: [
        { title: "Operations Protocol Review", time: "1 month ago", type: "performance" },
        { title: "Status marked as Inactive", time: "2 weeks ago", type: "status" }
      ]
    }
  ];

  const depts = ["Cardiology", "Pulmonology", "Neurology", "Pediatrics", "Emergency Medicine", "Radiology", "Dermatology", "Oncology", "Gastroenterology", "Gynecology", "Ophthalmology", "Human Resources", "Finance", "IT", "Operations"];
  const shifts = ["Standard Day (09:00 - 17:00)", "Evening (17:00 - 01:00)", "Night (01:00 - 09:00)"];

  const list = [...firstFive];
  let activeToGen = 138;
  let leaveToGen = 8;
  let inactiveToGen = 5;

  const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Elizabeth", "William", "Linda", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle", "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa", "Edward", "Deborah", "Ronald", "Stephanie", "Timothy", "Rebecca", "Jason", "Sharon", "Jeffrey", "Laura", "Ryan", "Cynthia", "Jacob", "Kathleen", "Gary", "Amy", "Nicholas", "Shirley", "Eric", "Angela", "Jonathan", "Helen", "Stephen", "Anna", "Larry", "Brenda", "Justin", "Pamela", "Scott", "Nicole", "Brandon", "Emma", "Benjamin", "Samantha", "Samuel", "Katherine", "Gregory", "Christine", "Alexander", "Debra", "Frank", "Rachel", "Patrick", "Carolyn", "Raymond", "Janet", "Jack", "Maria", "Dennis", "Heather", "Jerry", "Diane", "Tyler", "Virginia", "Aaron", "Julie", "Jose", "Joyce", "Adam", "Victoria", "Nathan", "Olivia", "Henry", "Kelly", "Douglas", "Christina", "Zachary", "Lauren", "Peter", "Joan", "Kyle", "Evelyn", "Walter", "Judith", "Harold", "Megan", "Jeremy", "Cheryl", "Ethan", "Andrea", "Carl", "Hannah", "Keith", "Martha", "Roger", "Jacqueline", "Gerald", "Frances", "Christian", "Gloria", "Terry", "Ann", "Sean", "Teresa", "Arthur", "Kathryn", "Austin", "Sara", "Noah", "Janice", "Lawrence", "Jean"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson", "Brooks", "Chavez", "Wood", "James", "Bennet", "Gray", "Mendoza", "Ruiz", "Hughes", "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez"];

  for (let i = 6; i <= 156; i++) {
    let status = "Active";
    if (leaveToGen > 0) {
      status = "On Leave";
      leaveToGen--;
    } else if (inactiveToGen > 0) {
      status = "Inactive";
      inactiveToGen--;
    } else {
      activeToGen--;
    }

    const fName = firstNames[i % firstNames.length];
    const lName = lastNames[i % lastNames.length];
    const fullName = `${fName} ${lName}`;
    const dept = depts[i % depts.length];
    const shift = shifts[i % shifts.length];

    let role = "Staff";
    let designation = "Assistant";

    if (dept === "HR" || dept === "Human Resources") {
      role = "HR";
      designation = i % 2 === 0 ? "HR Specialist" : "Recruiter";
    } else if (dept === "Finance") {
      role = "Finance";
      designation = i % 2 === 0 ? "Accountant" : "Billing Specialist";
    } else if (dept === "IT") {
      role = "IT";
      designation = i % 2 === 0 ? "IT Support" : "Network Engineer";
    } else if (dept === "Operations") {
      role = "Operations";
      designation = "Operations Assistant";
    } else {
      if (i % 3 === 0) {
        role = "Doctor";
        designation = `Consultant ${dept}`;
      } else if (i % 3 === 1) {
        role = "Nurse";
        designation = i % 6 === 1 ? "Head Nurse" : "Staff Nurse";
      } else {
        role = i % 2 === 0 ? "Pharmacist" : "Lab Technician";
        designation = role;
      }
    }

    const years = (2 + (i % 5) + (i % 10) / 10).toFixed(1);
    const attendance = 85 + (i % 15);
    const leaves = 5 + (i % 20);
    const rating = (4.0 + (i % 10) / 10).toFixed(1);

    list.push({
      id: `EMP-${1000 + i}`,
      name: fullName,
      department: dept,
      designation: designation,
      role: role,
      status: status,
      shift: shift,
      phone: `+1 (555) 019-${1000 + i}`,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}@medicore.com`,
      joiningDate: `${String((i % 28) + 1).padStart(2, '0')} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i % 12]} 202${i % 4}`,
      address: `${100 + i} Medical Dr, Floor ${(i % 3) + 1}, Cityville`,
      yearsOfService: `${years} Yrs`,
      attendancePct: `${attendance}`,
      leaveBalance: `${leaves}`,
      performanceRating: `${rating}`,
      employmentType: i % 10 === 0 ? "Contract" : "Full-Time",
      reportsTo: i % 2 === 0 ? "Dr. Sarah Johnson" : "John Doe",
      teamMembersCount: i % 8 === 0 ? `${2 + (i % 5)} Direct Reports` : "0 Direct Reports",
      gender: i % 2 === 0 ? "Male" : "Female",
      dob: `198${i % 10}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      bloodGroup: ["A+", "B+", "O+", "AB+", "O-", "A-", "B-", "AB-"][i % 8],
      emergencyContactName: `${lName} Family`,
      emergencyContactPhone: `+1 (555) 999-${1000 + i}`,
      emergencyContactRelation: "Spouse",
      salaryGrade: `Grade ${7 + (i % 5)}`,
      contractExpiry: i % 10 === 0 ? "31 Dec 2026" : "Permanent",
      recentActivity: [
        { title: "Completed shift routine checks", time: "1 day ago", type: "performance" },
        { title: "Leave Request Approved (1 Day)", time: "2 weeks ago", type: "leave" },
        { title: "Profile Info Updated", time: "1 month ago", type: "profile" }
      ]
    });
  }

  // Augment all employees with missing profile schema fields
  list.forEach((emp, index) => {
    const nationalities = ["American", "British", "Canadian", "Australian", "Egyptian"];
    const languages = ["English", "English, Spanish", "English, French", "English, Arabic"];
    emp.nationality = nationalities[index % nationalities.length];
    emp.language = languages[index % languages.length];
    emp.maritalStatus = index % 3 === 0 ? "Single" : "Married";
    
    const allSkills = ["Recruitment", "Employee Relations", "Performance Management", "Communication", "Problem Solving", "Leadership", "Data Analysis", "Project Management", "Customer Service", "Technical Support", "Medical Diagnostics", "Patient Care", "Budgeting"];
    emp.skills = [
      allSkills[(index) % allSkills.length],
      allSkills[(index + 3) % allSkills.length],
      allSkills[(index + 5) % allSkills.length],
      allSkills[(index + 7) % allSkills.length]
    ];
    
    emp.education = [
      { year: "2012 - 2016", degree: index % 2 === 0 ? `Master's in ${emp.department}` : `MBA in ${emp.department}`, institution: "Cityville University" },
      { year: "2008 - 2012", degree: "Bachelor Degree", institution: "State University" }
    ];
    
    emp.experience = [
      { year: "2021 - Present", title: emp.designation, company: "MediCore Hospital" },
      { year: "2018 - 2021", title: `Senior Specialist`, company: "City Health Center" },
      { year: "2016 - 2018", title: `Assistant`, company: "Wellness Hospital" }
    ];
    
    emp.documents = [
      { name: "Employment Contract", type: "PDF", size: "2.4 MB", date: emp.joiningDate },
      { name: "National ID Copy", type: "PDF", size: "1.1 MB", date: emp.joiningDate }
    ];
    
    emp.certificates = [
      { name: `${emp.department} Professional Certification`, issuer: "Global Health Board", year: "2020" },
      { name: "Advanced Training Program", issuer: "MediCore Academy", year: "2022" }
    ];
    
    emp.about = `Dedicated ${emp.department} professional with 5+ years of experience in ${emp.skills[0].toLowerCase()} and ${emp.skills[1].toLowerCase()}. Proven track record of improving team performance and streamlining processes.`;
  });

  return list;
})();

const initialDepartments = [
  { id: "CARD", name: "Cardiology", code: "CARD", headName: "Dr. Sarah Johnson", headTitle: "Consultant Cardiologist", subDeptsCount: 3, employeesCount: 0, status: "Active", description: "Heart and cardiovascular care", icon: "heart-pulse", headDoctorId: "DOC-1001", createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z", createdBy: "Admin", updatedBy: "Admin" },
  { id: "PULM", name: "Pulmonology", code: "PULM", headName: "Dr. Michael Brown", headTitle: "Consultant Pulmonologist", subDeptsCount: 2, employeesCount: 0, status: "Active", description: "Respiratory system care", icon: "lungs", headDoctorId: "DOC-1006", createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z", createdBy: "Admin", updatedBy: "Admin" },
  { id: "NEUR", name: "Neurology", code: "NEUR", headName: "Dr. Emily Davis", headTitle: "Consultant Neurologist", subDeptsCount: 3, employeesCount: 0, status: "Active", description: "Brain and nervous system care", icon: "brain", headDoctorId: "DOC-1007", createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z", createdBy: "Admin", updatedBy: "Admin" },
  { id: "PEDI", name: "Pediatrics", code: "PEDI", headName: "Dr. S. Lee", headTitle: "Consultant Pediatrician", subDeptsCount: 3, employeesCount: 0, status: "Active", description: "Infant and child healthcare", icon: "baby", headDoctorId: "DOC-1004", createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z", createdBy: "Admin", updatedBy: "Admin" },
  { id: "ORTH", name: "Orthopedics", code: "ORTH", headName: "Dr. M. Davis", headTitle: "Chief Orthopedic Surgeon", subDeptsCount: 2, employeesCount: 0, status: "Active", description: "Musculoskeletal system care", icon: "activity", headDoctorId: "DOC-1005", createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z", createdBy: "Admin", updatedBy: "Admin" },
  { id: "ER", name: "Emergency Medicine", code: "ER", headName: "Dr. J. Smith", headTitle: "Chief ER Physician", subDeptsCount: 4, employeesCount: 0, status: "Active", description: "Acute and emergency treatments", icon: "lightning", headDoctorId: "DOC-1002", createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z", createdBy: "Admin", updatedBy: "Admin" },
  { id: "RAD", name: "Radiology", code: "RAD", headName: "Dr. Robert Harrison", headTitle: "Chief Radiologist", subDeptsCount: 2, employeesCount: 0, status: "Active", description: "Imaging and diagnostics (X-ray, MRI)", icon: "camera", headDoctorId: "DOC-1008", createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z", createdBy: "Admin", updatedBy: "Admin" },
  { id: "DERM", name: "Dermatology", code: "DERM", headName: "Dr. Susan Carter", headTitle: "Consultant Dermatologist", subDeptsCount: 0, employeesCount: 0, status: "Active", description: "Skin, hair, and nail treatments", icon: "emoji-smile", headDoctorId: "DOC-1009", createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z", createdBy: "Admin", updatedBy: "Admin" },
  { id: "ONCO", name: "Oncology", code: "ONCO", headName: "Dr. William Vance", headTitle: "Lead Oncologist", subDeptsCount: 3, employeesCount: 0, status: "Active", description: "Cancer diagnosis and treatment", icon: "shield-plus", headDoctorId: "DOC-1010", createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z", createdBy: "Admin", updatedBy: "Admin" },
  { id: "GAST", name: "Gastroenterology", code: "GAST", headName: "Dr. Laura Adams", headTitle: "Consultant Gastroenterologist", subDeptsCount: 2, employeesCount: 0, status: "Active", description: "Digestive system diagnostics", icon: "droplet", headDoctorId: "DOC-1011", createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z", createdBy: "Admin", updatedBy: "Admin" },
  { id: "GYN", name: "Gynecology", code: "GYN", headName: "Dr. Karen White", headTitle: "Chief Gynecologist", subDeptsCount: 2, employeesCount: 0, status: "Active", description: "Women's reproductive health", icon: "gender-female", headDoctorId: "DOC-1012", createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z", createdBy: "Admin", updatedBy: "Admin" },
  { id: "OPHT", name: "Ophthalmology", code: "OPHT", headName: "Unassigned", headTitle: "Consultant Ophthalmologist", subDeptsCount: 0, employeesCount: 0, status: "Inactive", description: "Eye and vision care services", icon: "eye", headDoctorId: null, createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z", createdBy: "Admin", updatedBy: "Admin" },
  { id: "HR", name: "Human Resources", code: "HR", headName: "John Doe", headTitle: "HR Manager", subDeptsCount: 1, employeesCount: 0, status: "Active", description: "Personnel and talent management", icon: "people", headDoctorId: null, createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z", createdBy: "Admin", updatedBy: "Admin" },
  { id: "FIN", name: "Finance & Billing", code: "FIN", headName: "Michael Brown", headTitle: "Senior Accountant", subDeptsCount: 1, employeesCount: 0, status: "Active", description: "Financial accounts and billing", icon: "wallet2", headDoctorId: null, createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z", createdBy: "Admin", updatedBy: "Admin" },
  { id: "IT", name: "Information Technology", code: "IT", headName: "Emily Davis", headTitle: "IT Support Head", subDeptsCount: 1, employeesCount: 0, status: "Active", description: "Hospital tech systems and network", icon: "pc-display", headDoctorId: null, createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z", createdBy: "Admin", updatedBy: "Admin" },
  { id: "OPS", name: "Operations", code: "OPS", headName: "David Wilson", headTitle: "Operations Officer", subDeptsCount: 1, employeesCount: 0, status: "Active", description: "General hospital operations", icon: "gear", headDoctorId: null, createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z", createdBy: "Admin", updatedBy: "Admin" }
];

initialDepartments.forEach(dept => {
  dept.employeesCount = initialEmployees.filter(emp => 
    emp.department.toLowerCase() === dept.name.toLowerCase() || 
    emp.department.toLowerCase() === dept.id.toLowerCase() || 
    emp.department.toLowerCase() === dept.code.toLowerCase()
  ).length;
});

const initialSubDepartments = [
  { id: "SUB-CARD-1", departmentId: "CARD", name: "Pediatric Cardiology", code: "CARD-PED", createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z" },
  { id: "SUB-CARD-2", departmentId: "CARD", name: "Interventional Cardiology", code: "CARD-INT", createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z" },
  { id: "SUB-CARD-3", departmentId: "CARD", name: "Cardiac Electrophysiology", code: "CARD-EP", createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z" },
  { id: "SUB-NEUR-1", departmentId: "NEUR", name: "Stroke Center", code: "NEUR-STRK", createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z" },
  { id: "SUB-NEUR-2", departmentId: "NEUR", name: "Epilepsy Monitoring Unit", code: "NEUR-EPI", createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z" },
  { id: "SUB-NEUR-3", departmentId: "NEUR", name: "Neuro-Oncology", code: "NEUR-ONC", createdAt: "2024-05-18T09:00:00.000Z", updatedAt: "2024-05-18T09:00:00.000Z" }
];



export const useErpStore = create((set, get) => ({
  
  // Global UI Toast Notification
  globalToast: null,
  showToast: (message, type = 'success') => {
    set({ globalToast: { message, type } });
    setTimeout(() => {
      set({ globalToast: null });
    }, 3500);
  },
  hideToast: () => set({ globalToast: null }),

  patients: initialPatients,
  doctors: initialDoctors,
  appointments: initialAppointments,
  alerts: initialAlerts,
  messages: initialMessages,
  inventory: initialInventory,
  suppliers: initialSuppliers,
  departments: initialDepartments,
  subDepartments: initialSubDepartments,
  employees: initialEmployees,
  availableBeds: 14,
  searchQuery: "",
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  registerPatient: (patientData) => {
    const newId = `PAT-${1200 + get().patients.length + 1}`;
    const newPatient = {
      id: newId,
      ...patientData
    };
    set((state) => ({
      patients: [...state.patients, newPatient]
    }));
    // Append auto check-in alert
    get().addAlert({
      title: "New Patient Registered",
      type: "check_in",
      desc: `${patientData.name} (${newId}) registered successfully.`,
      category: "success"
    });
    return newPatient;
  },
  
  addAppointment: (apptData) => {
    const newId = `APT-${1000 + get().appointments.length + 1}`;
    
    // Find doctorroom info
    const doctorObj = get().doctors.find(d => d.name === apptData.doctorName) || {};
    const room = doctorObj.room || "Room TBD";
    
    const newAppt = {
      id: newId,
      room,
      type: apptData.type || "Consultation",
      durationMinutes: 30,
      payment: {
        amount: 100.00,
        status: "PENDING",
        method: "-",
        transactionId: "-"
      },
      clinicalNotes: {
        reason: apptData.reason || "General consult.",
        internalNotes: ""
      },
      timeline: [
        { status: "Appointment Created", timestamp: new Date().toLocaleString(), actor: "RECEPTION", completed: true, current: true }
      ],
      ...apptData
    };
    set((state) => ({
      appointments: [newAppt, ...state.appointments]
    }));
    return newAppt;
  },
  
  cancelAppointment: (id) => {
    set((state) => ({
      appointments: state.appointments.map(appt => {
        if (appt.id === id) {
          const updatedTimeline = [...(appt.timeline || [])];
          updatedTimeline.forEach(t => t.current = false);
          updatedTimeline.push({
            status: "Appointment Cancelled",
            timestamp: new Date().toLocaleString(),
            actor: "SYSTEM",
            completed: true,
            current: true,
            isCancelled: true
          });
          return {
            ...appt,
            status: "CANCELLED",
            timeline: updatedTimeline
          };
        }
        return appt;
      })
    }));
  },

  exportReport: (format) => {
    if (format === 'csv') {
      const depts = get().departments;
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "ID,Name,Code,Head,Sub-Departments,Status\n";
      
      depts.forEach(d => {
        const row = [
          d.id,
          `"${d.name}"`,
          d.code,
          `"${d.headName || 'Unassigned'}"`,
          d.subDeptsCount,
          d.status
        ].join(",");
        csvContent += row + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `medicore_departments_report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      const depts = get().departments;
      let pdfContent = "data:text/plain;charset=utf-8,";
      pdfContent += "--- MEDICORE ERP - DEPARTMENT REPORT ---\n\n";
      depts.forEach(d => {
        pdfContent += `[${d.code}] ${d.name} | Head: ${d.headName || 'Unassigned'} | Sub-Depts: ${d.subDeptsCount} | Status: ${d.status}\n`;
      });
      const encodedUri = encodeURI(pdfContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `medicore_departments_report.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    get().addAlert({
      title: "Report Exported",
      type: "system",
      desc: `Report generated successfully in ${format.toUpperCase()} format.`,
      category: "success"
    });
  },
  
  rescheduleAppointment: (id, newTime, newDate) => {
    set((state) => ({
      appointments: state.appointments.map(appt => {
        if (appt.id === id) {
          const updatedTimeline = [...appt.timeline];
          updatedTimeline.push({
            status: "Rescheduled",
            timestamp: new Date().toLocaleString(),
            actor: "SYSTEM",
            completed: true,
            current: true
          });
          return {
            ...appt,
            time: newTime,
            dateTime: `${newDate}T${newTime}:00`,
            timeline: updatedTimeline,
            status: "Scheduled"
          };
        }
        return appt;
      })
    }));
  },
  
  toggleDoctorCheckIn: (doctorId) => {
    set((state) => ({
      doctors: state.doctors.map(doc => {
        if (doc.id === doctorId) {
          const nextDuty = !doc.onDuty;
          // Add check-in/out alert
          get().addAlert({
            title: nextDuty ? `${doc.name} checked in` : `${doc.name} checked out`,
            type: "check_in",
            desc: nextDuty ? `Checked in for ${doc.specialty} shift.` : `Checked out from shifts.`,
            category: nextDuty ? "info" : "warning"
          });
          return { ...doc, onDuty: nextDuty };
        }
        return doc;
      })
    }));
  },

  addDepartment: (deptData, subDeptsList = [], currentRole = "Admin") => {
    const code = deptData.code.toUpperCase();
    const now = new Date().toISOString();
    
    const generateSubDeptCode = (parentCode, name) => {
      const cleanName = name.replace(/[^a-zA-Z ]/g, "");
      const words = cleanName.trim().split(/\s+/);
      let suffix = "";
      if (words.length >= 2) {
        suffix = words.map(w => w[0]).join("").toUpperCase();
      } else if (words.length === 1 && words[0].length > 0) {
        suffix = words[0].slice(0, 3).toUpperCase();
      } else {
        suffix = "SUB";
      }
      return `${parentCode}-${suffix}`;
    };

    const newDept = {
      id: code,
      employeesCount: 0,
      headTitle: deptData.headTitle || "Department Head",
      icon: "building",
      ...deptData,
      subDeptsCount: subDeptsList.length,
      createdAt: now,
      updatedAt: now,
      createdBy: currentRole,
      updatedBy: currentRole
    };

    const newSubDepts = subDeptsList.map((name, index) => ({
      id: `SUB-${code}-${Date.now()}-${index}`,
      departmentId: code,
      name,
      code: generateSubDeptCode(code, name),
      createdAt: now,
      updatedAt: now
    }));

    set((state) => ({
      departments: [...state.departments, newDept],
      subDepartments: [...(state.subDepartments || []), ...newSubDepts]
    }));

    get().addAlert({
      title: "New Department Created",
      type: "maintenance",
      desc: `${newDept.name} (${code}) created successfully.`,
      category: "success"
    });
    return newDept;
  },

  updateDepartment: (id, updatedData) => {
    set((state) => ({
      departments: state.departments.map(dept => {
        if (dept.id === id) {
          const now = new Date().toISOString();
          return { 
            ...dept, 
            ...updatedData, 
            updatedAt: now,
            subDeptsCount: state.subDepartments.filter(sub => sub.departmentId === id).length
          };
        }
        return dept;
      })
    }));
    get().addAlert({
      title: "Department Updated",
      type: "maintenance",
      desc: `Department details for ${id} have been modified.`,
      category: "info"
    });
  },

  addSubDepartment: (deptId, name, code) => {
    const now = new Date().toISOString();
    const newSubDept = {
      id: `SUB-${deptId}-${Date.now()}`,
      departmentId: deptId,
      name,
      code: code || `${deptId}-${name.slice(0,3).toUpperCase()}`,
      createdAt: now,
      updatedAt: now
    };
    set((state) => {
      const updatedSubDepts = [...(state.subDepartments || []), newSubDept];
      const subCount = updatedSubDepts.filter(sub => sub.departmentId === deptId).length;
      return {
        subDepartments: updatedSubDepts,
        departments: state.departments.map(dept => 
          dept.id === deptId ? { ...dept, subDeptsCount: subCount } : dept
        )
      };
    });
    return newSubDept;
  },

  updateSubDepartment: (subDeptId, name, code) => {
    const now = new Date().toISOString();
    set((state) => ({
      subDepartments: (state.subDepartments || []).map(sub => 
        sub.id === subDeptId ? { ...sub, name, code, updatedAt: now } : sub
      )
    }));
  },

  deleteSubDepartment: (subDeptId) => {
    const subDept = get().subDepartments?.find(sub => sub.id === subDeptId);
    if (!subDept) return;
    const deptId = subDept.departmentId;
    set((state) => {
      const updatedSubDepts = (state.subDepartments || []).filter(sub => sub.id !== subDeptId);
      const subCount = updatedSubDepts.filter(sub => sub.departmentId === deptId).length;
      return {
        subDepartments: updatedSubDepts,
        departments: state.departments.map(dept => 
          dept.id === deptId ? { ...dept, subDeptsCount: subCount } : dept
        )
      };
    });
  },


  deleteDepartment: (id) => {
    const dept = get().departments.find(d => d.id === id);
    set((state) => ({
      departments: state.departments.filter(d => d.id !== id)
    }));
    get().addAlert({
      title: "Department Removed",
      type: "system",
      desc: `${dept?.name || id} department was removed.`,
      category: "warning"
    });
  },
  
  addAlert: (alertData) => {
    const newAlert = {
      id: Date.now(),
      timeLabel: "Just now",
      read: false,
      ...alertData
    };
    set((state) => ({
      alerts: [newAlert, ...state.alerts]
    }));
  },
  
  markAlertRead: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map(a => a.id === alertId ? { ...a, read: true } : a)
    }));
  },
  
  markAllAlertsRead: () => {
    set((state) => ({
      alerts: state.alerts.map(a => ({ ...a, read: true }))
    }));
  },

  markMessageRead: (msgId) => {
    set((state) => ({
      messages: state.messages.map(m => m.id === msgId ? { ...m, read: true } : m)
    }));
  },

  markAllMessagesRead: () => {
    set((state) => ({
      messages: state.messages.map(m => ({ ...m, read: true }))
    }));
  },
  
  updateAvailableBeds: (count) => {
    set((state) => {
      // Find bed item in inventory and update stock
      const updatedInv = state.inventory.map(item => {
        if (item.category === "Beds") {
          return { ...item, stock: count };
        }
        return item;
      });
      return {
        availableBeds: count,
        inventory: updatedInv
      };
    });
  },

  exportReport: (format = "csv") => {
    // Generate text/csv content
    const appts = get().appointments;
    let fileContent = "";
    let mimeType = "";
    let fileName = "";
    
    if (format === "csv") {
      fileContent = "ID,Patient Name,Doctor,Room,Time,Status\n" +
        appts.map(a => `${a.id},"${a.patientName}","${a.doctorName}","${a.room}","${a.time}",${a.status}`).join("\n");
      mimeType = "text/csv";
      fileName = `MediCore_ERP_Report_${Date.now()}.csv`;
    } else {
      // HTML representation as standard text output
      fileContent = `
        MEDICORE ERP HOSPITAL REPORT
        Generated: ${new Date().toLocaleString()}
        
        Total Patients: ${get().patients.length}
        Doctors on Duty: ${get().doctors.filter(d => d.onDuty).length}
        Available Beds: ${get().availableBeds}
        
        Appointments:
        ` + appts.map(a => ` - ${a.id} | ${a.patientName} | ${a.doctorName} | ${a.room} | ${a.time} | ${a.status}`).join("\n");
      mimeType = "text/plain";
      fileName = `MediCore_ERP_Report_${Date.now()}.txt`;
    }
    
    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  addEmployee: (employeeData) => {
    const newId = `EMP-${1000 + get().employees.length + 1}`;
    const newEmployee = {
      id: newId,
      ...employeeData
    };
    set((state) => {
      const updatedEmployees = [...state.employees, newEmployee];
      const updatedDepts = state.departments.map(d => {
        if (d.name.toLowerCase() === newEmployee.department.toLowerCase() || 
            d.id.toLowerCase() === newEmployee.department.toLowerCase() || 
            d.code.toLowerCase() === newEmployee.department.toLowerCase()) {
          return { ...d, employeesCount: (d.employeesCount || 0) + 1 };
        }
        return d;
      });
      return {
        employees: updatedEmployees,
        departments: updatedDepts
      };
    });
    get().addAlert({
      title: "New Employee Registered",
      type: "check_in",
      desc: `${employeeData.name} registered as ${employeeData.designation || 'Staff'}.`,
      category: "success"
    });
    return newEmployee;
  },

  updateEmployee: (id, updatedData) => {
    set((state) => {
      const oldEmp = state.employees.find(e => e.id === id);
      if (!oldEmp) return {};
      const updatedEmployees = state.employees.map(e => e.id === id ? { ...e, ...updatedData } : e);
      let updatedDepts = state.departments;
      if (updatedData.department && updatedData.department !== oldEmp.department) {
        updatedDepts = state.departments.map(d => {
          let countOffset = 0;
          if (d.name.toLowerCase() === oldEmp.department.toLowerCase() || 
              d.id.toLowerCase() === oldEmp.department.toLowerCase() || 
              d.code.toLowerCase() === oldEmp.department.toLowerCase()) {
            countOffset -= 1;
          }
          if (d.name.toLowerCase() === updatedData.department.toLowerCase() || 
              d.id.toLowerCase() === updatedData.department.toLowerCase() || 
              d.code.toLowerCase() === updatedData.department.toLowerCase()) {
            countOffset += 1;
          }
          return { ...d, employeesCount: Math.max(0, (d.employeesCount || 0) + countOffset) };
        });
      }
      return {
        employees: updatedEmployees,
        departments: updatedDepts
      };
    });
    get().addAlert({
      title: "Employee Info Updated",
      type: "system",
      desc: `Details for employee ${id} updated.`,
      category: "info"
    });
  },

  deleteEmployee: (id) => {
    const emp = get().employees.find(e => e.id === id);
    if (!emp) return;
    set((state) => {
      const updatedEmployees = state.employees.filter(e => e.id !== id);
      const updatedDepts = state.departments.map(d => {
        if (d.name.toLowerCase() === emp.department.toLowerCase() || 
            d.id.toLowerCase() === emp.department.toLowerCase() || 
            d.code.toLowerCase() === emp.department.toLowerCase()) {
          return { ...d, employeesCount: Math.max(0, (d.employeesCount || 0) - 1) };
        }
        return d;
      });
      return {
        employees: updatedEmployees,
        departments: updatedDepts
      };
    });
    get().addAlert({
      title: "Employee Removed",
      type: "system",
      desc: `${emp.name} was removed from the employee directory.`,
      category: "warning"
    });
  }
}));
