const express = require('express');
const router = express.Router();
const { protect, adminOnly, studentOnly } = require('../middleware/auth');
const {
  getQuestionsByCourse,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
  getPracticeQuestions,
  validateQuestion
} = require('../controllers/questionController');

// @route   GET /api/questions
// @desc    Get all questions (admin view)
// @access  Private/Admin
router.get('/', protect, adminOnly, getAllQuestions);

// @route   GET /api/courses/:courseId/questions
// @desc    Get questions by course
// @access  Public
router.get('/courses/:courseId', getQuestionsByCourse);

// @route   GET /api/courses/:courseId/practice
// @desc    Get practice questions for student
// @access  Private/Student
router.get('/courses/:courseId/practice', protect, studentOnly, getPracticeQuestions);

// @route   GET /api/questions/:id
// @desc    Get single question
// @access  Public
router.get('/:id', getQuestion);

// @route   POST /api/questions
// @desc    Create question
// @access  Private/Admin
router.post('/', protect, adminOnly, validateQuestion, createQuestion);

// @route   PUT /api/questions/:id
// @desc    Update question
// @access  Private/Admin
router.put('/:id', protect, adminOnly, validateQuestion, updateQuestion);

// @route   DELETE /api/questions/:id
// @desc    Delete question
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, deleteQuestion);

module.exports = router;
