const express  = require("express");
const router   = express.Router();
const Question = require("../models/Question");
const { verifyToken, adminOnly } = require("../middleware/verifyToken");

// ── POST /api/qna/ask ─────────────────────────────────────────────────────────
// Auth required — links question to logged-in user
router.post("/ask", verifyToken, async (req, res) => {
  try {
    const { question, category } = req.body;
    if (!question || !question.trim())
      return res.status(400).json({ msg: "Question is required." });

    const user = req.user; // { id, role }
    const { User } = require("../models/User") || { User: require("mongoose").model("User") };
    let userName = "Anonymous";
    try {
      const u = await require("../models/User").findById(user.id).select("name").lean();
      if (u?.name) userName = u.name;
    } catch (_) {}

    const newQ = await Question.create({
      user:     user.id,
      name:     userName,
      question: question.trim(),
      category: category || "General",
      status:   "pending",
    });

    const io = req.app.get("io");
    if (io) io.to("admin_room").emit("new-question", newQ);

    res.status(201).json(newQ);
  } catch (err) {
    console.error("Ask Question Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ── GET /api/qna/ ─────────────────────────────────────────────────────────────
// Public — only returns APPROVED questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find({ status: "approved" })
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error("Get Questions Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ── GET /api/qna/user-questions ───────────────────────────────────────────────
// Auth — returns logged-in user's own questions (all statuses)
router.get("/user-questions", verifyToken, async (req, res) => {
  try {
    const questions = await Question.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error("User Questions Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ── GET /api/qna/admin/all ────────────────────────────────────────────────────
// Admin — returns ALL questions with all statuses
router.get("/admin/all", verifyToken, adminOnly, async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error("Admin All Questions Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ── GET /api/qna/doctor/assigned ──────────────────────────────────────────────
// Doctor — returns questions assigned to them
router.get("/doctor/assigned", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "doctor")
      return res.status(403).json({ msg: "Access denied. Doctors only." });

    const questions = await Question.find({
      assignedDoctorId: req.user.id,
      status: { $in: ["assigned", "answered"] },
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (err) {
    console.error("Doctor Assigned Questions Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ── PUT /api/qna/:id/assign ───────────────────────────────────────────────────
// Admin — assigns question to a doctor
router.put("/:id/assign", verifyToken, adminOnly, async (req, res) => {
  try {
    const { doctorId, doctorName, doctorSpec } = req.body;
    if (!doctorName) return res.status(400).json({ msg: "Doctor name is required." });

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      {
        status:             "assigned",
        assignedDoctorId:   doctorId   || null,
        assignedDoctorName: doctorName || "",
        assignedDoctorSpec: doctorSpec || "",
      },
      { new: true }
    );

    if (!question) return res.status(404).json({ msg: "Question not found." });

    // Notify the doctor via socket if they're online
    const io = req.app.get("io");
    if (io && doctorId) {
      io.to(`doctor_${doctorId}`).emit("question-assigned", question);
    }

    res.json(question);
  } catch (err) {
    console.error("Assign Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ── PUT /api/qna/:id/answer ───────────────────────────────────────────────────
// Doctor — submits answer (status: answered); admin can also use it
router.put("/:id/answer", verifyToken, async (req, res) => {
  try {
    const isDoctor = req.user.role === "doctor";
    const isAdmin  = req.user.role === "admin" || req.user.role === "superadmin";
    if (!isDoctor && !isAdmin)
      return res.status(403).json({ msg: "Access denied." });

    const { answer, doctorName, doctorSpec } = req.body;
    if (!answer || !answer.trim())
      return res.status(400).json({ msg: "Answer is required." });

    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: "Question not found." });

    // If doctor, verify they are assigned to this question
    if (isDoctor && question.assignedDoctorId?.toString() !== req.user.id) {
      return res.status(403).json({ msg: "This question was not assigned to you." });
    }

    question.answer = answer.trim();
    question.status = "answered";
    question.doctor = {
      name:           (doctorName || question.assignedDoctorName || "").trim(),
      specialization: (doctorSpec  || question.assignedDoctorSpec || "").trim(),
    };
    await question.save();

    const io = req.app.get("io");
    if (io) io.to("admin_room").emit("question-answered", question);

    res.json(question);
  } catch (err) {
    console.error("Answer Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ── PUT /api/qna/:id/approve ──────────────────────────────────────────────────
// Admin — approves the answer; question becomes public
router.put("/:id/approve", verifyToken, adminOnly, async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { status: "approved", answered: true },
      { new: true }
    );

    if (!question) return res.status(404).json({ msg: "Question not found." });

    // Notify the user if online
    const io = req.app.get("io");
    if (io) {
      if (question.user) io.to(`patient_${question.user}`).emit("question-approved", question);
      io.emit("question-approved", question);
    }

    res.json(question);
  } catch (err) {
    console.error("Approve Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
