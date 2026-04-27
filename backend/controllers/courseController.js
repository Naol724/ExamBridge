const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const Semester = require('../models/Semester');
const Department = require('../models/Department');
const Question = require('../models/Question');
const Note = require('../models/Note');

// @desc    Get courses by semester
// @route   GET /api/semesters/:semesterId/courses
// @access  Public
const getCoursesBySemester = async (req, res) => {
  try {
    const { semesterId } = req.params;
    
    // Check if semester exists
    const semester = await Semester.findById(semesterId);
    if (!semester) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    const courses = await Course.find({ semester: semesterId })
      .populate('department', 'name')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('semester', 'semester_number name')
      .populate('department', 'name total_years');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get course statistics
    const [questionsCount, notesCount] = await Promise.all([
      Question.countDocuments({ course: req.params.id }),
      Note.countDocuments({ course: req.params.id })
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...course.toObject(),
        stats: {
          questionsCount,
          notesCount
        }
      }
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, code, semester, department, description, credits } = req.body;

    // Check if semester exists
    const semesterDoc = await Semester.findById(semester);
    if (!semesterDoc) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    // Check if department exists
    const departmentDoc = await Department.findById(department);
    if (!departmentDoc) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if course name already exists in this semester
    const existingCourse = await Course.findOne({ name, semester });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course with this name already exists in this semester' });
    }

    const course = await Course.create({
      name,
      code,
      semester,
      department,
      description,
      credits
    });

    const populatedCourse = await Course.findById(course._id)
      .populate('semester', 'semester_number name')
      .populate('department', 'name');

    res.status(201).json({
      success: true,
      data: populatedCourse
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // If updating name and semester, check for duplicates
    if (req.body.name && req.body.semester) {
      const existingCourse = await Course.findOne({ 
        name: req.body.name, 
        semester: req.body.semester,
        _id: { $ne: req.params.id }
      });
      if (existingCourse) {
        return res.status(400).json({ message: 'Course with this name already exists in this semester' });
      }
    }

    // If updating semester, validate it exists
    if (req.body.semester) {
      const semesterDoc = await Semester.findById(req.body.semester);
      if (!semesterDoc) {
        return res.status(404).json({ message: 'Semester not found' });
      }
    }

    // If updating department, validate it exists
    if (req.body.department) {
      const departmentDoc = await Department.findById(req.body.department);
      if (!departmentDoc) {
        return res.status(404).json({ message: 'Department not found' });
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('semester', 'semester_number name')
     .populate('department', 'name');

    res.status(200).json({
      success: true,
      data: updatedCourse
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if course has associated questions or notes
    const [questionsCount, notesCount] = await Promise.all([
      Question.countDocuments({ course: req.params.id }),
      Note.countDocuments({ course: req.params.id })
    ]);

    if (questionsCount > 0 || notesCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete course with associated questions or notes. Delete them first.' 
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all courses (admin view)
// @route   GET /api/courses
// @access  Private/Admin
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('semester', 'semester_number name')
      .populate('department', 'name')
      .sort({ 'department': 1, 'semester': 1, 'name': 1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Validation rules
const validateCourse = [
  body('name').trim().notEmpty().withMessage('Course name is required')
    .isLength({ max: 100 }).withMessage('Course name cannot exceed 100 characters'),
  body('code').optional().trim().isLength({ max: 20 }).withMessage('Course code cannot exceed 20 characters'),
  body('semester').isMongoId().withMessage('Valid semester ID is required'),
  body('department').isMongoId().withMessage('Valid department ID is required'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('credits').optional().isInt({ min: 1, max: 10 }).withMessage('Credits must be between 1 and 10')
];

module.exports = {
  getCoursesBySemester,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  validateCourse
};
