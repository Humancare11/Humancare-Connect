import { useEffect, useState } from "react";
import "./MedicalQuestions.css";
import api from "../../api";

const STATUS_META = {
  pending:  { label: "Pending Review",    icon: "⏳", color: "#d97706", bg: "#fef3c7", border: "#fcd34d" },
  assigned: { label: "Assigned to Doctor", icon: "👨‍⚕️", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  answered: { label: "Answer Under Review", icon: "🔍", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  approved: { label: "Answered",           icon: "✅", color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
};

const CATEGORY_META = {
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

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: m.bg, color: m.color, border: `1px solid ${m.border}`,
    }}>
      {m.icon} {m.label}
    </span>
  );
}

function QuestionCard({ q }) {
  const [open, setOpen] = useState(false);
  const col = CATEGORY_META[q.category] || CATEGORY_META.General;

  return (
    <div className="mq-card">
      <div className="mq-card-header" onClick={() => setOpen(p => !p)}>
        <div className="mq-card-top-row">
          <span className="mq-cat-badge" style={{ background: col.bg, color: col.text }}>{q.category}</span>
          <StatusBadge status={q.status} />
          <span className="mq-date">{formatDate(q.createdAt)}</span>
          <span className={`mq-chevron ${open ? "mq-chevron--open" : ""}`}>›</span>
        </div>
        <p className="mq-question-preview">
          {open ? q.question : q.question.slice(0, 140) + (q.question.length > 140 ? "…" : "")}
        </p>
      </div>

      {open && (
        <div className="mq-card-body">
          {/* Status pipeline */}
          <div className="mq-pipeline">
            {["pending", "assigned", "answered", "approved"].map((s, i) => {
              const steps = ["pending", "assigned", "answered", "approved"];
              const currentIdx = steps.indexOf(q.status);
              const stepIdx    = i;
              const done       = stepIdx <= currentIdx;
              const active     = stepIdx === currentIdx;
              const m          = STATUS_META[s];
              return (
                <div key={s} className={`mq-step ${done ? "mq-step--done" : ""} ${active ? "mq-step--active" : ""}`}>
                  <div className="mq-step-dot">{done ? "✓" : i + 1}</div>
                  <div className="mq-step-label">{m.label}</div>
                  {i < 3 && <div className={`mq-step-line ${done && stepIdx < currentIdx ? "mq-step-line--done" : ""}`} />}
                </div>
              );
            })}
          </div>

          {/* Doctor assigned info */}
          {(q.status === "assigned" || q.status === "answered" || q.status === "approved") && q.assignedDoctorName && (
            <div className="mq-info-block mq-info-block--doctor">
              <span className="mq-info-icon">👨‍⚕️</span>
              <div>
                <div className="mq-info-label">Assigned Doctor</div>
                <div className="mq-info-value">{q.assignedDoctorName}{q.assignedDoctorSpec ? ` — ${q.assignedDoctorSpec}` : ""}</div>
              </div>
            </div>
          )}

          {/* Pending message */}
          {q.status === "pending" && (
            <div className="mq-waiting">
              <span>⏳</span>
              <p>Your question is pending admin review. You'll receive an answer within <strong>12 hours</strong>.</p>
            </div>
          )}

          {/* Under review message */}
          {q.status === "answered" && (
            <div className="mq-waiting mq-waiting--review">
              <span>🔍</span>
              <p>The doctor has submitted an answer. It's currently under admin review before being published.</p>
            </div>
          )}

          {/* Approved answer */}
          {q.status === "approved" && q.answer && (
            <div className="mq-answer-block">
              <div className="mq-answer-label">
                {q.doctor?.name && (
                  <span className="mq-answer-doctor">Dr. {q.doctor.name}{q.doctor.specialization ? `, ${q.doctor.specialization}` : ""}</span>
                )}
                <span>Doctor's Answer</span>
              </div>
              <p className="mq-answer-text">{q.answer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MedicalQuestions() {
  const [questions,  setQuestions]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [text,       setText]       = useState("");
  const [category,   setCategory]   = useState("General");
  const [submitting, setSubmitting] = useState(false);
  const [toast,      setToast]      = useState(null);
  const [filter,     setFilter]     = useState("all");

  const CATEGORIES = ["General","Heart","Skin","Neuro","Ortho","Dental","Eyes","Dizzy","Mental","Gut"];

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    try {
      const res = await api.get("/api/qna/user-questions");
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 5000);
  };

  const submitQuestion = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await api.post("/api/qna/ask", { question: text, category });
      setText("");
      setCategory("General");
      showToast("Question submitted! You'll receive an answer within 12 hours.", true);
      fetchQuestions();
    } catch (err) {
      showToast(err.response?.data?.msg || "Failed to submit. Please try again.", false);
    } finally {
      setSubmitting(false);
    }
  };

  const counts = {
    all:      questions.length,
    pending:  questions.filter(q => q.status === "pending").length,
    assigned: questions.filter(q => q.status === "assigned").length,
    answered: questions.filter(q => q.status === "answered").length,
    approved: questions.filter(q => q.status === "approved").length,
  };

  const displayed = filter === "all" ? questions : questions.filter(q => q.status === filter);

  return (
    <div className="mq-root">

      {/* Toast */}
      {toast && (
        <div className={`mq-toast ${toast.ok ? "mq-toast--ok" : "mq-toast--err"}`}>
          <span>{toast.ok ? "✓" : "!"}</span> {toast.msg}
        </div>
      )}

      <div className="mq-header">
        <span className="mq-eyebrow">HumaniCare</span>
        <h1 className="mq-title">Medical Questions</h1>
        <p className="mq-sub">Ask a question and get a verified doctor's answer within 12 hours.</p>
      </div>

      {/* Ask form */}
      <div className="mq-form-card">
        <h2 className="mq-form-title">Ask a New Question</h2>
        <form onSubmit={submitQuestion}>
          <div className="mq-cat-row">
            {CATEGORIES.map(c => {
              const col = CATEGORY_META[c] || CATEGORY_META.General;
              return (
                <button
                  key={c} type="button"
                  className={`mq-cat-chip ${category === c ? "mq-cat-chip--active" : ""}`}
                  style={category === c ? { background: col.text, color: "#fff" } : {}}
                  onClick={() => setCategory(c)}
                >{c}</button>
              );
            })}
          </div>
          <textarea
            className="mq-textarea"
            rows={4}
            placeholder="Describe your symptoms, medical history, and what you'd like to know…"
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={2000}
            required
          />
          <div className="mq-form-footer">
            <span className="mq-char-count">{text.length}/2000</span>
            <button className="mq-submit-btn" type="submit" disabled={submitting || !text.trim()}>
              {submitting ? "Submitting…" : "Submit Question →"}
            </button>
          </div>
        </form>
      </div>

      {/* Filter tabs */}
      <div className="mq-tabs">
        {[
          { key: "all",      label: "All" },
          { key: "pending",  label: "Pending" },
          { key: "assigned", label: "Assigned" },
          { key: "answered", label: "Under Review" },
          { key: "approved", label: "Answered" },
        ].map(t => (
          <button
            key={t.key}
            className={`mq-tab ${filter === t.key ? "mq-tab--active" : ""}`}
            onClick={() => setFilter(t.key)}
          >
            {t.label}
            <span className="mq-tab-count">{counts[t.key]}</span>
          </button>
        ))}
      </div>

      {/* Questions list */}
      {loading ? (
        <div className="mq-loading"><div className="mq-spinner" /><p>Loading your questions…</p></div>
      ) : displayed.length === 0 ? (
        <div className="mq-empty">
          <div className="mq-empty-icon">❓</div>
          <h3>{filter === "all" ? "No questions yet" : `No ${filter} questions`}</h3>
          <p>{filter === "all" ? "Submit your first question above — a verified doctor will answer within 12 hours." : "No questions with this status."}</p>
        </div>
      ) : (
        <div className="mq-list">
          {displayed.map(q => <QuestionCard key={q._id} q={q} />)}
        </div>
      )}
    </div>
  );
}
