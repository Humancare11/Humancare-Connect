// src/components/ProtectedRoute.jsx
// Blocks access to routes based on login status and user role.
// Usage in App.jsx:
//   <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user  = JSON.parse(localStorage.getItem("user") || "null");

  // 1. Not logged in at all → send to /login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Logged in but wrong role → send to home
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // 3. All checks passed → render the page
  return children;
}