import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI Resume Builder
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Build ATS-friendly resumes with AI-powered suggestions
          </p>
          <button
            onClick={() => navigate('/builder')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
          >
            Create Your Resume
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;