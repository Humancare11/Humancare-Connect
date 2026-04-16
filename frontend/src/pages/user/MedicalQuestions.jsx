import { useEffect, useState } from "react";
import axios from "axios";

export default function MedicalQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/qna/user-questions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const submitQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/qna/ask", {
        question: newQuestion,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewQuestion("");
      fetchQuestions(); // Refresh the list
    } catch (error) {
      console.error("Failed to submit question:", error);
      alert("Failed to submit question. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="medical-questions-page">
      <div className="page-header">
        <h1 className="page-title">Medical Questions</h1>
        <p className="page-subtitle">Ask questions and get answers from healthcare professionals</p>
      </div>

      {/* Ask New Question */}
      <div className="section-card">
        <h3>Ask a New Question</h3>
        <form onSubmit={submitQuestion} className="question-form">
          <div className="form-group">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Describe your medical question or concern..."
              rows={4}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Question"}
          </button>
        </form>
      </div>

      {/* Questions History */}
      <div className="section-card">
        <h3>Your Questions & Answers</h3>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">❓</div>
            <h4>No questions yet</h4>
            <p>You haven't asked any medical questions yet. Ask your first question above!</p>
          </div>
        ) : (
          <div className="questions-list">
            {questions.map((q) => (
              <div key={q._id} className="question-card">
                <div className="question-header">
                  <div className="question-meta">
                    <span className="question-date">
                      Asked on {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`question-status ${q.status}`}>
                      {q.status}
                    </span>
                  </div>
                </div>

                <div className="question-content">
                  <h4>Your Question:</h4>
                  <p>{q.question}</p>
                </div>

                {q.answer && (
                  <div className="answer-content">
                    <h4>Doctor's Answer:</h4>
                    <p>{q.answer}</p>
                    {q.answeredBy && (
                      <div className="answer-meta">
                        <span>Answered by: {q.answeredBy.name}</span>
                        <span>{new Date(q.answeredAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                )}

                {!q.answer && q.status === "pending" && (
                  <div className="waiting-answer">
                    <p>⏳ Waiting for a doctor to answer your question...</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}