// src/pages/DoctorRegister.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Doctor.css";

const SPECIALTIES = [
  "Cardiologist","Dermatologist","General Physician","Gynaecologist",
  "Neurologist","Ophthalmologist","Orthopaedic Surgeon","Paediatrician",
  "Psychiatrist","Pulmonologist","ENT Specialist","Gastroenterologist",
  "Diabetologist","Urologist","Oncologist","Radiologist","Andrologist","Audiologist",
];

const STEPS = ["Account", "Personal", "Professional"];

export default function DoctorRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    // step 0 — account
    email: "",
    password: "",
    confirmPassword: "",
    // step 1 — personal
    name: "",
    phone: "",
    gender: "",
    // step 2 — professional
    specialty: "",
    degree: "",
    experience: "",
    licenseNumber: "",
    hospital: "",
    consultationFee: "",
    bio: "",
  });

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setError("");
  };

  /* ── per-step validation ── */
  const validate = () => {
    if (step === 0) {
      if (!form.email)           return "Email is required.";
      if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email.";
      if (!form.password)        return "Password is required.";
      if (form.password.length < 6) return "Password must be at least 6 characters.";
      if (form.password !== form.confirmPassword) return "Passwords do not match.";
    }
    if (step === 1) {
      if (!form.name.trim())  return "Full name is required.";
      if (!form.phone.trim()) return "Phone number is required.";
      if (!form.gender)       return "Please select gender.";
    }
    if (step === 2) {
      if (!form.specialty)        return "Please select a specialization.";
      if (!form.degree.trim())    return "Degree / qualification is required.";
      if (!form.experience.trim()) return "Years of experience is required.";
      if (!form.licenseNumber.trim()) return "License number is required.";
    }
    return "";
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setStep((s) => s + 1);
  };

  const back = () => { setError(""); setStep((s) => s - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/doctor-register", {
        ...form,
        role: "doctor",
      });
      alert("Registration successful! Please login.");
      navigate("/doctor-login");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    }
    setLoading(false);
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
            <h2 className="dr-panel-title">Join our doctor<br />network today</h2>
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
              <div key={s} className={`dr-step${i === step ? " active" : ""}${i < step ? " done" : ""}`}>
                <div className="dr-step-circle">
                  {i < step ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                <span className="dr-step-label">{s}</span>
                {i < STEPS.length - 1 && <div className="dr-step-line" />}
              </div>
            ))}
          </div>

          <div className="dr-form-header">
            <h1 className="dr-form-title">Doctor Registration</h1>
            <p className="dr-form-sub">
              {step === 0 && "Set up your login credentials"}
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "Share your medical expertise"}
            </p>
          </div>

          {error && (
            <div className="dr-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); next(); }} noValidate>

            {/* ── STEP 0: Account ── */}
            {step === 0 && (
              <div className="dr-fields">
                <div className="dr-field">
                  <label>Email Address <span className="dr-req">*</span></label>
                  <input type="email" value={form.email} onChange={set("email")}
                    placeholder="doctor@example.com" autoFocus />
                </div>
                <div className="dr-field">
                  <label>Password <span className="dr-req">*</span></label>
                  <input type="password" value={form.password} onChange={set("password")}
                    placeholder="Minimum 6 characters" />
                </div>
                <div className="dr-field">
                  <label>Confirm Password <span className="dr-req">*</span></label>
                  <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")}
                    placeholder="Re-enter your password" />
                </div>
              </div>
            )}

            {/* ── STEP 1: Personal ── */}
            {step === 1 && (
              <div className="dr-fields">
                <div className="dr-field">
                  <label>Full Name <span className="dr-req">*</span></label>
                  <input type="text" value={form.name} onChange={set("name")}
                    placeholder="Dr. First Last" autoFocus />
                </div>
                <div className="dr-field">
                  <label>Phone Number <span className="dr-req">*</span></label>
                  <input type="tel" value={form.phone} onChange={set("phone")}
                    placeholder="+91 9876543210" />
                </div>
                <div className="dr-field">
                  <label>Gender <span className="dr-req">*</span></label>
                  <div className="dr-radio-group">
                    {["Male","Female","Other"].map((g) => (
                      <label key={g} className={`dr-radio${form.gender === g ? " selected" : ""}`}>
                        <input type="radio" name="gender" value={g}
                          checked={form.gender === g} onChange={set("gender")} />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: Professional ── */}
            {step === 2 && (
              <div className="dr-fields">
                <div className="dr-field">
                  <label>Specialization <span className="dr-req">*</span></label>
                  <select value={form.specialty} onChange={set("specialty")}>
                    <option value="">Select specialization</option>
                    {SPECIALTIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="dr-field">
                  <label>Degree / Qualification <span className="dr-req">*</span></label>
                  <input type="text" value={form.degree} onChange={set("degree")}
                    placeholder="e.g. MBBS, MD Cardiology" />
                </div>
                <div className="dr-row">
                  <div className="dr-field">
                    <label>Experience (years) <span className="dr-req">*</span></label>
                    <input type="number" min="0" max="60" value={form.experience}
                      onChange={set("experience")} placeholder="e.g. 10" />
                  </div>
                  <div className="dr-field">
                    <label>Consultation Fee (₹)</label>
                    <input type="number" min="0" value={form.consultationFee}
                      onChange={set("consultationFee")} placeholder="e.g. 500" />
                  </div>
                </div>
                <div className="dr-field">
                  <label>Medical License Number <span className="dr-req">*</span></label>
                  <input type="text" value={form.licenseNumber} onChange={set("licenseNumber")}
                    placeholder="e.g. MH-2024-12345" />
                </div>
                <div className="dr-field">
                  <label>Hospital / Clinic Name</label>
                  <input type="text" value={form.hospital} onChange={set("hospital")}
                    placeholder="e.g. Apollo Hospital, Mumbai" />
                </div>
                <div className="dr-field">
                  <label>Short Bio</label>
                  <textarea value={form.bio} onChange={set("bio")} rows={3}
                    placeholder="Brief description about your expertise and approach…" />
                </div>
              </div>
            )}

            {/* navigation buttons */}
            <div className={`dr-btn-row${step === 0 ? " dr-btn-row--single" : ""}`}>
              {step > 0 && (
                <button type="button" className="dr-btn-back" onClick={back}>
                  ← Back
                </button>
              )}
              <button
                type="submit"
                className="dr-btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <><span className="dr-spinner" /> Registering…</>
                ) : step < 2 ? (
                  "Continue →"
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
          </form>

          <p className="dr-switch">
            Already registered?{" "}
            <Link to="/doctor-login">Login here</Link>
          </p>

          <p className="dr-switch" style={{ marginTop: 8 }}>
            Not a doctor?{" "}
            <Link to="/register">Patient registration</Link>
          </p>
        </div>
      </div>
    </div>
  );
}