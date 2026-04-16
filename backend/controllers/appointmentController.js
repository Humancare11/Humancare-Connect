const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, problem } = req.body;
    const patientId = req.user.id;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ msg: "Doctor, date, and time are required." });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found." });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      time,
      problem,
    });

    const io = req.app.get("io");
    if (io) {
      io.to(`doctor_${doctorId}`).emit("new-appointment", {
        appointmentId: appointment._id,
        patientId,
        doctorId,
        status: appointment.status,
        date,
        time,
      });
      io.to("admin_room").emit("new-appointment", {
        appointmentId: appointment._id,
        patientId,
        doctorId,
        status: appointment.status,
        date,
        time,
      });
      io.to(`patient_${patientId}`).emit("appointment-updated", {
        appointmentId: appointment._id,
        status: appointment.status,
        date,
        time,
      });
    }

    res.status(201).json({
      msg: "Appointment booked successfully.",
      appointment,
    });
  } catch (error) {
    console.error("createAppointment error:", error);
    res.status(500).json({ msg: "Failed to book appointment." });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate("doctorId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(appointments);
  } catch (error) {
    console.error("getPatientAppointments error:", error);
    res.status(500).json({ msg: "Failed to fetch patient appointments." });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ msg: "Access denied. Doctors only." });
    }

    const appointments = await Appointment.find({ doctorId: req.user.id })
      .populate("patientId", "name email mobile")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(appointments);
  } catch (error) {
    console.error("getDoctorAppointments error:", error);
    res.status(500).json({ msg: "Failed to fetch doctor appointments." });
  }
};

const confirmAppointment = async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ msg: "Access denied. Doctors only." });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found." });
    }

    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "You can only confirm your own appointments." });
    }

    appointment.status = "confirmed";
    appointment.sessionStarted = true;
    await appointment.save();

    const io = req.app.get("io");
    if (io) {
      io.to(`appointment_${appointment._id}`).emit("appointment-updated", {
        appointmentId: appointment._id,
        status: appointment.status,
      });
      io.to(`patient_${appointment.patientId}`).emit("appointment-updated", {
        appointmentId: appointment._id,
        status: appointment.status,
      });
      io.to("admin_room").emit("appointment-updated", {
        appointmentId: appointment._id,
        status: appointment.status,
      });
    }

    res.status(200).json({ msg: "Appointment confirmed.", appointment });
  } catch (error) {
    console.error("confirmAppointment error:", error);
    res.status(500).json({ msg: "Failed to confirm appointment." });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "name email")
      .populate("doctorId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(appointments);
  } catch (error) {
    console.error("getAllAppointments error:", error);
    res.status(500).json({ msg: "Failed to fetch appointments." });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "name email mobile")
      .populate("doctorId", "name email")
      .lean();

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found." });
    }

    const isPatient = req.user.role === "user" && appointment.patientId._id.toString() === req.user.id;
    const isDoctor = req.user.role === "doctor" && appointment.doctorId._id.toString() === req.user.id;
    const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ msg: "Access denied." });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("getAppointmentById error:", error);
    res.status(500).json({ msg: "Failed to fetch appointment." });
  }
};

module.exports = {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  confirmAppointment,
  getAllAppointments,
  getAppointmentById,
};
