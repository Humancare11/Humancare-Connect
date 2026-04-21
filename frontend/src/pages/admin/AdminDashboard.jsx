import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QnAPage from "./QnAPage";
import "./Dashboard.css";

/* ── User Profile Modal ── */
function UserProfileModal({ user, onClose }) {
  if (!user) return null;

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
            <div style={{ fontSize: 18, fontWeight: 700 }}>{user.name}</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>{user.email}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ background: "#05966925", color: "#059669", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
              User
            </span>
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#9ca3af", fontSize: 22, cursor: "pointer" }}>✕</button>
          </div>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <p style={{ fontWeight: 700, color: "#374151", marginBottom: 8, marginTop: 0 }}>Personal Details</p>
          {row("Email", user.email)}
          {row("Mobile", user.mobile)}
          {row("Gender", user.gender)}
          {row("Date of Birth", user.dob)}
          {row("Role", user.role)}
          {row("Account Created", new Date(user.createdAt).toLocaleDateString())}
          {row("Last Updated", new Date(user.updatedAt).toLocaleDateString())}
        </div>
      </div>
    </div>
  );
}

/* ── Manage Users Component ── */
function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("adminToken");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(user => user._id !== userId));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="dash-section">
        <h2 className="dash-section-title">Manage Users</h2>
        <div style={{ textAlign: "center", padding: "40px" }}>Loading users...</div>
      </div>
    );
  }

  return (
    <div className="dash-section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 className="dash-section-title">Manage Users ({filteredUsers.length})</h2>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: 6,
            width: 300,
            fontSize: 14
          }}
        />
      </div>

      <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", fontSize: 14 }}>Name</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", fontSize: 14 }}>Email</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", fontSize: 14 }}>Mobile</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", fontSize: 14 }}>Gender</th>
              <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", fontSize: 14 }}>Joined</th>
              <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#374151", fontSize: 14 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} style={{ borderBottom: "1px solid #f3f4f6", hover: { background: "#f9fafb" } }}>
                <td style={{ padding: "12px 16px", fontSize: 14, color: "#111827" }}>{user.name}</td>
                <td style={{ padding: "12px 16px", fontSize: 14, color: "#6b7280" }}>{user.email}</td>
                <td style={{ padding: "12px 16px", fontSize: 14, color: "#6b7280" }}>{user.mobile || "—"}</td>
                <td style={{ padding: "12px 16px", fontSize: 14, color: "#6b7280" }}>{user.gender || "—"}</td>
                <td style={{ padding: "12px 16px", fontSize: 14, color: "#6b7280" }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <button
                    onClick={() => setSelectedUser(user)}
                    style={{
                      background: "#3b82f6",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 4,
                      fontSize: 12,
                      cursor: "pointer",
                      marginRight: 8
                    }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id, user.name)}
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 4,
                      fontSize: 12,
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            {searchTerm ? "No users found matching your search." : "No users registered yet."}
          </div>
        )}
      </div>

      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}

/* ── Admin Appointments Component ── */
function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/appointments/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => {
        console.error("Failed to load appointments", err);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <div className="dash-section"><h2 className="dash-section-title">Appointments</h2><p>Loading appointments...</p></div>;
  }

  if (!appointments.length) {
    return <div className="dash-section"><h2 className="dash-section-title">Appointments</h2><p>No appointments yet.</p></div>;
  }

  const statusColor = { pending: "#d97706", confirmed: "#059669", completed: "#10b981", cancelled: "#dc2626" };

  return (
    <div className="dash-section">
      <h2 className="dash-section-title">All Appointments</h2>
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              {['Patient', 'Doctor', 'Date', 'Time', 'Problem', 'Status'].map((label) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, i) => (
              <tr key={appointment._id} className={i % 2 === 0 ? "" : "alt"}>
                <td>{appointment.patientId?.name || 'Unknown'}</td>
                <td>{appointment.doctorId?.name || 'Unassigned'}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.problem || '—'}</td>
                <td>
                  <span className="status-badge" style={{ background: `${statusColor[appointment.status]}18`, color: statusColor[appointment.status] }}>
                    {appointment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/doctors`, { headers })
      .then((res) => setEnrollments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = (id, action) => {
    axios.put(`${import.meta.env.VITE_API_URL}/api/admin/doctors/${id}/${action}`, {}, { headers })
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

/* ── Support Tickets Component ── */
function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolution, setResolution] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/tickets/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveTicket = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/tickets/${id}/resolve`, {
        resolution,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedTicket(null);
      setResolution('');
      fetchTickets();
    } catch (error) {
      console.error('Error resolving ticket:', error);
    }
  };

  if (loading) return <div className="dash-section"><p>Loading tickets...</p></div>;

  return (
    <div className="dash-section">
      <h2 className="dash-section-title">Support Tickets</h2>
      <div className="tickets-list">
        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-item">
              <div className="ticket-header">
                <h3>{ticket.title}</h3>
                <span className={`ticket-status ${ticket.status}`}>{ticket.status}</span>
              </div>
              <p className="ticket-doctor">By: {ticket.createdBy.name} ({ticket.createdBy.email})</p>
              <p className="ticket-description">{ticket.description}</p>
              <p className="ticket-date">Created: {new Date(ticket.createdAt).toLocaleDateString()}</p>
              {ticket.status === 'resolved' && ticket.resolution && (
                <div className="ticket-resolution">
                  <strong>Resolution:</strong> {ticket.resolution}
                  <p>Resolved by: {ticket.resolvedBy?.name} on {new Date(ticket.updatedAt).toLocaleDateString()}</p>
                </div>
              )}
              {ticket.status === 'open' && (
                <button onClick={() => setSelectedTicket(ticket)}>Resolve</button>
              )}
            </div>
          ))
        )}
      </div>
      {selectedTicket && (
        <div className="modal">
          <div className="modal-content">
            <h3>Resolve Ticket: {selectedTicket.title}</h3>
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Enter resolution details..."
              rows="5"
            />
            <div className="modal-actions">
              <button onClick={() => resolveTicket(selectedTicket._id)}>Submit</button>
              <button onClick={() => { setSelectedTicket(null); setResolution(''); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
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
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setStats((s) => ({ ...s, totalUsers: res.data.totalUsers || 0, totalDoctors: res.data.totalDoctors || 0 })))
      .catch(() => { });
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/active-users`)
      .then((res) => setStats((s) => ({ ...s, activeUsers: res.data.activeUsers || 0 })))
      .catch(() => { });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  const renderContent = () => {
    if (activeMenu === "manage-doctors") return <ManageDoctors />;
    if (activeMenu === "manage-users") return <ManageUsers />;
    if (activeMenu === "appointments") return <AdminAppointments />;
    if (activeMenu === "qna") return <QnAPage />;
    if (activeMenu === "tickets") return <SupportTickets />;
    return (
      <div className="dash-section">
        <h2 className="dash-section-title">Admin Dashboard</h2>
        <div className="dash-cards">
          {[
            { label: "Total Users", value: stats.totalUsers },
            { label: "Active Users", value: stats.activeUsers },
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
    { key: "tickets", label: "Support Tickets" },
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
            <button className="dash-nav-item" onClick={() => navigate("/superadmin-dashboard")}>
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
