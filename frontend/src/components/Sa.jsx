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
          {/* Large Card — Prescription Refills */}
          <div className="services-card-item services-bento-large">
            <div className="services-icon-box"> 
              <FaPills />
              <span className="services-feature-badge">MOST REQUESTED</span>
            </div>
            <div className="services-content-split">
              <div className="services-content-left">
                <h3 className="services-card-title">Prescription Refills</h3>
                <p className="services-card-description">
                  Running low on medication? Fast-track refill from a licensed
                  provider — often within the same day. No appointment required.
                  Works even if you're between doctors.
                </p>
              </div>
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

          {/* Weight Loss */}
          <div className="services-card-item services-bento-small-weightloss">
            <div className="services-icon-box">
              <FaBalanceScale />
            </div>
            <h3 className="services-card-title">Weight Loss Programs</h3>
            <p className="services-card-description">
              Personalized plans including GLP-1 medications (Ozempic, Wegovy),
              lifestyle coaching, and monthly monitoring.
            </p>
            <div className="services-weight-stat-block">
              <span className="services-weight-stat-eyebrow">
                AVG. WEIGHT LOSS
              </span>
              <div className="services-weight-stat-row">
                <span className="services-weight-stat-number">15 lbs</span>
                <span className="services-weight-stat-period">/ 3 months</span>
                <a href="#" className="services-card-cta-link">
                  Start program →
                </a>
              </div>
            </div>
          </div>

          {/* Mental Health — Tall */}
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

          {/* General Consultation */}
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

          {/* Sexual Health */}
          <div className="services-card-item services-bento-small-0">
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

          {/* Chronic Care */}
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
        </div>
      </div>
    </section>
  );
}
