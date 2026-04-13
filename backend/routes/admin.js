const express = require("express");
const router = express.Router();
const { getAdminStats, getAllDoctors, approveDoctor, rejectDoctor } = require("../controllers/adminController");
const { verifyToken, adminOnly } = require("../middleware/verifyToken");

router.get("/stats", getAdminStats);

// Doctor management (admin only)
router.get("/doctors", verifyToken, adminOnly, getAllDoctors);
router.put("/doctors/:id/approve", verifyToken, adminOnly, approveDoctor);
router.put("/doctors/:id/reject", verifyToken, adminOnly, rejectDoctor);

module.exports = router;
