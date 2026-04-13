const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Doctor = require("../models/Doctor");

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalDoctors = await Enrollment.countDocuments({ approvalStatus: "approved" });

    res.status(200).json({ totalUsers, totalDoctors });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ msg: "Failed to fetch admin stats" });
  }
};

// GET /api/admin/doctors — all enrollments for admin review
const getAllDoctors = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("doctorId", "name email")
      .sort({ updatedAt: -1 })
      .lean();

    res.status(200).json(enrollments);
  } catch (error) {
    console.error("getAllDoctors error:", error);
    res.status(500).json({ msg: "Failed to fetch doctors" });
  }
};

// PUT /api/admin/doctors/:id/approve
const approveDoctor = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "approved", verified: true },
      { new: true }
    );
    if (!enrollment) return res.status(404).json({ msg: "Enrollment not found" });

    res.status(200).json({ msg: "Doctor approved", enrollment });
  } catch (error) {
    console.error("approveDoctor error:", error);
    res.status(500).json({ msg: "Failed to approve doctor" });
  }
};

// PUT /api/admin/doctors/:id/reject
const rejectDoctor = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "rejected", verified: false },
      { new: true }
    );
    if (!enrollment) return res.status(404).json({ msg: "Enrollment not found" });

    res.status(200).json({ msg: "Doctor rejected", enrollment });
  } catch (error) {
    console.error("rejectDoctor error:", error);
    res.status(500).json({ msg: "Failed to reject doctor" });
  }
};

module.exports = { getAdminStats, getAllDoctors, approveDoctor, rejectDoctor };
