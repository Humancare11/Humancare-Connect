import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../../socket";
import QnAPage from "./QnAPage";
import "./admindashboard.css";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
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
    if (activeMenu === "qna") {
      return <QnAPage />;
    }

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
            <h1>0</h1>
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