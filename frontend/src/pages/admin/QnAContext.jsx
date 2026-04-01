import { createContext, useContext, useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
//  Context
// ─────────────────────────────────────────────
const QnAContext = createContext(null);

const STORAGE_KEY = "qna_questions_v1";

// ─────────────────────────────────────────────
//  Seed data (used only when localStorage is empty)
// ─────────────────────────────────────────────
const SEED_QUESTIONS = [
  {
    id: 101,
    category: "Heart",
    question:
      "I have been experiencing chest tightness and mild shortness of breath when climbing stairs. My BP is 140/90. Should I be concerned about heart disease?",
    date: "2025-07-10",
    doctor: { name: "Dr. Rajesh Mehta", specialization: "Cardiologist" },
    answer:
      "Chest tightness with elevated BP warrants a thorough evaluation. Please get an ECG, echo, and lipid profile done soon. Lifestyle changes and possibly medication may be needed. Avoid strenuous activity until reviewed.",
    answered: true,
  },
  {
    id: 102,
    category: "Skin",
    question:
      "I have red, itchy patches on my elbows and knees that come and go. They look silvery and flaky. Could this be psoriasis? What should I do?",
    date: "2025-07-09",
    doctor: { name: "Dr. Sameer Joshi", specialization: "Dermatologist" },
    answer:
      "Based on your description, this does sound consistent with plaque psoriasis. A dermatologist visit is essential for diagnosis. Topical corticosteroids and moisturizers are common first-line treatments.",
    answered: true,
  },
  {
    id: 103,
    category: "Dizzy",
    question:
      "I feel dizzy every morning when I wake up. It lasts about 10 minutes. I also feel nauseous. Could this be BPPV or something more serious?",
    date: "2025-07-08",
    doctor: { name: "Dr. Ananya Krishnan", specialization: "ENT Specialist" },
    answer:
      "Morning positional dizziness is classic for BPPV. The Epley maneuver often resolves it quickly. However, ruling out inner ear infections and BP drops is important.",
    answered: true,
  },
  {
    id: 104,
    category: "Mental",
    question:
      "I have been feeling very anxious for the past month, with racing thoughts and poor sleep. I don't know if I should see a doctor or try managing on my own.",
    date: "2025-07-07",
    doctor: { name: "Dr. Shilpa Desai", specialization: "Psychotherapist" },
    answer:
      "Persistent anxiety lasting over a month definitely warrants professional attention. Cognitive Behavioural Therapy (CBT) combined with relaxation techniques can be very effective. Please do seek help.",
    answered: true,
  },
  {
    id: 105,
    category: "Gut",
    question:
      "I have bloating after almost every meal and alternating constipation and loose stools. This has been going on for 3 months. Could it be IBS?",
    date: "2025-07-06",
    doctor: null,
    answer: null,
    answered: false,
  },
  {
    id: 106,
    category: "Ortho",
    question:
      "My left knee hurts when I climb stairs or squat. There is occasional swelling. I am 42 years old. Is this early osteoarthritis?",
    date: "2025-07-05",
    doctor: { name: "Dr. Aditya Sharma", specialization: "Orthopedic Surgeon" },
    answer:
      "At 42 with these symptoms, early-stage osteoarthritis is possible. An X-ray would help confirm. Weight management, physiotherapy, and low-impact exercises are the first line of management.",
    answered: true,
  },
];

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) { /* ignore */ }
  return SEED_QUESTIONS;
}

function saveToStorage(questions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  } catch (_) { /* ignore */ }
}

// ─────────────────────────────────────────────
//  Provider  ← wrap your <App> or router with this
// ─────────────────────────────────────────────
export function QnAProvider({ children }) {
  const [questions, setQuestions] = useState(loadFromStorage);

  // keep localStorage in sync whenever questions change
  useEffect(() => {
    saveToStorage(questions);
  }, [questions]);

  /** Called from AskDoctor when the user submits a new question */
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
    setQuestions((prev) => [newQ, ...prev]);
    return newQ;
  }, []);

  /** Called from QnAPage when the admin submits an answer */
  const submitAnswer = useCallback((id, answer, doctorName, doctorSpec) => {
    setQuestions((prev) =>
      prev.map((q) =>
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
      )
    );
  }, []);

  return (
    <QnAContext.Provider value={{ questions, addQuestion, submitAnswer }}>
      {children}
    </QnAContext.Provider>
  );
}

// ─────────────────────────────────────────────
//  Hook
// ─────────────────────────────────────────────
export function useQnA() {
  const ctx = useContext(QnAContext);
  if (!ctx) {
    throw new Error(
      "[QnAContext] useQnA() was called outside <QnAProvider>.\n" +
        "Fix: wrap your routes/App with <QnAProvider> in App.jsx:\n\n" +
        "  import { QnAProvider } from './QnAContext';\n" +
        "  <QnAProvider><YourRoutes /></QnAProvider>"
    );
  }
  return ctx;
}