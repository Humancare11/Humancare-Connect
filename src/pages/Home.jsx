import React, { useEffect } from "react";
import "./home.css";
import Sa from "../components/Sa";
import Aa from "../components/Aa";

export default function HomePage() {
  useEffect(() => {
    // Scroll reveal
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => ro.observe(el));

    return () => {
      ro.disconnect();
    };
  }, []);

  return (
    <>
      {/* HEADER */}
      {/* <ServicesSection /> */}
      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge">
            <div className="badge-pulse"></div>
            Available in all 50 states — 24 / 7
          </div>

          <h1>
            Talk to a <span>licensed doctor</span>
            <br />
            in minutes.
          </h1>

          <p>
            Book video consultations, get prescriptions, and receive follow-up
            care from board-certified physicians — without leaving home.
          </p>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search doctors, specialties, conditions…"
            />
            <button>Search</button>
          </div>

          <div className="trust">
            <span className="trust-chip">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              HIPAA Compliant
            </span>
            <span className="trust-chip">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              GDPR Ready
            </span>
            <span className="trust-chip">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              500+ Verified Doctors
            </span>
            <span className="trust-chip">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Prescriptions Available
            </span>
          </div>
        </div>

        <div className="hero-right">
          {/* Floating top tag */}
          <div className="float-tag ft-top">
            <span style={{ fontSize: "16px" }}>⚡</span>
            Next slot: <strong style={{ color: "var(--teal)" }}>Available Now</strong>
          </div>

          {/* Doctor profile card */}
          <div className="h-card doc-profile">
            <div className="doc-row">
              <div className="doc-avi">👩‍⚕️</div>
              <div className="doc-name-wrap">
                <div className="dname">Dr. Sarah Mitchell</div>
                <div className="dspec">Internal Medicine · 12 yrs experience</div>
              </div>
            </div>
            <div className="doc-chips">
              <span className="dchip">⭐ 4.97</span>
              <span className="dchip">NY Licensed</span>
              <span className="dchip">Video Visit</span>
            </div>
            <div className="doc-avail">
              <div className="avail-dot"></div> Available now — instant booking
            </div>
          </div>

          {/* Upcoming appointment card */}
          <div className="h-card appt-card">
            <div className="appt-icon-wrap">
              <svg width="20" height="20" fill="none" stroke="var(--primary)" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            <div className="appt-text">
              <h4>Upcoming Visit</h4>
              <p>Dr. Chen · Cardio Follow-up</p>
            </div>
            <div className="appt-time">
              <div className="time-big">3:30</div>
              <div className="time-sm">Today PM</div>
            </div>
          </div>

          {/* Prescriptions card */}
          <div className="h-card rx-card">
            <div className="rx-head">Active Prescriptions</div>
            <div className="rx-row">
              <div className="rx-dot" style={{ background: "var(--primary)" }}></div>
              <span className="rx-label">Lisinopril</span>
              <span className="rx-dose">10mg · daily</span>
              <div className="rx-bar">
                <div className="rx-fill" style={{ width: "75%" }}></div>
              </div>
            </div>
            <div className="rx-row">
              <div className="rx-dot" style={{ background: "var(--teal)" }}></div>
              <span className="rx-label">Metformin</span>
              <span className="rx-dose">500mg · 2×</span>
              <div className="rx-bar">
                <div className="rx-fill" style={{ width: "45%", background: "linear-gradient(90deg,var(--teal),#0a6b5e)" }}></div>
              </div>
            </div>
            <div className="rx-row" style={{ marginBottom: "0" }}>
              <div className="rx-dot" style={{ background: "var(--gold)" }}></div>
              <span className="rx-label">Atorvastatin</span>
              <span className="rx-dose">20mg · nightly</span>
              <div className="rx-bar">
                <div className="rx-fill" style={{ width: "88%", background: "linear-gradient(90deg,var(--gold),#a06010)" }}></div>
              </div>
            </div>
          </div>

          {/* Floating bottom tag */}
          <div className="float-tag ft-bot">
            <svg width="13" height="13" fill="none" stroke="var(--teal)" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            HIPAA Certified Platform
          </div>
        </div>
      </section>

      <Sa />


      {/* ══════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════ */}
      {/* <section className="section how" id="how">
        <div className="how-flex">
          <div>
            <div className="section-eyebrow">Process</div>
            <h2 className="section-title" style={{ color: "white" }}>
              From signup to care
              <br />
              in under 5 minutes.
            </h2>
          </div>
          <p className="section-sub">
            We removed every friction point between you and a qualified physician.
          </p>
        </div>
        <div className="steps">
          <div className="step reveal">
            <div className="step-num">01</div>
            <div className="step-icon">🔍</div>
            <h3>Find Your Doctor</h3>
            <p>
              Browse by specialty, condition, or availability. Filter by
              insurance. Read verified reviews from real patients.
            </p>
            <div className="step-line"></div>
          </div>
          <div className="step reveal">
            <div className="step-num">02</div>
            <div className="step-icon">📅</div>
            <h3>Book Instantly</h3>
            <p>
              Same-day slots. No hold music, no waiting rooms — just a clean
              booking flow you complete in seconds.
            </p>
            <div className="step-line"></div>
          </div>
          <div className="step reveal">
            <div className="step-num">03</div>
            <div className="step-icon">💊</div>
            <h3>Get Care &amp; Scripts</h3>
            <p>
              Your video visit happens on our encrypted platform. Prescriptions
              reach your pharmacy within the hour.
            </p>
          </div>
        </div>
      </section> */}

      {/* ══════════════════════════════════════════════
          SPECIALTIES
      ══════════════════════════════════════════════ */}
 

<Aa />
      {/* ══════════════════════════════════════════════
          WHY HUMANCARE
      ══════════════════════════════════════════════ */}
      <section className="section" id="why">
        <div className="why-grid">
          <div className="why-visual">
            <div className="stat-card-main">
              <div className="sc-label">Patient outcome improvement</div>
              <div className="sc-big">
                94<span style={{ fontSize: "24px" }}>%</span>
              </div>
              <div className="sc-sub">After 3 months on Humancare</div>
              <div className="sc-divider"></div>
              <div className="sc-row">
                <span>Visit completion rate</span>
                <strong>98.2%</strong>
              </div>
              <div className="sc-prog">
                <div className="sc-fill" style={{ width: "98%" }}></div>
              </div>
              <div className="sc-row">
                <span>Prescription accuracy</span>
                <strong>99.7%</strong>
              </div>
              <div className="sc-prog">
                <div className="sc-fill" style={{ width: "99.7%", background: "linear-gradient(90deg,var(--teal),var(--gold))" }}></div>
              </div>
            </div>
            <div className="stat-float sf1">
              <div className="sf-label">Patients served</div>
              <div className="sf-val" style={{ color: "var(--primary)" }}>2.4M+</div>
            </div>
            <div className="stat-float sf2">
              <div className="sf-label">Avg. response</div>
              <div className="sf-val" style={{ color: "var(--teal)" }}>&lt;4 min</div>
            </div>
            <div className="stat-float sf3">
              <div className="sf-label">Rating</div>
              <div className="sf-val" style={{ color: "var(--gold)" }}>4.9 ★</div>
            </div>
          </div>

          <div>
            <div className="section-eyebrow">Why Humancare</div>
            <h2 className="section-title" style={{ marginBottom: "34px" }}>
              Built on trust,
              <br />
              at every step.
            </h2>
            <div className="why-list">
              <div className="why-item reveal">
                <div className="why-icon">🔒</div>
                <div>
                  <div className="why-item-title">HIPAA &amp; SOC 2 Certified</div>
                  <div className="why-item-desc">
                    End-to-end encryption on every visit, message, and record.
                    Your health data never leaves our secure, audited infrastructure.
                  </div>
                </div>
              </div>
              <div className="why-item reveal">
                <div className="why-icon">✅</div>
                <div>
                  <div className="why-item-title">Board-Certified Physicians Only</div>
                  <div className="why-item-desc">
                    Every doctor clears a rigorous 9-step credentialing process —
                    state licensure, malpractice history, peer reviews, and ongoing audits.
                  </div>
                </div>
              </div>
              <div className="why-item reveal">
                <div className="why-icon">💳</div>
                <div>
                  <div className="why-item-title">Transparent, Flat-Fee Pricing</div>
                  <div className="why-item-desc">
                    No surprise bills. See the exact cost before booking. Most major
                    insurance plans accepted, or a flat $49 uninsured rate.
                  </div>
                </div>
              </div>
              <div className="why-item reveal">
                <div className="why-icon">📞</div>
                <div>
                  <div className="why-item-title">24 / 7 Human Support</div>
                  <div className="why-item-desc">
                    Real people — by chat, phone, or video — available around the
                    clock for urgent questions, escalations, and care coordination.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          DOCTORS
      ══════════════════════════════════════════════ */}
<section className="pcp-section-wrapper">
        <div className="pcp-container">

          {/* LEFT */}
          <div className="pcp-left">

            <span className="pcp-eyebrow">— NO PCP? NO PROBLEM.</span>

            <h2 className="pcp-heading">
              Don't have a
              <br />
              primary care doctor?
              <br />
              <span>We’ve got you.</span>
            </h2>

            <p className="pcp-desc">
              Millions of Americans lack access to a regular physician.
              MediLink bridges that gap — giving you instant access to
              licensed providers who can serve as your primary care team.
            </p>

            <div className="pcp-features">
              <div className="pcp-feature">
                <div className="pcp-icon">📄</div>
                <div>
                  <h4>Acts as Your PCP</h4>
                  <p>
                    Our providers manage ongoing health, maintain your
                    records, and coordinate specialist referrals.
                  </p>
                </div>
              </div>

              <div className="pcp-feature">
                <div className="pcp-icon">🔁</div>
                <div>
                  <h4>Continuity of Care</h4>
                  <p>
                    Build a relationship with the same doctor across visits.
                    Your health history stays in one secure place.
                  </p>
                </div>
              </div>

              <div className="pcp-feature">
                <div className="pcp-icon">📅</div>
                <div>
                  <h4>365 Days a Year</h4>
                  <p>
                    No more 3-week waits. Connect the same day — including
                    evenings and weekends.
                  </p>
                </div>
              </div>
            </div>

            <button className="pcp-btn">
              Get a doctor today — free to start
            </button>
          </div>

          {/* RIGHT */}
          <div className="pcp-right">
            <h3 className="pcp-right-title">
              Your first visit, step by step
            </h3>

            <div className="pcp-steps">

              {[1, 2, 3, 4, 5].map((step, i) => {
                const data = [
                  ["Create your free account", "Under 2 minutes. No credit card required."],
                  ["Complete a health intake", "Share your medical history and current medications."],
                  ["Match with a provider", "We surface the best-fit doctor for your needs and state."],
                  ["Start your video visit", "Meet face-to-face from anywhere, on any device."],
                  ["Receive care instantly", "Prescription sent to your pharmacy within minutes."]
                ];

                return (
                  <div className="pcp-step" key={i}>
                    <div className="pcp-step-circle">{step}</div>
                    <div>
                      <h4>{data[i][0]}</h4>
                      <p>{data[i][1]}</p>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════ */}
      <section className="section">
        <div className="section-eyebrow">Patient Stories</div>
        <h2 className="section-title">
          Real people,
          <br />
          real outcomes.
        </h2>
        <div className="testi-track">
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-q">
              "Saw a doctor within 4 minutes of signing up. Had my prescription
              at the pharmacy an hour later. This completely changed how I think
              about healthcare."
            </p>
            <div className="testi-au">
              <div className="testi-avi">AM</div>
              <div>
                <div className="testi-aname">Alex M.</div>
                <div className="testi-aloc">Austin, TX</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-q">
              "As someone without insurance, the flat $49 fee was a revelation.
              Dr. Nair took 45 full minutes with me. I felt truly heard for the
              first time in years."
            </p>
            <div className="testi-au">
              <div className="testi-avi">JS</div>
              <div>
                <div className="testi-aname">Jordan S.</div>
                <div className="testi-aloc">Chicago, IL</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-q">
              "My daughter had a fever at 2am. We got a same-night video call
              with a pediatrician who was calm, thorough, and reassuring.
              Absolute lifesaver."
            </p>
            <div className="testi-au">
              <div className="testi-avi">RP</div>
              <div>
                <div className="testi-aname">Rachel P.</div>
                <div className="testi-aloc">Seattle, WA</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-q">
              "Managing my chronic condition used to mean multiple in-office
              visits a month. Now I check in via video and my health has
              genuinely improved — costs way down too."
            </p>
            <div className="testi-au">
              <div className="testi-avi">DT</div>
              <div>
                <div className="testi-aname">David T.</div>
                <div className="testi-aloc">Miami, FL</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-q">
              "My therapist on Humancare remembers every detail, follows up
              proactively, and has been a genuine partner in my recovery.
              Exceptional mental health care."
            </p>
            <div className="testi-au">
              <div className="testi-avi">LK</div>
              <div>
                <div className="testi-aname">Laura K.</div>
                <div className="testi-aloc">Denver, CO</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA BAND
      ══════════════════════════════════════════════ */}
      <div className="cta-band">
        <div className="cta-inner">
          <div className="section-eyebrow">Get Started</div>
          <h2 className="cta-title">
            Your health
            <br />
            deserves better.
          </h2>
          <p className="cta-desc">
            Join 2.4 million Americans who chose a smarter way to access care.
          </p>
          <div className="cta-btns">
            <button className="cta-btn-w">Create Free Account</button>
            <button className="cta-btn-g">Talk to a Doctor Now</button>
          </div>
          <div className="cta-pills">
            <span className="cta-pill">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              HIPAA Compliant
            </span>
            <span className="cta-pill">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Board-Certified Doctors
            </span>
            <span className="cta-pill">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              24/7 Available
            </span>
            <span className="cta-pill">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              No Surprise Bills
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════ */}
      
    </>
  );
}