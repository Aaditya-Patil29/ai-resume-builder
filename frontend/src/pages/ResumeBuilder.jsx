import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Move Card component outside to prevent re-creation
const Card = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 hover:shadow-md transition-shadow">
    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-l-4 border-indigo-500 pl-3">
      {title}
    </h2>
    {children}
  </div>
);

function ResumeBuilder() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    personalInfo: { fullName: "", email: "", phone: "", location: "" },
    summary: "",
    skills: [],
    experience: [],
    projects: [],
    education: [],
  });

  const [skillInput, setSkillInput] = useState("");

  // ---------------------- INPUT HANDLERS ----------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ---------------------- SKILLS ----------------------
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const skill = skillInput.trim();
      if (!skill) return;

      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));

      setSkillInput("");
    }
  };

  const removeSkill = (s) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((x) => x !== s),
    }));
  };

  // ---------------------- EXPERIENCE ----------------------
  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { role: "", company: "", duration: "", description: "" },
      ],
    }));
  };

  const updateExperience = (i, key, value) => {
    setFormData((prev) => {
      const arr = [...prev.experience];
      arr[i] = { ...arr[i], [key]: value };
      return { ...prev, experience: arr };
    });
  };

  const removeExperience = (i) => {
    setFormData((prev) => {
      const arr = [...prev.experience];
      arr.splice(i, 1);
      return { ...prev, experience: arr };
    });
  };

  // ---------------------- PROJECTS ----------------------
  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: "", tech: "", description: "", link: "" }],
    }));
  };

  const updateProject = (i, key, value) => {
    setFormData((prev) => {
      const arr = [...prev.projects];
      arr[i] = { ...arr[i], [key]: value };
      return { ...prev, projects: arr };
    });
  };

  const removeProject = (i) => {
    setFormData((prev) => {
      const arr = [...prev.projects];
      arr.splice(i, 1);
      return { ...prev, projects: arr };
    });
  };

  // ---------------------- EDUCATION ----------------------
  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { school: "", degree: "", year: "" }],
    }));
  };

  const updateEducation = (i, key, value) => {
    setFormData((prev) => {
      const arr = [...prev.education];
      arr[i] = { ...arr[i], [key]: value };
      return { ...prev, education: arr };
    });
  };

  const removeEducation = (i) => {
    setFormData((prev) => {
      const arr = [...prev.education];
      arr.splice(i, 1);
      return { ...prev, education: arr };
    });
  };

  // ---------------------- PREVIEW ----------------------
  const handlePreview = () => {
    navigate("/preview", { state: { formData } });
  };

  // Input class as constant
  const inputClass =
    "border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent w-full transition outline-none bg-white";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Resume Builder
          </h1>
          <p className="text-gray-600">Create your professional resume in minutes</p>
        </div>

        {/* PERSONAL INFO */}
        <Card title="Personal Information">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="personalInfo.fullName"
              placeholder="Full Name"
              value={formData.personalInfo.fullName}
              onChange={handleInputChange}
              className={inputClass}
            />
            <input
              type="email"
              name="personalInfo.email"
              placeholder="Email"
              value={formData.personalInfo.email}
              onChange={handleInputChange}
              className={inputClass}
            />
            <input
              type="tel"
              name="personalInfo.phone"
              placeholder="Phone"
              value={formData.personalInfo.phone}
              onChange={handleInputChange}
              className={inputClass}
            />
            <input
              type="text"
              name="personalInfo.location"
              placeholder="Location"
              value={formData.personalInfo.location}
              onChange={handleInputChange}
              className={inputClass}
            />
          </div>
        </Card>

        {/* SUMMARY */}
        <Card title="Professional Summary">
          <textarea
            name="summary"
            rows={4}
            placeholder="Write a brief summary about yourself..."
            value={formData.summary}
            onChange={handleInputChange}
            className={inputClass}
          />
        </Card>

        {/* SKILLS */}
        <Card title="Skills">
          <input
            type="text"
            placeholder="Type a skill and press Enter"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            className={`${inputClass} mb-3`}
          />

          <div className="flex flex-wrap gap-2">
            {formData.skills.length === 0 && (
              <p className="text-gray-500 text-sm">No skills added yet.</p>
            )}

            {formData.skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md flex items-center gap-2 text-sm border border-indigo-200"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-indigo-600 hover:text-red-600 font-semibold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </Card>

        {/* EXPERIENCE */}
        <Card title="Experience">
          <button
            onClick={addExperience}
            className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
          >
            + Add Experience
          </button>

          {formData.experience.map((exp, index) => (
            <div key={index} className="border-t border-gray-200 pt-4 mt-4 space-y-3">
              <input
                className={inputClass}
                placeholder="Role"
                value={exp.role}
                onChange={(e) => updateExperience(index, "role", e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Company"
                value={exp.company}
                onChange={(e) => updateExperience(index, "company", e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Duration (e.g., Jan 2020 - Present)"
                value={exp.duration}
                onChange={(e) => updateExperience(index, "duration", e.target.value)}
              />
              <textarea
                className={inputClass}
                placeholder="Description"
                rows={3}
                value={exp.description}
                onChange={(e) => updateExperience(index, "description", e.target.value)}
              />
              <button
                onClick={() => removeExperience(index)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </Card>

        {/* PROJECTS */}
        <Card title="Projects">
          <button
            onClick={addProject}
            className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
          >
            + Add Project
          </button>

          {formData.projects.map((pr, index) => (
            <div key={index} className="border-t border-gray-200 pt-4 mt-4 space-y-3">
              <input
                className={inputClass}
                placeholder="Project Title"
                value={pr.title}
                onChange={(e) => updateProject(index, "title", e.target.value)}
              />
              <input
                className={inputClass}
                placeholder="Tech Stack"
                value={pr.tech}
                onChange={(e) => updateProject(index, "tech", e.target.value)}
              />
              <textarea
                className={inputClass}
                placeholder="Description"
                rows={3}
                value={pr.description}
                onChange={(e) =>
                  updateProject(index, "description", e.target.value)
                }
              />
              <input
                className={inputClass}
                placeholder="Project Link (optional)"
                value={pr.link}
                onChange={(e) => updateProject(index, "link", e.target.value)}
              />
              <button
                onClick={() => removeProject(index)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </Card>

        {/* EDUCATION */}
        <Card title="Education">
          <button
            onClick={addEducation}
            className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
          >
            + Add Education
          </button>

          {formData.education.map((ed, index) => (
            <div key={index} className="border-t border-gray-200 pt-4 mt-4 space-y-3">
              <input
                className={inputClass}
                placeholder="School / University"
                value={ed.school}
                onChange={(e) =>
                  updateEducation(index, "school", e.target.value)
                }
              />
              <input
                className={inputClass}
                placeholder="Degree"
                value={ed.degree}
                onChange={(e) =>
                  updateEducation(index, "degree", e.target.value)
                }
              />
              <input
                className={inputClass}
                placeholder="Year (e.g., 2020 - 2024)"
                value={ed.year}
                onChange={(e) => updateEducation(index, "year", e.target.value)}
              />
              <button
                onClick={() => removeEducation(index)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </Card>

        {/* PREVIEW BUTTON */}
        <div className="flex justify-center mt-8 mb-12">
          <button
            onClick={handlePreview}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium"
          >
             Preview Resume
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;