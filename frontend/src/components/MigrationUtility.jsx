import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function MigrationUtility() {
  const [status, setStatus] = useState("idle");
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => setLogs((prev) => [...prev, msg]);

  const runMigration = async () => {
    setStatus("running");
    setLogs(["Starting migration from localStorage to MongoDB..."]);

    const qnaDataRaw = localStorage.getItem("qna_questions_v1");
    const qnaData = qnaDataRaw ? JSON.parse(qnaDataRaw) : [];

    if (qnaData && qnaData.length > 0) {
      addLog(`Found ${qnaData.length} QnA items locally...`);
      for (const item of qnaData) {
        try {
          if (!item.doctor) {
            await axios.post(`${API_BASE}/qna/ask`, {
              question: item.question,
              category: item.category,
              name: "Local User"
            });
            addLog(`Migrated question: ${item.question.slice(0, 30)}...`);
          } else {
            // It has an answer, we first ask the question, get the ID, then post the answer.
            const res = await axios.post(`${API_BASE}/qna/ask`, {
              question: item.question,
              category: item.category,
              name: "Local User"
            });
            
            await axios.post(`${API_BASE}/qna/${res.data._id}/answer`, {
              answer: item.answer,
              name: item.doctor.name
            });
            addLog(`Migrated QnA pair: ${item.question.slice(0, 30)}...`);
          }
        } catch (err) {
          addLog(`Error migrating QnA: ${err.message}`);
        }
      }
      localStorage.removeItem("qna_questions_v1");
      addLog("Cleared QnA local storage.");
    }

    const regDocsRaw = localStorage.getItem("registeredDoctors");
    const regDocs = regDocsRaw ? JSON.parse(regDocsRaw) : [];
    
    if (regDocs && regDocs.length > 0) {
      addLog(`Found ${regDocs.length} registered doctors locally. Skipping auto-auth creation as passwords are lost or hashed differently. Doctors will need to re-register. Removing local cache...`);
      localStorage.removeItem("registeredDoctors");
    }
    
    const enrolledRaw = localStorage.getItem("enrolledDoctors");
    const enrolled = enrolledRaw ? JSON.parse(enrolledRaw) : [];
    
    if (enrolled && enrolled.length > 0) {
      addLog(`Found ${enrolled.length} enrolled doctors locally.`);
      // If we wished to create mock auths for them, we could, but without real passwords, it's safer
      // to let them re-register, OR we can dump them as mock objects. 
      // For this migration utility, we'll inform the admin and delete them because of the Auth dependency (doctorId).
      addLog(`Doctor enrollments are linked to Doctor Auth accounts. Clearing orphaned enrollments from localStorage...`);
      localStorage.removeItem("enrolledDoctors");
    }

    setStatus("done");
    addLog("Migration script finished successfully.");
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0', background: '#f9f9f9' }}>
      <h2>Database Migration Utility</h2>
      <p style={{ color: '#555', marginBottom: '1rem' }}>
        This utility scans your browser's localStorage for legacy mock data and migrates it to the MongoDB Atlas database.
      </p>
      
      <button 
        onClick={runMigration}
        disabled={status === "running"}
        style={{
          background: '#0C8B7A',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: status === "running" ? 'not-allowed' : 'pointer'
        }}
      >
        {status === "running" ? "Migrating..." : "Run Migration"}
      </button>

      {logs.length > 0 && (
        <div style={{ marginTop: '20px', background: '#111', color: '#0f0', padding: '15px', borderRadius: '4px', fontFamily: 'monospace', maxHeight: '200px', overflowY: 'auto' }}>
          {logs.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      )}
    </div>
  );
}
