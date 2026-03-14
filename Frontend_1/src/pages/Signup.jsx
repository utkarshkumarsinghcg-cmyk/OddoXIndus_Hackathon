import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { Lock, Mail, User, ChevronDown, Eye, EyeOff } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Inventory Manager');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useInventory();
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    login(email, password);
    navigate('/');
  };

  return (
    <>
      <style>{`
        .signup-page {
          display: flex;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .signup-left {
          flex: 1;
          background: linear-gradient(160deg, #060e1a 0%, #0b1929 40%, #0d2137 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 4rem 4.5rem;
          position: relative;
          overflow: hidden;
        }

        .signup-left::before {
          content: '';
          position: absolute;
          top: -120px;
          right: -120px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(33, 150, 243, 0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .signup-left::after {
          content: '';
          position: absolute;
          bottom: -80px;
          left: -80px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(33, 150, 243, 0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .signup-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 3.5rem;
        }

        .signup-brand img {
          width: 42px;
          height: 42px;
          object-fit: contain;
        }

        .signup-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .signup-brand-name {
          font-size: 1.35rem;
          font-weight: 800;
          color: #e8edf5;
          letter-spacing: 0.04em;
        }

        .signup-brand-sub {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #2196F3;
          font-weight: 600;
          margin-top: 3px;
        }

        .signup-headline {
          font-size: 2.75rem;
          font-weight: 700;
          color: #f0f4f8;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }

        .signup-subtext {
          font-size: 1rem;
          color: #7a8ba5;
          line-height: 1.7;
          max-width: 420px;
          margin-bottom: 3rem;
        }

        .signup-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .signup-feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #94a3b8;
          font-size: 0.95rem;
        }

        .signup-feature-check {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(33, 150, 243, 0.15);
          border: 1px solid rgba(33, 150, 243, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .signup-feature-check::after {
          content: '✓';
          color: #2196F3;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .signup-right {
          flex: 1;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 4.5rem;
          overflow-y: auto;
        }

        .signup-form-wrapper {
          width: 100%;
          max-width: 400px;
        }

        .signup-form-title {
          font-size: 1.85rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.4rem;
        }

        .signup-form-subtitle {
          font-size: 0.95rem;
          color: #6b7280;
          margin-bottom: 1.75rem;
        }

        .signup-field-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.45rem;
        }

        .signup-field-group {
          margin-bottom: 1.15rem;
        }

        .signup-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .signup-input-icon {
          position: absolute;
          left: 0.85rem;
          color: #9ca3af;
          display: flex;
          pointer-events: none;
        }

        .signup-input {
          width: 100%;
          padding: 0.72rem 0.85rem 0.72rem 2.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.9rem;
          font-family: inherit;
          color: #111827;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .signup-input:focus {
          outline: none;
          border-color: #2196F3;
          box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.12);
        }

        .signup-input::placeholder { color: #9ca3af; }

        .signup-select-wrapper { position: relative; }

        .signup-select {
          width: 100%;
          padding: 0.72rem 2.5rem 0.72rem 0.85rem;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.9rem;
          font-family: inherit;
          color: #111827;
          background: #fff;
          appearance: none;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .signup-select:focus {
          outline: none;
          border-color: #2196F3;
          box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.12);
        }

        .signup-select-chevron {
          position: absolute;
          right: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          pointer-events: none;
          display: flex;
        }

        .signup-toggle-pw {
          position: absolute;
          right: 0.85rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          display: flex;
          transition: color 0.2s;
          padding: 0;
        }

        .signup-toggle-pw:hover { color: #374151; }

        .signup-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.6rem 0.85rem;
          border-radius: 10px;
          font-size: 0.82rem;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .signup-submit {
          width: 100%;
          padding: 0.8rem;
          background: linear-gradient(135deg, #1976D2, #2196F3);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(33, 150, 243, 0.3);
        }

        .signup-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4); }
        .signup-submit:active { transform: translateY(0); }

        .signup-footer {
          text-align: center;
          margin-top: 1.75rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .signup-footer a {
          color: #2196F3;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .signup-footer a:hover { color: #1976D2; }

        @keyframes signupSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .signup-animate { animation: signupSlideUp 0.5s ease forwards; }

        @media (max-width: 900px) {
          .signup-page { flex-direction: column; }
          .signup-left { padding: 2.5rem 2rem; }
          .signup-right { padding: 2.5rem 2rem; }
          .signup-headline { font-size: 2rem; }
        }
      `}</style>

      <div className="signup-page">
        {/* LEFT */}
        <div className="signup-left">
          <div className="signup-brand">
            <img src="/logo.png" alt="WareNova" />
            <div className="signup-brand-text">
              <span className="signup-brand-name">WARENOVA</span>
              <span className="signup-brand-sub">Digital Solutions</span>
            </div>
          </div>

          <h1 className="signup-headline">Start managing<br />stock smarter.</h1>
          <p className="signup-subtext">
            Create your account to gain full access to the centralized inventory
            management platform used by warehouse teams worldwide.
          </p>

          <div className="signup-features">
            <div className="signup-feature-item">
              <span className="signup-feature-check"></span>
              Real-time stock tracking across warehouses
            </div>
            <div className="signup-feature-item">
              <span className="signup-feature-check"></span>
              Automated low-stock alerts & reorder rules
            </div>
            <div className="signup-feature-item">
              <span className="signup-feature-check"></span>
              Full audit trail for every stock movement
            </div>
            <div className="signup-feature-item">
              <span className="signup-feature-check"></span>
              Multi-location support & internal transfers
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="signup-right">
          <div className="signup-form-wrapper signup-animate">
            <h2 className="signup-form-title">Create account</h2>
            <p className="signup-form-subtitle">Fill in your details to get started</p>

            {error && <div className="signup-error">{error}</div>}

            <form onSubmit={handleSignup}>
              <div className="signup-field-group">
                <label className="signup-field-label">Full Name</label>
                <div className="signup-input-wrapper">
                  <span className="signup-input-icon"><User size={16} /></span>
                  <input type="text" className="signup-input" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>

              <div className="signup-field-group">
                <label className="signup-field-label">Role</label>
                <div className="signup-select-wrapper">
                  <select className="signup-select" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option>Inventory Manager</option>
                    <option>Warehouse Staff</option>
                  </select>
                  <span className="signup-select-chevron"><ChevronDown size={16} /></span>
                </div>
              </div>

              <div className="signup-field-group">
                <label className="signup-field-label">Email</label>
                <div className="signup-input-wrapper">
                  <span className="signup-input-icon"><Mail size={16} /></span>
                  <input type="email" className="signup-input" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className="signup-field-group">
                <label className="signup-field-label">Password</label>
                <div className="signup-input-wrapper">
                  <span className="signup-input-icon"><Lock size={16} /></span>
                  <input type={showPassword ? 'text' : 'password'} className="signup-input" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" className="signup-toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="signup-field-group">
                <label className="signup-field-label">Confirm Password</label>
                <div className="signup-input-wrapper">
                  <span className="signup-input-icon"><Lock size={16} /></span>
                  <input type="password" className="signup-input" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
              </div>

              <button type="submit" className="signup-submit">Create Account</button>
            </form>

            <div className="signup-footer">
              Already have an account? <Link to="/login">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
