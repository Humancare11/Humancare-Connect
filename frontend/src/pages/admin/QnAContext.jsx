// src/pages/admin/QnAContext.jsx
// ─────────────────────────────────────────────────────────────────
//  This is the ONLY source of truth for Q&A data.
//  Both AskDoctor (pages/AskDoctor.jsx) and QnAPage (pages/admin/QnAPage.jsx)
//  import from THIS file.
//
//  Import path from AskDoctor  : "../admin/QnAContext"
//  Import path from QnAPage    : "./QnAContext"
//  Import path from App.jsx    : "./pages/admin/QnAContext"
// ─────────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const QnAContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// ── provider ─────────────────────────────────────────────────────
export function QnAProvider({ children }) {
  const [questions, setQuestions] = useState([]);

  // Fetch initial questions
  const fetchQuestions = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/qna`);
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch QnA questions:", err);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // ── addQuestion  (called from AskDoctor) ─────────────────────
  const addQuestion = useCallback(async (text, category) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      const payload = {
        question: text.trim(),
        category,
        name: user.name || "User",
      };

      const res = await axios.post(`${API_BASE}/qna/ask`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newQ = res.data;
      setQuestions((prev) => [newQ, ...prev]);
      return newQ;
    } catch (err) {
      console.error("Failed to ask question:", err);
      // Fallback/return something or just throw
      throw err;
    }
  }, []);

  // ── submitAnswer  (called from QnAPage) ──────────────────────
  const submitAnswer = useCallback(async (id, answer, doctorName, doctorSpec) => {
    try {
      // In Doctor dashboard, token might be doctorToken or token
      let token = localStorage.getItem("doctorToken") || localStorage.getItem("token");
      
      const payload = {
        answer: answer.trim(),
        name: doctorName.trim() || "Dr. Admin",
      };

      const res = await axios.post(`${API_BASE}/qna/${id}/answer`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedQ = res.data;
      setQuestions((prev) => prev.map((q) => (q._id === id ? updatedQ : q)));
    } catch (err) {
      console.error("Failed to submit answer:", err);
      throw err;
    }
  }, []);

  return (
    <QnAContext.Provider value={{ questions, addQuestion, submitAnswer }}>
      {children}
    </QnAContext.Provider>
  );
}

// ── hook ─────────────────────────────────────────────────────────
export function useQnA() {
  const ctx = useContext(QnAContext);
  if (!ctx) {
    throw new Error(
      "[QnAContext] useQnA() called outside <QnAProvider>.\n" +
        "Make sure <QnAProvider> wraps your routes in App.jsx."
    );
  }
  return ctx;
}