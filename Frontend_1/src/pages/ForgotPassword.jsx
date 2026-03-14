import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, ShieldCheck, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=newPassword
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    // Mock sending OTP
    setStep(2);
    startResendTimer();
  };

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }
    setStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    alert('Password has been reset successfully!');
    window.location.href = '/login';
  };

  return (
    <>
      <style>{`
        .forgot-page {
          display: flex;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .forgot-left {
          flex: 1;
          background: linear-gradient(160deg, #060e1a 0%, #0b1929 40%, #0d2137 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 4rem 4.5rem;
          position: relative;
          overflow: hidden;
        }

        .forgot-left::before {
          content: '';
          position: absolute;
          top: -120px;
          right: -120px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(33, 150, 243, 0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .forgot-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 3.5rem;
        }

        .forgot-brand img {
          width: 42px;
          height: 42px;
          object-fit: contain;
        }

        .forgot-brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .forgot-brand-name {
          font-size: 1.35rem;
          font-weight: 800;
          color: #e8edf5;
          letter-spacing: 0.04em;
        }

        .forgot-brand-sub {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #2196F3;
          font-weight: 600;
          margin-top: 3px;
        }

        .forgot-headline {
          font-size: 2.75rem;
          font-weight: 700;
          color: #f0f4f8;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }

        .forgot-subtext {
          font-size: 1rem;
          color: #7a8ba5;
          line-height: 1.7;
          max-width: 420px;
          margin-bottom: 3rem;
        }

        /* Steps indicator */
        .forgot-steps {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .forgot-step-dot {
          width: 40px;
          height: 5px;
          border-radius: 3px;
          background: rgba(255,255,255,0.1);
          transition: background 0.3s;
        }

        .forgot-step-dot.active {
          background: #2196F3;
        }

        .forgot-step-dot.done {
          background: rgba(33, 150, 243, 0.4);
        }

        /* Right Panel */
        .forgot-right {
          flex: 1;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 4.5rem;
        }

        .forgot-form-wrapper {
          width: 100%;
          max-width: 400px;
        }

        .forgot-icon-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .forgot-icon-step1 {
          background: rgba(33, 150, 243, 0.1);
          color: #2196F3;
        }

        .forgot-icon-step2 {
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
        }

        .forgot-icon-step3 {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .forgot-form-title {
          font-size: 1.85rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.4rem;
        }

        .forgot-form-subtitle {
          font-size: 0.95rem;
          color: #6b7280;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .forgot-field-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.45rem;
        }

        .forgot-field-group {
          margin-bottom: 1.35rem;
        }

        .forgot-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .forgot-input-icon {
          position: absolute;
          left: 0.85rem;
          color: #9ca3af;
          display: flex;
          pointer-events: none;
        }

        .forgot-input {
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

        .forgot-input:focus {
          outline: none;
          border-color: #2196F3;
          box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.12);
        }

        .forgot-input::placeholder { color: #9ca3af; }

        /* OTP inputs */
        .forgot-otp-group {
          display: flex;
          gap: 0.6rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .forgot-otp-input {
          width: 50px;
          height: 56px;
          text-align: center;
          font-size: 1.35rem;
          font-weight: 700;
          font-family: inherit;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          color: #111827;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .forgot-otp-input:focus {
          outline: none;
          border-color: #2196F3;
          box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.12);
        }

        .forgot-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.6rem 0.85rem;
          border-radius: 10px;
          font-size: 0.82rem;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .forgot-submit {
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
          transition: all 0.2s;
          box-shadow: 0 4px 14px rgba(33, 150, 243, 0.3);
        }

        .forgot-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4); }
        .forgot-submit:active { transform: translateY(0); }

        .forgot-resend {
          text-align: center;
          margin-top: 1.25rem;
          font-size: 0.85rem;
          color: #6b7280;
        }

        .forgot-resend button {
          background: none;
          border: none;
          color: #2196F3;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.85rem;
          padding: 0;
        }

        .forgot-resend button:disabled {
          color: #9ca3af;
          cursor: not-allowed;
        }

        .forgot-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 1.75rem;
          font-size: 0.875rem;
          color: #6b7280;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .forgot-back-link:hover { color: #374151; }

        @keyframes forgotSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .forgot-animate { animation: forgotSlideUp 0.5s ease forwards; }

        @media (max-width: 900px) {
          .forgot-page { flex-direction: column; }
          .forgot-left { padding: 2.5rem 2rem; }
          .forgot-right { padding: 2.5rem 2rem; }
          .forgot-headline { font-size: 2rem; }
        }
      `}</style>

      <div className="forgot-page">
        {/* LEFT */}
        <div className="forgot-left">
          <div className="forgot-brand">
            <img src="/logo.png" alt="WareNova" />
            <div className="forgot-brand-text">
              <span className="forgot-brand-name">WARENOVA</span>
              <span className="forgot-brand-sub">Digital Solutions</span>
            </div>
          </div>

          <h1 className="forgot-headline">
            {step === 1 && <>Account<br />recovery.</>}
            {step === 2 && <>Verify your<br />identity.</>}
            {step === 3 && <>Set a new<br />password.</>}
          </h1>
          <p className="forgot-subtext">
            {step === 1 && "Enter your registered email and we\u2019ll send a one-time password to verify your identity."}
            {step === 2 && "We\u2019ve sent a 6-digit code to your email address. Enter it below to continue."}
            {step === 3 && "Choose a strong password to secure your account. You\u2019ll be redirected to login afterwards."}
          </p>

          <div className="forgot-steps">
            <div className={`forgot-step-dot ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`}></div>
            <div className={`forgot-step-dot ${step >= 2 ? (step > 2 ? 'done' : 'active') : ''}`}></div>
            <div className={`forgot-step-dot ${step >= 3 ? 'active' : ''}`}></div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="forgot-right">
          <div className="forgot-form-wrapper forgot-animate" key={step}>
            
            {/* ── STEP 1: Enter Email ── */}
            {step === 1 && (
              <>
                <div className="forgot-icon-circle forgot-icon-step1">
                  <Mail size={28} />
                </div>
                <h2 className="forgot-form-title">Forgot password?</h2>
                <p className="forgot-form-subtitle">
                  No worries! Enter your email and we&#39;ll send you an OTP to reset your password.
                </p>

                {error && <div className="forgot-error">{error}</div>}

                <form onSubmit={handleSendOtp}>
                  <div className="forgot-field-group">
                    <label className="forgot-field-label">Email Address</label>
                    <div className="forgot-input-wrapper">
                      <span className="forgot-input-icon"><Mail size={16} /></span>
                      <input type="email" className="forgot-input" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                  </div>
                  <button type="submit" className="forgot-submit">Send OTP</button>
                </form>

                <Link to="/login" className="forgot-back-link">
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </>
            )}

            {/* ── STEP 2: Enter OTP ── */}
            {step === 2 && (
              <>
                <div className="forgot-icon-circle forgot-icon-step2">
                  <KeyRound size={28} />
                </div>
                <h2 className="forgot-form-title">Enter OTP</h2>
                <p className="forgot-form-subtitle">
                  We sent a 6-digit verification code to <strong>{email}</strong>
                </p>

                {error && <div className="forgot-error">{error}</div>}

                <form onSubmit={handleVerifyOtp}>
                  <div className="forgot-otp-group">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        className="forgot-otp-input"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value.replace(/\D/, ''))}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      />
                    ))}
                  </div>
                  <button type="submit" className="forgot-submit">Verify Code</button>
                </form>

                <div className="forgot-resend">
                  {resendTimer > 0 ? (
                    <>Resend code in <strong>{resendTimer}s</strong></>
                  ) : (
                    <>Didn't receive code? <button onClick={() => { startResendTimer(); }}>Resend OTP</button></>
                  )}
                </div>

                <Link to="/login" className="forgot-back-link">
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </>
            )}

            {/* ── STEP 3: New Password ── */}
            {step === 3 && (
              <>
                <div className="forgot-icon-circle forgot-icon-step3">
                  <ShieldCheck size={28} />
                </div>
                <h2 className="forgot-form-title">New password</h2>
                <p className="forgot-form-subtitle">
                  Your identity has been verified. Set your new password below.
                </p>

                {error && <div className="forgot-error">{error}</div>}

                <form onSubmit={handleResetPassword}>
                  <div className="forgot-field-group">
                    <label className="forgot-field-label">New Password</label>
                    <div className="forgot-input-wrapper">
                      <span className="forgot-input-icon"><KeyRound size={16} /></span>
                      <input type="password" className="forgot-input" placeholder="Min. 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>
                  </div>
                  <div className="forgot-field-group">
                    <label className="forgot-field-label">Confirm Password</label>
                    <div className="forgot-input-wrapper">
                      <span className="forgot-input-icon"><KeyRound size={16} /></span>
                      <input type="password" className="forgot-input" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                  </div>
                  <button type="submit" className="forgot-submit">Reset Password</button>
                </form>

                <Link to="/login" className="forgot-back-link">
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
