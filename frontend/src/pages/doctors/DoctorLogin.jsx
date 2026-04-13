import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Doctor.css";

const API_BASE = "/api";

export default function DoctorLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.email.trim()) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Enter a valid email.";
    if (!form.password) return "Password is required.";
    return "";
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/doctor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      // Store JWT token and minimal doctor info for session
      localStorage.setItem("doctorToken", data.token);
      localStorage.setItem("currentDoctor", JSON.stringify(data.doctor));

      navigate("/doctor-dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dr-page">
      <div className="dr-panel dr-panel--left">
        <div className="dr-panel-inner">
          <Link to="/" className="dr-brand">
            <div className="dr-brand-mark">H</div>
            <span className="dr-brand-name">HumaniCare</span>
          </Link>

          <div className="dr-panel-hero">
            <div className="dr-panel-icon">🩺</div>
            <h2 className="dr-panel-title">
              Welcome back,
              <br />
              Doctor
            </h2>
            <p className="dr-panel-sub">
              Login to continue to your doctor dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="dr-panel dr-panel--right">
        <div className="dr-form-wrap">
          <div className="dr-form-header">
            <h1 className="dr-form-title">Doctor Login</h1>
            <p className="dr-form-sub">Enter your email and password</p>
          </div>

          {error && (
            <div className="dr-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} noValidate>
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
                  disabled={loading}
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
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="dr-btn-row dr-btn-row--single">
              <button type="submit" className="dr-btn-primary" disabled={loading}>
                {loading ? "Logging in…" : "Login →"}
              </button>
            </div>
          </form>

          <p className="dr-switch">
            New doctor? <Link to="/doctor-register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
