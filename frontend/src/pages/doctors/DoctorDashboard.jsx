import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Doctor.css";
import Dashbord from "./Dashbord";
import DoctorEnrollments from "./DoctorEnrollments";

const Ico = {
  Logout: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Bell: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
};

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [enrollmentData, setEnrollmentData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("doctorToken");
    const currentDoctor = JSON.parse(localStorage.getItem("currentDoctor") || "null");

    if (!token || !currentDoctor) {
      navigate("/doctor-login");
      return;
    }

    setDoctor(currentDoctor);

    // Fetch enrollment from backend
    fetch(`/api/doctor/enrollment/${currentDoctor.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((enrollment) => {
        if (enrollment) {
          setIsEnrolled(true);
          setEnrollmentData(enrollment);
          const updated = { ...currentDoctor, isEnrolled: true };
          localStorage.setItem("currentDoctor", JSON.stringify(updated));
          setDoctor(updated);
        } else {
          setIsEnrolled(currentDoctor.isEnrolled || false);
        }
      })
      .catch(() => {
        setIsEnrolled(currentDoctor.isEnrolled || false);
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("currentDoctor");
    localStorage.removeItem("doctorToken");
    navigate("/doctor-login");
  };

  const handleEnrollmentComplete = (data) => {
    const updatedDoctor = { ...doctor, isEnrolled: true };
    setDoctor(updatedDoctor);
    setIsEnrolled(true);
    setEnrollmentData(data);
    localStorage.setItem("currentDoctor", JSON.stringify(updatedDoctor));
  };

  if (!doctor) return null;

  const initials = doctor.name
    ? doctor.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "DR";

  const renderContent = () => {
    if (!isEnrolled) {
      return <DoctorEnrollments onComplete={handleEnrollmentComplete} initialData={enrollmentData} doctorId={doctor.id} />;
    }

    switch (activeMenu) {
      case "Dashboard":
        return <Dashbord />;
      case "Enrollments":
        return <DoctorEnrollments onComplete={handleEnrollmentComplete} initialData={enrollmentData} doctorId={doctor.id} />;
      case "Appointments":
        return <div className="dd-card"><h2 className="dd-card-title">Appointments</h2><p>No upcoming appointments.</p></div>;
      case "My Patients":
        return <div className="dd-card"><h2 className="dd-card-title">My Patients</h2><p>You have no patients yet.</p></div>;
      case "Messages":
        return <div className="dd-card"><h2 className="dd-card-title">Messages</h2><p>No new messages.</p></div>;
      case "Analytics":
        return <div className="dd-card"><h2 className="dd-card-title">Analytics</h2><p>Analytics will be available once you have patient data.</p></div>;
      case "Settings":
        return <div className="dd-card"><h2 className="dd-card-title">Settings</h2><p>Manage your account settings here.</p></div>;
      default:
        return <Dashbord />;
    }
  };

  const menuItems = [
    { icon: "🏠", label: "Dashboard" },
    { icon: "📝", label: "Enrollments" },
    { icon: "📅", label: "Appointments" },
    { icon: "👥", label: "My Patients" },
    { icon: "💬", label: "Messages" },
    { icon: "📊", label: "Analytics" },
    { icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className="dd-page">
      <aside className={`dd-sidebar${sideOpen ? " open" : ""}`}>
        <div className="dd-sidebar-brand">
          <div className="dr-brand-mark">H</div>
          <span className="dr-brand-name">HumaniCare</span>
        </div>

        <nav className="dd-nav">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`dd-nav-item${activeMenu === item.label ? " active" : ""}`}
              onClick={() => isEnrolled && setActiveMenu(item.label)}
              style={{ opacity: isEnrolled ? 1 : 0.5, cursor: isEnrolled ? 'pointer' : 'not-allowed' }}
              disabled={!isEnrolled}
            >
              <span className="dd-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="dd-logout" onClick={logout}>
          <Ico.Logout /> Logout
        </button>
      </aside>

      <main className="dd-main">
        <header className="dd-topbar">
          <div className="dd-topbar-left">
            <button
              className="dd-hamburger"
              onClick={() => setSideOpen((p) => !p)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <div>
              <div className="dd-greeting">Welcome,</div>
              <div className="dd-greeting-name">{doctor.name || "Doctor"} 👋</div>
            </div>
          </div>

          <div className="dd-topbar-right">
            <button className="dd-icon-btn">
              <Ico.Bell />
              <span className="dd-notif-dot" />
            </button>
            <div className="dd-topbar-avatar">{initials}</div>
          </div>
        </header>

        <div className="dd-content">
          {!isEnrolled && (
            <div style={{ marginBottom: '2rem', padding: '1rem', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', color: '#92400e', fontSize: '0.875rem' }}>
              <strong>Action Required:</strong> Please complete your enrollment form to access all dashboard features.
            </div>
          )}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
