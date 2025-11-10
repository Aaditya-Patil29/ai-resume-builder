import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Example API calls
export const testBackend = () => API.get("/test");
export const createResume = (data) => API.post("/resume", data);
export const analyzeResume = (data) => API.post("/analyze", data);
