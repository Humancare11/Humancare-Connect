// src/pages/DoctorRegister.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Doctor.css";

const STEPS = ["Account"];

export default function DoctorRegister() {
  const navigate = useNavigate();
  const [step] = useState(0);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.email) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email.";
    if (!form.password) return "Password is required.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return "";
  };

  const next = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    navigate("/doctor-enrollments");
  };

  return (
    <div className="dr-page">
      {/* left panel */}
      <div className="dr-panel dr-panel--left">
        <div className="dr-panel-inner">
          <Link to="/" className="dr-brand">
            <div className="dr-brand-mark">H</div>
            <span className="dr-brand-name">HumaniCare</span>
          </Link>

          <div className="dr-panel-hero">
            <div className="dr-panel-icon">🩺</div>
            <h2 className="dr-panel-title">
              Join our doctor
              <br />
              network today
            </h2>
            <p className="dr-panel-sub">
              Connect with thousands of patients across Maharashtra.
              Manage appointments, consult online and grow your practice.
            </p>

            <div className="dr-panel-perks">
              {[
                ["📅", "Smart appointment scheduling"],
                ["💬", "Video & chat consultations"],
                ["📊", "Patient insights dashboard"],
                ["🔒", "Secure & NABH compliant"],
              ].map(([icon, text]) => (
                <div className="dr-perk" key={text}>
                  <span className="dr-perk-icon">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* right panel — form */}
      <div className="dr-panel dr-panel--right">
        <div className="dr-form-wrap">
          {/* stepper */}
          <div className="dr-stepper">
            {STEPS.map((s, i) => (
              <div key={s} className={`dr-step active`}>
                <div className="dr-step-circle">
                  <span>{i + 1}</span>
                </div>
                <span className="dr-step-label">{s}</span>
              </div>
            ))}
          </div>

          <div className="dr-form-header">
            <h1 className="dr-form-title">Doctor Registration</h1>
            <p className="dr-form-sub">Set up your login credentials</p>
          </div>

          {error && (
            <div className="dr-error">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={next} noValidate>
            <div className="dr-fields">
              <div className="dr-field">
                <label>
                  Email Address <span className="dr-req">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="doctor@example.com"
                  autoFocus
                />
              </div>

              <div className="dr-field">
                <label>
                  Password <span className="dr-req">*</span>
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div className="dr-field">
                <label>
                  Confirm Password <span className="dr-req">*</span>
                </label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  placeholder="Re-enter your password"
                />
              </div>
            </div>

            <div className="dr-btn-row dr-btn-row--single">
              <button type="submit" className="dr-btn-primary">
                Continue →
              </button>
            </div>
          </form>

          <p className="dr-switch">
            Already registered? <Link to="/doctor-login">Login here</Link>
          </p>

          <p className="dr-switch" style={{ marginTop: 8 }}>
            Not a doctor? <Link to="/register">Patient registration</Link>
          </p>
        </div>
      </div>
    </div>
  );
}