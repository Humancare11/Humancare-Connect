// routes/auth.js
const express = require("express");
const router  = express.Router();

const {
  register,
  login,
  doctorRegister,   // ✅ new
  doctorLogin,      // ✅ new
} = require("../controllers/authController");

// ── User routes ──────────────────────────────────
router.post("/register", register);
router.post("/login",    login);

// ── Doctor routes ─────────────────────────────────
router.post("/doctor-register", doctorRegister);
router.post("/doctor-login",    doctorLogin);

module.exports = router;