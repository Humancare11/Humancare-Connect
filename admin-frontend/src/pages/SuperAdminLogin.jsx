import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function SuperAdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/admin-login", form);
      const { token, user } = res.data;

      if (user.role !== "superadmin") {
        setError("This account is not a Super Admin. Use the Admin login.");
        setLoading(false);
        return;
      }

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(user));
      navigate("/superadmin");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-left" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)" }}>
        <div className="login-brand">
          <div className="login-brand-mark" style={{ background: "#6d28d9" }}>H</div>
          <span>HumaniCare</span>
        </div>
        <div className="login-hero">
          <div className="login-icon">👑</div>
          <h2>Super Admin Portal</h2>
          <p>Full platform control. Create and manage admin accounts.</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <div className="login-form-header">
            <h1>Super Admin Login</h1>
            <p>Restricted access — Super Admins only</p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="superadmin@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoFocus
                required
                disabled={loading}
              />
            </div>

            <div className="login-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="login-btn"
              style={{ background: "#6d28d9" }}
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p className="login-switch">
            Regular admin? <Link to="/admin-login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
