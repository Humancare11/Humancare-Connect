// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ─── Common fields (user + doctor) ───────────────────────
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin", "superadmin", "doctor"],
      default: "user",
    },

    // ─── User profile fields ──────────────────────────────────
    mobile: {
      type: String,
      default: "",
    },

   

    dob: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },

  },
  {
    timestamps: true,       // createdAt, updatedAt auto add
  }
);

module.exports = mongoose.model("User", userSchema);