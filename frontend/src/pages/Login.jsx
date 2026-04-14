import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import PhoneInputLib from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./log.css";
import {
  FaFacebookF,
  FaGoogle,
  FaLinkedinIn,
} from "react-icons/fa";
import "./login.css";

const PhoneInput = PhoneInputLib.default ?? PhoneInputLib;

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    mobile: "",
    country: "",
    dob: "",
    gender: "",
    password: "",
    terms: false,
  });

  const navigate = useNavigate();

  // ---------------- LOGIN INPUT ----------------
  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- REGISTER INPUT ----------------
  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;

    setRegisterForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ---------------- LOGIN SUBMIT ----------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginForm
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("user-online", {
        userId: res.data.user._id,
        role: res.data.user.role,
      });

      window.dispatchEvent(new Event("authChange"));

      alert("Login Success ✅");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Login Failed ❌");
    }
  };

  // ---------------- REGISTER SUBMIT ----------------
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!registerForm.terms)
      return alert("Accept Terms & Conditions");

    if (registerForm.password.length < 6)
      return alert("Password must be at least 6 characters");

    if (!registerForm.mobile)
      return alert("Enter mobile number");

    if (!registerForm.dob)
      return alert("Select Date of Birth");

    if (!registerForm.gender)
      return alert("Select Gender");

    const { terms, ...data } = registerForm;

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        data
      );

      alert("Registered Successfully ✅");
      setIsRegister(false);
    } catch (err) {
      alert(err?.response?.data?.msg || "Server Error ❌");
    }
  };

  return (
    <>
      <div className="main-log">
    <div
      className={`auth-wrapper ${
        isRegister ? "panel-active" : ""
      }`}
    >
      {/* REGISTER FORM */}
      <div className="auth-form-box register-form-box">
        <form
          onSubmit={handleRegisterSubmit}
          className="register-form"
        >
          <h1>Create Account</h1>

          <div className="social-links">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaGoogle /></a>
            <a href="#"><FaLinkedinIn /></a>
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
            onChange={(phone) =>
              setRegisterForm((prev) => ({
                ...prev,
                mobile: phone,
              }))
            }
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

            <select
              name="gender"
              onChange={handleRegisterChange}
              required
            >
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
            <input
              type="checkbox"
              name="terms"
              onChange={handleRegisterChange}
            />
            I accept Terms & Conditions
          </label>

          <button type="submit">Sign Up</button>

          <div className="mobile-switch">
            <p>Already have an account?</p>
            <button
              type="button"
              onClick={() => setIsRegister(false)}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>

      {/* LOGIN FORM */}
      <div className="auth-form-box login-form-box">
        <form onSubmit={handleLoginSubmit}>
          <h1>Sign In</h1>

          <div className="social-links">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaGoogle /></a>
            <a href="#"><FaLinkedinIn /></a>
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
            <button
              type="button"
              onClick={() => setIsRegister(true)}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>

      {/* SLIDING PANEL */}
      <div className="slide-panel-wrapper">
        <div className="slide-panel">
          <div className="panel-content panel-content-left">
            <h1>Welcome Back!</h1>
            <p>
              Stay connected by logging in with your credentials
              and continue your experience
            </p>
            <button
              className="transparent-btn"
              onClick={() => setIsRegister(false)}
            >
              Sign In
            </button>
          </div>

          <div className="panel-content panel-content-right">
            <h1>Hey There!</h1>
            <p>
              Begin your amazing journey by creating an account
              with us today
            </p>
            <button
              className="transparent-btn"
              onClick={() => setIsRegister(true)}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
     </div>
    </>
  );
}