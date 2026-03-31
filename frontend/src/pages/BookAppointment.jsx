import { useLocation } from "react-router-dom";
import { useState } from "react";
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
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
          </form>
        )}

      </div>
    </div>
  );
}