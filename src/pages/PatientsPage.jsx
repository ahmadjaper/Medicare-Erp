import React, { useState } from 'react';
import TopNavbar from '../components/TopNavbar';
import { useErpStore } from '../store/erpStore';

function PatientsPage() {
  const { patients, registerPatient } = useErpStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [allergies, setAllergies] = useState("");
  const [history, setHistory] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    registerPatient({
      name,
      age: parseInt(age),
      gender,
      phone,
      email,
      bloodGroup,
      allergies: allergies || "None",
      history: history || "None",
      address
    });
    // Reset form
    setName("");
    setAge("");
    setGender("Male");
    setPhone("");
    setEmail("");
    setBloodGroup("O+");
    setAllergies("");
    setHistory("");
    setAddress("");
    setIsModalOpen(false);
    useErpStore.getState().showToast("Patient registered successfully!", "success");
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  return (
    <>
      <div className="top-navbar mb-4">
        <div>
          <nav className="breadcrumb-custom mb-1" aria-label="breadcrumb">
            <span className="text-muted">Operations</span>
            <span className="mx-1">/</span>
            <span className="text-dark fw-bold">Patients</span>
          </nav>
        </div>
        <TopNavbar />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title">Patients Directory</h1>
        <button className="btn-medicore" onClick={() => setIsModalOpen(true)}>
          <i className="bi bi-person-plus"></i> Register Patient
        </button>
      </div>

      <div className="dashboard-card p-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search patients by name, ID or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '400px' }}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.9rem' }}>
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ fontWeight: 600 }}>Patient ID</th>
                <th scope="col" style={{ fontWeight: 600 }}>Name</th>
                <th scope="col" style={{ fontWeight: 600 }}>Age & Gender</th>
                <th scope="col" style={{ fontWeight: 600 }}>Phone</th>
                <th scope="col" style={{ fontWeight: 600 }}>Blood Group</th>
                <th scope="col" style={{ fontWeight: 600 }}>Allergies</th>
                <th scope="col" style={{ fontWeight: 600 }}>History</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td className="fw-bold text-primary">{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{`${patient.age} yrs, ${patient.gender}`}</td>
                  <td>{patient.phone}</td>
                  <td>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded">
                      {patient.bloodGroup}
                    </span>
                  </td>
                  <td>{patient.allergies}</td>
                  <td>{patient.history}</td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No patients found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Patient Modal */}
      {isModalOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15,23,42,0.5)' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header bg-primary text-white border-0 py-3" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
                <h5 className="modal-title fw-bold"><i className="bi bi-person-plus-fill me-2"></i>Register New Patient</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setIsModalOpen(false)} aria-label="Close"></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Full Name</label>
                    <input type="text" className="form-control" placeholder="e.g. Johnathan Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Age</label>
                      <input type="number" className="form-control" placeholder="e.g. 35" value={age} onChange={(e) => setAge(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Gender</label>
                      <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)} required>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Phone</label>
                      <input type="text" className="form-control" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Blood Group</label>
                      <select className="form-select" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} required>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email Address</label>
                    <input type="email" className="form-control" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Address</label>
                    <input type="text" className="form-control" placeholder="123 Medical Center Dr" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Allergies</label>
                      <input type="text" className="form-control" placeholder="Peanuts, Penicillin" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Medical History</label>
                      <input type="text" className="form-control" placeholder="Hypertension" value={history} onChange={(e) => setHistory(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light fw-bold px-4 py-2" style={{ borderRadius: '8px' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-bold px-4 py-2" style={{ borderRadius: '8px' }}>Register</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PatientsPage;
