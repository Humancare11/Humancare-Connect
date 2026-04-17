import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

/* ─── helpers ─── */
const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "DR";

const fmt = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const todayLabel = () =>
  new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const avatarColors = ["#0c8b7a", "#7c3aed", "#d97706", "#dc2626", "#0369a1", "#059669"];
const avatarBg = ["#d0faf4", "#ede9fe", "#fef3c7", "#fee2e2", "#dbeafe", "#d1fae5"];

const getAC = (i) => ({ color: avatarColors[i % avatarColors.length], bg: avatarBg[i % avatarBg.length] });

/* ─── sub-components ─── */
const StatCard = ({ icon, label, value, sub, accent }) => (
  <div className="db2-stat" style={{ "--ac": accent }}>
    <div className="db2-stat-icon">{icon}</div>
    <div className="db2-stat-body">
      <span className="db2-stat-value">{value}</span>
      <span className="db2-stat-label">{label}</span>
      {sub && <span className="db2-stat-sub">{sub}</span>}
    </div>
    <div className="db2-stat-glow" />
  </div>
);

const TypeBadge = ({ type }) => {
  const map = {
    Video: { cls: "video", label: "Video" },
    "In-Clinic": { cls: "clinic", label: "Clinic" },
    Chat: { cls: "chat", label: "Chat" },
  };
  const t = map[type] || { cls: "clinic", label: type };
  return <span className={`db2-badge db2-badge--${t.cls}`}>{t.label}</span>;
};

const StatusBadge = ({ status }) => {
  const map = {
    confirmed: { cls: "confirmed", label: "Confirmed" },
    pending: { cls: "pending", label: "Pending" },
    done: { cls: "done", label: "Done" },
    cancelled: { cls: "cancelled", label: "Cancelled" },
  };
  const s = map[status] || { cls: "pending", label: status };
  return <span className={`db2-badge db2-badge--${s.cls}`}>{s.label}</span>;
};

/* ─── main component ─── */
export default function Dashbord() {
  const navigate = useNavigate();
  const doctor = JSON.parse(localStorage.getItem("currentDoctor") || "null") || {};
  const token = localStorage.getItem("doctorToken");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [tab, setTab] = useState("today");
  const [now, setNow] = useState(new Date());

  /* live clock */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  /* fetch appointments */
  const fetchAppointments = useCallback(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get("http://localhost:5000/api/appointments/doctor", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setAppointments(r.data))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  /* confirm */
  const confirm = async (id) => {
    setConfirming(id);
    try {
      const res = await axios.put(
        `http://localhost:5000/api/appointments/${id}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? res.data.appointment : a))
      );
    } catch { /* silent */ }
    finally { setConfirming(null); }
  };

  /* cancel */
  const cancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    setCancellingId(id);
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "cancelled" } : a))
      );
    } catch { /* silent */ }
    finally { setCancellingId(null); }
  };

  /* derived stats */
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAppts = appointments.filter((a) => a.date === todayStr || a.date?.startsWith(todayStr));
  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
  const doneCount = appointments.filter((a) => a.status === "done" || a.status === "completed").length;

  const displayed = tab === "today"
    ? todayAppts
    : tab === "pending"
      ? appointments.filter((a) => a.status === "pending")
      : appointments.filter((a) => a.status === "confirmed");

  const docInitials = initials(doctor.name);

  return (
    <div className="db2-wrap">

      {/* ── Welcome Banner ── */}
      <div className="db2-banner">
        <div className="db2-banner-left">
          <p className="db2-banner-greeting">{greeting()},</p>
          <h1 className="db2-banner-name">Dr. {doctor.name || "Doctor"} 👋</h1>
          <p className="db2-banner-date">{todayLabel()}</p>
        </div>
        <div className="db2-banner-right">
          <div className="db2-banner-clock">
            {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </div>
          <p className="db2-banner-sub">
            {todayAppts.length > 0
              ? `${todayAppts.length} appointment${todayAppts.length > 1 ? "s" : ""} today`
              : "No appointments today"}
          </p>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="db2-stats-row">
        <StatCard
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
          label="Today's Appointments"
          value={loading ? "—" : todayAppts.length}
          sub={`${confirmedCount} confirmed`}
          accent="#0c8b7a"
        />
        <StatCard
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
          label="Pending Approval"
          value={loading ? "—" : pendingCount}
          sub="awaiting confirmation"
          accent="#d97706"
        />
        <StatCard
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
          label="Total Appointments"
          value={loading ? "—" : appointments.length}
          sub={`${doneCount} completed`}
          accent="#7c3aed"
        />
        <StatCard
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
          label="Confirmed"
          value={loading ? "—" : confirmedCount}
          sub="ready for consultation"
          accent="#059669"
        />
      </div>

      {/* ── Main Grid ── */}
      <div className="db2-grid">

        {/* ── Appointments Panel ── */}
        <div className="db2-panel">
          <div className="db2-panel-head">
            <span className="db2-panel-title">Appointments</span>
            <div className="db2-tabs">
              {["today", "pending", "confirmed"].map((t) => (
                <button
                  key={t}
                  className={`db2-tab${tab === t ? " db2-tab--active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                  <span className="db2-tab-count">
                    {t === "today" ? todayAppts.length
                      : t === "pending" ? pendingCount
                        : confirmedCount}
                  </span>
                </button>
              ))}
            </div>
            <Link to="/doctor-dashboard/appointments" className="db2-view-all">
              View all →
            </Link>
          </div>

          <div className="db2-appt-list">
            {loading ? (
              <div className="db2-loading">
                {[1, 2, 3].map((n) => <div key={n} className="db2-skeleton" />)}
              </div>
            ) : displayed.length === 0 ? (
              <div className="db2-empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <p>No appointments in this category</p>
              </div>
            ) : (
              displayed.map((a, i) => {
                const ac = getAC(i);
                const av = initials(a.patientId?.name || "P");
                return (
                  <div className="db2-appt-row" key={a._id}>
                    <div className="db2-appt-av" style={{ background: ac.bg, color: ac.color }}>{av}</div>
                    <div className="db2-appt-info">
                      <div className="db2-appt-name">{a.patientId?.name || "Unknown Patient"}</div>
                      <div className="db2-appt-issue">{a.problem || "General consultation"}</div>
                      <div className="db2-appt-meta">
                        <TypeBadge type={a.type || "In-Clinic"} />
                        <span className="db2-appt-time">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {a.time || "—"} · {a.date ? fmt(a.date) : "—"}
                        </span>
                      </div>
                    </div>
                    <div className="db2-appt-status">
                      <StatusBadge status={a.status} />
                    </div>
                    <div className="db2-appt-actions">
                      {a.status === "pending" && (
                        <button
                          className="db2-btn db2-btn--confirm"
                          onClick={() => confirm(a._id)}
                          disabled={confirming === a._id}
                        >
                          {confirming === a._id ? "…" : "Confirm"}
                        </button>
                      )}
                      {a.status === "confirmed" && (
                        <button
                          className="db2-btn db2-btn--join"
                          onClick={() => navigate(`/video-call/${a._id}`)}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="23 7 16 12 23 17 23 7" />
                            <rect x="1" y="5" width="15" height="14" rx="2" />
                          </svg>
                          Join Call
                        </button>
                      )}
                      {(a.status === "pending" || a.status === "confirmed") && (
                        <button
                          className="db2-btn db2-btn--cancel"
                          onClick={() => cancel(a._id)}
                          disabled={cancellingId === a._id}
                          title="Cancel"
                        >
                          {cancellingId === a._id ? "…" : "✕"}
                        </button>
                      )}
                      {(a.status === "done" || a.status === "completed") && (
                        <span className="db2-done">✓ Completed</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="db2-right">

  

          {/* Quick Actions */}
          <div className="db2-panel">
            <div className="db2-panel-head">
              <span className="db2-panel-title">Quick Actions</span>
            </div>
            <div className="db2-quick-grid">
              <Link to="/doctor-dashboard/appointments" className="db2-quick-item">
                <div className="db2-quick-icon" style={{ background: "#d0faf4", color: "#0c8b7a" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <span>Appointments</span>
              </Link>
              <Link to="/doctor-dashboard/patients" className="db2-quick-item">
                <div className="db2-quick-icon" style={{ background: "#ede9fe", color: "#7c3aed" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <span>My Patients</span>
              </Link>
              <Link to="/doctor-dashboard/messages" className="db2-quick-item">
                <div className="db2-quick-icon" style={{ background: "#fef3c7", color: "#d97706" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <span>Messages</span>
              </Link>
              <Link to="/doctor-dashboard/analytics" className="db2-quick-item">
                <div className="db2-quick-icon" style={{ background: "#dbeafe", color: "#0369a1" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                    <line x1="2" y1="20" x2="22" y2="20" />
                  </svg>
                </div>
                <span>Analytics</span>
              </Link>
              <Link to="/doctor-dashboard/enrollments" className="db2-quick-item">
                <div className="db2-quick-icon" style={{ background: "#fee2e2", color: "#dc2626" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <span>Enrollments</span>
              </Link>
              <Link to="/doctor-dashboard/settings" className="db2-quick-item">
                <div className="db2-quick-icon" style={{ background: "#d1fae5", color: "#059669" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </div>
                <span>Settings</span>
              </Link>
            </div>
          </div>

          {/* Upcoming next appointment */}
          {(() => {
            const next = appointments.find((a) => a.status === "confirmed");
            if (!next) return null;
            const av = initials(next.patientId?.name || "P");
            const ac = getAC(0);
            return (
              <div className="db2-panel db2-next-panel">
                <div className="db2-panel-head">
                  <span className="db2-panel-title">Next Consultation</span>
                  <span className="db2-badge db2-badge--confirmed">Confirmed</span>
                </div>
                <div className="db2-next-body">
                  <div className="db2-next-av" style={{ background: ac.bg, color: ac.color }}>{av}</div>
                  <div>
                    <div className="db2-next-name">{next.patientId?.name || "Patient"}</div>
                    <div className="db2-next-issue">{next.problem || "General consultation"}</div>
                    <div className="db2-next-meta">
                      <TypeBadge type={next.type || "In-Clinic"} />
                      <span className="db2-appt-time">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {next.time} · {fmt(next.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="db2-btn db2-btn--join db2-btn--full"
                  onClick={() => navigate(`/video-call/${next._id}`)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" />
                  </svg>
                  Start Video Call
                </button>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}
