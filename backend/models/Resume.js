const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'guest'
  },
  
  personalInfo: {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: String,
    location: String,
    linkedin: String,
    portfolio: String,
    github: String
  },
  
  summary: {
    type: String,
    default: ''
  },
  
  experience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    current: {
      type: Boolean,
      default: false
    },
    description: String,
    achievements: [String]
  }],
  
  education: [{
    institution: String,
    degree: String,
    field: String,
    graduationYear: String,
    gpa: String
  }],
  
  skills: {
    type: [String],
    default: []
  },
  
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    link: String,
    github: String
  }],
  
  certifications: [{
    name: String,
    issuer: String,
    date: String,
    credentialId: String
  }],
  
  // AI Analysis Results
  atsScore: {
    type: Number,
    default: 0
  },
  
  suggestions: {
    type: [String],
    default: []
  },
  
  missingKeywords: {
    type: [String],
    default: []
  },
  
  lastAnalyzed: {
    type: Date
  }
  
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster queries
resumeSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);