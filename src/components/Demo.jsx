import { useState, useEffect, useRef } from "react";
import "./demo.css";

const industries = [
  {
    id: 1, icon: "🏢", tab: "Corporates", subtitle: "Employee Healthcare",
    tag: "EMPLOYEE HEALTH", title: "Corporates",
    description: "Empower your workforce with on-demand healthcare access. From routine consultations to specialist referrals, we keep your team healthy and productive.",
    features: ["24/7 teleconsultations", "Mental health support", "Annual health screenings", "Insurance integration"],
  },
  {
    id: 2, icon: "🛡️", tab: "Insurance Cos.", subtitle: "Embedded Telehealth",
    tag: "EMBEDDED TELEHEALTH", title: "Insurance Companies",
    description: "Enhance your policy offerings with integrated telehealth. Reduce claims costs while delivering superior member experiences across every plan tier.",
    features: ["Claims reduction tools", "Member wellness portals", "Real-time consultations", "Data analytics"],
  },
  {
    id: 3, icon: "⚓", tab: "Shipping & Maritime", subtitle: "Maritime Telemedicine",
    tag: "MARITIME TELEMEDICINE", title: "Shipping & Maritime",
    description: "Keep crews safe in international waters with specialized maritime medical support. From remote diagnoses to emergency evacuations, we have you covered at sea.",
    features: ["Satellite consultations", "Emergency evacuations", "Port medical liaison", "Crew wellness programs"],
  },
  {
    id: 4, icon: "⚖️", tab: "Law Firms", subtitle: "Medico-Legal Services",
    tag: "MEDICO-LEGAL SERVICES", title: "Law Firms",
    description: "Strengthen your cases with expert medico-legal support. Access certified medical professionals who provide accurate documentation and expert witness services.",
    features: ["Expert witness reports", "Medical record review", "IME coordination", "Court-ready documentation"],
  },
  {
    id: 5, icon: "🏨", tab: "Hotels & Rentals", subtitle: "Guest Medical Assist.",
    tag: "GUEST MEDICAL ASSISTANCE", title: "Hotels & Rentals",
    description: "Elevate guest experience with on-demand medical support. From minor illnesses to emergency coordination, we ensure your guests feel safe wherever they stay.",
    features: ["24/7 guest teleconsultations", "Concierge medical visits", "Emergency referrals", "Multi-language support"],
  },
  {
    id: 6, icon: "🏘️", tab: "Property Cos.", subtitle: "Tenant Healthcare",
    tag: "TENANT HEALTHCARE", title: "Property Companies",
    description: "Add healthcare value to your properties and attract premium tenants. Offer residents convenient medical access as a differentiating amenity.",
    features: ["On-site telemedicine", "Resident health portals", "Emergency response", "Wellness programs"],
  },
  {
    id: 7, icon: "✈️", tab: "Tourism Cos.", subtitle: "Traveler Medical Assist.",
    tag: "TRAVELER MEDICAL ASSISTANCE", title: "Tourism Companies",
    description: "Protect travelers across every destination with comprehensive medical support. Ensure peace of mind with 24/7 assistance that travels with your clients.",
    features: ["Destination medical support", "Travel insurance coordination", "Emergency repatriation", "Pre-trip consultations"],
  },
];

const TOTAL   = industries.length;
const STEP    = 360 / TOTAL;   // ≈ 51.4° per card
const ANIM_MS = 780;

/*
  Three fixed slot configs that match the reference image:
  - CENTER: faces you straight on, full size
  - LEFT / RIGHT: heavily rotateY so they appear almost edge-on,
    shifted outward and slightly down to sit on the arc
*/
const SLOTS = {
  center: {
    x: 0,
    y: 0,
    rotateY: 0,
    scale: 1.1,
    opacity: 1,
    zIndex: 20,
  },
  left: {
    x: -420,
    y: 20,
    rotateY: -50,   // rotated away — inner face visible, outer edge toward viewer
    scale: 1,
    opacity: 0.88,
    zIndex: 10,
  },
  right: {
    x: 420,
    y: 20,
    rotateY: 50,
    scale: 1,
    opacity: 0.88,
    zIndex: 10,
  },
};

/*
  Entry/exit positions used during the wheel spin animation.
  When a card enters from the right it starts at FAR_RIGHT,
  moves through RIGHT slot, then CENTER. Same logic reversed for left.
*/
const FAR_RIGHT = { x: 680, y: 60, rotateY: -80, scale: 0.55, opacity: 0, zIndex: 1 };
const FAR_LEFT  = { x: -680, y: 60, rotateY:  80, scale: 0.55, opacity: 0, zIndex: 1 };

export default function IndustryCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating]     = useState(false);
  const [isPlaying, setIsPlaying]     = useState(true);
  const autoRef = useRef(null);

  // ── Auto-play ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) { clearInterval(autoRef.current); return; }
    autoRef.current = setInterval(() => {
      if (!animating) navigate(1);
    }, 3200);
    return () => clearInterval(autoRef.current);
  }, [isPlaying, animating, activeIndex]);

  const navigate = (dir) => {
    if (animating) return;
    setAnimating(true);
    setActiveIndex((prev) => ((prev + dir) % TOTAL + TOTAL) % TOTAL);
    setTimeout(() => setAnimating(false), ANIM_MS + 60);
  };

  const goTo = (i) => {
    if (animating || i === activeIndex) return;
    let diff = i - activeIndex;
    if (diff >  TOTAL / 2) diff -= TOTAL;
    if (diff < -TOTAL / 2) diff += TOTAL;
    navigate(diff > 0 ? 1 : -1);
  };

  /*
    Determine which slot (or "hidden") a card belongs to.
    diff = card's offset from activeIndex, wrapped to -3…+3
  */
  const getSlotKey = (cardIndex) => {
    let diff = cardIndex - activeIndex;
    if (diff >  TOTAL / 2) diff -= TOTAL;
    if (diff < -TOTAL / 2) diff += TOTAL;
    if (diff ===  0) return "center";
    if (diff === -1) return "left";
    if (diff ===  1) return "right";
    return "hidden";
  };

  // Card dimensions
  const FRONT_W = 500, FRONT_H = 610;
  const SIDE_W  = 420, SIDE_H  = 580;

  return (
    <div className="page">
      <div className="eyebrow">WHO WE WORK WITH</div>
      <h1>Built for Every Industry</h1>
      <p className="subtitle">
        From Fortune 500 corporations to boutique hotels — select your industry to see how
        we tailor our medical support to your specific needs.
      </p>

      {/* Tab bar */}
      <div className="tab-bar">
        {industries.map((ind, i) => (
          <div
            key={ind.id}
            className={`tab-item${activeIndex === i ? " active" : ""}`}
            onClick={() => goTo(i)}
          >
            <span className="tab-icon">{ind.icon}</span>
            <span className="tab-name">{ind.tab}</span>
            <span className="tab-sub">{ind.subtitle}</span>
          </div>
        ))}
      </div>

      {/* Carousel stage */}
      <div className="stage-outer">
        <div className="wheel-stage">
          {industries.map((ind, cardIndex) => {
            const slotKey = getSlotKey(cardIndex);
            if (slotKey === "hidden") return null;

            const slot    = SLOTS[slotKey];
            const isFront = slotKey === "center";
            const cardW   = isFront ? FRONT_W : SIDE_W;
            const cardH   = isFront ? FRONT_H : SIDE_H;

            return (
              <div
                key={cardIndex}
                className="wheel-slot"
                style={{
                  transform:  `translateX(${slot.x}px) translateY(${slot.y}px)`,
                  zIndex:     slot.zIndex,
                  opacity:    slot.opacity,
                  transition: `transform ${ANIM_MS}ms cubic-bezier(0.22,1,0.36,1),
                               opacity   ${ANIM_MS}ms ease`,
                }}
                onClick={() => !isFront && navigate(slotKey === "right" ? 1 : -1)}
              >
                <div
                  className={`card${isFront ? " front" : ""}`}
                  style={{
                    width:     cardW,
                    height:    cardH,
                    transform: `translateX(-50%) translateY(-50%)
                                scale(${slot.scale})
                                rotateY(${slot.rotateY}deg)`,
                    transition: `transform ${ANIM_MS}ms cubic-bezier(0.22,1,0.36,1)`,
                    cursor:    isFront ? "default" : "pointer",
                  }}
                >
                  <div className="card-tag">{ind.tag}</div>
                  <div className="icon-wrap">{ind.icon}</div>
                  <div className="card-title">{ind.title}</div>
                  <div className="card-desc">{ind.description}</div>
                  <div className="features">
                    {ind.features.map((f) => (
                      <div className="feat" key={f}>
                        <span className="check">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  {isFront && (
                    <div className="card-footer">
                      <div className="badge">🌐 Available in 50+ countries</div>
                      <button className="cta">Get a Proposal</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <button className="nav-btn" onClick={() => { setIsPlaying(false); navigate(-1); }}>‹</button>
        <div className="dots">
          {industries.map((_, i) => (
            <div
              key={i}
              className={`dot${activeIndex === i ? " active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button className="nav-btn" onClick={() => { setIsPlaying(false); navigate(1); }}>›</button>
        <button className="play-btn" onClick={() => setIsPlaying((p) => !p)}>
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
      </div>
    </div>
  );
}