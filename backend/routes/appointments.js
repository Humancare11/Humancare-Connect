const express = require("express");
const router = express.Router();
const { verifyToken, adminOnly } = require("../middleware/verifyToken");
const {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  confirmAppointment,
  cancelAppointment,
  getAllAppointments,
  getAppointmentById,
} = require("../controllers/appointmentController");

router.post("/", verifyToken, createAppointment);
router.get("/mine", verifyToken, getPatientAppointments);
router.get("/doctor", verifyToken, getDoctorAppointments);
router.get("/admin/all", verifyToken, adminOnly, getAllAppointments);
router.put("/:id/confirm", verifyToken, confirmAppointment);
router.put("/:id/cancel", verifyToken, cancelAppointment);
router.get("/:id", verifyToken, getAppointmentById);

module.exports = router;
