import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { Lock, Mail, Eye, EyeOff, ChevronDown } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Inventory Manager');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useInventory();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
    navigate('/');
  };

  return (
    <>
      <style>{`
        .login-page {
          display: flex;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .login-left {
          flex: 1;
          background: linear-gradient(160deg, #060e1a 0%, #0b1929 40%, #0d2137 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 4rem 4.5rem;
          position: relative;
          overflow: hidden;
        }

        .login-left::before {
          content: '';
          position: absolute;
          top: -150px;
          right: -150px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(33, 150, 243, 0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-left::after {
          content: '';
          position: absolute;
          bottom: -100px;
          left: -100px;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(33, 150, 243, 0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .login-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 3.5rem;
        }

        .login-brand img {
          width: 42px;
          height: 42px;
          object-fit: contain;
        }

        .login-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .login-brand-name {
          font-size: 1.35rem;
          font-weight: 800;
          color: #e8edf5;
          letter-spacing: 0.04em;
        }

        .login-brand-sub {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #2196F3;
          font-weight: 600;
          margin-top: 3px;
        }

        .login-headline {
          font-size: 2.75rem;
          font-weight: 700;
          color: #e8edf5;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }

        .login-subtext {
          font-size: 1rem;
          color: #5a7194;
          line-height: 1.7;
          max-width: 420px;
          margin-bottom: 3rem;
        }

        .login-stats {
          display: flex;
          gap: 1.25rem;
        }

        .login-stat-card {
          background: rgba(33, 150, 243, 0.05);
          border: 1px solid rgba(33, 150, 243, 0.1);
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          min-width: 140px;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .login-stat-card:hover {
          transform: translateY(-3px);
          border-color: rgba(33, 150, 243, 0.3);
        }

        .login-stat-value {
          font-size: 1.65rem;
          font-weight: 700;
          color: #2196F3;
          margin-bottom: 0.3rem;
        }

        .login-stat-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #3d5a80;
          font-weight: 600;
        }

        .login-right {
          flex: 1;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 4.5rem;
        }

        .login-form-wrapper {
          width: 100%;
          max-width: 400px;
        }

        .login-form-title {
          font-size: 1.85rem;
          font-weight: 700;
          color: #0b1929;
          margin-bottom: 0.4rem;
        }

        .login-form-subtitle {
          font-size: 0.95rem;
          color: #5a7194;
          margin-bottom: 2rem;
        }

        .login-field-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #1a3358;
          margin-bottom: 0.45rem;
        }

        .login-field-group {
          margin-bottom: 1.35rem;
        }

        .login-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .login-input-icon {
          position: absolute;
          left: 0.85rem;
          color: #8899b4;
          display: flex;
          pointer-events: none;
        }

        .login-input {
          width: 100%;
          padding: 0.72rem 0.85rem 0.72rem 2.75rem;
          border: 1px solid #d4dbe6;
          border-radius: 10px;
          font-size: 0.9rem;
          font-family: inherit;
          color: #0b1929;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .login-input:focus {
          outline: none;
          border-color: #2196F3;
          box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.12);
        }

        .login-input::placeholder { color: #8899b4; }

        .login-select-wrapper { position: relative; }

        .login-select {
          width: 100%;
          padding: 0.72rem 2.5rem 0.72rem 0.85rem;
          border: 1px solid #d4dbe6;
          border-radius: 10px;
          font-size: 0.9rem;
          font-family: inherit;
          color: #0b1929;
          background: #fff;
          appearance: none;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .login-select:focus {
          outline: none;
          border-color: #2196F3;
          box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.12);
        }

        .login-select-chevron {
          position: absolute;
          right: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: #5a7194;
          pointer-events: none;
          display: flex;
        }

        .login-password-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .login-forgot {
          font-size: 0.8rem;
          font-weight: 600;
          color: #2196F3;
          cursor: pointer;
          border: none;
          background: none;
          padding: 0;
          text-decoration: none;
          transition: color 0.2s;
        }

        .login-forgot:hover { color: #1976D2; }

        .login-toggle-pw {
          position: absolute;
          right: 0.85rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #8899b4;
          display: flex;
          transition: color 0.2s;
          padding: 0;
        }

        .login-toggle-pw:hover { color: #1a3358; }

        .login-submit {
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
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 4px 14px rgba(33, 150, 243, 0.3);
        }

        .login-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4); }
        .login-submit:active { transform: translateY(0); }

        .login-footer {
          text-align: center;
          margin-top: 2rem;
          font-size: 0.875rem;
          color: #5a7194;
        }

        .login-footer a {
          color: #2196F3;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .login-footer a:hover { color: #1976D2; }

        @keyframes loginSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .login-animate { animation: loginSlideUp 0.5s ease forwards; }

        @media (max-width: 900px) {
          .login-page { flex-direction: column; }
          .login-left { padding: 2.5rem 2rem; }
          .login-right { padding: 2.5rem 2rem; }
          .login-headline { font-size: 2rem; }
          .login-stats { flex-wrap: wrap; }
        }
      `}</style>

      <div className="login-page">
        <div className="login-left">
          <div className="login-brand">
            <img src="/logo.png" alt="WareNova" />
            <div className="login-brand-text">
              <span className="login-brand-name">WARENOVA</span>
              <span className="login-brand-sub">Digital Solutions</span>
            </div>
          </div>

          <h1 className="login-headline">Manage your<br />inventory with<br />confidence.</h1>
          <p className="login-subtext">
            Replace manual registers and scattered Excel sheets with a centralized,
            real-time digital platform. Track every unit from receipt to delivery.
          </p>

          <div className="login-stats">
            <div className="login-stat-card login-animate" style={{ animationDelay: '0.1s' }}>
              <div className="login-stat-value">4,200+</div>
              <div className="login-stat-label">Products Tracked</div>
            </div>
            <div className="login-stat-card login-animate" style={{ animationDelay: '0.25s' }}>
              <div className="login-stat-value">99.4%</div>
              <div className="login-stat-label">Stock Accuracy</div>
            </div>
            <div className="login-stat-card login-animate" style={{ animationDelay: '0.4s' }}>
              <div className="login-stat-value">$1.8M</div>
              <div className="login-stat-label">Waste Reduced</div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-wrapper login-animate">
            <h2 className="login-form-title">Welcome back</h2>
            <p className="login-form-subtitle">Sign in to your account to continue</p>

            <form onSubmit={handleLogin}>
              <div className="login-field-group">
                <label className="login-field-label">Role</label>
                <div className="login-select-wrapper">
                  <select className="login-select" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option>Inventory Manager</option>
                    <option>Warehouse Staff</option>
                  </select>
                  <span className="login-select-chevron"><ChevronDown size={16} /></span>
                </div>
              </div>

              <div className="login-field-group">
                <label className="login-field-label">Email</label>
                <div className="login-input-wrapper">
                  <span className="login-input-icon"><Mail size={16} /></span>
                  <input type="email" className="login-input" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className="login-field-group">
                <div className="login-password-header">
                  <label className="login-field-label" style={{ marginBottom: 0 }}>Password</label>
                  <Link to="/forgot-password" className="login-forgot">Forgot Password?</Link>
                </div>
                <div className="login-input-wrapper" style={{ marginTop: '0.45rem' }}>
                  <span className="login-input-icon"><Lock size={16} /></span>
                  <input type={showPassword ? 'text' : 'password'} className="login-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" className="login-toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-submit">Sign In</button>
            </form>

            <div className="login-footer">
              Don&#39;t have an account? <Link to="/signup">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
