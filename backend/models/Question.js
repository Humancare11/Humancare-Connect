const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: { type: String, default: "Anonymous", trim: true },
    category: { type: String, default: "General", trim: true },
    question: { type: String, required: true, trim: true },

    // Admin fills these when answering
    answer: { type: String, default: "" },
    doctor: {
      name:           { type: String, default: "" },
      specialization: { type: String, default: "" },
    },
    answered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
