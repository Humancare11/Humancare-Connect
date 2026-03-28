import { useState } from "react";
import "./Aa.css";

export default function SpecialtiesSection() {
  const [activeTab, setActiveTab] = useState("specialties");

  const specialties = [
    { icon: "🫀", name: "Cardiology", count: "48 doctors" },
    { icon: "🧠", name: "Neurology", count: "32 doctors" },
    { icon: "🌿", name: "Mental Health", count: "76 doctors" },
    { icon: "🧒", name: "Pediatrics", count: "41 doctors" },
    { icon: "🦴", name: "Orthopedics", count: "29 doctors" },
    { icon: "👁️", name: "Ophthalmology", count: "22 doctors" },
    { icon: "🩺", name: "Primary Care", count: "98 doctors" },
    { icon: "💊", name: "Dermatology", count: "35 doctors" },
  ];

  const symptoms = [
    { icon: "🤒", name: "Fever", count: "120 doctors" },
    { icon: "🤕", name: "Headache", count: "95 doctors" },
    { icon: "😷", name: "Cold & Cough", count: "110 doctors" },
    { icon: "💔", name: "Chest Pain", count: "60 doctors" },
    { icon: "🦵", name: "Joint Pain", count: "70 doctors" },
    { icon: "👀", name: "Eye Problems", count: "40 doctors" },
    { icon: "🧠", name: "Stress", count: "85 doctors" },
    { icon: "🩹", name: "Skin Issues", count: "55 doctors" },
  ];

  const data = activeTab === "specialties" ? specialties : symptoms;

  return (
    <section className="section spec-section" id="specialties">
      <div className="spec-header">
        <div>
          <div className="section-eyebrow">Specialties</div>
          <h2 className="section-title">
            Care for every <br /> part of you.
          </h2>
        </div>

        <div className="tabs">
          <button
            className={activeTab === "specialties" ? "tab active" : "tab"}
            onClick={() => setActiveTab("specialties")}
          >
            Specialties
          </button>
          <button
            className={activeTab === "symptoms" ? "tab active" : "tab"}
            onClick={() => setActiveTab("symptoms")}
          >
            Symptoms
          </button>
        </div>
      </div>

      <div className="spec-grid">
        {data.map((item, index) => (
          <div className="spec-card reveal" key={index}>
            <span className="s-icon">{item.icon}</span>
            <span className="s-name">{item.name}</span>
            <span className="s-count">{item.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}