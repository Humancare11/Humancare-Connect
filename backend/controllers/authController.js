// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");

// ── helper: generate JWT ──────────────────────────────────────
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// ── helper: safe user object (no password) ────────────────────
const safeUser = (user) => ({
  _id:             user._id,
  name:            user.name,
  email:           user.email,
  role:            user.role,
  mobile:          user.mobile,
  gender:          user.gender,
  // doctor fields
  specialty:       user.specialty,
  degree:          user.degree,
  experience:      user.experience,
  licenseNumber:   user.licenseNumber,
  hospital:        user.hospital,
  consultationFee: user.consultationFee,
  bio:             user.bio,
  phone:           user.phone,
  isVerified:      user.isVerified,
  rating:          user.rating,
});

// ════════════════════════════════════════════
//  1. USER REGISTER
// ════════════════════════════════════════════
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ msg: "Name, email and password are required." });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ msg: "Email already registered." });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user",
    });

    return res.status(201).json({
      msg:   "Registration successful.",
      token: generateToken(user),
      user:  safeUser(user),
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ msg: "Server error. Please try again." });
  }
};

// ════════════════════════════════════════════
//  2. USER LOGIN
// ════════════════════════════════════════════
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Email and password are required." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Invalid email or password." });

    // block doctors from using user login
    if (user.role === "doctor")
      return res.status(403).json({ msg: "Please use the Doctor Login page." });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ msg: "Invalid email or password." });

    return res.json({
      msg:   "Login successful.",
      token: generateToken(user),
      user:  safeUser(user),
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ msg: "Server error. Please try again." });
  }
};

// ════════════════════════════════════════════
//  3. DOCTOR REGISTER
// ════════════════════════════════════════════
const doctorRegister = async (req, res) => {
  try {
    const {
      name, email, password,
      phone, gender,
      specialty, degree, experience,
      licenseNumber, hospital, consultationFee, bio,
    } = req.body;

    // required field checks
    if (!name || !email || !password)
      return res.status(400).json({ msg: "Name, email and password are required." });
    if (!specialty)
      return res.status(400).json({ msg: "Specialization is required." });
    if (!degree)
      return res.status(400).json({ msg: "Degree / qualification is required." });
    if (!licenseNumber)
      return res.status(400).json({ msg: "Medical license number is required." });
    if (password.length < 6)
      return res.status(400).json({ msg: "Password must be at least 6 characters." });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ msg: "Email already registered." });

    const hashed = await bcrypt.hash(password, 10);

    const doctor = await User.create({
      name,
      email,
      password: hashed,
      role: "doctor",
      phone:           phone           || "",
      gender:          gender          || "",
      specialty:       specialty       || "",
      degree:          degree          || "",
      experience:      experience      || "",
      licenseNumber:   licenseNumber   || "",
      hospital:        hospital        || "",
      consultationFee: consultationFee ? Number(consultationFee) : 0,
      bio:             bio             || "",
      isVerified:      false,           // admin verifies later
    });

    return res.status(201).json({
      msg:  "Doctor registration successful. Please login.",
      user: safeUser(doctor),
    });
  } catch (err) {
    console.error("doctorRegister error:", err);
    return res.status(500).json({ msg: "Server error. Please try again." });
  }
};

// ════════════════════════════════════════════
//  4. DOCTOR LOGIN
// ════════════════════════════════════════════
const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Email and password are required." });

    const doctor = await User.findOne({ email });

    if (!doctor)
      return res.status(400).json({ msg: "Invalid email or password." });

    // make sure the account is actually a doctor
    if (doctor.role !== "doctor")
      return res.status(403).json({ msg: "This account is not registered as a doctor." });

    const match = await bcrypt.compare(password, doctor.password);
    if (!match)
      return res.status(400).json({ msg: "Invalid email or password." });

    return res.json({
      msg:   "Login successful.",
      token: generateToken(doctor),
      user:  safeUser(doctor),
    });
  } catch (err) {
    console.error("doctorLogin error:", err);
    return res.status(500).json({ msg: "Server error. Please try again." });
  }
};

module.exports = { register, login, doctorRegister, doctorLogin };