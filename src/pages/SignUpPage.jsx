import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Receptionist' // Default role
  });
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    const result = signup(formData.name, formData.email, formData.password, formData.role);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light py-5">
      <div className="card shadow-sm border-0" style={{ width: '100%', maxWidth: '450px', borderRadius: '12px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <i className="bi bi-person-plus-fill fs-1 text-primary"></i>
            <h3 className="fw-bold mt-2 text-dark">Create Account</h3>
            <p className="text-muted">Register for MediCore ERP</p>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-muted small fw-semibold">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-person text-muted"></i>
                </span>
                <input 
                  type="text" 
                  name="name"
                  className="form-control border-start-0 ps-0" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small fw-semibold">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-envelope text-muted"></i>
                </span>
                <input 
                  type="email" 
                  name="email"
                  className="form-control border-start-0 ps-0" 
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small fw-semibold">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <input 
                  type="password" 
                  name="password"
                  className="form-control border-start-0 ps-0" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-muted small fw-semibold">Select Role</label>
              <select 
                name="role" 
                className="form-select" 
                value={formData.role} 
                onChange={handleChange}
              >
                <option value="Admin">Admin</option>
                <option value="HR">HR</option>
                <option value="Receptionist">Receptionist</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold shadow-sm mb-3">
              Sign Up
            </button>
          </form>

          <div className="text-center text-muted small">
            Already have an account? <Link to="/login" className="text-primary text-decoration-none fw-semibold">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
