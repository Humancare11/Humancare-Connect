import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppointmentChat from "../../components/AppointmentChat";
import "./appointment.css";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("confirmed");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/appointments/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Failed to load appointments", err))
      .finally(() => setLoading(false));
  }, []);

  const pendingAppointments = appointments.filter((a) => a.status === "pending");
  const confirmedAppointments = appointments.filter((a) => a.status === "confirmed");
  const completedAppointments = appointments.filter((a) => a.status === "completed");

  const tabData = {
    pending: pendingAppointments,
    confirmed: confirmedAppointments,
    completed: completedAppointments,
  };

  const currentList = tabData[activeTab];

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="appt-page">
      {/* Header */}
      <div className="appt-header">
        <div className="appt-header-text">
          <p className="appt-eyebrow">HumaniCare</p>
          <h1 className="appt-title">My Appointments</h1>
          <p className="appt-subtitle">Track, manage and connect with your doctors</p>
        </div>
        <Link to="/find-a-doctor" className="appt-book-btn">
          <span className="appt-book-icon">+</span>
          Book Appointment
        </Link>
      </div>

      {/* Stats Strip */}
      <div className="appt-stats">
        <div className="appt-stat-card">
          <span className="appt-stat-num">{pendingAppointments.length}</span>
          <span className="appt-stat-label">Pending</span>
          <div className="appt-stat-dot pending-dot" />
        </div>
        <div className="appt-stat-divider" />
        <div className="appt-stat-card">
          <span className="appt-stat-num">{confirmedAppointments.length}</span>
          <span className="appt-stat-label">Confirmed</span>
          <div className="appt-stat-dot confirmed-dot" />
        </div>
        <div className="appt-stat-divider" />
        <div className="appt-stat-card">
          <span className="appt-stat-num">{completedAppointments.length}</span>
          <span className="appt-stat-label">Completed</span>
          <div className="appt-stat-dot completed-dot" />
        </div>
      </div>

      {/* Tabs */}
      <div className="appt-tabs">
        {["pending", "confirmed", "completed"].map((tab) => (
          <button
            key={tab}
            className={`appt-tab ${activeTab === tab ? "active" : ""} tab-${tab}`}
            onClick={() => setActiveTab(tab)}
          >
            <span className="tab-label">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            <span className="tab-count">{tabData[tab].length}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="appt-content">
        {loading ? (
          <div className="appt-loading">
            <div className="appt-spinner" />
            <p>Fetching your appointments…</p>
          </div>
        ) : currentList.length === 0 ? (
          <div className="appt-empty">
            <div className="appt-empty-icon">
              {activeTab === "pending" ? "⏳" : activeTab === "confirmed" ? "✅" : "📋"}
            </div>
            <h3>No {activeTab} appointments</h3>
            <p>
              {activeTab === "pending"
                ? "You have no appointments awaiting confirmation."
                : activeTab === "confirmed"
                  ? "No confirmed appointments right now."
                  : "Your past consultations will show up here."}
            </p>
            {activeTab !== "completed" && (
              <Link to="/find-a-doctor" className="appt-empty-cta">
                Find a Doctor
              </Link>
            )}
          </div>
        ) : (
          <div className="appt-list">
            {currentList.map((appt, i) => (
              <div
                className={`appt-card appt-card--${activeTab}`}
                key={appt._id}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Card Left */}
                <div className="appt-card-left">
                  <div className="appt-avatar">
                    {appt.doctorId?.name?.charAt(0)?.toUpperCase() || "D"}
                  </div>
                  <div className={`appt-status-line status-line--${activeTab}`} />
                </div>

                {/* Card Body */}
                <div className="appt-card-body">
                  <div className="appt-card-top">
                    <div className="appt-doctor-info">
                      <h4 className="appt-doctor-name">
                        Dr. {appt.doctorId?.name || "Unknown Doctor"}
                      </h4>
                      <p className="appt-doctor-email">{appt.doctorId?.email || ""}</p>
                    </div>
                    <span className={`appt-badge appt-badge--${activeTab}`}>
                      {activeTab === "pending" && "⏳ Pending"}
                      {activeTab === "confirmed" && "✅ Confirmed"}
                      {activeTab === "completed" && "📋 Completed"}
                    </span>
                  </div>

                  <div className="appt-meta">
                    <div className="appt-meta-item">
                      <span className="appt-meta-icon">📅</span>
                      <span>{formatDate(appt.date)}</span>
                    </div>
                    <div className="appt-meta-item">
                      <span className="appt-meta-icon">🕐</span>
                      <span>{appt.time || "—"}</span>
                    </div>
                    {appt.problem && (
                      <div className="appt-meta-item appt-problem">
                        <span className="appt-meta-icon">📝</span>
                        <span>{appt.problem}</span>
                      </div>
                    )}
                  </div>

                  <div className="appt-card-actions">
                    {activeTab === "pending" && (
                      <span className="appt-waiting-text">Awaiting doctor confirmation</span>
                    )}
                    {activeTab === "confirmed" && (
                      <>
                        <button
                          className="appt-btn appt-btn--primary"
                          onClick={() => setSelectedAppointment(appt)}
                        >
                          💬 Start Consultation
                        </button>
                        <Link
                          to={`/video-call/${appt._id}`}
                          className="appt-btn appt-btn--outline"
                        >
                          📹 Join Video Call
                        </Link>
                      </>
                    )}
                    {activeTab === "completed" && (
                      <span className="appt-done-text">Consultation completed</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Consultation Modal */}
      {selectedAppointment && selectedAppointment.status === "confirmed" && (
        <div className="appt-modal-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="appt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="appt-modal-header">
              <div className="appt-modal-title-group">
                <div className="appt-modal-avatar">
                  {selectedAppointment.doctorId?.name?.charAt(0)?.toUpperCase() || "D"}
                </div>
                <div>
                  <h3>Live Consultation</h3>
                  <p>Dr. {selectedAppointment.doctorId?.name || "Unknown Doctor"}</p>
                </div>
              </div>
              <button
                className="appt-modal-close"
                onClick={() => setSelectedAppointment(null)}
              >
                ×
              </button>
            </div>
            <div className="appt-modal-body">
              <AppointmentChat
                appointmentId={selectedAppointment._id}
                userName={user?.name}
              />
            </div>
            <div className="appt-modal-footer">
              <Link
                to={`/video-call/${selectedAppointment._id}`}
                className="appt-btn appt-btn--primary full-width"
              >
                📹 Join Video Call
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}