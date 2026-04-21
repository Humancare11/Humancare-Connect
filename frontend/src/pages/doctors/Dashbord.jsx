import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "DR";

const fmt = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const todayLabel = () =>
  new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

/* Avatar palette cycles */
const AVATAR_PALETTE = [
  { bg: "rgba(25,201,163,0.15)",  color: "#19c9a3" },
  { bg: "rgba(167,139,250,0.15)", color: "#a78bfa" },
  { bg: "rgba(245,158,11,0.15)",  color: "#f59e0b" },
  { bg: "rgba(248,113,113,0.15)", color: "#f87171" },
  { bg: "rgba(56,189,248,0.15)",  color: "#38bdf8" },
  { bg: "rgba(34,197,94,0.15)",   color: "#22c55e"  },
];
const palette = (i) => AVATAR_PALETTE[i % AVATAR_PALETTE.length];

/* ─────────────────────────────────────────
   Sub-components
───────────────────────────────────────── */
function StatCard({ icon, label, value, sub, accentVar, delay = 0 }) {
  return (
    <div className="dd-stat" style={{ "--ac": `var(${accentVar})`, animationDelay: `${delay}s` }}>
      <div className="dd-stat-icon">{icon}</div>
      <div className="dd-stat-body">
        <span className="dd-stat-value">{value}</span>
        <span className="dd-stat-label">{label}</span>
        {sub && <span className="dd-stat-sub">{sub}</span>}
      </div>
      <div className="dd-stat-blob" />
    </div>
  );
}

const STATUS_MAP = {
  confirmed: { cls: "teal",   label: "Confirmed" },
  pending:   { cls: "amber",  label: "Pending"   },
  done:      { cls: "green",  label: "Done"      },
  completed: { cls: "green",  label: "Completed" },
  cancelled: { cls: "red",    label: "Cancelled" },
};

const TYPE_MAP = {
  Video:      { cls: "purple", label: "Video"    },
  "In-Clinic":{ cls: "teal",   label: "Clinic"   },
  Chat:       { cls: "amber",  label: "Chat"     },
};

function Badge({ text, cls }) {
  return <span className={`dd-badge dd-badge--${cls}`}>{text}</span>;
}

const QUICK_ACTIONS = [
  { to: "/doctor-dashboard/appointments", label: "Appointments", accentVar: "--teal",   icon: "M8 2v4M16 2v4M3 10h18M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" },
  { to: "/doctor-dashboard/patients",     label: "Patients",     accentVar: "--purple", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
  { to: "/doctor-dashboard/messages",     label: "Messages",     accentVar: "--amber",  icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
  { to: "/doctor-dashboard/raise-ticket", label: "Raise Ticket", accentVar: "--orange", icon: "M2 10h20l-2 8H4l-2-8zM6 2v4M18 2v4M6 10v8M18 10v8M10 6h4" },
  { to: "/doctor-dashboard/analytics",   label: "Analytics",    accentVar: "--blue",   icon: "M18 20V10M12 20V4M6 20v-6M2 20h20" },
  { to: "/doctor-dashboard/enrollments", label: "Enrollments",  accentVar: "--red",    icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8" },
  { to: "/doctor-dashboard/settings",    label: "Settings",     accentVar: "--green",  icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" },
];

function SvgIcon({ d, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {d.split("M").filter(Boolean).map((seg, i) => (
        <path key={i} d={`M${seg}`} />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
export default function DoctorDashboard() {
  const navigate = useNavigate();
  const doctor = JSON.parse(localStorage.getItem("currentDoctor") || "null") || {};
  const token = localStorage.getItem("doctorToken");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [tab, setTab] = useState("today");
  const [now, setNow] = useState(new Date());

  /* Live clock */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  /* Fetch */
  const fetchAppointments = useCallback(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/appointments/doctor`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => setAppointments(r.data))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  /* Confirm */
  const confirm = async (id) => {
    setConfirming(id);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/appointments/${id}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments((prev) => prev.map((a) => (a._id === id ? res.data.appointment : a)));
    } catch { /* silent */ }
    finally { setConfirming(null); }
  };

  /* Cancel */
  const cancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    setCancellingId(id);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/appointments/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "cancelled" } : a))
      );
    } catch { /* silent */ }
    finally { setCancellingId(null); }
  };

  /* Derived */
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAppts    = appointments.filter((a) => a.date === todayStr || a.date?.startsWith(todayStr));
  const pendingCount  = appointments.filter((a) => a.status === "pending").length;
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
  const doneCount     = appointments.filter((a) => a.status === "done" || a.status === "completed").length;

  const displayed =
    tab === "today"
      ? todayAppts
      : tab === "pending"
      ? appointments.filter((a) => a.status === "pending")
      : appointments.filter((a) => a.status === "confirmed");

  const nextConfirmed = appointments.find((a) => a.status === "confirmed");

  return (
    <div className="dd-root">

      {/* ── Banner ── */}
      <div className="dd-banner">
        <div className="dd-banner-left">
          <span className="dd-eyebrow">HumaniCare</span>
          <h1 className="dd-banner-name">
            {getGreeting()}, Dr. {doctor.name || "Doctor"}{" "}
            <span className="dd-wave">👋</span>
          </h1>
          <p className="dd-banner-date">{todayLabel()}</p>
        </div>
        <div className="dd-banner-right">
          <div className="dd-clock">
            {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </div>
          <p className="dd-banner-today">
            {todayAppts.length > 0
              ? `${todayAppts.length} appointment${todayAppts.length !== 1 ? "s" : ""} today`
              : "No appointments today"}
          </p>
        </div>
        <div className="dd-banner-glow" />
      </div>

      {/* ── Stats ── */}
      <div className="dd-stats">
        <StatCard
          accentVar="--teal" delay={0.05}
          label="Today's Appointments" value={loading ? "—" : todayAppts.length}
          sub={`${confirmedCount} confirmed`}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
        />
        <StatCard
          accentVar="--amber" delay={0.1}
          label="Pending Approval" value={loading ? "—" : pendingCount}
          sub="awaiting confirmation"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        />
        <StatCard
          accentVar="--purple" delay={0.15}
          label="Total Appointments" value={loading ? "—" : appointments.length}
          sub={`${doneCount} completed`}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
        />
        <StatCard
          accentVar="--green" delay={0.2}
          label="Confirmed" value={loading ? "—" : confirmedCount}
          sub="ready for consultation"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>}
        />
      </div>

      {/* ── Main Grid ── */}
      <div className="dd-grid">

        {/* ── Left: Appointments Panel ── */}
        <div className="dd-panel">
          <div className="dd-panel-head">
            <span className="dd-panel-title">Appointments</span>
            <div className="dd-tabs">
              {[
                { key: "today",     label: "Today",     count: todayAppts.length  },
                { key: "pending",   label: "Pending",   count: pendingCount       },
                { key: "confirmed", label: "Confirmed", count: confirmedCount     },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  className={`dd-tab ${tab === key ? "dd-tab--active" : ""}`}
                  onClick={() => setTab(key)}
                >
                  {label}
                  <span className="dd-tab-count">{count}</span>
                </button>
              ))}
            </div>
            <Link to="/doctor-dashboard/appointments" className="dd-view-all">
              View all →
            </Link>
          </div>

          <div className="dd-appt-list">
            {loading ? (
              <div className="dd-skeletons">
                {[1, 2, 3].map((n) => <div key={n} className="dd-skeleton" style={{ animationDelay: `${n * 0.08}s` }} />)}
              </div>
            ) : displayed.length === 0 ? (
              <div className="dd-empty">
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <p>No appointments in this category</p>
              </div>
            ) : (
              displayed.map((a, i) => {
                const pal = palette(i);
                const av  = initials(a.patientId?.name || "P");
                const sm  = STATUS_MAP[a.status] || { cls: "amber", label: a.status };
                const tm  = TYPE_MAP[a.type || "In-Clinic"] || { cls: "teal", label: a.type || "Clinic" };
                return (
                  <div className="dd-appt-row" key={a._id} style={{ animationDelay: `${i * 0.04}s` }}>
                    <div
                      className="dd-appt-av"
                      style={{ background: pal.bg, color: pal.color, boxShadow: `0 0 0 1.5px ${pal.color}30` }}
                    >{av}</div>

                    <div className="dd-appt-info">
                      <div className="dd-appt-name">{a.patientId?.name || "Unknown Patient"}</div>
                      <div className="dd-appt-issue">{a.problem || "General consultation"}</div>
                      <div className="dd-appt-meta">
                        <Badge text={tm.label} cls={tm.cls} />
                        <span className="dd-appt-time">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {a.time || "—"} · {a.date ? fmt(a.date) : "—"}
                        </span>
                      </div>
                    </div>

                    <div className="dd-appt-right">
                      <Badge text={sm.label} cls={sm.cls} />
                      <div className="dd-appt-actions">
                        {a.status === "pending" && (
                          <button
                            className="dd-btn dd-btn--confirm"
                            onClick={() => confirm(a._id)}
                            disabled={confirming === a._id}
                          >
                            {confirming === a._id ? <span className="dd-spin" /> : "Confirm"}
                          </button>
                        )}
                        {a.status === "confirmed" && (
                          <button
                            className="dd-btn dd-btn--join"
                            onClick={() => navigate(`/video-call/${a._id}`)}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                              <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                            </svg>
                            Join
                          </button>
                        )}
                        {(a.status === "done" || a.status === "completed") && (
                          <span className="dd-done">✓ Done</span>
                        )}
                        {(a.status === "pending" || a.status === "confirmed") && (
                          <button
                            className="dd-btn dd-btn--cancel"
                            onClick={() => cancel(a._id)}
                            disabled={cancellingId === a._id}
                            title="Cancel"
                          >
                            {cancellingId === a._id ? <span className="dd-spin dd-spin--red" /> : "✕"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="dd-right-col">

          {/* Next Consultation */}
          {nextConfirmed && (() => {
            const pal = palette(0);
            const av  = initials(nextConfirmed.patientId?.name || "P");
            const tm  = TYPE_MAP[nextConfirmed.type || "In-Clinic"] || { cls: "teal", label: "Clinic" };
            return (
              <div className="dd-panel dd-next-panel">
                <div className="dd-panel-head">
                  <span className="dd-panel-title">Next Consultation</span>
                  <Badge text="Confirmed" cls="teal" />
                </div>
                <div className="dd-next-body">
                  <div
                    className="dd-next-av"
                    style={{ background: pal.bg, color: pal.color, boxShadow: `0 0 0 2px ${pal.color}40` }}
                  >{av}</div>
                  <div className="dd-next-info">
                    <div className="dd-next-name">{nextConfirmed.patientId?.name || "Patient"}</div>
                    <div className="dd-next-issue">{nextConfirmed.problem || "General consultation"}</div>
                    <div className="dd-next-meta">
                      <Badge text={tm.label} cls={tm.cls} />
                      <span className="dd-appt-time">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {nextConfirmed.time} · {fmt(nextConfirmed.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="dd-btn dd-btn--join dd-btn--wide"
                  onClick={() => navigate(`/video-call/${nextConfirmed._id}`)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                  </svg>
                  Start Video Call
                </button>
              </div>
            );
          })()}

          {/* Quick Actions */}
          <div className="dd-panel">
            <div className="dd-panel-head">
              <span className="dd-panel-title">Quick Actions</span>
            </div>
            <div className="dd-quick-grid">
              {QUICK_ACTIONS.map(({ to, label, accentVar, icon }) => (
                <Link key={to} to={to} className="dd-quick-item" style={{ "--qa": `var(${accentVar})` }}>
                  <div className="dd-quick-icon">
                    <SvgIcon d={icon} size={18} />
                  </div>
                  <span className="dd-quick-label">{label}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}