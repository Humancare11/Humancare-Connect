// routes/tickets.js
const express = require("express");
const router = express.Router();
const {
  createTicket,
  getDoctorTickets,
  getAllTickets,
  resolveTicket,
  createUserTicket,
  getUserTickets,
  getAllUserTickets,
  resolveUserTicket,
} = require("../controllers/ticketController");
const { verifyToken, adminOnly } = require("../middleware/verifyToken");

// Doctor routes
router.post("/create", verifyToken, createTicket);
router.get("/my", verifyToken, getDoctorTickets);

// Patient/User routes
router.post("/user/create", verifyToken, createUserTicket);
router.get("/user/my", verifyToken, getUserTickets);

// Admin routes
router.get("/all", verifyToken, adminOnly, getAllTickets);
router.put("/:id/resolve", verifyToken, adminOnly, resolveTicket);
router.get("/user/all", verifyToken, adminOnly, getAllUserTickets);
router.put("/user/:id/resolve", verifyToken, adminOnly, resolveUserTicket);

module.exports = router;