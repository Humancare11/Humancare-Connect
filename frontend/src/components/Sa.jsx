import React from "react";
import "./Sa.css";

const smallCards = [
  {
    id: "mental-health",
    icon: "🧠",
    title: "Mental Health",
    description:
      "Therapy, psychiatry, anxiety & depression treatment with licensed therapists and psychiatrists.",
    cta: "Get support →",
  },
  {
    id: "general-consultation",
    icon: "🩺",
    title: "General Consultation",
    description:
      "Sick visits, wellness checks, infections, minor injuries — same-day access to a doctor for whatever is on your mind.",
    cta: "See a doctor →",
  },
  {
    id: "sexual-health",
    icon: "❤️",
    title: "Sexual Health",
    description:
      "Confidential, judgment-free care for STI testing, ED, birth control, UTIs, and more.",
    cta: "Learn more →",
  },
  {
    id: "chronic-care",
    icon: "🫀",
    title: "Chronic Care",
    description:
      "Ongoing support for diabetes, hypertension, thyroid, and asthma with a dedicated care team.",
    cta: "Manage condition →",
  },
];

export default function ServicesSection() {
  return (
    <section className="services-section-wrapper">
      <div className="services-inner-container">

        {/* Section Header */}
        <div className="services-header-block">
          <span className="services-eyebrow-label">— SERVICES</span>
          <h2 className="services-main-heading">
            Everything you need,
            <br />
            <span className="services-heading-highlight">all in one place.</span>
          </h2>
        </div>

        {/* Top Row */}
        <div className="services-top-row-grid">

          {/* Featured Card – Prescription Refills */}
          <div className="services-feature-card services-card-item">
            <span className="services-feature-badge">MOST REQUESTED</span>
            <div className="services-feature-body">
              <div className="services-icon-box">💊</div>
              <h3 className="services-card-title">Prescription Refills</h3>
              <p className="services-card-description">
                Running low on medication? Fast-track refill from a licensed
                provider — often within the same day. No appointment required.
                Works even if you're between doctors.
              </p>
              <a href="#" className="services-card-cta-link">Request refill →</a>
            </div>
            <div className="services-feature-stats-panel">
              <div className="services-stat-box-item">
                <span className="services-stat-value-text">2 hrs</span>
                <span className="services-stat-label-text">Avg. processing time</span>
              </div>
              <div className="services-stat-box-item">
                <span className="services-stat-value-text">94%</span>
                <span className="services-stat-label-text">Same-day approval rate</span>
              </div>
            </div>
          </div>

          {/* Weight Loss Card */}
          <div className="services-weight-card services-card-item">
            <div className="services-icon-box services-icon-box--gold">⚖️</div>
            <h3 className="services-card-title">Weight Loss Programs</h3>
            <p className="services-card-description">
              Personalised plans including GLP-1 medications (Ozempic, Wegovy),
              lifestyle coaching, and monthly monitoring. Evidence-based,
              physician-supervised.
            </p>
            <div className="services-weight-stat-block">
              <span className="services-weight-stat-eyebrow">AVG. WEIGHT LOSS</span>
              <div className="services-weight-stat-row">
                <span className="services-weight-stat-number">15 lbs</span>
                <span className="services-weight-stat-period">/ 3 months</span>
              </div>
            </div>
            <a href="#" className="services-card-cta-link">Start program →</a>
          </div>

        </div>

        {/* Bottom Grid */}
        <div className="services-bottom-cards-grid">
          {smallCards.map((card) => (
            <div className="services-card-item services-small-card" key={card.id}>
              <div className="services-icon-box">{card.icon}</div>
              <h3 className="services-card-title">{card.title}</h3>
              <p className="services-card-description">{card.description}</p>
              <a href="#" className="services-card-cta-link">{card.cta}</a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}