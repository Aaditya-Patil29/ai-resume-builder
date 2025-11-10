const Resume = require('../models/Resume');

// @desc    Create new resume
// @route   POST /api/resumes
// @access  Public
exports.createResume = async (req, res) => {
  try {
    const resume = new Resume(req.body);
    await resume.save();
    
    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: resume
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all resumes for a user
// @route   GET /api/resumes/user/:userId
// @access  Public
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.params.userId })
      .sort({ createdAt: -1 }); // Most recent first
    
    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resumes/:id
// @access  Public
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Public
exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      data: resume
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Public
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get resume statistics
// @route   GET /api/resumes/stats/:userId
// @access  Public
exports.getStats = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.params.userId });
    
    const stats = {
      totalResumes: resumes.length,
      averageAtsScore: resumes.length > 0
        ? resumes.reduce((sum, r) => sum + r.atsScore, 0) / resumes.length
        : 0,
      lastUpdated: resumes.length > 0 
        ? resumes[0].updatedAt 
        : null,
      analyzedResumes: resumes.filter(r => r.atsScore > 0).length
    };
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};