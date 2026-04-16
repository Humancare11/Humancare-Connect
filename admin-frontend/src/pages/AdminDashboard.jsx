import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QnAPage from "./admin/QnAPage";
import "./Dashboard.css";

/* ── Doctor Profile Modal ── */
function DoctorProfileModal({ doctor, onClose }) {
  if (!doctor) return null;
  const name = `${doctor.firstName || ""} ${doctor.surname || ""}`.trim() || doctor.doctorId?.name || "—";
  const statusColor = { pending: "#d97706", approved: "#059669", rejected: "#dc2626" };

  const row = (label, value) =>
    value ? (
      <div style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
        <span style={{ minWidth: 180, fontWeight: 600, color: "#6b7280", fontSize: 13 }}>{label}</span>
        <span style={{ color: "#111827", fontSize: 13 }}>{value}</span>
      </div>
    ) : null;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: "min(680px, 95vw)", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ background: "#1f2937", color: "#fff", padding: "20px 24px", borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{name}</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>{doctor.specialization || "—"}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ background: `${statusColor[doctor.approvalStatus]}25`, color: statusColor[doctor.approvalStatus], padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>
              {doctor.approvalStatus}
            </span>
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#9ca3af", fontSize: 22, cursor: "pointer" }}>✕</button>
          </div>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <p style={{ fontWeight: 700, color: "#374151", marginBottom: 8, marginTop: 0 }}>Personal Details</p>
          {row("Email", doctor.email || doctor.doctorId?.email)}
          {row("Phone", doctor.countryCode ? `+${doctor.countryCode} ${doctor.phoneNumber}` : doctor.phoneNumber)}
          {row("Gender", doctor.gender)}
          {row("Date of Birth", doctor.dob)}
          {row("Address", doctor.address)}
          {row("City / State / Country", [doctor.city, doctor.state, doctor.country].filter(Boolean).join(", "))}
          {row("ZIP", doctor.zip)}
          <p style={{ fontWeight: 700, color: "#374151", marginBottom: 8, marginTop: 20 }}>Professional Details</p>
          {row("Qualification", doctor.qualification)}
          {row("Specialization", doctor.specialization)}
          {row("Sub-Specialization", doctor.subSpecialization)}
          {row("Experience", doctor.experience ? `${doctor.experience} years` : null)}
          {row("Consultation Fee", doctor.consultantFees ? `₹${doctor.consultantFees}` : null)}
          {row("Consultation Mode", doctor.consultationMode)}
          {row("Languages Known", doctor.languagesKnown?.join(", "))}
          {row("Clinic Name", doctor.clinicName)}
          {row("Clinic Address", doctor.clinicAddress)}
          {row("About", doctor.aboutDoctor)}
          <p style={{ fontWeight: 700, color: "#374151", marginBottom: 8, marginTop: 20 }}>Verification Details</p>
          {row("Medical Registration No.", doctor.medicalRegistrationNumber)}
          {row("Medical Council", doctor.medicalCouncilName)}
          {row("Registration Year", doctor.registrationYear)}
          {row("ID Proof Type", doctor.idProofType)}
        </div>
      </div>
    </div>
  );
}

/* ── Manage Doctors panel ── */
function ManageDoctors() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const token = localStorage.getItem("adminToken");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/doctors", { headers })
      .then((res) => setEnrollments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = (id, action) => {
    axios.put(`http://localhost:5000/api/admin/doctors/${id}/${action}`, {}, { headers })
      .then((res) => {
        setEnrollments((prev) => prev.map((e) => e._id === id ? { ...e, approvalStatus: res.data.enrollment.approvalStatus } : e));
        setSelectedDoctor((prev) => prev?._id === id ? { ...prev, approvalStatus: res.data.enrollment.approvalStatus } : prev);
      })
      .catch(console.error);
  };

  if (loading) return <p className="dash-empty">Loading doctors...</p>;
  if (!enrollments.length) return <p className="dash-empty">No doctor enrollment requests yet.</p>;

  const statusColor = { pending: "#d97706", approved: "#059669", rejected: "#dc2626" };

  return (
    <div className="dash-section">
      {selectedDoctor && <DoctorProfileModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />}
      <h2 className="dash-section-title">Doctor Enrollment Requests</h2>
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              {["Name", "Email", "Specialization", "Status", "Actions"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e, i) => {
              const name = `${e.firstName || ""} ${e.surname || ""}`.trim() || e.doctorId?.name || "—";
              const email = e.email || e.doctorId?.email || "—";
              return (
                <tr key={e._id} className={i % 2 === 0 ? "" : "alt"}>
                  <td className="bold">{name}</td>
                  <td className="muted">{email}</td>
                  <td>{e.specialization || "—"}</td>
                  <td>
                    <span className="status-badge" style={{ background: `${statusColor[e.approvalStatus]}18`, color: statusColor[e.approvalStatus] }}>
                      {e.approvalStatus}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn-view" onClick={() => setSelectedDoctor(e)}>View</button>
                    {e.approvalStatus !== "approved" && (
                      <button className="btn-approve" onClick={() => updateStatus(e._id, "approve")}>Approve</button>
                    )}
                    {e.approvalStatus !== "rejected" && (
                      <button className="btn-reject" onClick={() => updateStatus(e._id, "reject")}>Reject</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Main Admin Dashboard ── */
export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [stats, setStats] = useState({ totalUsers: 0, totalDoctors: 0, activeUsers: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("adminUser") || "null");
    if (!stored || !["admin", "superadmin"].includes(stored.role)) {
      navigate("/admin-login");
      return;
    }
    setUser(stored);
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    axios.get("http://localhost:5000/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setStats((s) => ({ ...s, totalUsers: res.data.totalUsers || 0, totalDoctors: res.data.totalDoctors || 0 })))
      .catch(() => {});
    axios.get("http://localhost:5000/api/admin/active-users")
      .then((res) => setStats((s) => ({ ...s, activeUsers: res.data.activeUsers || 0 })))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  const renderContent = () => {
    if (activeMenu === "manage-doctors") return <ManageDoctors />;
    if (activeMenu === "qna") return <QnAPage />;
    return (
      <div className="dash-section">
        <h2 className="dash-section-title">Admin Dashboard</h2>
        <div className="dash-cards">
          {[
            { label: "Total Users", value: stats.totalUsers },
            { label: "Active Users (Live)", value: stats.activeUsers },
            { label: "Approved Doctors", value: stats.totalDoctors },
            { label: "Total Appointments", value: 0 },
          ].map((c) => (
            <div className="dash-card" key={c.label}>
              <div className="dash-card-label">{c.label}</div>
              <div className="dash-card-value">{c.value}</div>
            </div>
          ))}
        </div>
        <div className="dash-welcome">
          <h3>Welcome, {user?.name} 👋</h3>
          <p>Use the sidebar to manage doctors, users, and platform content.</p>
        </div>
      </div>
    );
  };

  if (!user) return null;

  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "manage-doctors", label: "Manage Doctors" },
    { key: "manage-users", label: "Manage Users" },
    { key: "appointments", label: "Appointments" },
    { key: "qna", label: "Medical Questions" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <div className="dash-wrapper">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-brand">
          <div className="dash-brand-mark">H</div>
          <span>HumaniCare</span>
        </div>
        <div className="dash-profile">
          <div className="dash-avatar">{user.name?.[0]?.toUpperCase()}</div>
          <div className="dash-profile-name">{user.name}</div>
          <div className="dash-profile-email">{user.email}</div>
          <span className="dash-role-badge">{user.role === "superadmin" ? "Super Admin" : "Admin"}</span>
        </div>
        <nav className="dash-nav">
          {menuItems.map((m) => (
            <button
              key={m.key}
              className={`dash-nav-item${activeMenu === m.key ? " active" : ""}`}
              onClick={() => setActiveMenu(m.key)}
            >
              {m.label}
            </button>
          ))}
          {user.role === "superadmin" && (
            <button className="dash-nav-item" onClick={() => navigate("/superadmin")}>
              Manage Admins
            </button>
          )}
        </nav>
        <button className="dash-logout" onClick={handleLogout}>Logout</button>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <header className="dash-topbar">
          <div className="dash-topbar-title">Humancare Admin</div>
          <span className="dash-topbar-user">Welcome, {user.name}</span>
        </header>
        <div className="dash-content">{renderContent()}</div>
      </main>
    </div>
  );
}
