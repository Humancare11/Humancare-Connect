import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import socket from "../../socket";
import "./user.css";

export default function UserLayout({ children }) {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) { navigate("/login"); return; }
    setUser(storedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (socket.connected) socket.disconnect();
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  const menuItems = [
    { path: "/user/dashboard",         label: "Dashboard",          icon: "🏠" },
    { path: "/user/appointments",      label: "Appointments",       icon: "📅" },
    { path: "/user/medical-questions", label: "Medical Questions",  icon: "❓" },
    { path: "/user/favourite-doctors", label: "Favourite Doctors",  icon: "❤️" },
    { path: "/user/lab-appointments",  label: "Lab Appointments",   icon: "🧪" },
    { path: "/user/profile-settings",  label: "Profile Settings",   icon: "⚙️" },
    { path: "/user/change-password",   label: "Change Password",    icon: "🔒" },
  ];

  // Current page label for topbar
  const currentPage = menuItems.find((m) => m.path === location.pathname);

  if (!user) {
    return (
      <div className="hc-ul__loader">
        <div className="hc-ul__loader-spinner" />
      </div>
    );
  }

  return (
    <div className="hc-ul__page">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="hc-ul__overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`hc-ul__sidebar ${sidebarOpen ? "hc-ul__sidebar--open" : ""}`}>

        {/* Brand */}
        <div className="hc-ul__brand">
          <div className="hc-ul__brand-dot" />
          <span className="hc-ul__brand-name">HumaniCare</span>
        </div>

        {/* Profile */}
        <div className="hc-ul__profile">
          <div className="hc-ul__avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hc-ul__profile-info">
            <h4 className="hc-ul__profile-name">{user.name}</h4>
            <p className="hc-ul__profile-email">{user.email}</p>
          </div>
          <span className="hc-ul__profile-badge">Patient</span>
        </div>

        {/* Nav */}
        <nav className="hc-ul__nav">
          <p className="hc-ul__nav-section-label">Main Menu</p>
          {menuItems.slice(0, 2).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`hc-ul__nav-item ${location.pathname === item.path ? "hc-ul__nav-item--active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="hc-ul__nav-icon">{item.icon}</span>
              <span className="hc-ul__nav-label">{item.label}</span>
              {location.pathname === item.path && (
                <span className="hc-ul__nav-active-dot" />
              )}
            </Link>
          ))}

          <p className="hc-ul__nav-section-label">Health</p>
          {menuItems.slice(2, 5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`hc-ul__nav-item ${location.pathname === item.path ? "hc-ul__nav-item--active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="hc-ul__nav-icon">{item.icon}</span>
              <span className="hc-ul__nav-label">{item.label}</span>
              {location.pathname === item.path && (
                <span className="hc-ul__nav-active-dot" />
              )}
            </Link>
          ))}

          <p className="hc-ul__nav-section-label">Account</p>
          {menuItems.slice(5).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`hc-ul__nav-item ${location.pathname === item.path ? "hc-ul__nav-item--active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="hc-ul__nav-icon">{item.icon}</span>
              <span className="hc-ul__nav-label">{item.label}</span>
              {location.pathname === item.path && (
                <span className="hc-ul__nav-active-dot" />
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <button className="hc-ul__logout" onClick={handleLogout}>
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </aside>

      {/* ── Main ── */}
      <div className="hc-ul__main">

        {/* Topbar */}
        <header className="hc-ul__topbar">
          {/* Mobile burger */}
          <button
            className="hc-ul__burger"
            onClick={() => setSidebarOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>

          <div className="hc-ul__topbar-left">
            <p className="hc-ul__topbar-eyebrow">HumaniCare</p>
            <h1 className="hc-ul__topbar-title">
              {currentPage?.icon} {currentPage?.label || "Dashboard"}
            </h1>
          </div>

          <div className="hc-ul__topbar-right">
            <Link to="/find-a-doctor" className="hc-ul__topbar-book">
              + Book Appointment
            </Link>
            <div className="hc-ul__topbar-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="hc-ul__content">
          {children}
        </main>
      </div>
    </div>
  );
}