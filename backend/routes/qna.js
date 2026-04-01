const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const auth = require("../middleware/authMiddleware");

// POST: Ask Question
router.post("/ask", auth, async (req, res) => {
  try {
    const { question, name, category } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ msg: "Question is required" });
    }

    const newQuestion = new Question({
      user: req.user.id,
      name: name || "User",
      category: category || "General",
      question: question.trim(),
    });

    await newQuestion.save();

    const savedQuestion = await Question.findById(newQuestion._id);

    const io = req.app.get("io");
    if (io) {
      io.emit("new-question", savedQuestion);
    }

    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error("Ask Question Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET: All Questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    console.error("Get Questions Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET: Single Question
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    res.json(question);
  } catch (error) {
    console.error("Get Single Question Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// POST: Add Answer
router.post("/:id/answer", auth, async (req, res) => {
  try {
    const { answer, name } = req.body;

    if (!answer || !answer.trim()) {
      return res.status(400).json({ msg: "Answer is required" });
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ msg: "Question not found" });
    }

    question.answers.push({
      user: req.user.id,
      name: name || "User",
      answer: answer.trim(),
    });

    question.answered = true;

    await question.save();

    const updatedQuestion = await Question.findById(req.params.id);

    const io = req.app.get("io");
    if (io) {
      io.emit("new-answer", updatedQuestion);
    }

    res.json(updatedQuestion);
  } catch (error) {
    console.error("Post Answer Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;