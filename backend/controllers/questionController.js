const { body, validationResult } = require('express-validator');
const Question = require('../models/Question');
const Course = require('../models/Course');

// @desc    Get questions by course
// @route   GET /api/courses/:courseId/questions
// @access  Public
const getQuestionsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { type, year } = req.query;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Build query
    const query = { course: courseId };
    if (type) {
      query.type = type;
    }
    if (year) {
      query.year_of_exam = parseInt(year);
    }

    const questions = await Question.find(query)
      .sort({ year_of_exam: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Public
const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('course', 'name code');
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create question
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      course, 
      question_text, 
      type, 
      year_of_exam, 
      options, 
      correct_answer, 
      explanation, 
      difficulty, 
      marks 
    } = req.body;

    // Check if course exists
    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Validate options for multiple choice questions
    if (options && options.length > 0) {
      const hasCorrectOption = options.some(option => option.is_correct);
      if (!hasCorrectOption) {
        return res.status(400).json({ message: 'Multiple choice questions must have at least one correct option' });
      }
    }

    const question = await Question.create({
      course,
      question_text,
      type: type || 'practice',
      year_of_exam,
      options,
      correct_answer,
      explanation,
      difficulty: difficulty || 'medium',
      marks: marks || 1
    });

    const populatedQuestion = await Question.findById(question._id)
      .populate('course', 'name code');

    res.status(201).json({
      success: true,
      data: populatedQuestion
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private/Admin
const updateQuestion = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // If updating options, validate them
    if (req.body.options && req.body.options.length > 0) {
      const hasCorrectOption = req.body.options.some(option => option.is_correct);
      if (!hasCorrectOption) {
        return res.status(400).json({ message: 'Multiple choice questions must have at least one correct option' });
      }
    }

    // If updating course, validate it exists
    if (req.body.course) {
      const courseDoc = await Course.findById(req.body.course);
      if (!courseDoc) {
        return res.status(404).json({ message: 'Course not found' });
      }
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('course', 'name code');

    res.status(200).json({
      success: true,
      data: updatedQuestion
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await question.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all questions (admin view)
// @route   GET /api/questions
// @access  Private/Admin
const getAllQuestions = async (req, res) => {
  try {
    const { type, course, year } = req.query;
    
    // Build query
    const query = {};
    if (type) query.type = type;
    if (course) query.course = course;
    if (year) query.year_of_exam = parseInt(year);

    const questions = await Question.find(query)
      .populate('course', 'name code')
      .sort({ course: 1, year_of_exam: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Get all questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get practice questions for student
// @route   GET /api/courses/:courseId/practice
// @access  Private/Student
const getPracticeQuestions = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { limit = 10, difficulty } = req.query;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Build query for practice questions only
    const query = { 
      course: courseId, 
      type: 'practice' 
    };
    
    if (difficulty) {
      query.difficulty = difficulty;
    }

    const questions = await Question.find(query)
      .limit(parseInt(limit))
      .sort({ difficulty: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    console.error('Get practice questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Validation rules
const validateQuestion = [
  body('course').isMongoId().withMessage('Valid course ID is required'),
  body('question_text').trim().notEmpty().withMessage('Question text is required'),
  body('type').optional().isIn(['past', 'practice']).withMessage('Type must be past or practice'),
  body('year_of_exam').optional().isInt({ min: 2015 }).withMessage('Year of exam must be 2015 or later'),
  body('options').optional().isArray().withMessage('Options must be an array'),
  body('options.*.text').optional().notEmpty().withMessage('Option text is required'),
  body('options.*.is_correct').optional().isBoolean().withMessage('is_correct must be boolean'),
  body('correct_answer').optional().trim().notEmpty().withMessage('Correct answer is required'),
  body('explanation').optional().trim(),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty level'),
  body('marks').optional().isInt({ min: 1 }).withMessage('Marks must be at least 1')
];

module.exports = {
  getQuestionsByCourse,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAllQuestions,
  getPracticeQuestions,
  validateQuestion
};
