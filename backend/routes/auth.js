// routes/auth.js
const express = require("express");
const router  = express.Router();

const {
  register,
  login,
  doctorRegister,
  doctorLogin,
  adminLogin,
} = require("../controllers/authController");

// ── User routes ──────────────────────────────────
router.post("/register", register);
router.post("/login",    login);

// ── Doctor routes ─────────────────────────────────
router.post("/doctor-register", doctorRegister);
router.post("/doctor-login",    doctorLogin);

// ── Admin / SuperAdmin login ──────────────────────────────────────
router.post("/admin-login", adminLogin);

module.exports = router;