import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import "./Doctor.css";
const API_BASE = "/api";

export default function DoctorAuthPage() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // LOGIN FORM
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // REGISTER FORM
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ---------------- LOGIN INPUT ----------------
  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // ---------------- REGISTER INPUT ----------------
  const handleRegisterChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // ---------------- GOOGLE AUTH ----------------
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/google-doctor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.msg || data.message || "Google Sign-In failed.");
        setLoading(false);
        return;
      }
      localStorage.setItem("doctorToken", data.token);
      localStorage.setItem("currentDoctor", JSON.stringify(data.doctor));

      if (data.isNewUser) {
        // New doctor account — go to dashboard where the enrollment form is available
        navigate("/doctor-dashboard?newAccount=1");
      } else {
        navigate("/doctor-dashboard");
      }
    } catch (err) {
      setError("Could not connect to server.");
    }
    setLoading(false);
  };

  // ---------------- LOGIN SUBMIT ----------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/doctor/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginForm.email.trim().toLowerCase(),
          password: loginForm.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      localStorage.setItem("doctorToken", data.token);
      localStorage.setItem(
        "currentDoctor",
        JSON.stringify(data.doctor)
      );

      navigate("/doctor-dashboard");
    } catch (err) {
      setError("Could not connect to server.");
    }

    setLoading(false);
  };

  // ---------------- REGISTER SUBMIT ----------------
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (
      registerForm.password !==
      registerForm.confirmPassword
    ) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/doctor/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerForm.name.trim(),
          email: registerForm.email.trim().toLowerCase(),
          password: registerForm.password,
          confirmPassword:
            registerForm.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.message ||
            "Registration failed. Please try again."
        );
        setLoading(false);
        return;
      }

      localStorage.setItem("doctorToken", data.token);
      localStorage.setItem(
        "currentDoctor",
        JSON.stringify(data.doctor)
      );

      navigate("/doctor-dashboard");
    } catch (err) {
      setError("Could not connect to server.");
    }

    setLoading(false);
  };

  return (
    <div
      className={`doctor-auth-wrapper ${
        isRegister ? "panel-active" : ""
      }`}
    >
      {/* REGISTER FORM */}
      <div className="doctor-auth-form-box register-form-box">
        <form onSubmit={handleRegisterSubmit}>
          <h1>Doctor Register</h1>

          <div className="doctor-social-links">
            <a href="#"><FaFacebookF /></a>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Sign-In failed.")}
              type="icon"
              shape="circle"
              size="large"
            />
            <a href="#"><FaLinkedinIn /></a>
          </div>

          <span>Create your professional account</span>

          {error && (
            <p className="doctor-error">{error}</p>
          )}

          <input
            type="text"
            name="name"
            placeholder="Dr. John Doe"
            value={registerForm.name}
            onChange={handleRegisterChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="doctor@example.com"
            value={registerForm.email}
            onChange={handleRegisterChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={registerForm.password}
            onChange={handleRegisterChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={registerForm.confirmPassword}
            onChange={handleRegisterChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="doctor-mobile-switch">
            <p>Already have an account?</p>
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError("");
              }}
            >
              Login
            </button>
          </div>
        </form>
      </div>

      {/* LOGIN FORM */}
      <div className="doctor-auth-form-box login-form-box">
        <form onSubmit={handleLoginSubmit}>
          <h1>Doctor Login</h1>

          <div className="doctor-social-links">
            <a href="#"><FaFacebookF /></a>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Sign-In failed.")}
              type="icon"
              shape="circle"
              size="large"
            />
            <a href="#"><FaLinkedinIn /></a>
          </div>

          <span>Login to your doctor dashboard</span>

          {error && (
            <p className="doctor-error">{error}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="doctor@example.com"
            value={loginForm.email}
            onChange={handleLoginChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={loginForm.password}
            onChange={handleLoginChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="doctor-mobile-switch">
            <p>New doctor?</p>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError("");
              }}
            >
              Register
            </button>
          </div>
        </form>
      </div>

      {/* SLIDING PANEL */}
      <div className="doctor-slide-panel-wrapper">
        <div className="doctor-slide-panel">
          {/* LEFT PANEL */}
          <div className="doctor-panel-content doctor-panel-left">
            <h1>Welcome Back Doctor!</h1>
            <p>
              Login to continue managing patients and
              appointments.
            </p>
            <button
              className="doctor-transparent-btn"
              onClick={() => {
                setIsRegister(false);
                setError("");
              }}
            >
              Login
            </button>
          </div>

          {/* RIGHT PANEL */}
          <div className="doctor-panel-content doctor-panel-right">
            <h1>Join HumaniCare</h1>
            <p>
              Register now and become part of our trusted
              doctor network.
            </p>
            <button
              className="doctor-transparent-btn"
              onClick={() => {
                setIsRegister(true);
                setError("");
              }}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}