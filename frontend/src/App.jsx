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
import BookAppointment from "./pages/BookAppointment";
import VideoCall from "./pages/VideoCall";
import socket from "./socket";

import DoctorRegister from "./pages/doctors/DoctorRegister";
import DoctorLogin from "./pages/doctors/DoctorLogin";
import DoctorDashboard from "./pages/doctors/DoctorDashboard";
import DoctorEnrollments from "./pages/doctors/DoctorEnrollments";

// User imports
import UserLayout from "./pages/user/UserLayout";
import Dashboard from "./pages/user/Dashboard";
import Appointments from "./pages/user/Appointments";
import MedicalQuestions from "./pages/user/MedicalQuestions";
import FavouriteDoctors from "./pages/user/FavouriteDoctors";
import LabAppointments from "./pages/user/LabAppointments";
import ProfileSettings from "./pages/user/ProfileSettings";
import ChangePassword from "./pages/user/ChangePassword";

// Admin imports
import AdminDashboard from "./pages/admin/AdminDashboard";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import AdminAuth from "./pages/admin/AdminAuth";

// Private Route component for admin authentication
function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("adminToken");
  const user = JSON.parse(localStorage.getItem("adminUser") || "null");

  if (!token || !user) {
    return <Navigate to="/adminauth" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/adminauth" replace />;
  }

  return children;
}

function AppLayout() {
  const location = useLocation();

  // Hide header/footer on these routes
  const hideLayout =
    location.pathname.startsWith("/doctor-dashboard") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/superadmin") ||
    location.pathname.startsWith("/user") ||
    location.pathname.startsWith("/video-call");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser?._id) {
      if (!socket.connected) socket.connect();

      socket.emit("user-online", {
        userId: storedUser._id,
        role: storedUser.role,
      });
    }
  }, []);

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>
        {/* Public Routes */}
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
        <Route path="/book-appointment" element={<BookAppointment />} />

        {/* User Routes */}
        <Route
          path="/user/dashboard"
          element={
            <UserLayout>
              <Dashboard />
            </UserLayout>
          }
        />
        <Route
          path="/user/appointments"
          element={
            <UserLayout>
              <Appointments />
            </UserLayout>
          }
        />
        <Route
          path="/user/medical-questions"
          element={
            <UserLayout>
              <MedicalQuestions />
            </UserLayout>
          }
        />
        <Route
          path="/user/favourite-doctors"
          element={
            <UserLayout>
              <FavouriteDoctors />
            </UserLayout>
          }
        />
        <Route
          path="/user/lab-appointments"
          element={
            <UserLayout>
              <LabAppointments />
            </UserLayout>
          }
        />
        <Route
          path="/user/profile-settings"
          element={
            <UserLayout>
              <ProfileSettings />
            </UserLayout>
          }
        />
        <Route
          path="/user/change-password"
          element={
            <UserLayout>
              <ChangePassword />
            </UserLayout>
          }
        />
        <Route path="/profile" element={<Navigate to="/user/dashboard" replace />} />

        {/* Doctor Routes */}
        <Route path="/doctor-enrollments" element={<DoctorEnrollments />} />
        <Route path="/doctor-register" element={<DoctorRegister />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

        {/* Video Call Route (Header/Footer Hidden) */}
        <Route path="/video-call/:appointmentId" element={<VideoCall />} />

        {/* Admin Routes */}
        <Route path="/adminauth" element={<AdminAuth />} />

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