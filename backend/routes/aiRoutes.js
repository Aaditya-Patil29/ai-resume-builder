const express = require('express');
const router = express.Router();
const { analyzeResume, improveSuggestion } = require('../controllers/aiController');

// AI operations
router.post('/analyze', analyzeResume);
router.post('/improve', improveSuggestion);

module.exports = router;