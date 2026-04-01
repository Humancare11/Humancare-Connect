import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AdminDashboard from "./pages/admin/AdminDashboard";
import socket from "./socket";
import QnAPage from "./pages/admin/QnAPage";
import { QnAProvider } from "./pages/admin/QnAContext"; // ✅ named import — NOT default

function App() {
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
    <BrowserRouter>
      {/*
        ✅ QnAProvider wraps everything so that AskDoctor (/ask-a-question)
           and QnAPage (/qnapage) share the same questions state.
           Questions posted on AskDoctor will appear on QnAPage immediately.
           localStorage inside QnAContext also persists across page refreshes.
      */}
      <QnAProvider>
        <Header />

        <Routes>
          <Route path="/"                 element={<Home />} />
          <Route path="/about"            element={<About />} />
          <Route path="/find-a-doctor"    element={<Findadoctor />} />
          <Route path="/ask-a-question"   element={<AskDoctor />} />
          <Route path="/medical-services" element={<Services />} />
          <Route path="/blogs"            element={<Blogs />} />
          <Route path="/corporates"       element={<Corporates />} />
          <Route path="/contact"          element={<Contact />} />
          <Route path="/privacy"          element={<Privacy />} />
          <Route path="/terms"            element={<Terms />} />
          <Route path="/login"            element={<Login />} />
          <Route path="/register"         element={<Register />} />
          <Route path="/profile"          element={<Profile />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/admin"            element={<AdminDashboard />} />
          <Route path="/qnapage"          element={<QnAPage />} />
        </Routes>

        <Footer />
      </QnAProvider>
    </BrowserRouter>
  );
}

export default App;