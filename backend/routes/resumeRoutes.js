const express = require('express');
const router = express.Router();
const {
  createResume,
  getResumes,
  getResume,
  updateResume,
  deleteResume,
  getStats
} = require('../controllers/resumeController');

// Resume CRUD operations
router.post('/', createResume);
router.get('/user/:userId', getResumes);
router.get('/stats/:userId', getStats);
router.get('/:id', getResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

module.exports = router;