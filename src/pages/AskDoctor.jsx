import { useState, useRef } from "react";
import "./AskDoctor.css";

const CATEGORIES = ["General", "Heart", "Skin", "Neuro", "Ortho", "Dental", "Eyes", "Dizzy", "Mental", "Gut"];

const categoryColors = {
  General: { bg: "#EEF2FF", text: "#4338CA" },
  Heart:   { bg: "#FEF2F2", text: "#DC2626" },
  Skin:    { bg: "#FFF7ED", text: "#C2410C" },
  Neuro:   { bg: "#F5F3FF", text: "#7C3AED" },
  Ortho:   { bg: "#F0FDF4", text: "#16A34A" },
  Dental:  { bg: "#ECFDF5", text: "#059669" },
  Eyes:    { bg: "#EFF6FF", text: "#2563EB" },
  Dizzy:   { bg: "#FEF9C3", text: "#B45309" },
  Mental:  { bg: "#FDF4FF", text: "#A21CAF" },
  Gut:     { bg: "#F0FDF4", text: "#15803D" },
};

const initialQuestions = [
  {
    id: 101,
    category: "Heart",
    question: "I have been experiencing chest tightness and mild shortness of breath when climbing stairs. My BP is 140/90. Should I be concerned about heart disease?",
    date: "2025-07-10",
    doctor: { name: "Dr. Rajesh Mehta", specialization: "Cardiologist" },
    answer: "Chest tightness with elevated BP warrants a thorough evaluation. Please get an ECG, echo, and lipid profile done soon. Lifestyle changes and possibly medication may be needed. Avoid strenuous activity until reviewed.",
    answered: true,
  },
  {
    id: 102,
    category: "Skin",
    question: "I have red, itchy patches on my elbows and knees that come and go. They look silvery and flaky. Could this be psoriasis? What should I do?",
    date: "2025-07-09",
    doctor: { name: "Dr. Sameer Joshi", specialization: "Dermatologist" },
    answer: "Based on your description, this does sound consistent with plaque psoriasis. A dermatologist visit is essential for diagnosis. Topical corticosteroids and moisturizers are common first-line treatments.",
    answered: true,
  },
  {
    id: 103,
    category: "Dizzy",
    question: "I feel dizzy every morning when I wake up. It lasts about 10 minutes. I also feel nauseous. Could this be BPPV or something more serious?",
    date: "2025-07-08",
    doctor: { name: "Dr. Ananya Krishnan", specialization: "ENT Specialist" },
    answer: "Morning positional dizziness is classic for BPPV (Benign Paroxysmal Positional Vertigo). The Epley maneuver often resolves it quickly. However, ruling out inner ear infections and BP drops is important.",
    answered: true,
  },
  {
    id: 104,
    category: "Mental",
    question: "I have been feeling very anxious for the past month, with racing thoughts and poor sleep. I don't know if I should see a doctor or try managing on my own.",
    date: "2025-07-07",
    doctor: { name: "Dr. Shilpa Desai", specialization: "Psychotherapist" },
    answer: "Persistent anxiety lasting over a month definitely warrants professional attention. Cognitive Behavioural Therapy (CBT) combined with relaxation techniques can be very effective. Please do seek help.",
    answered: true,
  },
  {
    id: 105,
    category: "Gut",
    question: "I have bloating after almost every meal and alternating constipation and loose stools. This has been going on for 3 months. Could it be IBS?",
    date: "2025-07-06",
    doctor: null,
    answer: null,
    answered: false,
  },
  {
    id: 106,
    category: "Ortho",
    question: "My left knee hurts when I climb stairs or squat. There is occasional swelling. I am 42 years old. Is this early osteoarthritis?",
    date: "2025-07-05",
    doctor: { name: "Dr. Aditya Sharma", specialization: "Orthopedic Surgeon" },
    answer: "At 42 with these symptoms, early-stage osteoarthritis is possible. An X-ray would help confirm. Weight management, physiotherapy, and low-impact exercises are the first line of management.",
    answered: true,
  },
];

const PER_PAGE = 4;

const formatDate = (d) => {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const wordCount = (str) => str.trim().split(/\s+/).filter(Boolean).length;

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" strokeLinecap="round"/></svg>
);
const ChevLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" strokeLinecap="round"/></svg>
);
const ChevRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" strokeLinecap="round"/></svg>
);
const UploadIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);
const DoctorIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const CalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);

export default function AskDoctor() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [category, setCategory] = useState("General");
  const [submitted, setSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const fileRef = useRef();

  const MAX = 2000;

  const validate = () => {
    const e = {};
    if (!text.trim()) e.text = "Please enter your question.";
    else if (text.length > MAX) e.text = `Maximum ${MAX} characters allowed.`;
    if (file && wordCount(text) < 20) e.file = "Please describe your problem in at least 20 words before uploading a file.";
    if (!agreed) e.agreed = "Please agree to the Terms and Conditions.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    const newQ = {
      id: Date.now(),
      category,
      question: text.trim(),
      date: new Date().toISOString().split("T")[0],
      doctor: null,
      answer: null,
      answered: false,
    };
    setQuestions((prev) => [newQ, ...prev]);
    setText(""); setFile(null); setAgreed(false); setErrors({});
    setCategory("General"); setCurrentPage(1); setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const totalPages = Math.max(1, Math.ceil(questions.length / PER_PAGE));
  const visible = questions.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const goPage = (p) => { if (p >= 1 && p <= totalPages) setCurrentPage(p); };

  const pages = () => {
    const arr = [];
    if (totalPages <= 5) for (let i = 1; i <= totalPages; i++) arr.push(i);
    else {
      arr.push(1);
      if (currentPage > 3) arr.push("…");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) arr.push(i);
      if (currentPage < totalPages - 2) arr.push("…");
      arr.push(totalPages);
    }
    return arr;
  };

  return (
    <div className="ad-page">
      <div className="ad-hero">
        <div className="ad-hero-inner">
          {/* <span className="ad-hero-badge">Free Medical Consultation</span> */}
          <h1>Ask a Doctor Online</h1>
          <p>Get answers from verified specialists across 20+ departments — free, fast, confidential.</p>
          
        </div>
      </div>

      <div className="ad-layout">
        <div className="ad-left">
          <div className="ad-form-card">
            <div className="ad-form-header">
              <h2>Ask Free Doctor Online</h2>
              <p>Describe your problem clearly for the best medical advice</p>
            </div>

            {submitted && (
              <div className="ad-success">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#0C8B7A"/><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Your question has been submitted! Our experts will respond within 12 hours.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="ad-field">
                <label>Category</label>
                <div className="ad-cat-grid">
                  {CATEGORIES.map((c) => (
                    <button type="button" key={c} className={`ad-cat-chip${category === c ? " active" : ""}`} onClick={() => setCategory(c)}>{c}</button>
                  ))}
                </div>
              </div>

              <div className="ad-field">
                <label>Your Question <span className="ad-req">*</span></label>
                <div className={`ad-textarea-wrap${errors.text ? " err" : ""}`}>
                  <textarea
                    value={text}
                    onChange={(e) => { if (e.target.value.length <= MAX) { setText(e.target.value); setErrors((p) => ({ ...p, text: undefined })); } }}
                    placeholder="Describe your symptoms, duration, and any relevant medical history… e.g. 'I have been having a throbbing headache on one side for 3 days, worsens with light…'"
                    rows={6}
                  />
                  <div className={`ad-counter${text.length > MAX * 0.9 ? " warn" : ""}`}>{text.length}/{MAX}</div>
                </div>
                {errors.text && <span className="ad-err">{errors.text}</span>}
              </div>

              <div className="ad-field">
                <label>Upload Medical Reports <span className="ad-opt">(optional)</span></label>
                <div
                  className={`ad-upload-box${errors.file ? " err" : ""}${file ? " has-file" : ""}`}
                  onClick={() => fileRef.current.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { setFile(f); setErrors((p) => ({ ...p, file: undefined })); } }}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    style={{ display: "none" }}
                    onChange={(e) => { if (e.target.files[0]) { setFile(e.target.files[0]); setErrors((p) => ({ ...p, file: undefined })); } }}
                  />
                  {file ? (
                    <div className="ad-file-info">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0C8B7A" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span>{file.name}</span>
                      <button type="button" className="ad-file-remove" onClick={(ev) => { ev.stopPropagation(); setFile(null); }}>×</button>
                    </div>
                  ) : (
                    <>
                      <UploadIcon />
                      <span className="ad-upload-main">Drag & drop or <em>browse</em></span>
                      <span className="ad-upload-sub">JPG, PNG, PDF · Max 10MB · Min 20 words required</span>
                    </>
                  )}
                </div>
                {errors.file && <span className="ad-err">{errors.file}</span>}
              </div>

              <div className={`ad-checkbox-wrap${errors.agreed ? " err" : ""}`}>
                <label className="ad-checkbox">
                  <input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); setErrors((p) => ({ ...p, agreed: undefined })); }} />
                  <span className="ad-checkmark" />
                  I agree to the <a href="#">Terms and Conditions</a> 
                </label>
                {errors.agreed && <span className="ad-err">{errors.agreed}</span>}
              </div>

              <button type="submit" className="ad-submit-btn">Ask Doctor Now →</button>
            </form>
          </div>

          <div className="ad-trust">
            {[["🔒", "100% Confidential"], ["✅", "Verified Doctors"], ["⚡", "Fast Response"]].map(([icon, label]) => (
              <div className="ad-trust-item" key={label}><span>{icon}</span>{label}</div>
            ))}
          </div>
        </div>

        <div className="ad-right">
          <div className="ad-right-header">
            <h2>Recent Questions</h2>
            <span className="ad-count">{questions.length} questions</span>
          </div>

          <div className="ad-qlist">
            {visible.map((q, i) => {
              const col = categoryColors[q.category] || { bg: "#EEF2FF", text: "#4338CA" };
              const expanded = expandedId === q.id;
              return (
                <div className="ad-qcard" key={q.id} style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="ad-qcard-top">
                    <span className="ad-cat-badge" style={{ background: col.bg, color: col.text }}>{q.category}</span>
                    <span className="ad-qdate"><CalIcon /> {formatDate(q.date)}</span>
                  </div>

                  <p className="ad-qtext">{expanded ? q.question : q.question.slice(0, 130) + (q.question.length > 130 ? "…" : "")}</p>

                  {q.answered && q.doctor && (
                    <div className="ad-doctor-row">
                      <div className="ad-doctor-avatar" style={{ background: col.bg, color: col.text }}>{q.doctor.name.split(" ").slice(-1)[0][0]}</div>
                      <div>
                        <div className="ad-doctor-name"><DoctorIcon /> {q.doctor.name}</div>
                        <div className="ad-doctor-spec">{q.doctor.specialization}</div>
                      </div>
                    </div>
                  )}

                  {q.answered && q.answer ? (
                    <div className="ad-answer">
                      <div className="ad-answer-label">Doctor's Answer</div>
                      <p>{expanded ? q.answer : q.answer.slice(0, 100) + (q.answer.length > 100 ? "…" : "")}</p>
                    </div>
                  ) : (
                    <div className="ad-pending">
                      <ClockIcon />
                      Our experts will answer shortly (within 12 hours)
                    </div>
                  )}

                  <div className="ad-qcard-actions">
                    <button className="ad-read-btn" onClick={() => setExpandedId(expanded ? null : q.id)}>{expanded ? "Show Less" : "Read More"}</button>
                    <button className="ad-consult-btn">Consult Now</button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="ad-pagination">
              <button className="ad-pg-btn ad-pg-nav" onClick={() => goPage(currentPage - 1)} disabled={currentPage === 1}><ChevLeft /> Prev</button>
              {pages().map((p, i) =>
                p === "…" ? <span key={`e${i}`} className="ad-pg-ellipsis">…</span> : (
                  <button key={p} className={`ad-pg-btn${currentPage === p ? " active" : ""}`} onClick={() => goPage(p)}>{p}</button>
                )
              )}
              <button className="ad-pg-btn ad-pg-nav" onClick={() => goPage(currentPage + 1)} disabled={currentPage === totalPages}>Next <ChevRight /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}