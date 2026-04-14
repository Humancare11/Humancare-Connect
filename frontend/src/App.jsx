// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Findadoctor from "./pages/Findadoctor";
import AskDoctor from "./pages/AskDoctor";
import Services from "./pages/Services";
import Blogs from "./pages/Blogs/Blogs";
import Corporates from "./pages/Corporates";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import BookAppointment from "./pages/BookAppointment";
import socket from "./socket";

import DoctorRegister from "./pages/doctors/DoctorRegister";
import DoctorLogin from "./pages/doctors/DoctorLogin";
import DoctorDashboard from "./pages/doctors/DoctorDashboard";
import DoctorEnrollments from "./pages/doctors/DoctorEnrollments";

// Admin imports

import AdminDashboard from "./pages/admin/AdminDashboard";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import AdminAuth from "./pages/admin/AdminAuth";

// Private Route component for admin authentication
function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("adminToken");
  const user = JSON.parse(localStorage.getItem("adminUser") || "null");
  if (!token || !user) return <Navigate to="/admin-login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/admin-login" replace />;
  return children;
}

function AppLayout() {
  const location = useLocation();

  const hideLayout = location.pathname.startsWith("/doctor-dashboard") || 
                     location.pathname.startsWith("/admin") ||
                     location.pathname.startsWith("/superadmin");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?._id) {
      if (!socket.connected) socket.connect();
      socket.emit("user-online", { userId: storedUser._id, role: storedUser.role });
    }
  }, []);

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/find-a-doctor" element={<Findadoctor />} />
        <Route path="/ask-a-question" element={<AskDoctor />} />
        <Route path="/medical-services" element={<Services />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/corporates" element={<Corporates />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/book-appointment" element={<BookAppointment />} />

        {/* Doctor routes */}
        <Route path="/doctor-enrollments" element={<DoctorEnrollments />} />
        <Route path="/doctor-register" element={<DoctorRegister />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

        {/* Admin routes */}
        <Route path="/adminauth" element={<AdminAuth/>} />


        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute allowedRoles={["admin", "superadmin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/superadmin-dashboard"
          element={
            <PrivateRoute allowedRoles={["superadmin"]}>
              <SuperAdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
