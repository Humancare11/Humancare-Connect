// src/pages/DoctorLogin.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../../socket";
import "./Doctor.css";

export default function DoctorLogin() {
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [showPw,  setShowPw]  = useState(false);

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/doctor-login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (!socket.connected) socket.connect();
      socket.emit("user-online", {
        userId: res.data.user._id,
        role: res.data.user.role,
      });

      window.dispatchEvent(new Event("authChange"));
      navigate("/doctor-dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Please check your credentials.");
    }
    setLoading(false);
  };

  return (
    <div className="dr-page">
      {/* left decorative panel */}
      <div className="dr-panel dr-panel--left dl-left">
        <div className="dr-panel-inner">
          <Link to="/" className="dr-brand">
            <div className="dr-brand-mark">H</div>
            <span className="dr-brand-name">HumaniCare</span>
          </Link>
          <div className="dr-panel-hero">
            <div className="dr-panel-icon">👨‍⚕️</div>
            <h2 className="dr-panel-title">Welcome back,<br />Doctor</h2>
            <p className="dr-panel-sub">
              Log in to access your dashboard, manage your appointments,
              and connect with your patients.
            </p>
            <div className="dl-stats">
              <div className="dl-stat">
                <div className="dl-stat-val">2,400+</div>
                <div className="dl-stat-lbl">Verified Doctors</div>
              </div>
              <div className="dl-stat">
                <div className="dl-stat-val">50K+</div>
                <div className="dl-stat-lbl">Consultations</div>
              </div>
              <div className="dl-stat">
                <div className="dl-stat-val">98%</div>
                <div className="dl-stat-lbl">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* right — login form */}
      <div className="dr-panel dr-panel--right">
        <div className="dr-form-wrap dr-form-wrap--narrow">

          <div className="dl-logo-sm">
            <div className="dr-brand-mark">H</div>
          </div>

          <div className="dr-form-header">
            <h1 className="dr-form-title">Doctor Login</h1>
            <p className="dr-form-sub">Sign in to your doctor account</p>
          </div>

          {error && (
            <div className="dr-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="dr-fields">

              <div className="dr-field">
                <label>Email Address</label>
                <div className="dr-input-wrap">
                  <svg className="dr-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input type="email" value={form.email} onChange={set("email")}
                    placeholder="doctor@example.com" autoFocus />
                </div>
              </div>

              <div className="dr-field">
                <div className="dr-field-header">
                  <label>Password</label>
                  <Link to="/forgot-password" className="dr-forgot">Forgot password?</Link>
                </div>
                <div className="dr-input-wrap">
                  <svg className="dr-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Enter your password"
                  />
                  <button type="button" className="dr-pw-toggle" onClick={() => setShowPw((p) => !p)}>
                    {showPw ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="dr-btn-primary dr-btn-full" disabled={loading}>
              {loading ? (
                <><span className="dr-spinner" /> Signing in…</>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div className="dr-divider"><span>or</span></div>

          <p className="dr-switch">
            New to HumaniCare?{" "}
            <Link to="/doctor-register">Register as a doctor</Link>
          </p>
          <p className="dr-switch" style={{ marginTop: 8 }}>
            Are you a patient?{" "}
            <Link to="/login">Patient login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}