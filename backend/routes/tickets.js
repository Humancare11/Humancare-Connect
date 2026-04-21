// routes/tickets.js
const express = require("express");
const router = express.Router();
const {
  createTicket,
  getDoctorTickets,
  getAllTickets,
  resolveTicket,
} = require("../controllers/ticketController");
const { verifyToken, adminOnly } = require("../middleware/verifyToken");

// Doctor routes
router.post("/create", verifyToken, createTicket);
router.get("/my", verifyToken, getDoctorTickets);

// Admin routes
router.get("/all", verifyToken, adminOnly, getAllTickets);
router.put("/:id/resolve", verifyToken, adminOnly, resolveTicket);

module.exports = router;