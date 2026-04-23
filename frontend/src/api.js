import axios from "axios";

// Single axios instance used by ALL pages.
// withCredentials: true → sends httpOnly cookies automatically on every request.
// No manual Authorization headers needed anywhere.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
});

export default api;
