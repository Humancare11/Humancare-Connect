import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Appointment.css";

export default function Appointment() {
  const { state } = useLocation();
  const doctor = state?.doctor;

  const [form, setForm] = useState({
    date: "",
    time: "",
    problem: ""
  });
  const [success, setSuccess] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to book the appointment.");
      return;
    }

    try {
      const doctorId = doctor.doctorId || doctor.id;
      const res = await axios.post(
        "http://localhost:5000/api/appointments",
        {
          doctorId,
          date: form.date,
          time: form.time,
          problem: form.problem,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointment(res.data.appointment);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to book appointment.");
    }
  };

  if (!doctor) return <h2>No Doctor Selected</h2>;

  return (
    <div className="ap-container">
      <div className="ap-card">

        <h2 className="ap-title">Book Appointment</h2>

        {/* Doctor Info */}
        <div className="ap-doctor">
          <div className="ap-avatar" style={{ background: doctor.color }}>
            {doctor.initials}
          </div>
          <div className="ap-doc-info">
            <h4>{doctor.name}</h4>
            <p>{doctor.specialty}</p>
          </div>
        </div>

        {success ? (
          <div className="ap-success">
            <h3>✅ Appointment Booked</h3>
            <p>Doctor will contact you soon</p>
            {appointment && (
              <div style={{ marginTop: 16, textAlign: "left" }}>
                <p><strong>Doctor:</strong> {doctor.name}</p>
                <p><strong>Date:</strong> {appointment.date}</p>
                <p><strong>Time:</strong> {appointment.time}</p>
                <p><strong>Status:</strong> {appointment.status}</p>
              </div>
            )}
          </div>
        ) : (
          <form className="ap-form" onSubmit={handleSubmit}>
            <input type="date" name="date" onChange={handleChange} required />
            <input type="time" name="time" onChange={handleChange} required />

            <textarea
              name="problem"
              placeholder="Describe your problem..."
              onChange={handleChange}
              required
            />

            <button className="ap-btn">Confirm Appointment</button>
            {error && <p style={{ color: "#dc2626", marginTop: 12 }}>{error}</p>}
          </form>
        )}

      </div>
    </div>
  );
}