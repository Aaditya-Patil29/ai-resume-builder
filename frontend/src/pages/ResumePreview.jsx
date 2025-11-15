import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ResumePreview() {
  const nav = useNavigate();
  const { state } = useLocation();
  const [data, setData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const resumeRef = useRef(null);

  useEffect(() => {
    // Get data from state or localStorage
    if (state?.formData) {
      setData(state.formData);
      setSelectedTemplate(state.template || 'classic');
    } else {
      try {
        const saved = localStorage.getItem("resumeData");
        if (saved) {
          setData(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Error loading resume data:", error);
      }
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

  // Template Components
  const ClassicTemplate = () => (
    <div className="p-10">
      <div className="text-center mb-6 pb-5 border-b-2 border-gray-800">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-tight">{fullName}</h1>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600 flex-wrap">
          <span>📍 {location}</span>
          <span>•</span>
          <span>📞 {phone}</span>
          <span>•</span>
          <span>📧 {email}</span>
        </div>
      </div>
      {summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2 border-gray-300 uppercase">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2 border-gray-300 uppercase">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span key={i} className="px-3 py-1 bg-gray-100 text-gray-800 rounded border border-gray-300 text-sm font-medium">{s}</span>
            ))}
          </div>
        </div>
      )}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2 border-gray-300 uppercase">Experience</h2>
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
                {e.description && <p className="text-gray-700 text-sm leading-relaxed mt-1">{e.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2 border-gray-300 uppercase">Projects</h2>
          <div className="space-y-3">
            {projects.map((p, i) => (
              <div key={i}>
                <h3 className="text-base font-bold text-gray-900">{p.title || "Project"}</h3>
                {p.tech && <p className="text-sm text-gray-600 italic mb-1">{p.tech}</p>}
                {p.description && <p className="text-gray-700 text-sm leading-relaxed">{p.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2 border-gray-300 uppercase">Education</h2>
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
        </div>
      )}
    </div>
  );

  const ModernTemplate = () => (
    <div className="p-10">
      <div className="bg-indigo-600 text-white p-6 -m-10 mb-6">
        <h1 className="text-4xl font-bold mb-2">{fullName}</h1>
        <div className="flex gap-4 text-sm flex-wrap">
          <span>📍 {location}</span>
          <span>📞 {phone}</span>
          <span>📧 {email}</span>
        </div>
      </div>
      {summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-3 border-l-4 border-indigo-600 pl-3">About Me</h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-3 border-l-4 border-indigo-600 pl-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span key={i} className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">{s}</span>
            ))}
          </div>
        </div>
      )}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-3 border-l-4 border-indigo-600 pl-3">Experience</h2>
          {experience.map((e, i) => (
            <div key={i} className="mb-4 pl-4 border-l-2 border-indigo-200">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-gray-900">{e.role}</h3>
                  <p className="text-indigo-600 text-sm">{e.company}</p>
                </div>
                <span className="text-xs text-gray-500">{e.duration}</span>
              </div>
              {e.description && <p className="text-gray-700 text-sm mt-2">{e.description}</p>}
            </div>
          ))}
        </div>
      )}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-3 border-l-4 border-indigo-600 pl-3">Projects</h2>
          {projects.map((p, i) => (
            <div key={i} className="mb-3">
              <h3 className="font-bold text-gray-900">{p.title}</h3>
              {p.tech && <p className="text-xs text-indigo-600 mb-1">{p.tech}</p>}
              {p.description && <p className="text-gray-700 text-sm">{p.description}</p>}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-indigo-600 mb-3 border-l-4 border-indigo-600 pl-3">Education</h2>
          {education.map((ed, i) => (
            <div key={i} className="flex justify-between mb-2">
              <div>
                <h3 className="font-bold text-gray-900">{ed.degree}</h3>
                <p className="text-sm text-gray-700">{ed.school}</p>
              </div>
              <span className="text-xs text-gray-500">{ed.year}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const MinimalTemplate = () => (
    <div className="p-10 font-serif">
      <div className="mb-8">
        <h1 className="text-5xl font-light text-gray-900 mb-1">{fullName}</h1>
        <p className="text-sm text-gray-600">{location} · {phone} · {email}</p>
      </div>
      {summary && (
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed text-sm">{summary}</p>
        </div>
      )}
      {experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-sans">Experience</h2>
          {experience.map((e, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold text-gray-900">{e.role}</h3>
                <span className="text-xs text-gray-500">{e.duration}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{e.company}</p>
              {e.description && <p className="text-sm text-gray-700">{e.description}</p>}
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-sans">Skills</h2>
          <p className="text-sm text-gray-700">{skills.join(' · ')}</p>
        </div>
      )}
      {projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-sans">Projects</h2>
          {projects.map((p, i) => (
            <div key={i} className="mb-3">
              <h3 className="font-semibold text-gray-900 text-sm">{p.title}</h3>
              {p.description && <p className="text-sm text-gray-700">{p.description}</p>}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-sans">Education</h2>
          {education.map((ed, i) => (
            <div key={i} className="mb-2 flex justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{ed.degree}</h3>
                <p className="text-sm text-gray-600">{ed.school}</p>
              </div>
              <span className="text-xs text-gray-500">{ed.year}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const CreativeTemplate = () => (
    <div className="p-10">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 -m-10 mb-8 rounded-br-[100px]">
        <h1 className="text-5xl font-black mb-3">{fullName}</h1>
        <div className="text-sm space-y-1">
          <div>📍 {location}</div>
          <div>📞 {phone}</div>
          <div>📧 {email}</div>
        </div>
      </div>
      {summary && (
        <div className="mb-6 bg-purple-50 p-4 rounded-lg">
          <h2 className="text-2xl font-black text-purple-600 mb-2">✨ About Me</h2>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-black text-purple-600 mb-3">🚀 Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span key={i} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold shadow-md">{s}</span>
            ))}
          </div>
        </div>
      )}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-black text-purple-600 mb-3">💼 Experience</h2>
          {experience.map((e, i) => (
            <div key={i} className="mb-4 bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
              <div className="flex justify-between mb-1">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{e.role}</h3>
                  <p className="text-purple-600">{e.company}</p>
                </div>
                <span className="text-sm text-gray-500">{e.duration}</span>
              </div>
              {e.description && <p className="text-gray-700 text-sm mt-2">{e.description}</p>}
            </div>
          ))}
        </div>
      )}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-black text-purple-600 mb-3">🎨 Projects</h2>
          {projects.map((p, i) => (
            <div key={i} className="mb-3 bg-pink-50 p-3 rounded-lg">
              <h3 className="font-bold text-gray-900">{p.title}</h3>
              {p.tech && <p className="text-xs text-pink-600 mb-1">{p.tech}</p>}
              {p.description && <p className="text-gray-700 text-sm">{p.description}</p>}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-black text-purple-600 mb-3">🎓 Education</h2>
          {education.map((ed, i) => (
            <div key={i} className="mb-2 bg-gray-50 p-3 rounded-lg flex justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{ed.degree}</h3>
                <p className="text-sm text-gray-700">{ed.school}</p>
              </div>
              <span className="text-sm text-gray-500">{ed.year}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ProfessionalTemplate = () => (
    <div className="p-10 bg-white">
      <div className="border-b-4 border-slate-700 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">{fullName}</h1>
        <div className="text-sm text-slate-600">
          {location} | {phone} | {email}
        </div>
      </div>
      {summary && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-slate-700 mb-2 tracking-wide">Executive Summary</h2>
          <p className="text-slate-700 text-sm leading-relaxed">{summary}</p>
        </div>
      )}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-slate-700 mb-3 tracking-wide">Professional Experience</h2>
          {experience.map((e, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-slate-900">{e.role}</h3>
                  <p className="text-slate-600 text-sm">{e.company}</p>
                </div>
                <span className="text-xs text-slate-500 italic">{e.duration}</span>
              </div>
              {e.description && <p className="text-slate-700 text-sm mt-1">{e.description}</p>}
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-slate-700 mb-2 tracking-wide">Core Competencies</h2>
          <div className="grid grid-cols-3 gap-2">
            {skills.map((s, i) => (
              <div key={i} className="text-sm text-slate-700">• {s}</div>
            ))}
          </div>
        </div>
      )}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-slate-700 mb-3 tracking-wide">Key Projects</h2>
          {projects.map((p, i) => (
            <div key={i} className="mb-3">
              <h3 className="font-bold text-slate-900 text-sm">{p.title}</h3>
              {p.description && <p className="text-slate-700 text-sm">{p.description}</p>}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase text-slate-700 mb-3 tracking-wide">Education</h2>
          {education.map((ed, i) => (
            <div key={i} className="flex justify-between mb-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{ed.degree}</h3>
                <p className="text-slate-600 text-sm">{ed.school}</p>
              </div>
              <span className="text-xs text-slate-500">{ed.year}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const TechTemplate = () => (
    <div className="p-10 bg-slate-900 text-white">
      <div className="border-l-4 border-green-500 pl-4 mb-8">
        <h1 className="text-4xl font-mono font-bold mb-1">&gt; {fullName}</h1>
        <div className="text-sm text-green-400 font-mono">
          {location} :: {phone} :: {email}
        </div>
      </div>
      {summary && (
        <div className="mb-6">
          <h2 className="text-green-400 font-mono text-sm mb-2">// About</h2>
          <p className="text-gray-300 text-sm pl-4 border-l-2 border-green-500">{summary}</p>
        </div>
      )}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-green-400 font-mono text-sm mb-2">// Tech Stack</h2>
          <div className="flex flex-wrap gap-2 pl-4">
            {skills.map((s, i) => (
              <span key={i} className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs font-mono border border-green-500">{s}</span>
            ))}
          </div>
        </div>
      )}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-green-400 font-mono text-sm mb-2">// Experience</h2>
          {experience.map((e, i) => (
            <div key={i} className="mb-4 pl-4 border-l-2 border-green-500">
              <div className="flex justify-between mb-1">
                <div>
                  <h3 className="font-mono text-green-300">{e.role}</h3>
                  <p className="text-gray-400 text-sm">{e.company}</p>
                </div>
                <span className="text-xs text-gray-500 font-mono">{e.duration}</span>
              </div>
              {e.description && <p className="text-gray-300 text-sm mt-1">{e.description}</p>}
            </div>
          ))}
        </div>
      )}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-green-400 font-mono text-sm mb-2">// Projects</h2>
          {projects.map((p, i) => (
            <div key={i} className="mb-3 pl-4 border-l-2 border-green-500">
              <h3 className="font-mono text-green-300 text-sm">{p.title}</h3>
              {p.tech && <p className="text-xs text-green-400 mb-1 font-mono">[{p.tech}]</p>}
              {p.description && <p className="text-gray-300 text-sm">{p.description}</p>}
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-green-400 font-mono text-sm mb-2">// Education</h2>
          {education.map((ed, i) => (
            <div key={i} className="mb-2 pl-4 border-l-2 border-green-500 flex justify-between">
              <div>
                <h3 className="font-mono text-green-300 text-sm">{ed.degree}</h3>
                <p className="text-gray-400 text-sm">{ed.school}</p>
              </div>
              <span className="text-xs text-gray-500 font-mono">{ed.year}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern': return <ModernTemplate />;
      case 'minimal': return <MinimalTemplate />;
      case 'creative': return <CreativeTemplate />;
      case 'professional': return <ProfessionalTemplate />;
      case 'tech': return <TechTemplate />;
      default: return <ClassicTemplate />;
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Resume Data Found</h2>
          <button 
            onClick={() => nav('/builder')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go to Builder
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-6 no-print">
          <button onClick={() => nav(-1)} className="px-5 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all border border-gray-300 flex items-center gap-2 shadow-sm font-medium">
            <span>←</span> Back
          </button>
          <div className="flex gap-3">
            <button onClick={() => window.print()} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 font-medium shadow-sm">
              🖨️ Print
            </button>
            <button onClick={onDownloadPDF} disabled={isGenerating} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 font-medium shadow-sm disabled:opacity-50">
              {isGenerating ? '⏳ Generating...' : '📥 Download PDF'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div ref={resumeRef}>
            {renderTemplate()}
          </div>
        </div>

        <div className="mt-6 text-center text-gray-600 text-sm no-print">
          💡 Template: <strong>{selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)}</strong>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          @page { margin: 0.5in; }
        }
      `}</style>
    </div>
  );
}

export default ResumePreview;