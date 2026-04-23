const express = require("express");
const router  = require("express").Router();
const { verifyToken, verifyUserToken, verifyDoctorToken, verifyAdminToken, adminOnly } = require("../middleware/verifyToken");
const {
  createAppointment, getPatientAppointments, getDoctorAppointments,
  confirmAppointment, completeAppointment, cancelAppointment,
  getAllAppointments, getAppointmentById,
} = require("../controllers/appointmentController");

router.post("/",         verifyUserToken,   createAppointment);
router.get("/mine",      verifyUserToken,   getPatientAppointments);
router.get("/doctor",    verifyDoctorToken, getDoctorAppointments);
router.get("/admin/all", verifyAdminToken,  adminOnly, getAllAppointments);
router.put("/:id/confirm",  verifyToken, confirmAppointment);
router.put("/:id/complete", verifyToken, completeAppointment);
router.put("/:id/cancel",   verifyToken, cancelAppointment);
router.get("/:id",          verifyToken, getAppointmentById);

module.exports = router;
