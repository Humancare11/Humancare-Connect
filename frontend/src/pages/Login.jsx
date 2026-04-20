import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import socket from "../socket";
import PhoneInputLib from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./log.css";

const PhoneInput = PhoneInputLib.default ?? PhoneInputLib;

// ─── helper: store auth data and emit socket ─────────────────────────────────
function loginSuccess(data, navigate) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  if (!socket.connected) socket.connect();
  socket.emit("user-online", { userId: data.user._id, role: data.user.role });
  window.dispatchEvent(new Event("authChange"));
  navigate("/");
}

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const [registerForm, setRegisterForm] = useState({
    name: "", email: "", mobile: "", dob: "", gender: "", password: "", terms: false,
  });

  // ── Google completion state ───────────────────────────────────────────────
  // Set when the backend says the Google email is new and needs extra profile info
  const [googlePending, setGooglePending] = useState(null); // { credential, name, email }
  const [googleProfile, setGoogleProfile] = useState({ mobile: "", dob: "", gender: "" });

  const navigate = useNavigate();

  // ---------------- LOGIN INPUT ----------------
  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  // ---------------- REGISTER INPUT ----------------
  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // ---------------- GOOGLE AUTH ----------------
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("/api/auth/google", {
        credential: credentialResponse.credential,
      });

      if (res.data.isNewUser) {
        // New Google user — collect missing profile fields before creating account
        setGooglePending({
          credential: credentialResponse.credential,
          name: res.data.googleName,
          email: res.data.googleEmail,
        });
        setIsRegister(true); // flip to register panel so the completion form is visible
        return;
      }

      loginSuccess(res.data, navigate);
    } catch (err) {
      alert(err.response?.data?.msg || "Google Sign-In failed ❌");
    }
  };

  // Submitted after the user fills in the missing profile fields (mobile, dob, gender)
  const handleGoogleComplete = async (e) => {
    e.preventDefault();

    if (!googleProfile.mobile) return alert("Enter mobile number");
    if (!googleProfile.dob) return alert("Select Date of Birth");
    if (!googleProfile.gender) return alert("Select Gender");

    try {
      const res = await axios.post("/api/auth/google", {
        credential: googlePending.credential,
        mobile: googleProfile.mobile,
        dob: googleProfile.dob,
        gender: googleProfile.gender,
      });

      loginSuccess(res.data, navigate);
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed ❌");
    }
  };

  // ---------------- LOGIN SUBMIT ----------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        loginForm
      );

      loginSuccess(res.data, navigate);
      alert("Login Success ✅");
    } catch (err) {
      alert(err.response?.data?.msg || "Login Failed ❌");
    }
  };

  // ---------------- REGISTER SUBMIT ----------------
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!registerForm.terms) return alert("Accept Terms & Conditions");
    if (registerForm.password.length < 6) return alert("Password must be at least 6 characters");
    if (!registerForm.mobile) return alert("Enter mobile number");
    if (!registerForm.dob) return alert("Select Date of Birth");
    if (!registerForm.gender) return alert("Select Gender");

    const { terms, ...data } = registerForm;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, data);
      alert("Registered Successfully ✅");
      setIsRegister(false);
    } catch (err) {
      alert(err?.response?.data?.msg || "Server Error ❌");
    }
  };

  // ─── Google profile-completion form (shown after Google OAuth for new users) ──
  if (googlePending) {
    return (
      <div className="main-log">
        <div className="auth-wrapper">
          <div className="auth-form-box" style={{ width: "100%", maxWidth: 420, margin: "auto" }}>
            <form onSubmit={handleGoogleComplete} className="register-form">
              <h1>Complete Your Profile</h1>
              <p style={{ color: "#555", marginBottom: 8 }}>
                Welcome, <strong>{googlePending.name}</strong>! Just a few more details to finish
                setting up your account.
              </p>

              <input type="text" value={googlePending.name} disabled style={{ opacity: 0.6 }} />
              <input type="email" value={googlePending.email} disabled style={{ opacity: 0.6 }} />

              <PhoneInput
                country="in"
                value={googleProfile.mobile}
                onChange={(phone) => setGoogleProfile((prev) => ({ ...prev, mobile: phone }))}
                inputStyle={{ width: "100%" }}
              />

              <div className="row">
                <input
                  type="date"
                  value={googleProfile.dob}
                  onChange={(e) => setGoogleProfile((prev) => ({ ...prev, dob: e.target.value }))}
                  required
                />
                <select
                  value={googleProfile.gender}
                  onChange={(e) => setGoogleProfile((prev) => ({ ...prev, gender: e.target.value }))}
                  required
                >
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button type="submit">Create Account</button>
              <button
                type="button"
                onClick={() => { setGooglePending(null); setIsRegister(false); }}
                style={{ background: "none", color: "#888", border: "none", marginTop: 8, cursor: "pointer" }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="main-log">
        <div className={`auth-wrapper ${isRegister ? "panel-active" : ""}`}>

          {/* REGISTER FORM */}
          <div className="auth-form-box register-form-box">
            <form onSubmit={handleRegisterSubmit} className="register-form">
              <h1>Create Account</h1>

              <div className="social-links">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => alert("Google Sign-In failed ❌")}
                  type="icon"
                  shape="circle"
                  size="large"
                />
              </div>

              <span>or use your email for registration</span>

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleRegisterChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleRegisterChange}
                required
              />

              <PhoneInput
                country="in"
                value={registerForm.mobile}
                onChange={(phone) => setRegisterForm((prev) => ({ ...prev, mobile: phone }))}
                inputStyle={{ width: "100%" }}
              />

              <div className="row">
                <input
                  type="date"
                  name="dob"
                  value={registerForm.dob}
                  onChange={handleRegisterChange}
                  required
                />
                <select name="gender" onChange={handleRegisterChange} required>
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleRegisterChange}
                required
              />

              <label className="terms">
                <input type="checkbox" name="terms" onChange={handleRegisterChange} />
                I accept Terms &amp; Conditions
              </label>

              <button type="submit">Sign Up</button>

              <div className="mobile-switch">
                <p>Already have an account?</p>
                <button type="button" onClick={() => setIsRegister(false)}>Sign In</button>
              </div>
            </form>
          </div>

          {/* LOGIN FORM */}
          <div className="auth-form-box login-form-box">
            <form onSubmit={handleLoginSubmit}>
              <h1>Sign In</h1>

              <div className="social-links">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => alert("Google Sign-In failed ❌")}
                  type="icon"
                  shape="circle"
                  size="large"
                />
              </div>

              <span>or use your account</span>

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={loginForm.email}
                onChange={handleLoginChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
              />

              <a href="#">Forgot your password?</a>

              <button type="submit">Sign In</button>

              <div className="mobile-switch">
                <p>Don't have an account?</p>
                <button type="button" onClick={() => setIsRegister(true)}>Sign Up</button>
              </div>
            </form>
          </div>

          {/* SLIDING PANEL */}
          <div className="slide-panel-wrapper">
            <div className="slide-panel">
              <div className="panel-content panel-content-left">
                <h1>Welcome Back!</h1>
                <p>Stay connected by logging in with your credentials and continue your experience</p>
                <button className="transparent-btn" onClick={() => setIsRegister(false)}>Sign In</button>
              </div>
              <div className="panel-content panel-content-right">
                <h1>Hey There!</h1>
                <p>Begin your amazing journey by creating an account with us today</p>
                <button className="transparent-btn" onClick={() => setIsRegister(true)}>Sign Up</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
