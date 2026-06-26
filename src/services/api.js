// Medicare ERP - Backend-ready Mock Service Layer
import { useErpStore } from '../store/erpStore';


// 1. Initial Schedule Data
let scheduleSlots = [
  {
    id: "slot-1",
    title: "Consultation",
    type: "consultation",
    startTime: "2024-05-19T09:00:00",
    endTime: "2024-05-19T11:00:00",
    patientName: "John Doe",
    status: "booked"
  },
  {
    id: "slot-2",
    title: "ECG & Tests",
    type: "tests",
    startTime: "2024-05-19T13:00:00",
    endTime: "2024-05-19T15:00:00",
    patientName: "Linda Davis",
    status: "priority"
  },
  {
    id: "slot-3",
    title: "Surgery",
    type: "surgery",
    startTime: "2024-05-21T08:00:00",
    endTime: "2024-05-21T10:00:00",
    patientName: "Alice Smith",
    status: "urgent"
  },
  {
    id: "slot-4",
    title: "Follow-up",
    type: "followup",
    startTime: "2024-05-21T14:00:00",
    endTime: "2024-05-21T15:30:00",
    patientName: "Mark T.",
    status: "booked"
  },
  {
    id: "slot-5",
    title: "Ward Rounds",
    type: "ward_rounds",
    startTime: "2024-05-21T16:00:00",
    endTime: "2024-05-21T17:30:00",
    patientName: "",
    status: "booked"
  },
  {
    id: "slot-6",
    title: "Consultation",
    type: "consultation",
    startTime: "2024-05-22T10:30:00",
    endTime: "2024-05-22T12:30:00",
    patientName: "Robert W.",
    status: "booked"
  },
  {
    id: "slot-7",
    title: "Consultation",
    type: "consultation",
    startTime: "2024-05-23T15:00:00",
    endTime: "2024-05-23T17:00:00",
    patientName: "",
    status: "available"
  }
];

// 2. Initial Appointments Database
export let appointments = [
  {
    id: "APT-1001",
    patientName: "John Doe",
    dateTime: "2024-05-22T10:00:00",
    type: "Consultation",
    doctorId: "DOC-1001",
    status: "CONFIRMED"
  },
  {
    id: "APT-1002",
    patientName: "Linda Davis",
    dateTime: "2024-05-19T13:00:00",
    type: "ECG & Tests",
    doctorId: "DOC-1002",
    status: "COMPLETED"
  },
  {
    id: "APT-1003",
    patientName: "Alice Smith",
    dateTime: "2024-05-21T08:00:00",
    type: "Surgery",
    doctorId: "DOC-1003",
    status: "CONFIRMED"
  },
  {
    id: "APT-1004",
    patientName: "Mark T.",
    dateTime: "2024-05-21T14:00:00",
    type: "Follow-up",
    doctorId: "DOC-1004",
    status: "CONFIRMED"
  },
  {
    id: "APT-1005",
    patientName: "Robert W.",
    dateTime: "2024-05-22T10:30:00",
    type: "Consultation",
    doctorId: "DOC-1005",
    status: "CONFIRMED"
  }
];

// 3. Initial Appointment Details Data
let appointmentDetails = {
  id: "APT-1001",
  status: "CONFIRMED", // CONFIRMED, CANCELLED
  dateTime: "2024-05-22T10:00:00",
  type: "Consultation",
  durationMinutes: 30,
  
  payment: {
    amount: 100.00,
    status: "PAID",
    method: "Credit Card (**** 4242)",
    transactionId: "TXN_982310"
  },
  
  patient: {
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
  
  clinicalNotes: {
    reason: "Chest pain and discomfort during physical activity. Patient reports mild shortness of breath and occasional fatigue over the past 2 weeks.",
    internalNotes: "Patient has mild discomfort occasionally. Monitor ECG results closely. Blood pressure was slightly elevated (140/90) upon arrival."
  },
  
  timeline: [
    {
      status: "Appointment Created",
      timestamp: "18 May 2024, 09:15 AM",
      actor: "ADMIN USER",
      completed: true,
      current: false
    },
    {
      status: "Appointment Confirmed",
      timestamp: "18 May 2024, 09:20 AM",
      actor: "ADMIN USER",
      completed: true,
      current: false
    },
    {
      status: "Patient Checked In",
      timestamp: "22 May 2024, 09:55 AM",
      actor: "RECEPTION",
      completed: true,
      current: true
    },
    {
      status: "Appointment Completed",
      timestamp: "Estimated: 22 May 2024, 10:30 AM",
      actor: null,
      completed: false,
      current: false
    }
  ]
};

// 3. Exportable Mock Async Services
export const getDoctorInfo = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "DOC-1001",
        name: "Dr. Sarah Johnson",
        specialty: "Cardiologist",
        status: "Active"
      });
    }, 50);
  });
};

export const getScheduleSlots = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...scheduleSlots]);
    }, 50);
  });
};

export const saveScheduleSlot = async (newSlot) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      newSlot.id = "slot-" + Date.now();
      scheduleSlots.push(newSlot);
      resolve({ success: true, slot: newSlot });
    }, 100);
  });
};

export const deleteScheduleSlot = async (slotId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      scheduleSlots = scheduleSlots.filter(s => s.id !== slotId);
      resolve({ success: true });
    }, 100);
  });
};

export const getKPIMetrics = async (timeRange = "This Month") => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalAppointments: { value: 156, change: "+12.5%", label: "vs last month", trend: "up" },
        completedAppointments: { value: 142, total: 156, percentage: 91.0 },
        revenue: { value: 32450, change: "+16.8%", label: "vs last month", trend: "up" },
        rating: { value: 4.8, max: 5 },
        noShowRate: { value: "2.5%", change: "-1.2%", label: "improvement", trend: "down" }
      });
    }, 80);
  });
};

export const getTopServices = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { name: "Consultation", amount: 16450, percentage: 50.8 },
        { name: "ECG", amount: 4240, percentage: 13.2 },
        { name: "Stress Test", amount: 4120, percentage: 12.7 },
        { name: "Follow-up", amount: 3120, percentage: 9.6 }
      ]);
    }, 50);
  });
};

export const getFeedbackSummary = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        average: 4.8,
        totalReviews: 120,
        distribution: [
          { stars: 5, count: 92, percentage: 76 },
          { stars: 4, count: 23, percentage: 19 },
          { stars: 3, count: 4, percentage: 3 },
          { stars: 2, count: 1, percentage: 1 },
          { stars: 1, count: 0, percentage: 0 }
        ]
      });
    }, 60);
  });
};

export const getAppointmentsTrend = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: {
          completed: [65, 85, 78, 105, 90, 100],
          cancelled: [10, 18, 12, 22, 10, 25],
          noShow: [5, 8, 3, 10, 4, 12]
        }
      });
    }, 80);
  });
};

export const getRevenueTrend = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        revenue: [19000, 22000, 29000, 26000, 36000, 32450]
      });
    }, 80);
  });
};

export const getAppointmentDetails = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const appt = appointments.find(a => a.id === id);
      const currentStatus = appt ? appt.status : "CONFIRMED";
      resolve({ 
        ...appointmentDetails,
        id,
        status: currentStatus
      });
    }, 50);
  });
};

export const updateAppointmentStatus = async (id, status) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const appt = appointments.find(a => a.id === id);
      if (appt) {
        appt.status = status;
      }
      if (id === appointmentDetails.id || id === "APT-1001") {
        appointmentDetails.status = status;
      }
      resolve({ success: true, status });
    }, 100);
  });
};

// 4. Department Async APIs
export const getDepartments = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(useErpStore.getState().departments);
    }, 50);
  });
};

export const getDepartmentById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dept = useErpStore.getState().departments.find(d => d.id === id);
      resolve(dept || null);
    }, 50);
  });
};

export const createDepartment = async (deptData, subDeptsList = []) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDept = useErpStore.getState().addDepartment(deptData, subDeptsList);
      resolve({ success: true, department: newDept });
    }, 100);
  });
};

export const updateDepartment = async (id, deptData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      useErpStore.getState().updateDepartment(id, deptData);
      const updated = useErpStore.getState().departments.find(d => d.id === id);
      resolve({ success: true, department: updated });
    }, 100);
  });
};

export const deleteDepartment = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      useErpStore.getState().deleteDepartment(id);
      resolve({ success: true });
    }, 100);
  });
};

export const getSubDepartmentsByDeptId = async (deptId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const subs = (useErpStore.getState().subDepartments || []).filter(sub => sub.departmentId === deptId);
      resolve(subs);
    }, 50);
  });
};

export const createSubDepartment = async (deptId, subDeptData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newSub = useErpStore.getState().addSubDepartment(deptId, subDeptData.name, subDeptData.code);
      resolve(newSub);
    }, 100);
  });
};

export const updateSubDepartmentApi = async (id, subDeptData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      useErpStore.getState().updateSubDepartment(id, subDeptData.name, subDeptData.code);
      const updated = (useErpStore.getState().subDepartments || []).find(sub => sub.id === id);
      resolve(updated);
    }, 100);
  });
};

export const deleteSubDepartmentApi = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      useErpStore.getState().deleteSubDepartment(id);
      resolve({ success: true });
    }, 100);
  });
};

export const getEmployees = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(useErpStore.getState().employees);
    }, 50);
  });
};

export const getEmployeeById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const emp = useErpStore.getState().employees.find(e => e.id === id);
      resolve(emp || null);
    }, 50);
  });
};

export const createEmployee = async (employeeData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEmp = useErpStore.getState().addEmployee(employeeData);
      resolve({ success: true, employee: newEmp });
    }, 100);
  });
};

export const updateEmployee = async (id, employeeData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      useErpStore.getState().updateEmployee(id, employeeData);
      const updated = useErpStore.getState().employees.find(e => e.id === id);
      resolve({ success: true, employee: updated });
    }, 100);
  });
};

export const deleteEmployee = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      useErpStore.getState().deleteEmployee(id);
      resolve({ success: true });
    }, 100);
  });
};


