import React, { useState } from 'react';
import { createResume, analyzeResume } from '../services/api';

function ResumeBuilder() {
  const [formData, setFormData] = useState({
    userId: 'user123',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: ''
    },
    summary: '',
    experience: [],
    skills: []
  });

  const [atsScore, setAtsScore] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(s => s.trim());
    setFormData(prev => ({ ...prev, skills }));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeResume(formData, '');
      setAtsScore(result.data.atsScore);
      setSuggestions(result.data.suggestions);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please check if the backend is running.');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      await createResume({ ...formData, atsScore, suggestions });
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Save failed. Please check if the backend is running.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Build Your Resume</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Personal Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="personalInfo.fullName"
              placeholder="Full Name"
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="email"
              name="personalInfo.email"
              placeholder="Email"
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="tel"
              name="personalInfo.phone"
              placeholder="Phone"
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="personalInfo.location"
              placeholder="Location"
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Professional Summary</h2>
          <textarea
            name="summary"
            placeholder="Write a brief summary about yourself..."
            onChange={handleInputChange}
            rows="4"
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Skills</h2>
          <input
            type="text"
            placeholder="Enter skills separated by commas (e.g., React, Node.js, MongoDB)"
            onChange={handleSkillsChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? 'Analyzing...' : '🤖 Analyze with AI'}
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            💾 Save Resume
          </button>
        </div>

        {atsScore !== null && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">ATS Analysis Results</h2>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">ATS Score:</span>
                <span className={`text-2xl font-bold ${
                  atsScore >= 80 ? 'text-green-600' :
                  atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {atsScore}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    atsScore >= 80 ? 'bg-green-600' :
                    atsScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${atsScore}%` }}
                />
              </div>
            </div>

            <h3 className="font-bold mb-2">Suggestions:</h3>
            <ul className="list-disc pl-5 space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="text-gray-700">{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeBuilder;