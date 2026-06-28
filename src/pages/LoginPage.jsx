import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-sm border-0" style={{ width: '100%', maxWidth: '400px', borderRadius: '12px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <i className="bi bi-hospital-fill fs-1 text-primary"></i>
            <h3 className="fw-bold mt-2 text-dark">MediCore ERP</h3>
            <p className="text-muted">Sign in to your account</p>
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-muted small fw-semibold">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-envelope text-muted"></i>
                </span>
                <input 
                  type="email" 
                  className="form-control border-start-0 ps-0" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-muted small fw-semibold">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <input 
                  type="password" 
                  className="form-control border-start-0 ps-0" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold shadow-sm mb-3">
              Sign In
            </button>
          </form>

          <div className="text-center text-muted small">
            Don't have an account? <Link to="/signup" className="text-primary text-decoration-none fw-semibold">Sign up</Link>
          </div>
          
          <div className="mt-4 pt-3 border-top text-center text-muted" style={{ fontSize: '0.75rem' }}>
            <strong>Demo Accounts:</strong><br />
            admin@medicare.com / password123<br />
            hr@medicare.com / password123<br />
            reception@medicare.com / password123
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
