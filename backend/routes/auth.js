// routes/auth.js
const express = require("express");
const router  = express.Router();

const {
  register,
  login,
  doctorRegister,
  doctorLogin,
  adminLogin,
  updateProfile,
  googleAuthUser,
  googleAuthDoctor,
  changePassword,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// ── User routes ──────────────────────────────────
router.post("/register", register);
router.post("/login",    login);

// ── Doctor routes ─────────────────────────────────
router.post("/doctor-register", doctorRegister);
router.post("/doctor-login",    doctorLogin);

// ── Google OAuth ──────────────────────────────────────────────────
router.post("/google",        googleAuthUser);
router.post("/google-doctor", googleAuthDoctor);

// ── Admin / SuperAdmin login ──────────────────────────────────────
router.post("/admin-login", adminLogin);

// ── Protected user routes ─────────────────────────────────────────
router.put("/update-profile",  authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;