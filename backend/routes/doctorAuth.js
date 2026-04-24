const express    = require("express");
const router     = express.Router();
const jwt        = require("jsonwebtoken");
const Doctor     = require("../models/Doctor");
const Enrollment = require("../models/Enrollment");
const { COOKIE_OPTS, verifyDoctorToken } = require("../middleware/verifyToken");

const signToken = (id, email) =>
  jwt.sign({ id, email, role: "doctor" }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ── POST /api/doctor/register ─────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword)
      return res.status(400).json({ message: "All fields are required." });
    if (!/\S+@\S+\.\S+/.test(email))
      return res.status(400).json({ message: "Enter a valid email." });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match." });

    const cleanEmail = email.toLowerCase().trim();
    const existing = await Doctor.findOne({ email: cleanEmail });
    if (existing)
      return res.status(409).json({ message: "This email is already registered. Please login." });

    const doctor = await Doctor.create({ name, email: cleanEmail, password });
    const token  = signToken(doctor._id, doctor.email);

    res.cookie("doctorToken", token, COOKIE_OPTS);
    return res.status(201).json({
      message: "Doctor registered successfully.",
      token,
      doctor: { id: doctor._id, name: doctor.name, email: doctor.email, isEnrolled: doctor.isEnrolled },
    });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: "This email is already registered. Please login." });
    return res.status(500).json({ message: err.message || "Server error. Please try again." });
  }
});

// ── POST /api/doctor/login ────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const cleanEmail = email.toLowerCase().trim();
    const doctor = await Doctor.findOne({ email: cleanEmail });
    if (!doctor)
      return res.status(401).json({ message: "Login credentials are incorrect." });

    const isMatch = await doctor.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Login credentials are incorrect." });

    const token = signToken(doctor._id, doctor.email);
    res.cookie("doctorToken", token, COOKIE_OPTS);
    return res.status(200).json({
      message: "Login successful.",
      token,
      doctor: { id: doctor._id, name: doctor.name, email: doctor.email, isEnrolled: doctor.isEnrolled },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error. Please try again." });
  }
});

// ── POST /api/doctor/logout ───────────────────────────────────────────────────
router.post("/logout", (req, res) => {
  res.clearCookie("doctorToken", COOKIE_OPTS);
  res.json({ message: "Logged out." });
});

// ── GET /api/doctor/me ────────────────────────────────────────────────────────
router.get("/me", verifyDoctorToken, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found." });
    return res.status(200).json({
      doctor: { id: doctor._id, name: doctor.name, email: doctor.email, isEnrolled: doctor.isEnrolled },
    });
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
});

// ── GET /api/doctor/enrollment/:doctorId ──────────────────────────────────────
router.get("/enrollment/:doctorId", async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ doctorId: req.params.doctorId });
    res.json(enrollment);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/doctor/enrollment ───────────────────────────────────────────────
router.post("/enrollment", async (req, res) => {
  try {
    const { doctorId, ...enrollmentData } = req.body;
    let enrollment = await Enrollment.findOne({ doctorId });
    if (enrollment) {
      Object.assign(enrollment, enrollmentData);
      enrollment.updatedAt = new Date();
      await enrollment.save();
    } else {
      enrollment = new Enrollment({ doctorId, ...enrollmentData });
      await enrollment.save();
      await Doctor.findByIdAndUpdate(doctorId, { isEnrolled: true });
    }
    res.json(enrollment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/doctor/approved ──────────────────────────────────────────────────
router.get("/approved", async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ approvalStatus: "approved" })
      .populate("doctorId", "name email")
      .lean();

    const doctors = enrollments.map((e) => ({
      id:         e._id,
      doctorId:   e.doctorId?._id,
      name:       `Dr. ${e.firstName || ""} ${e.surname || ""}`.trim(),
      degree:     e.qualification || "",
      specialty:  e.specialization || "",
      languages:  e.languagesKnown || [],
      location:   [e.city, e.state].filter(Boolean).join(", "),
      price:      e.consultantFees || 0,
      experience: e.experience || 0,
      gender:     e.gender || "",
      rating:     0,
      initials:   `${(e.firstName || " ")[0]}${(e.surname || " ")[0]}`.toUpperCase(),
      color:      "#2563eb",
      source:     "enrollment",
    }));

    return res.json(doctors);
  } catch (err) {
    console.error("approved doctors error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
