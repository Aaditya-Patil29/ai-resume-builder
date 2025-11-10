const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const resumeRoutes = require('./routes/resumeRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ AI Resume Builder API is running!',
    status: 'success',
    timestamp: new Date().toISOString(),
    endpoints: {
      resumes: '/api/resumes',
      ai: '/api/ai'
    }
  });
});

// API Routes
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-builder';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.log('❌ MongoDB Connection Error:', err.message);
    console.log('💡 Tip: Make sure MongoDB is running or check your connection string');
  });

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('🚀 ================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🚀 Visit: http://localhost:${PORT}`);
  console.log('🚀 ================================');
});

// Handle server errors
process.on('unhandledRejection', (err) => {
  console.log('❌ Unhandled Rejection:', err.message);
});