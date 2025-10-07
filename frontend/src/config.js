// Frontend calls backend via this base URL.
// When deploying on Vercel, set REACT_APP_API_BASE environment variable.
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";
export default API_BASE;
