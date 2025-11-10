import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const createResume = async (resumeData) => {
  return await axios.post(`${API_BASE_URL}/resumes`, resumeData);
};

export const analyzeResume = async (resumeData, jobDescription) => {
  return await axios.post(`${API_BASE_URL}/resumes/analyze`, {
    resumeData,
    jobDescription
  });
};

export const getResumes = async (userId) => {
  return await axios.get(`${API_BASE_URL}/resumes/${userId}`);
};