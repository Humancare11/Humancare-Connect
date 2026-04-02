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
      enum: ["user", "admin", "doctor"],   // ✅ doctor added
      default: "user",
    },

    // ─── User profile fields ──────────────────────────────────
    mobile: {
      type: String,
      default: "",
    },

    country: {
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

    // ─── Doctor-only fields ───────────────────────────────────
    specialty: {
      type: String,
      default: "",
    },

    degree: {
      type: String,
      default: "",
    },

    experience: {
      type: String,         // e.g. "10" years
      default: "",
    },

    licenseNumber: {
      type: String,
      default: "",
    },

    hospital: {
      type: String,
      default: "",
    },

    consultationFee: {
      type: Number,
      default: 0,
    },

    bio: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,       // admin can verify doctor later
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    availableToday: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,       // createdAt, updatedAt auto add
  }
);

module.exports = mongoose.model("User", userSchema);