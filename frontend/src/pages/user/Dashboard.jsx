import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppointmentChat from "../../components/AppointmentChat";
import "./dashboard.css";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    axios
      .get("http://localhost:5000/api/appointments/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Failed to load appointments", err))
      .finally(() => setLoading(false));
  }, []);

  const pendingCount   = appointments.filter((a) => a.status === "pending").length;
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="hc-dash__page">

      <div className="hc-dash__header">
        <div className="hc-dash__header-text">
          <p className="hc-dash__eyebrow">HumaniCare</p>
          <h1 className="hc-dash__title">{getGreeting()}, {user?.name?.split(" ")[0] || "there"} 👋</h1>
          <p className="hc-dash__subtitle">Here's your health overview for today</p>
        </div>
        <Link to="/find-a-doctor" className="hc-dash__book-btn">
          <span>+</span> Book Appointment
        </Link>
      </div>

      <div className="hc-dash__stats">
        <div className="hc-dash__stat-card">
          <div className="hc-dash__stat-icon hc-dash__stat-icon--pending">⏳</div>
          <div className="hc-dash__stat-info">
            <span className="hc-dash__stat-num">{pendingCount}</span>
            <span className="hc-dash__stat-label">Pending</span>
          </div>
          <div className="hc-dash__stat-dot hc-dash__dot--pending" />
        </div>
        <div className="hc-dash__stat-divider" />
        <div className="hc-dash__stat-card">
          <div className="hc-dash__stat-icon hc-dash__stat-icon--confirmed">✅</div>
          <div className="hc-dash__stat-info">
            <span className="hc-dash__stat-num">{confirmedCount}</span>
            <span className="hc-dash__stat-label">Confirmed</span>
          </div>
          <div className="hc-dash__stat-dot hc-dash__dot--confirmed" />
        </div>
        <div className="hc-dash__stat-divider" />
        <div className="hc-dash__stat-card">
          <div className="hc-dash__stat-icon hc-dash__stat-icon--completed">📋</div>
          <div className="hc-dash__stat-info">
            <span className="hc-dash__stat-num">{completedCount}</span>
            <span className="hc-dash__stat-label">Completed</span>
          </div>
          <div className="hc-dash__stat-dot hc-dash__dot--completed" />
        </div>
        <div className="hc-dash__stat-divider" />
        <div className="hc-dash__stat-card">
          <div className="hc-dash__stat-icon hc-dash__stat-icon--total">📊</div>
          <div className="hc-dash__stat-info">
            <span className="hc-dash__stat-num">{appointments.length}</span>
            <span className="hc-dash__stat-label">Total</span>
          </div>
          <div className="hc-dash__stat-dot hc-dash__dot--total" />
        </div>
      </div>

      <div className="hc-dash__section">
        <div className="hc-dash__section-header">
          <div>
            <h2 className="hc-dash__section-title">Recent Appointments</h2>
            <p className="hc-dash__section-sub">Your last 5 appointments</p>
          </div>
          <Link to="/appointments" className="hc-dash__view-all">View all →</Link>
        </div>

        {loading ? (
          <div className="hc-dash__loading">
            <div className="hc-dash__spinner" />
            <p>Fetching appointments…</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="hc-dash__empty">
            <div className="hc-dash__empty-icon">📅</div>
            <h3>No appointments yet</h3>
            <p>Book your first appointment to begin your healthcare journey.</p>
            <Link to="/find-a-doctor" className="hc-dash__empty-cta">Find a Doctor</Link>
          </div>
        ) : (
          <div className="hc-dash__table-wrap">
            <table className="hc-dash__table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, 5).map((appt, i) => (
                  <tr key={appt._id} style={{ animationDelay: `${i * 60}ms` }}>
                    <td>
                      <div className="hc-dash__doctor-cell">
                        <div className="hc-dash__avatar">
                          {appt.doctorId?.name?.charAt(0)?.toUpperCase() || "D"}
                        </div>
                        <span className="hc-dash__doctor-name">
                          Dr. {appt.doctorId?.name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="hc-dash__cell-muted">{formatDate(appt.date)}</td>
                    <td className="hc-dash__cell-muted">{appt.time || "—"}</td>
                    <td>
                      <span className={`hc-dash__badge hc-dash__badge--${appt.status}`}>
                        {appt.status === "pending"   && "⏳ Pending"}
                        {appt.status === "confirmed" && "✅ Confirmed"}
                        {appt.status === "completed" && "📋 Completed"}
                      </span>
                    </td>
                    <td>
                      {appt.status === "confirmed" ? (
                        <button
                          className="hc-dash__btn hc-dash__btn--primary"
                          onClick={() => setSelectedAppointment(appt)}
                        >
                          💬 Consult
                        </button>
                      ) : appt.status === "pending" ? (
                        <span className="hc-dash__waiting">Awaiting confirmation</span>
                      ) : (
                        <span className="hc-dash__done">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedAppointment && selectedAppointment.status === "confirmed" && (
        <div className="hc-dash__modal-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="hc-dash__modal" onClick={(e) => e.stopPropagation()}>
            <div className="hc-dash__modal-header">
              <div className="hc-dash__modal-title-group">
                <div className="hc-dash__modal-avatar">
                  {selectedAppointment.doctorId?.name?.charAt(0)?.toUpperCase() || "D"}
                </div>
                <div>
                  <h3>Live Consultation</h3>
                  <p>Dr. {selectedAppointment.doctorId?.name || "Unknown Doctor"}</p>
                </div>
              </div>
              <button className="hc-dash__modal-close" onClick={() => setSelectedAppointment(null)}>×</button>
            </div>
            <div className="hc-dash__modal-body">
              <AppointmentChat appointmentId={selectedAppointment._id} userName={user?.name} />
            </div>
            <div className="hc-dash__modal-footer">
              <Link to={`/video-call/${selectedAppointment._id}`} className="hc-dash__btn hc-dash__btn--primary hc-dash__btn--full">
                📹 Join Video Call
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}