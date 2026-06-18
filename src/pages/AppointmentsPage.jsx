import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';

function AppointmentsPage() {
  const navigate = useNavigate();

  const appointmentsList = [
    {
      id: "APT-1001",
      patientName: "John Doe",
      dateTime: "22 May 2024, 10:00 AM",
      type: "Consultation",
      specialty: "Cardiology",
      status: "CONFIRMED"
    },
    {
      id: "APT-1002",
      patientName: "Linda Davis",
      dateTime: "19 May 2024, 01:00 PM",
      type: "ECG & Tests",
      specialty: "Diagnostics",
      status: "COMPLETED"
    },
    {
      id: "APT-1003",
      patientName: "Alice Smith",
      dateTime: "21 May 2024, 08:00 AM",
      type: "Surgery",
      specialty: "Cardiology",
      status: "CONFIRMED"
    },
    {
      id: "APT-1004",
      patientName: "Mark T.",
      dateTime: "21 May 2024, 02:00 PM",
      type: "Follow-up",
      specialty: "General Medicine",
      status: "CONFIRMED"
    },
    {
      id: "APT-1005",
      patientName: "Robert W.",
      dateTime: "22 May 2024, 10:30 AM",
      type: "Consultation",
      specialty: "General Medicine",
      status: "CONFIRMED"
    }
  ];

  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Operations</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Appointments</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title">Appointments</h1>
        <button className="btn-medicore" onClick={() => alert("Opening Book Appointment form...")}>
          <i className="bi bi-plus-lg"></i> Book Appointment
        </button>
      </div>

      <div className="dashboard-card p-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.9rem' }}>
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ fontWeight: 600 }}>Appt ID</th>
                <th scope="col" style={{ fontWeight: 600 }}>Patient</th>
                <th scope="col" style={{ fontWeight: 600 }}>Date & Time</th>
                <th scope="col" style={{ fontWeight: 600 }}>Type</th>
                <th scope="col" style={{ fontWeight: 600 }}>Specialty</th>
                <th scope="col" style={{ fontWeight: 600 }}>Status</th>
                <th scope="col" style={{ fontWeight: 600, width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointmentsList.map((appt) => (
                <tr key={appt.id}>
                  <td className="fw-bold text-primary">{appt.id}</td>
                  <td>{appt.patientName}</td>
                  <td>{appt.dateTime}</td>
                  <td>{appt.type}</td>
                  <td>{appt.specialty}</td>
                  <td>
                    <span 
                      className="badge-active"
                      style={{
                        backgroundColor: appt.status === 'COMPLETED' ? '#e0f2fe' : 'var(--badge-active-bg)',
                        color: appt.status === 'COMPLETED' ? '#0369a1' : 'var(--badge-active-text)'
                      }}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/appointments/details`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AppointmentsPage;
