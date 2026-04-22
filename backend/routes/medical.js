const express = require("express");
const router  = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const {
  getDoctorPatients,
  getPatientHistory,
  createPrescription,
  createMedicalCertificate,
  getMyPrescriptions,
  getMyMedicalCertificates,
} = require("../controllers/medicalController");

// Doctor routes
router.get("/patients",                   verifyToken, getDoctorPatients);
router.get("/patients/:patientId/history", verifyToken, getPatientHistory);
router.post("/prescriptions",             verifyToken, createPrescription);
router.post("/certificates",              verifyToken, createMedicalCertificate);

// Patient routes
router.get("/my-prescriptions",  verifyToken, getMyPrescriptions);
router.get("/my-certificates",   verifyToken, getMyMedicalCertificates);

module.exports = router;
