import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResumes, deleteResume, getStats } from '../services/api.js';

function Dashboard() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = "guest"; // Replace with actual user ID from auth

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resumesRes, statsRes] = await Promise.all([
        getResumes(userId),
        getStats(userId)
      ]);
      
      if (resumesRes.data.success) {
        setResumes(resumesRes.data.data);
      }
      
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) {
      return;
    }
    
    try {
      const response = await deleteResume(id);
      if (response.data.success) {
        setResumes(resumes.filter(r => r._id !== id));
        fetchData(); // Refresh stats
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Failed to delete resume");
    }
  };

  const handleEdit = (resume) => {
    // Transform backend data to frontend format
    const formData = {
      personalInfo: resume.personalInfo,
      summary: resume.summary,
      skills: resume.skills,
      experience: resume.experience.map(exp => ({
        role: exp.position,
        company: exp.company,
        duration: `${exp.startDate} - ${exp.endDate}`,
        description: exp.description
      })),
      projects: resume.projects.map(proj => ({
        title: proj.name,
        tech: proj.technologies.join(', '),
        description: proj.description,
        link: proj.link
      })),
      education: resume.education.map(edu => ({
        school: edu.institution,
        degree: edu.degree,
        year: edu.graduationYear
      }))
    };
    
    navigate('/builder', { state: { formData, resumeId: resume._id } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Manage your resumes</p>
          </div>
          <button 
            onClick={() => navigate('/builder')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            + Create New Resume
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm mb-1">Total Resumes</div>
              <div className="text-3xl font-bold text-indigo-600">{stats.totalResumes}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm mb-1">Average ATS Score</div>
              <div className="text-3xl font-bold text-green-600">
                {stats.averageAtsScore.toFixed(1)}%
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-gray-600 text-sm mb-1">Analyzed Resumes</div>
              <div className="text-3xl font-bold text-blue-600">{stats.analyzedResumes}</div>
            </div>
          </div>
        )}

        {/* Resumes List */}
        {resumes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-6">Create your first resume to get started</p>
            <button 
              onClick={() => navigate('/builder')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Create Resume
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {resumes.map((resume) => (
              <div key={resume._id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {resume.personalInfo.fullName}
                    </h3>
                    <p className="text-sm text-gray-600">{resume.personalInfo.email}</p>
                  </div>
                  {resume.atsScore > 0 && (
                    <div className="text-right">
                      <div className="text-sm text-gray-600">ATS Score</div>
                      <div className={`text-2xl font-bold ${
                        resume.atsScore >= 80 ? 'text-green-600' : 
                        resume.atsScore >= 60 ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {resume.atsScore}%
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <div>Skills: {resume.skills.length}</div>
                  <div>Experience: {resume.experience.length}</div>
                  <div>Education: {resume.education.length}</div>
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(resume)}
                    className="flex-1 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => navigate('/preview', { state: { resumeId: resume._id } })}
                    className="flex-1 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-medium"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => handleDelete(resume._id)}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;