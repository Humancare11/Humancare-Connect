// src/pages/admin/QnAPage.jsx
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./QnAPage.css";

const API = `${import.meta.env.VITE_API_URL}/api/qna`;

const CATEGORY_META = {
  General: { bg: "#EEF2FF", text: "#4338CA" },
  Heart: { bg: "#FEF2F2", text: "#DC2626" },
  Skin: { bg: "#FFF7ED", text: "#C2410C" },
  Neuro: { bg: "#F5F3FF", text: "#7C3AED" },
  Ortho: { bg: "#F0FDF4", text: "#16A34A" },
  Dental: { bg: "#ECFDF5", text: "#059669" },
  Eyes: { bg: "#EFF6FF", text: "#2563EB" },
  Dizzy: { bg: "#FEF9C3", text: "#B45309" },
  Mental: { bg: "#FDF4FF", text: "#A21CAF" },
  Gut: { bg: "#F0FDF4", text: "#15803D" },
};

const FILTERS = ["All", "Pending", "Answered"];

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

/* ── icons ── */
const IconCal = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconUser = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const Spinner = () => <span className="qna-spinner" />;

/* ── AnswerForm ── */
function AnswerForm({ question, onSubmit, onCancel }) {
  const [answerText, setAnswerText] = useState(question.answer || "");
  const [doctorName, setDoctorName] = useState(question.doctor?.name || "");
  const [doctorSpec, setDoctorSpec] = useState(question.doctor?.specialization || "");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleAIDraft = async () => {
    setLoading(true); setErr("");
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system:
            "You are a helpful medical assistant drafting answers for doctors to review. " +
            "Write a clear, empathetic response in 3–5 sentences. " +
            "End with a recommendation to consult a doctor in person. " +
            "Do not provide a definitive diagnosis.",
          messages: [{ role: "user", content: `Category: ${question.category}\nPatient question: ${question.question}` }],
        }),
      });
      const data = await resp.json();
      const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
      if (text) setAnswerText(text);
      else setErr("Could not generate draft. Please type manually.");
    } catch {
      setErr("Network error. Please type your answer manually.");
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    if (!answerText.trim()) { setErr("Answer cannot be empty."); return; }
    onSubmit(answerText, doctorName, doctorSpec);
  };

  return (
    <div className="qna-answer-form">
      <div className="qna-answer-form-title"><IconEdit /> Write Answer</div>
      <div className="qna-doctor-inputs">
        <div className="qna-input-group">
          <label>Doctor Name</label>
          <input type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="e.g. Dr. Priya Mehta" />
        </div>
        <div className="qna-input-group">
          <label>Specialization</label>
          <input type="text" value={doctorSpec} onChange={(e) => setDoctorSpec(e.target.value)} placeholder="e.g. Cardiologist" />
        </div>
      </div>
      <textarea
        className="qna-answer-textarea" rows={5} value={answerText}
        onChange={(e) => { setAnswerText(e.target.value); setErr(""); }}
        placeholder="Type the medical answer here, or click 'AI Draft' to generate a starting point…"
      />
      {loading && <div className="qna-ai-loading"><Spinner /> Generating AI-assisted draft…</div>}
      {err && <div className="qna-form-err">{err}</div>}
      <div className="qna-form-actions">
        <button className="qna-submit-ans-btn" onClick={handleSubmit}><IconCheck /> Submit Answer</button>
        <button className="qna-ai-btn" onClick={handleAIDraft} disabled={loading}>
          {loading ? <><Spinner /> Generating…</> : "✦ AI Draft"}
        </button>
        <button className="qna-cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* ══ Main QnAPage ══ */
export default function QnAPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [answeringId, setAnsweringId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  const token = localStorage.getItem("adminToken");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchQuestions = useCallback(() => {
    axios.get(API, { headers })
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("fetch questions error:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleSubmitAnswer = async (id, answerText, doctorName, doctorSpec) => {
    try {
      const res = await axios.put(
        `${API}/${id}/answer`,
        { answer: answerText, doctorName, doctorSpec },
        { headers }
      );
      setQuestions((prev) => prev.map((q) => q._id === id ? res.data : q));
      setAnsweringId(null);
      setSuccessId(id);
      setTimeout(() => setSuccessId(null), 4000);
    } catch (err) {
      console.error("submit answer error:", err);
      alert(err.response?.data?.msg || "Failed to submit answer.");
    }
  };

  const pendingCount = questions.filter((q) => !q.answered).length;
  const answeredCount = questions.filter((q) => q.answered).length;

  const filtered = questions.filter((q) => {
    const matchFilter =
      filter === "All" ||
      (filter === "Pending" && !q.answered) ||
      (filter === "Answered" && q.answered);
    const matchSearch =
      !search.trim() ||
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) return <p style={{ padding: 24, color: "#6b7280" }}>Loading questions…</p>;

  return (
    <div className="qna-page">
      {/* header */}
      <div className="qna-page-header">
        <div className="qna-header-inner">
          <div>
            <h1>QnA Admin Panel</h1>
            <p>Review patient questions and submit doctor responses.</p>
          </div>
          <div className="qna-stats">
            <div className="qna-stat-card">
              <div className="qna-stat-val">{questions.length}</div>
              <div className="qna-stat-label">Total</div>
            </div>
            <div className="qna-stat-card pending">
              <div className="qna-stat-val">{pendingCount}</div>
              <div className="qna-stat-label">Pending</div>
            </div>
            <div className="qna-stat-card answered">
              <div className="qna-stat-val">{answeredCount}</div>
              <div className="qna-stat-label">Answered</div>
            </div>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="qna-controls">
        <div className="qna-search-wrap">
          <IconSearch />
          <input type="text" placeholder="Search questions or categories…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="qna-filters">
          {FILTERS.map((f) => (
            <button key={f} className={`qna-filter-pill${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>
              {f}
              {f === "Pending" && pendingCount > 0 && <span className="qna-filter-count">{pendingCount}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* list */}
      <div className="qna-list">
        {filtered.length === 0 && (
          <div className="qna-empty">
            <div className="qna-empty-icon">📭</div>
            <p>No questions found for this filter.</p>
          </div>
        )}

        {filtered.map((q, i) => {
          const col = CATEGORY_META[q.category] || CATEGORY_META.General;
          const isExpanded = expandedId === q._id;
          const isAnswering = answeringId === q._id;
          const showSuccess = successId === q._id;

          return (
            <div
              className={`qna-q-card${q.answered ? " is-answered" : ""}`}
              key={q._id}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* top row */}
              <div className="qna-card-top">
                <div className="qna-card-left">
                  <span className="qna-cat-badge" style={{ background: col.bg, color: col.text }}>{q.category}</span>
                  <span className={`qna-status-badge ${q.answered ? "answered" : "pending"}`}>
                    {q.answered ? "✓ Answered" : "⏳ Pending"}
                  </span>
                </div>
                <div className="qna-card-right">
                  <span className="qna-date"><IconCal /> {formatDate(q.createdAt)}</span>
                </div>
              </div>

              {/* question text */}
              <div className="qna-q-text" onClick={() => setExpandedId(isExpanded ? null : q._id)}>
                {isExpanded ? q.question : q.question.slice(0, 180) + (q.question.length > 180 ? "…" : "")}
                {q.question.length > 180 && (
                  <span className="qna-toggle-text">{isExpanded ? " Show less" : " Read more"}</span>
                )}
              </div>

              {/* existing answer */}
              {q.answered && q.answer && !isAnswering && (
                <div className="qna-existing-answer">
                  {q.doctor?.name && (
                    <div className="qna-answered-by">
                      <div className="qna-doc-avatar" style={{ background: col.bg, color: col.text }}>
                        {q.doctor.name.split(" ").pop()[0]}
                      </div>
                      <div>
                        <div className="qna-doc-name"><IconUser /> {q.doctor.name}</div>
                        <div className="qna-doc-spec">{q.doctor.specialization}</div>
                      </div>
                    </div>
                  )}
                  <div className="qna-answer-body">
                    <div className="qna-answer-label">Doctor's Answer</div>
                    <p>{q.answer}</p>
                  </div>
                </div>
              )}

              {/* success flash */}
              {showSuccess && (
                <div className="qna-success-flash">
                  <IconCheck /> Answer saved to MongoDB and now visible on the patient page.
                </div>
              )}

              {/* answer form */}
              {isAnswering && (
                <AnswerForm
                  question={q}
                  onSubmit={(ans, name, spec) => handleSubmitAnswer(q._id, ans, name, spec)}
                  onCancel={() => setAnsweringId(null)}
                />
              )}

              {/* actions */}
              {!isAnswering && (
                <div className="qna-card-actions">
                  <button
                    className={`qna-answer-btn${q.answered ? " edit" : ""}`}
                    onClick={() => setAnsweringId(q._id)}
                  >
                    {q.answered ? <><IconEdit /> Edit Answer</> : "Answer this question →"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
