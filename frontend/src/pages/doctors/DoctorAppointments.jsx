import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DoctorAppointments.css";
import api from "../../api";
import { useDoctorAuth } from "../../context/DoctorAuthContext";

const STATUS_META = {
  pending: { label: "Pending", icon: "⏳", color: "amber" },
  confirmed: { label: "Confirmed", icon: "✓", color: "teal" },
  cancelled: { label: "Cancelled", icon: "✕", color: "red" },
  completed: { label: "Completed", icon: "★", color: "slate" },
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DoctorAppointments() {
  const { doctor } = useDoctorAuth();
  const doctorName = doctor?.name || "Doctor";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);

  useEffect(() => {
    api.get("/api/appointments/doctor")
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Failed to load appointments", err))
      .finally(() => setLoading(false));
  }, []);

  const confirmAppointment = async (id) => {
    setConfirmingId(id);
    try {
      const res = await api.put(`/api/appointments/${id}/confirm`, {});

      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? res.data.appointment : a))
      );
    } catch {
      alert("Could not confirm appointment.");
    } finally {
      setConfirmingId(null);
    }
  };

  const TABS = ["all", "pending", "confirmed", "completed"];

  const counts = {
    all: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
  };

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  return (
    <div className="da-root">
      {/* Header */}
      <header className="da-header">
        <div>
          <span className="da-eyebrow">HumaniCare</span>
          <h1 className="da-greeting">
            {getGreeting()}, {doctorName} <span className="da-wave">👋</span>
          </h1>
          <p className="da-sub">Manage your patient appointments</p>
        </div>
      </header>

      {/* Stats */}
      <div className="da-stats">
        {[
          { key: "pending", label: "Pending", dot: "amber" },
          { key: "confirmed", label: "Confirmed", dot: "teal" },
          { key: "completed", label: "Completed", dot: "green" },
          { key: "all", label: "Total", dot: "purple" },
        ].map(({ key, label, dot }, i) => (
          <div
            key={key}
            className={`da-stat ${filter === key ? "da-stat--active" : ""}`}
            style={{ animationDelay: `${i * 0.07}s` }}
            onClick={() => setFilter(key)}
          >
            <span className={`da-dot da-dot--${dot}`} />
            <div>
              <div className="da-stat-num">{counts[key] ?? 0}</div>
              <div className="da-stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Panel */}
      <div className="da-panel">
        <div className="da-panel-top">
          <div>
            <h2 className="da-panel-title">Appointments</h2>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="da-table-wrap">
            <table className="da-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Problem</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((appt, idx) => {
                  const meta =
                    STATUS_META[appt.status] || {
                      label: appt.status,
                      color: "slate",
                      icon: "•",
                    };

                  const isOpen = selectedId === appt._id;

                  return (
                    <>
                      {/* MAIN ROW */}
                      <tr
                        key={appt._id}
                        className={`da-row ${
                          isOpen ? "da-row--open" : ""
                        }`}
                        style={{ animationDelay: `${idx * 0.04}s` }}
                      >
                        <td>
                          <div className="da-patient">
                            <div className="da-avatar">
                              {(appt.patientId?.name || "?")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <span className="da-patient-name">
                              {appt.patientId?.name || "Unknown"}
                            </span>
                          </div>
                        </td>

                        <td className="da-mono">
                          {formatDate(appt.date)}
                        </td>

                        <td className="da-mono">
                          {appt.time || "—"}
                        </td>

                        <td className="da-problem">
                          {appt.problem || "—"}
                        </td>

                        <td>
                          <span
                            className={`da-badge da-badge--${meta.color}`}
                          >
                            {meta.icon} {meta.label}
                          </span>
                        </td>

                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="da-action-group">
                            {/* CONFIRM */}
                            {appt.status === "pending" && (
                              <button
                                className="da-btn da-btn--confirm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmAppointment(appt._id);
                                }}
                                disabled={
                                  confirmingId === appt._id
                                }
                              >
                                {confirmingId === appt._id ? (
                                  <span className="da-spinner" />
                                ) : (
                                  "Confirm"
                                )}
                              </button>
                            )}

                            {/* JOIN */}
                            {appt.status === "confirmed" && (
                              <Link
                                className="da-btn da-btn--join"
                                to={`/video-call/${appt._id}`}
                                onClick={(e) =>
                                  e.stopPropagation()
                                }
                              >
                                Join
                              </Link>
                            )}

                            {/* 🔽 ONLY THIS OPENS DATA */}
                            <button
                              className={`da-btn da-btn--ghost ${
                                isOpen
                                  ? "da-btn--ghost-on"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(
                                  isOpen ? null : appt._id
                                );
                              }}
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                style={{
                                  transform: isOpen
                                    ? "rotate(180deg)"
                                    : "none",
                                  transition:
                                    "transform 0.22s",
                                }}
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* EXPAND */}
                      {isOpen && (
                        <tr
                          key={`${appt._id}-exp`}
                          className="da-expand-row"
                        >
                          <td colSpan={6}>
                            <div className="da-expand">
                              <p>
                                <strong>Name:</strong>{" "}
                                {appt.patientId?.name}
                              </p>
                              <p>
                                <strong>Email:</strong>{" "}
                                {appt.patientId?.email}
                              </p>
                              <p>
                                <strong>Problem:</strong>{" "}
                                {appt.problem}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}