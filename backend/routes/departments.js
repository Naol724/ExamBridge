const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  validateDepartment
} = require('../controllers/departmentController');

// @route   GET /api/departments
// @desc    Get all departments
// @access  Public
router.get('/', getDepartments);

// @route   GET /api/departments/:id
// @desc    Get single department
// @access  Public
router.get('/:id', getDepartment);

// @route   POST /api/departments
// @desc    Create department
// @access  Private/Admin
router.post('/', protect, adminOnly, validateDepartment, createDepartment);

// @route   PUT /api/departments/:id
// @desc    Update department
// @access  Private/Admin
router.put('/:id', protect, adminOnly, validateDepartment, updateDepartment);

// @route   DELETE /api/departments/:id
// @desc    Delete department
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, deleteDepartment);

module.exports = router;
