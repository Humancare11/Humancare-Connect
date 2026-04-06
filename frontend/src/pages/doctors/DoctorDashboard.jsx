// src/pages/doctors/DoctorDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Doctor.css";

/* ── mock data (replace with API calls) ── */
const MOCK_APPOINTMENTS = [
  { id: 1, patient: "Ananya Sharma", time: "10:00 AM", date: "Today", type: "Video", status: "upcoming", issue: "Chest pain checkup" },
  { id: 2, patient: "Vikram Patil", time: "11:30 AM", date: "Today", type: "In-Clinic", status: "upcoming", issue: "Follow-up consultation" },
  { id: 3, patient: "Meera Kulkarni", time: "2:00 PM", date: "Today", type: "Video", status: "upcoming", issue: "Anxiety & sleep issues" },
  { id: 4, patient: "Rohit Joshi", time: "4:30 PM", date: "Today", type: "Chat", status: "upcoming", issue: "Prescription renewal" },
  { id: 5, patient: "Sunita Naik", time: "9:00 AM", date: "Tomorrow", type: "In-Clinic", status: "upcoming", issue: "Routine checkup" },
  { id: 6, patient: "Pradeep More", time: "3:00 PM", date: "Yesterday", type: "Video", status: "done", issue: "Diabetes review" },
];

const STATS = [
  { label: "Today's Appointments", val: 4, icon: "📅", color: "#0C8B7A", bg: "#E6F5F3" },
  { label: "Total Patients", val: 248, icon: "👥", color: "#223A5E", bg: "#EEF2FF" },
  { label: "This Month Earnings", val: "₹38,500", icon: "💰", color: "#C97B1A", bg: "#FEF3E2" },
  { label: "Avg. Rating", val: "4.8 ⭐", icon: "⭐", color: "#F59E0B", bg: "#FFFBEB" },
];

const Ico = {
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Video: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  ),
  Chat: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Clinic: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Logout: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Bell: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Edit: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
};

const typeIcon = (type) => {
  if (type === "Video") return <span className="dd-type-icon video"><Ico.Video /></span>;
  if (type === "Chat") return <span className="dd-type-icon chat"><Ico.Chat /></span>;
  return <span className="dd-type-icon clinic"><Ico.Clinic /></span>;
};

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [filter, setFilter] = useState("Today");
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => {
    const currentDoctor = JSON.parse(localStorage.getItem("currentDoctor") || "null");

    if (!currentDoctor || !currentDoctor.isLoggedIn) {
      navigate("/doctor-login");
      return;
    }

    setDoctor(currentDoctor);
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("currentDoctor");
    navigate("/doctor-login");
  };

  const filtered = MOCK_APPOINTMENTS.filter((a) => {
    if (filter === "Today") return a.date === "Today";
    if (filter === "Tomorrow") return a.date === "Tomorrow";
    if (filter === "Completed") return a.status === "done";
    return true;
  });

  if (!doctor) return null;

  const initials = doctor.name
    ? doctor.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "DR";

  return (
    <div className="dd-page">
      <aside className={`dd-sidebar${sideOpen ? " open" : ""}`}>
        <div className="dd-sidebar-brand">
          <div className="dr-brand-mark">H</div>
          <span className="dr-brand-name">HumaniCare</span>
        </div>

        <nav className="dd-nav">
          {[
            { icon: "🏠", label: "Dashboard", active: true },
            { icon: "📅", label: "Appointments", active: false },
            { icon: "👥", label: "My Patients", active: false },
            { icon: "💬", label: "Messages", active: false },
            { icon: "📊", label: "Analytics", active: false },
            { icon: "⚙️", label: "Settings", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`dd-nav-item${item.active ? " active" : ""}`}
            >
              <span className="dd-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="dd-logout" onClick={logout}>
          <Ico.Logout /> Logout
        </button>
      </aside>

      <main className="dd-main">
        <header className="dd-topbar">
          <div className="dd-topbar-left">
            <button className="dd-hamburger" onClick={() => setSideOpen((p) => !p)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div>
              <div className="dd-greeting">Good morning,</div>
              <div className="dd-greeting-name">{doctor.name || "Doctor"} 👋</div>
            </div>
          </div>

          <div className="dd-topbar-right">
            <button className="dd-icon-btn">
              <Ico.Bell />
              <span className="dd-notif-dot" />
            </button>
            <div className="dd-topbar-avatar">{initials}</div>
          </div>
        </header>

        <div className="dd-content">
          <div className="dd-stats-grid">
            {STATS.map((s) => (
              <div className="dd-stat-card" key={s.label}>
                <div className="dd-stat-icon" style={{ background: s.bg, color: s.color }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                </div>
                <div className="dd-stat-info">
                  <div className="dd-stat-val" style={{ color: s.color }}>{s.val}</div>
                  <div className="dd-stat-lbl">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="dd-grid">
            <div className="dd-card dd-appointments">
              <div className="dd-card-head">
                <h2 className="dd-card-title">Appointments</h2>
                <div className="dd-filter-tabs">
                  {["Today", "Tomorrow", "Completed", "All"].map((f) => (
                    <button
                      key={f}
                      className={`dd-tab${filter === f ? " active" : ""}`}
                      onClick={() => setFilter(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="dd-appt-list">
                {filtered.length === 0 ? (
                  <div className="dd-empty">
                    <span style={{ fontSize: 32 }}>📭</span>
                    <p>No appointments for this filter.</p>
                  </div>
                ) : (
                  filtered.map((a) => (
                    <div className="dd-appt-item" key={a.id}>
                      <div className="dd-appt-avatar">
                        {a.patient.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </div>
                      <div className="dd-appt-info">
                        <div className="dd-appt-name">{a.patient}</div>
                        <div className="dd-appt-issue">{a.issue}</div>
                        <div className="dd-appt-meta">
                          {typeIcon(a.type)}
                          <span className="dd-appt-type">{a.type}</span>
                          <span className="dd-appt-sep">·</span>
                          <Ico.Calendar />
                          <span>{a.date}, {a.time}</span>
                        </div>
                      </div>
                      <div className="dd-appt-actions">
                        {a.status === "upcoming" ? (
                          <>
                            <button className="dd-appt-btn dd-appt-btn--start">Start</button>
                            <button className="dd-appt-btn dd-appt-btn--cancel">Cancel</button>
                          </>
                        ) : (
                          <span className="dd-done-badge">✓ Done</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="dd-right-col">
              <div className="dd-card dd-profile-card">
                <div className="dd-card-head">
                  <h2 className="dd-card-title">My Profile</h2>
                  <button className="dd-edit-btn"><Ico.Edit /> Edit</button>
                </div>
                <div className="dd-profile-body">
                  <div className="dd-profile-av">{initials}</div>
                  <div className="dd-profile-name">{doctor.name || "Doctor"}</div>
                  <div className="dd-profile-spec">{doctor.specialty || "General Physician"}</div>
                  <div className="dd-profile-meta">
                    <span>📧 {doctor.email}</span>
                    {doctor.experience && <span>💼 {doctor.experience} yrs exp</span>}
                    {doctor.hospital && <span>🏥 {doctor.hospital}</span>}
                    {doctor.licenseNumber && <span>📋 {doctor.licenseNumber}</span>}
                  </div>
                  <div className="dd-profile-badge">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#0C8B7A">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verified Doctor
                  </div>
                </div>
              </div>

              <div className="dd-card dd-quick-card">
                <h2 className="dd-card-title" style={{ marginBottom: 14 }}>Quick Actions</h2>
                <div className="dd-quick-grid">
                  {[
                    { icon: "📅", label: "New Appointment" },
                    { icon: "💊", label: "Write Prescription" },
                    { icon: "📋", label: "Patient Records" },
                    { icon: "💬", label: "Start Chat" },
                  ].map((q) => (
                    <button key={q.label} className="dd-quick-btn">
                      <span style={{ fontSize: 22 }}>{q.icon}</span>
                      <span className="dd-quick-lbl">{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}