import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Test connection
export const testBackend = () => API.get("/test");

// Resume CRUD operations
export const createResume = (data) => API.post("/resumes", data);
export const getResumes = (userId) => API.get(`/resumes/user/${userId}`);
export const getResume = (id) => API.get(`/resumes/${id}`);
export const updateResume = (id, data) => API.put(`/resumes/${id}`, data);
export const deleteResume = (id) => API.delete(`/resumes/${id}`);
export const getStats = (userId) => API.get(`/resumes/stats/${userId}`);

// AI operations
export const analyzeResume = (data) => API.post("/ai/analyze", data);
export const improveSuggestion = (data) => API.post("/ai/improve", data);