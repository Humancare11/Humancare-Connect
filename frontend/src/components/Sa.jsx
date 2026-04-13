import React from "react";
import "./Sa.css";
import {
  FaBrain,
  FaStethoscope,
  FaHeart,
  FaHeartbeat,
  FaPills,
  FaBalanceScale,
} from "react-icons/fa";

const smallCards = [
  {
    id: "mental-health",
    icon: FaBrain,
    title: "Mental Health",
    description:
      "Therapy, psychiatry, anxiety & depression treatment with licensed therapists and psychiatrists.",
    cta: "Get support →",
  },
  {
    id: "general-consultation",
    icon: FaStethoscope,
    title: "General Consultation",
    description:
      "Sick visits, wellness checks, infections, minor injuries — same-day access to a doctor for whatever is on your mind.",
    cta: "See a doctor →",
  },
  {
    id: "sexual-health",
    icon: FaHeart,
    title: "Sexual Health",
    description:
      "Confidential, judgment-free care for STI testing, ED, birth control, UTIs, and more.",
    cta: "Learn more →",
  },
  {
    id: "chronic-care",
    icon: FaHeartbeat,
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
            <span className="services-heading-highlight">
              all in one place.
            </span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="services-bento-grid">
          <div className="services-card-item services-bento-large">
            <span className="services-feature-badge">MOST REQUESTED</span>
            <div className="services-icon-box">
              <FaPills />
            </div>
            <div className="services-content-split">
              {/* Left Side - Title and Description */}
              <div className="services-content-left">
                <h3 className="services-card-title">Prescription Refills</h3>
                <p className="services-card-description">
                  Running low on medication? Fast-track refill from a licensed
                  provider — often within the same day. No appointment required.
                  Works even if you're between doctors.
                </p>
              </div>

              {/* Right Side - Stats */}
              <div className="services-content-right">
                <div className="services-stat-mini">
                  <span className="services-stat-value-text">2 hrs</span>
                  <span className="services-stat-label-text">Avg. time</span>
                </div>
                <div className="services-stat-mini">
                  <span className="services-stat-value-text">94%</span>
                  <span className="services-stat-label-text">Same-day</span>
                </div>
              </div>
            </div>

            <a href="#" className="services-card-cta-link">
              Request refill →
            </a>
          </div>
          {/* Weight Loss Card - First */}
          <div className="services-card-item services-bento-small-weightloss">
            <div className="services-icon-box services-icon-box--gold">
              <FaBalanceScale />
            </div>
            <h3 className="services-card-title">Weight Loss Programs</h3>
            <p className="services-card-description">
              Personalised plans including GLP-1 medications (Ozempic, Wegovy),
              lifestyle coaching, and monthly monitoring.
            </p>
            <div className="services-weight-stat-block">
              <span className="services-weight-stat-eyebrow">
                AVG. WEIGHT LOSS
              </span>
              <div className="services-weight-stat-row">
                <span className="services-weight-stat-number">15 lbs</span>
                <span className="services-weight-stat-period">/ 3 months</span>
              </div>
            </div>
            <a href="#" className="services-card-cta-link">
              Start program →
            </a>
          </div>

          {/* Row 1: Featured Card – Prescription Refills (LARGE 3x2) + Weight Loss (TALL 2x2) + Mental Health (SMALL 2x1) */}
          <div className="services-card-item services-bento-large">
            <span className="services-feature-badge">MOST REQUESTED</span>
            <div className="services-icon-box">
              <FaPills />
            </div>
            <div className="services-content-split">
              {/* Left Side - Title and Description */}
              <div className="services-content-left">
                <h3 className="services-card-title">Prescription Refills</h3>
                <p className="services-card-description">
                  Running low on medication? Fast-track refill from a licensed
                  provider — often within the same day. No appointment required.
                  Works even if you're between doctors.
                </p>
              </div>

              {/* Right Side - Stats */}
              <div className="services-content-right">
                <div className="services-stat-mini">
                  <span className="services-stat-value-text">2 hrs</span>
                  <span className="services-stat-label-text">Avg. time</span>
                </div>
                <div className="services-stat-mini">
                  <span className="services-stat-value-text">94%</span>
                  <span className="services-stat-label-text">Same-day</span>
                </div>
              </div>
            </div>

            <a href="#" className="services-card-cta-link">
              Request refill →
            </a>
          </div>

          {/* Mental Health - SMALL (2x1) */}
          <div className="services-card-item services-bento-smal-1">
            <div className="services-icon-box">
              <FaBrain />
            </div>
            <h3 className="services-card-title">Mental Health</h3>
            <p className="services-card-description">
              Professional therapy, psychiatry, and counseling for anxiety,
              depression, and stress management.
            </p>
            <a href="#" className="services-card-cta-link">
              Get support →
            </a>
          </div>
          <div className="services-card-item services-bento-wide">
            <div className="services-icon-box">
              <FaHeartbeat />
            </div>
            <h3 className="services-card-title">Chronic Care</h3>
            <p className="services-card-description">
              Ongoing support for diabetes, hypertension, thyroid, and asthma
              with a dedicated care team.
            </p>
            <a href="#" className="services-card-cta-link">
              Manage condition →
            </a>
          </div>

          {/* Row 2: General Consultation (SMALL 2x1) + Sexual Health (SMALL 2x1) */}
          <div className="services-card-item services-bento-small">
            <div className="services-icon-box">
              <FaStethoscope />
            </div>
            <h3 className="services-card-title">General Consultation</h3>
            <p className="services-card-description">
              Sick visits, wellness checks, infections, minor injuries. Same-day
              access to a doctor.
            </p>
            <a href="#" className="services-card-cta-link">
              See a doctor →
            </a>
          </div>

          {/* Sexual Health - SMALL (2x1) */}
          <div className="services-card-item services-bento-small">
            <div className="services-icon-box">
              <FaHeart />
            </div>
            <h3 className="services-card-title">Sexual Health</h3>
            <p className="services-card-description">
              Confidential, judgment-free care for STI testing, ED, birth
              control, and more.
            </p>
            <a href="#" className="services-card-cta-link">
              Learn more →
            </a>
          </div>
          {/* <div className="services-card-item services-bento-wide">
            <div className="services-icon-box">
              <FaHeartbeat />
            </div>
            <h3 className="services-card-title">Chronic Care</h3>
            <p className="services-card-description">
              Ongoing support for diabetes, hypertension, thyroid, and asthma
              with a dedicated care team.
            </p>
            <a href="#" className="services-card-cta-link">
              Manage condition →
            </a>
          </div> */}
        </div>
      </div>
    </section>
  );
}
