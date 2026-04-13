import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../../socket";
import QnAPage from "./QnAPage";
import "./admindashboard.css";

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
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 16, width: "min(680px, 95vw)", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
      >
        {/* Header */}
        <div style={{ background: "#1f2937", color: "#fff", padding: "20px 24px", borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{name}</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>{doctor.specialization || "—"}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ background: `${statusColor[doctor.approvalStatus]}25`, color: statusColor[doctor.approvalStatus], padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: "capitalize" }}>
              {doctor.approvalStatus}
            </span>
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#9ca3af", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>✕</button>
          </div>
        </div>

        {/* Body */}
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

function ManageDoctors() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/doctors", { headers })
      .then((res) => setEnrollments(res.data))
      .catch((err) => console.error("fetch doctors error:", err))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = (id, action) => {
    axios
      .put(`http://localhost:5000/api/admin/doctors/${id}/${action}`, {}, { headers })
      .then((res) => {
        setEnrollments((prev) =>
          prev.map((e) =>
            e._id === id ? { ...e, approvalStatus: res.data.enrollment.approvalStatus } : e
          )
        );
        setSelectedDoctor((prev) =>
          prev?._id === id ? { ...prev, approvalStatus: res.data.enrollment.approvalStatus } : prev
        );
      })
      .catch((err) => console.error(`${action} error:`, err));
  };

  if (loading) return <p style={{ padding: 24 }}>Loading doctors...</p>;

  if (enrollments.length === 0)
    return <p style={{ padding: 24 }}>No doctor enrollment requests yet.</p>;

  return (
    <div style={{ padding: 24 }}>
      {selectedDoctor && (
        <DoctorProfileModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
      )}

      <h2 style={{ marginTop: 0, marginBottom: 20 }}>Doctor Enrollment Requests</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 14px rgba(0,0,0,0.06)" }}>
          <thead>
            <tr style={{ background: "#1f2937", color: "#fff" }}>
              {["Name", "Email", "Specialization", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 14 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e, i) => {
              const name = `${e.firstName || ""} ${e.surname || ""}`.trim() || e.doctorId?.name || "—";
              const email = e.email || e.doctorId?.email || "—";
              const statusColor = { pending: "#d97706", approved: "#059669", rejected: "#dc2626" };
              return (
                <tr key={e._id} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "#fff" : "#f9fafb" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 500 }}>{name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#6b7280" }}>{email}</td>
                  <td style={{ padding: "12px 16px" }}>{e.specialization || "—"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: `${statusColor[e.approvalStatus]}20`, color: statusColor[e.approvalStatus], padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>
                      {e.approvalStatus}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      onClick={() => setSelectedDoctor(e)}
                      style={{ padding: "6px 14px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
                    >
                      View
                    </button>
                    {e.approvalStatus !== "approved" && (
                      <button
                        onClick={() => updateStatus(e._id, "approve")}
                        style={{ padding: "6px 14px", background: "#059669", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
                      >
                        Approve
                      </button>
                    )}
                    {e.approvalStatus !== "rejected" && (
                      <button
                        onClick={() => updateStatus(e._id, "reject")}
                        style={{ padding: "6px 14px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
                      >
                        Reject
                      </button>
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

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (!storedUser) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRes = await axios.get("http://localhost:5000/api/admin/stats");
        setTotalUsers(statsRes.data.totalUsers || 0);
        setTotalDoctors(statsRes.data.totalDoctors || 0);

        const activeRes = await axios.get("http://localhost:5000/api/admin/active-users");
        setActiveUsers(activeRes.data.activeUsers || 0);
      } catch (err) {
        console.log("Admin stats fetch error:", err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleActiveUsers = (count) => {
      setActiveUsers(count);
    };

    socket.on("active-users-count", handleActiveUsers);

    return () => {
      socket.off("active-users-count", handleActiveUsers);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    if (socket.connected) {
      socket.disconnect();
    }

    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  const renderMainContent = () => {
    if (activeMenu === "qna") return <QnAPage />;
    if (activeMenu === "manage-doctors") return <ManageDoctors />;

    return (
      <>
        <h2 className="admin-dashboard-title">Admin Dashboard</h2>

        <div className="admin-cards">
          <div className="admin-card">
            <h4>Total Users</h4>
            <h1>{totalUsers}</h1>
          </div>

          <div className="admin-card">
            <h4>Active Users (Live)</h4>
            <h1>{activeUsers}</h1>
          </div>

          <div className="admin-card">
            <h4>Total Doctors</h4>
            <h1>{totalDoctors}</h1>
          </div>

          <div className="admin-card">
            <h4>Total Appointments</h4>
            <h1>0</h1>
          </div>
        </div>

        <div className="admin-content-box">
          <h3>Welcome Admin 👋</h3>
          <p>
            This is your admin control panel. From here, you can manage users,
            doctors, appointments, questions, and platform content.
          </p>
        </div>

        <div className="admin-content-box" style={{ marginTop: "20px" }}>
          <h3>Quick Actions</h3>
          <p>Manage your platform efficiently with admin controls.</p>

          <div className="admin-actions">
            <button>View Users</button>
            <button>Manage Doctors</button>
            <button>Check Appointments</button>
            <button onClick={() => setActiveMenu("qna")}>Review Questions</button>
          </div>
        </div>
      </>
    );
  };

  if (!user) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "150px" }}>
        Please login first
      </h2>
    );
  }

  return (
    <div className="admin-dashboard-wrapper">
      {/* Fixed Top Header */}
      <header className="admin-top-header">
        <div className="admin-top-left">
          <h2>Humancare Admin</h2>
        </div>

        <div className="admin-top-right">
          <span className="admin-top-user">
            Welcome, {user.name}
          </span>
          <button className="admin-top-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="admin-dashboard">
        <div className="admin-sidebar">
          <div className="admin-profile-box">
            <div className="admin-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span className="admin-role-badge">Admin</span>
          </div>

          <ul className="admin-menu">
            <li
              className={activeMenu === "dashboard" ? "active" : ""}
              onClick={() => setActiveMenu("dashboard")}
            >
              Dashboard
            </li>

            <li
              className={activeMenu === "manage-users" ? "active" : ""}
              onClick={() => setActiveMenu("manage-users")}
            >
              Manage Users
            </li>

            <li
              className={activeMenu === "manage-doctors" ? "active" : ""}
              onClick={() => setActiveMenu("manage-doctors")}
            >
              Manage Doctors
            </li>

            <li
              className={activeMenu === "appointments" ? "active" : ""}
              onClick={() => setActiveMenu("appointments")}
            >
              Appointments
            </li>

            <li
              className={activeMenu === "qna" ? "active" : ""}
              onClick={() => setActiveMenu("qna")}
            >
              Medical Questions
            </li>

            <li
              className={activeMenu === "blogs" ? "active" : ""}
              onClick={() => setActiveMenu("blogs")}
            >
              Blogs
            </li>

            <li
              className={activeMenu === "settings" ? "active" : ""}
              onClick={() => setActiveMenu("settings")}
            >
              Settings
            </li>
          </ul>
        </div>

        <div className="admin-main-content">{renderMainContent()}</div>
      </div>
    </div>
  );
}