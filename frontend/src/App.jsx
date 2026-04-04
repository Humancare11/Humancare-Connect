// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

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
import AdminDashboard from "./pages/admin/AdminDashboard";
import QnAPage from "./pages/admin/QnAPage";
import { QnAProvider } from "./pages/admin/QnAContext";
import socket from "./socket";
import DoctorRegister from "./pages/doctors/DoctorRegister";
import DoctorLogin from "./pages/doctors/DoctorLogin";
import DoctorDashboard from "./pages/doctors/DoctorDashboard";

import DoctorEnrollments from "./pages/doctors/DoctorEnrollments";

function AppLayout() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/admin" || location.pathname === "/qnapage";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser?._id) {
      if (!socket.connected) {
        socket.connect();
      }
      socket.emit("user-online", {
        userId: storedUser._id,
        role: storedUser.role,
      });
    }
  }, []);

  return (
    <QnAProvider>
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

        <Route path="/doctor-enrollments" element={<DoctorEnrollments />} />
        <Route path="/doctor-registration" element={<DoctorRegister />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        {/* <Route path="/doctor-dashboard" element={
  <ProtectedRoute role="doctor">
    <DoctorDashboard />
  </ProtectedRoute>
} /> */}
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

        {/* Admin-only routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qnapage"
          element={
            <ProtectedRoute role="admin">
              <QnAPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!hideLayout && <Footer />}
    </QnAProvider>
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
