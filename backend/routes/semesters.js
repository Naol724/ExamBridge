const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getSemestersByYear,
  getSemester,
  createSemester,
  updateSemester,
  deleteSemester,
  validateSemester
} = require('../controllers/semesterController');

// @route   GET /api/years/:yearId/semesters
// @desc    Get semesters by year
// @access  Public
router.get('/years/:yearId', getSemestersByYear);

// @route   GET /api/semesters/:id
// @desc    Get single semester
// @access  Public
router.get('/:id', getSemester);

// @route   POST /api/semesters
// @desc    Create semester
// @access  Private/Admin
router.post('/', protect, adminOnly, validateSemester, createSemester);

// @route   PUT /api/semesters/:id
// @desc    Update semester
// @access  Private/Admin
router.put('/:id', protect, adminOnly, validateSemester, updateSemester);

// @route   DELETE /api/semesters/:id
// @desc    Delete semester
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, deleteSemester);

module.exports = router;
