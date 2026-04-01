import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import "./profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (!storedUser) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (socket.connected) {
      socket.disconnect();
    }

    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  if (!user) {
    return <h2 style={{ textAlign: "center" }}>Please login first</h2>;
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="profile-box">
          <div className="avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>

        <ul className="menu">
          <li className="active">Dashboard</li>
          <li>Appointments</li>
          <li>Medical Questions</li>
          <li>Favourite Doctors</li>
          <li>Lab Appointments</li>
          <li>Profile Settings</li>
          <li>Change Password</li>
          <li
            onClick={handleLogout}
            style={{ cursor: "pointer", color: "red" }}
          >
            Logout
          </li>
        </ul>
      </div>

      <div className="main-content">
        <h2 className="dashboard-title">Dashboard</h2>

        <div className="cards">
          <div className="card">
            <h4>Pending Appointments</h4>
            <h1>0</h1>
          </div>

          <div className="card">
            <h4>Completed Appointments</h4>
            <h1>0</h1>
          </div>

          <div className="card">
            <h4>Total Doctors Consulted</h4>
            <h1>0</h1>
          </div>
        </div>

        <div className="content-box">
          <h3>Welcome 👋</h3>
          <p>
            Your dashboard is ready. You can add appointments, reports, and more features here.
          </p>
        </div>
      </div>
    </div>
  );
}