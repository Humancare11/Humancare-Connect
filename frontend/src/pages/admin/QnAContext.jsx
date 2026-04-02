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

const QnAContext = createContext(null);

const STORAGE_KEY = "qna_questions_v1";

// ── seed data shown before any real questions exist ──────────────
const SEED = [
  {
    id: 101,
    category: "Heart",
    question:
      "I have been experiencing chest tightness and mild shortness of breath when climbing stairs. My BP is 140/90. Should I be concerned about heart disease?",
    date: "2025-07-10",
    doctor: { name: "Dr. Rajesh Mehta", specialization: "Cardiologist" },
    answer:
      "Chest tightness with elevated BP warrants a thorough evaluation. Please get an ECG, echo, and lipid profile done soon. Avoid strenuous activity until reviewed.",
    answered: true,
  },
  {
    id: 102,
    category: "Skin",
    question:
      "I have red, itchy patches on my elbows and knees that come and go. They look silvery and flaky. Could this be psoriasis?",
    date: "2025-07-09",
    doctor: { name: "Dr. Sameer Joshi", specialization: "Dermatologist" },
    answer:
      "This does sound consistent with plaque psoriasis. A dermatologist visit is essential for diagnosis. Topical corticosteroids and moisturizers are common first-line treatments.",
    answered: true,
  },
  {
    id: 103,
    category: "Gut",
    question:
      "I have bloating after almost every meal and alternating constipation and loose stools for 3 months. Could it be IBS?",
    date: "2025-07-06",
    doctor: null,
    answer: null,
    answered: false,
  },
];

// ── helpers ──────────────────────────────────────────────────────
function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return SEED;
}

function writeStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_) {}
}

// ── provider ─────────────────────────────────────────────────────
export function QnAProvider({ children }) {
  const [questions, setQuestions] = useState(readStorage);

  // persist to localStorage on every change
  useEffect(() => {
    writeStorage(questions);
  }, [questions]);

  // sync across browser tabs (storage event fires in OTHER tabs)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setQuestions(JSON.parse(e.newValue));
        } catch (_) {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ── addQuestion  (called from AskDoctor) ─────────────────────
  const addQuestion = useCallback((text, category) => {
    const newQ = {
      id: Date.now(),
      category,
      question: text.trim(),
      date: new Date().toISOString().split("T")[0],
      doctor: null,
      answer: null,
      answered: false,
    };
    setQuestions((prev) => {
      const updated = [newQ, ...prev];
      writeStorage(updated);   // write immediately, not just via useEffect
      return updated;
    });
    return newQ;
  }, []);

  // ── submitAnswer  (called from QnAPage) ──────────────────────
  const submitAnswer = useCallback((id, answer, doctorName, doctorSpec) => {
    setQuestions((prev) => {
      const updated = prev.map((q) =>
        q.id === id
          ? {
              ...q,
              answered: true,
              answer: answer.trim(),
              doctor: {
                name: doctorName.trim() || "Dr. Admin",
                specialization: doctorSpec.trim() || "General Physician",
              },
            }
          : q
      );
      writeStorage(updated);   // write immediately
      return updated;
    });
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