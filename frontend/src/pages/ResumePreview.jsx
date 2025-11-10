import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const STORAGE_KEY = "resume_builder_form_v1";

function ResumePreview() {
  const nav = useNavigate();
  const { state } = useLocation();
  const [data, setData] = useState(state?.formData || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const resumeRef = useRef(null);

  useEffect(() => {
    if (!state?.formData) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setData(JSON.parse(saved));
      } catch {}
    }
  }, [state]);

  const fullName = data?.personalInfo?.fullName || "Your Name";
  const email = data?.personalInfo?.email || "email@example.com";
  const phone = data?.personalInfo?.phone || "0000000000";
  const location = data?.personalInfo?.location || "Your City";
  const summary = data?.summary || "";
  const skills = data?.skills || [];
  const experience = data?.experience || [];
  const projects = data?.projects || [];
  const education = data?.education || [];

  const onDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = resumeRef.current;
      const opt = {
        margin: 0.5,
        filename: `${fullName.replace(/\s+/g, '_')}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try using the Print option instead.');
    } finally {
      setIsGenerating(false);
    }
  };

  const section = (title, children) => (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2 border-gray-300 uppercase tracking-wide">
        {title}
      </h2>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between mb-6 no-print">
          <button 
            onClick={() => nav(-1)} 
            className="px-5 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all border border-gray-300 flex items-center gap-2 shadow-sm font-medium"
          >
            <span>←</span> Back to Editor
          </button>
          <div className="flex gap-3">
            <button 
              onClick={() => window.print()} 
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 font-medium shadow-sm"
            >
              🖨️ Print
            </button>
            <button 
              onClick={onDownloadPDF}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? '⏳ Generating...' : '⬇️ Download PDF'}
            </button>
          </div>
        </div>

        {/* Resume Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div ref={resumeRef} className="p-10">
            
            {/* Header Section */}
            <div className="text-center mb-6 pb-5 border-b-2 border-gray-800">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-tight">
                {fullName}
              </h1>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="text-gray-800">📍</span> {location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="text-gray-800">📞</span> {phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="text-gray-800">📧</span> {email}
                </span>
              </div>
            </div>

            {/* Professional Summary */}
            {summary && section(
              "Professional Summary",
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            )}

            {/* Skills */}
            {skills.length > 0 && section(
              "Skills",
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-800 rounded border border-gray-300 text-sm font-medium">
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* Experience */}
            {experience.length > 0 && section(
              "Experience",
              <div className="space-y-4">
                {experience.map((e, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{e.role || "Role"}</h3>
                        <p className="text-gray-700 font-semibold text-sm">{e.company || "Company"}</p>
                      </div>
                      <span className="text-sm text-gray-600 italic">{e.duration || "—"}</span>
                    </div>
                    {e.description && (
                      <p className="text-gray-700 text-sm leading-relaxed mt-1">{e.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {projects.length > 0 && section(
              "Projects",
              <div className="space-y-3">
                {projects.map((p, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-base font-bold text-gray-900">{p.title || "Project"}</h3>
                      {p.link && (
                        <a 
                          href={p.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium no-print-link"
                        >
                          View →
                        </a>
                      )}
                    </div>
                    {p.tech && (
                      <p className="text-sm text-gray-600 italic mb-1">{p.tech}</p>
                    )}
                    {p.description && (
                      <p className="text-gray-700 text-sm leading-relaxed">{p.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {education.length > 0 && section(
              "Education",
              <div className="space-y-2">
                {education.map((ed, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">{ed.degree || "Degree"}</h3>
                      <p className="text-gray-700 text-sm font-semibold">{ed.school || "School"}</p>
                    </div>
                    <span className="text-sm text-gray-600 italic">{ed.year || ""}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 text-center text-gray-600 text-sm no-print">
          💡 Tip: Use "Download PDF" for best quality, or "Print" to save as PDF from your browser
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .no-print-link {
            display: none !important;
          }
          @page {
            margin: 0.5in;
          }
        }
      `}</style>
    </div>
  );
}

export default ResumePreview;