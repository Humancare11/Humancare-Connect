const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");

// JWT token banane ka helper
const signToken = (id, email) =>
  jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// ── POST /api/doctor/register ─────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields are required." });

    if (!/\S+@\S+\.\S+/.test(email))
      return res.status(400).json({ message: "Enter a valid email." });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match." });

    const existing = await Doctor.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existing)
      return res.status(409).json({
        message: "This email is already registered. Please login.",
      });

    const doctor = await Doctor.create({ email, password });
    const token = signToken(doctor._id, doctor.email);

    return res.status(201).json({
      message: "Doctor registered successfully.",
      token,
      doctor: { id: doctor._id, email: doctor.email },
    });
  } catch (err) {
    console.error("Doctor register error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ── POST /api/doctor/login ─────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required." });

    if (!/\S+@\S+\.\S+/.test(email))
      return res.status(400).json({ message: "Enter a valid email." });

    const doctor = await Doctor.findOne({ email: email.toLowerCase().trim() });
    if (!doctor)
      return res
        .status(401)
        .json({ message: "Login credentials are incorrect." });

    const isMatch = await doctor.comparePassword(password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Login credentials are incorrect." });

    const token = signToken(doctor._id, doctor.email);

    return res.status(200).json({
      message: "Login successful.",
      token,
      doctor: { id: doctor._id, email: doctor.email },
    });
  } catch (err) {
    console.error("Doctor login error:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ── GET /api/doctor/me  (protected route) ─────────────────────
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Unauthorized." });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const doctor = await Doctor.findById(decoded.id).select("-password");
    if (!doctor)
      return res.status(404).json({ message: "Doctor not found." });

    return res.status(200).json({ doctor });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
});

module.exports = router;