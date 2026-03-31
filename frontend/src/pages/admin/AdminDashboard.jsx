import { useEffect, useState } from "react";
import "./admindashboard.css";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (!user) {
    return <h2 style={{ textAlign: "center", marginTop: "150px" }}>Please login first</h2>;
  }

  return (
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
          <li className="active">Dashboard</li>
          <li>Manage Users</li>
          <li>Manage Doctors</li>
          <li>Appointments</li>
          <li>Medical Questions</li>
          <li>Blogs</li>
          <li>Settings</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      <div className="admin-main-content">
        <h2 className="admin-dashboard-title">Admin Dashboard</h2>

        <div className="admin-cards">
          <div className="admin-card">
            <h4>Total Users</h4>
            <h1>0</h1>
          </div>

          <div className="admin-card">
            <h4>Total Doctors</h4>
            <h1>0</h1>
          </div>

          <div className="admin-card">
            <h4>Total Appointments</h4>
            <h1>0</h1>
          </div>

          <div className="admin-card">
            <h4>Pending Queries</h4>
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
            <button>Review Questions</button>
          </div>
        </div>
      </div>
    </div>
  );
}