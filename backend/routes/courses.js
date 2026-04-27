const express = require('express');
const router = express.Router();
const { protect, adminOnly, studentOnly } = require('../middleware/auth');
const {
  getCoursesBySemester,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  validateCourse
} = require('../controllers/courseController');

// @route   GET /api/courses
// @desc    Get all courses (admin view)
// @access  Private/Admin
router.get('/', protect, adminOnly, getAllCourses);

// @route   GET /api/semesters/:semesterId/courses
// @desc    Get courses by semester
// @access  Public
router.get('/semesters/:semesterId', getCoursesBySemester);

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', getCourse);

// @route   POST /api/courses
// @desc    Create course
// @access  Private/Admin
router.post('/', protect, adminOnly, validateCourse, createCourse);

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private/Admin
router.put('/:id', protect, adminOnly, validateCourse, updateCourse);

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, deleteCourse);

module.exports = router;
