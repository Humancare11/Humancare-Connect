import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./header.css";

export default function Header() {
  const pillRef = useRef(null);
  const itemRefs = useRef([]);
  const location = useLocation();

  const [hovered, setHovered] = useState(null);
  const [active, setActive] = useState(0);

  const navItems = [
    { label: "Find a Doctor", link: "/find-a-doctor" },
    { label: "Ask a Question", link: "/ask-a-question" },
    { label: "Medical Services", link: "/medical-services" },
    { label: "Corporates", link: "/corporates" },
    { label: "Blogs", link: "/blogs" },
  ];

  // ✅ AUTO ACTIVE BASED ON URL
  useEffect(() => {
    const index = navItems.findIndex(
      (item) => item.link === location.pathname
    );
    if (index !== -1) {
      setActive(index);
    }
  }, [location.pathname]);

  const currentIndex = hovered !== null ? hovered : active;

  useEffect(() => {
    const pill = pillRef.current;
    const currentItem = itemRefs.current[currentIndex];

    if (pill && currentItem) {
      pill.style.width = currentItem.offsetWidth + "px";
      pill.style.left = currentItem.offsetLeft + "px";
    }
  }, [currentIndex]);

  return (
    <header className="glass-header">
      <div className="nav-container">
<a href="/">
  <div class="logo">Humancare</div>
</a>


        <nav
          className="nav-menu"
          onMouseLeave={() => setHovered(null)}
        >
          <span className="pill" ref={pillRef}></span>

          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`nav-item ${
                currentIndex === index ? "active" : ""
              }`}
              onMouseEnter={() => setHovered(index)}
              onClick={() => setActive(index)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#" className="register">Book Appointment</a>
      </div>
    </header>
  );
}