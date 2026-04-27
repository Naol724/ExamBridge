const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getYearsByDepartment,
  getYear,
  createYear,
  updateYear,
  deleteYear,
  validateYear
} = require('../controllers/yearController');

// @route   GET /api/departments/:departmentId/years
// @desc    Get years by department
// @access  Public
router.get('/departments/:departmentId', getYearsByDepartment);

// @route   GET /api/years/:id
// @desc    Get single year
// @access  Public
router.get('/:id', getYear);

// @route   POST /api/years
// @desc    Create year
// @access  Private/Admin
router.post('/', protect, adminOnly, validateYear, createYear);

// @route   PUT /api/years/:id
// @desc    Update year
// @access  Private/Admin
router.put('/:id', protect, adminOnly, validateYear, updateYear);

// @route   DELETE /api/years/:id
// @desc    Delete year
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, deleteYear);

module.exports = router;
