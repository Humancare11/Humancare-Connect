const express = require("express");
const router = express.Router();
const { getAdminStats, getAllDoctors, approveDoctor, rejectDoctor, getAllUsers, deleteUser, getUserDetails } = require("../controllers/adminController");
const { verifyToken, adminOnly } = require("../middleware/verifyToken");

router.get("/stats", getAdminStats);

// Doctor management (admin only)
router.get("/doctors", verifyToken, adminOnly, getAllDoctors);
router.put("/doctors/:id/approve", verifyToken, adminOnly, approveDoctor);
router.put("/doctors/:id/reject", verifyToken, adminOnly, rejectDoctor);

// User management (admin only)
router.get("/users", verifyToken, adminOnly, getAllUsers);
router.get("/users/:id", verifyToken, adminOnly, getUserDetails);
router.delete("/users/:id", verifyToken, adminOnly, deleteUser);

module.exports = router;
