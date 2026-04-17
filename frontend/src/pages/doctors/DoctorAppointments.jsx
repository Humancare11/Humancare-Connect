import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppointmentChat from "../../components/AppointmentChat";

export default function DoctorAppointments() {
  const doctorName = JSON.parse(localStorage.getItem("currentDoctor") || "null")?.name || "Doctor";
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const token = localStorage.getItem("doctorToken");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:5000/api/appointments/doctor", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => {
        console.error("Failed to load doctor appointments", err);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const confirmAppointment = async (appointmentId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/confirm`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId ? res.data.appointment : appointment
        )
      );
      setSelectedAppointment((prev) =>
        prev?._id === appointmentId ? res.data.appointment : prev
      );
    } catch (error) {
      console.error("Failed to confirm appointment", error);
      alert("Could not confirm appointment.");
    }
  };

  if (loading) {
    return <div className="dd-card"><h2 className="dd-card-title">Appointments</h2><p>Loading appointments...</p></div>;
  }

  if (!appointments.length) {
    return <div className="dd-card"><h2 className="dd-card-title">Appointments</h2><p>No upcoming appointments.</p></div>;
  }

  return (
    <div className="dd-card">
      <h2 className="dd-card-title">Appointments</h2>
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              {['Patient', 'Date', 'Time', 'Problem', 'Status', 'Actions'].map((label) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id} className="alt">
                <td>{appointment.patientId?.name || 'Unknown'}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.problem || '—'}</td>
                <td>{appointment.status}</td>
                <td className="actions-cell">
                  <button className="btn-view" onClick={() => setSelectedAppointment(appointment)}>
                    View
                  </button>
                  {appointment.status === 'pending' ? (
                    <button className="btn-approve" onClick={() => confirmAppointment(appointment._id)}>
                      Confirm
                    </button>
                  ) : (
                    <Link className="btn-view" to={`/video-call/${appointment._id}`}>
                      Join Call
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedAppointment && selectedAppointment.status === 'confirmed' && (
        <div style={{ marginTop: 24 }}>
          <h3>Consultation</h3>
          <AppointmentChat appointmentId={selectedAppointment._id} userName={doctorName} />
          <Link to={`/video-call/${selectedAppointment._id}`} className="ap-btn" style={{ marginTop: 16, display: 'inline-block' }}>
            Start Video Call
          </Link>
        </div>
      )}
    </div>
  );
}
