import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// ✅ DO NOT import QnAContext here at all.
// QnAProvider is already used inside App.jsx — no need to touch main.jsx.

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);