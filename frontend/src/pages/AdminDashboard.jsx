import React from "react";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard 🚀</h1>
      <p>Welcome, {user?.name}</p>

      <div style={{ marginTop: "20px" }}>
        <h3>Admin Controls</h3>
        <ul>
          <li>View Users</li>
          <li>Delete Users</li>
          <li>Manage Data</li>
        </ul>
      </div>
    </div>
  );
}