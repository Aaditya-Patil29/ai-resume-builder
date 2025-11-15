import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const templates = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional and professional layout',
    preview: '📄',
    color: 'blue'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean design with accent colors',
    preview: '🎨',
    color: 'indigo'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant',
    preview: '✨',
    color: 'gray'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and eye-catching',
    preview: '🚀',
    color: 'purple'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate and polished',
    preview: '💼',
    color: 'slate'
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Perfect for developers',
    preview: '💻',
    color: 'green'
  }
];

function Templates() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [selectedTemplate, setSelectedTemplate] = useState('classic');

  const handleSelectTemplate = () => {
    // Get form data from state or localStorage
    const formData = state?.formData || JSON.parse(localStorage.getItem('resumeData') || '{}');
    
    navigate('/preview', { 
      state: { 
        formData,
        template: selectedTemplate 
      } 
    });
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'border-blue-500 bg-blue-50',
      indigo: 'border-indigo-500 bg-indigo-50',
      gray: 'border-gray-500 bg-gray-50',
      purple: 'border-purple-500 bg-purple-50',
      slate: 'border-slate-500 bg-slate-50',
      green: 'border-green-500 bg-green-50'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Choose Your Template
          </h1>
          <p className="text-gray-600">Select a template that best represents you</p>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`cursor-pointer bg-white rounded-lg p-6 border-2 transition-all hover:shadow-lg ${
                selectedTemplate === template.id
                  ? `${getColorClasses(template.color)} border-2`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-6xl mb-4 text-center">{template.preview}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                {template.name}
              </h3>
              <p className="text-gray-600 text-sm text-center mb-4">
                {template.description}
              </p>
              {selectedTemplate === template.id && (
                <div className="text-center">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    ✓ Selected
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-300 transition font-medium"
          >
            ← Back
          </button>
          <button
            onClick={handleSelectTemplate}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium"
          >
            Continue with {templates.find(t => t.id === selectedTemplate)?.name}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Templates;