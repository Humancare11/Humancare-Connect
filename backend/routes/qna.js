const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const { verifyToken, adminOnly } = require("../middleware/verifyToken");

// ── POST /api/qna/ask ─────────────────────────────────────────────
// Public — no auth required (optionally reads token for user name)
router.post("/ask", async (req, res) => {
  try {
    const { question, category, name } = req.body;

    if (!question || !question.trim())
      return res.status(400).json({ msg: "Question is required." });

    const newQuestion = await Question.create({
      question: question.trim(),
      category: category || "General",
      name:     name    || "Anonymous",
    });

    const io = req.app.get("io");
    if (io) io.emit("new-question", newQuestion);

    res.status(201).json(newQuestion);
  } catch (err) {
    console.error("Ask Question Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ── GET /api/qna/ ─────────────────────────────────────────────────
// Public — both user frontend and admin read from here
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    console.error("Get Questions Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ── PUT /api/qna/:id/answer ───────────────────────────────────────
// Admin only — submit / update a doctor's answer
router.put("/:id/answer", verifyToken, adminOnly, async (req, res) => {
  try {
    const { answer, doctorName, doctorSpec } = req.body;

    if (!answer || !answer.trim())
      return res.status(400).json({ msg: "Answer is required." });

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      {
        answer:   answer.trim(),
        answered: true,
        doctor: {
          name:           (doctorName || "").trim(),
          specialization: (doctorSpec  || "").trim(),
        },
      },
      { new: true }
    );

    if (!question)
      return res.status(404).json({ msg: "Question not found." });

    const io = req.app.get("io");
    if (io) io.emit("question-answered", question);

    res.json(question);
  } catch (err) {
    console.error("Answer Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
