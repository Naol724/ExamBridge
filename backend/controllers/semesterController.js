const { body, validationResult } = require('express-validator');
const Semester = require('../models/Semester');
const Year = require('../models/Year');
const Course = require('../models/Course');

// @desc    Get semesters by year
// @route   GET /api/years/:yearId/semesters
// @access  Public
const getSemestersByYear = async (req, res) => {
  try {
    const { yearId } = req.params;
    
    // Check if year exists
    const year = await Year.findById(yearId);
    if (!year) {
      return res.status(404).json({ message: 'Year not found' });
    }

    const semesters = await Semester.find({ year: yearId })
      .sort({ semester_number: 1 });

    res.status(200).json({
      success: true,
      count: semesters.length,
      data: semesters
    });
  } catch (error) {
    console.error('Get semesters error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single semester
// @route   GET /api/semesters/:id
// @access  Public
const getSemester = async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.id)
      .populate('year', 'year_number department')
      .populate({
        path: 'year',
        populate: {
          path: 'department',
          select: 'name total_years'
        }
      });
    
    if (!semester) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    res.status(200).json({
      success: true,
      data: semester
    });
  } catch (error) {
    console.error('Get semester error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create semester
// @route   POST /api/semesters
// @access  Private/Admin
const createSemester = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { semester_number, year } = req.body;

    // Check if year exists
    const yearDoc = await Year.findById(year);
    if (!yearDoc) {
      return res.status(404).json({ message: 'Year not found' });
    }

    // Check if semester already exists for this year
    const existingSemester = await Semester.findOne({ semester_number, year });
    if (existingSemester) {
      return res.status(400).json({ message: 'Semester already exists for this year' });
    }

    const semester = await Semester.create({
      semester_number,
      year
    });

    const populatedSemester = await Semester.findById(semester._id)
      .populate('year', 'year_number department')
      .populate({
        path: 'year',
        populate: {
          path: 'department',
          select: 'name total_years'
        }
      });

    res.status(201).json({
      success: true,
      data: populatedSemester
    });
  } catch (error) {
    console.error('Create semester error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update semester
// @route   PUT /api/semesters/:id
// @access  Private/Admin
const updateSemester = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const semester = await Semester.findById(req.params.id);

    if (!semester) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    // If updating semester_number or year, validate constraints
    if (req.body.semester_number || req.body.year) {
      const yearDoc = await Year.findById(req.body.year || semester.year);
      if (!yearDoc) {
        return res.status(404).json({ message: 'Year not found' });
      }

      const newSemesterNumber = req.body.semester_number || semester.semester_number;
      const existingSemester = await Semester.findOne({ 
        semester_number: newSemesterNumber, 
        year: req.body.year || semester.year,
        _id: { $ne: req.params.id }
      });
      
      if (existingSemester) {
        return res.status(400).json({ message: 'Semester already exists for this year' });
      }
    }

    const updatedSemester = await Semester.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('year', 'year_number department')
     .populate({
       path: 'year',
       populate: {
         path: 'department',
         select: 'name total_years'
       }
     });

    res.status(200).json({
      success: true,
      data: updatedSemester
    });
  } catch (error) {
    console.error('Update semester error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete semester
// @route   DELETE /api/semesters/:id
// @access  Private/Admin
const deleteSemester = async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.id);

    if (!semester) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    // Check if semester has associated courses
    const coursesCount = await Course.countDocuments({ semester: req.params.id });
    if (coursesCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete semester with associated courses. Delete courses first.' 
      });
    }

    await semester.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete semester error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Validation rules
const validateSemester = [
  body('semester_number').isInt({ min: 1, max: 2 }).withMessage('Semester number must be 1 or 2'),
  body('year').isMongoId().withMessage('Valid year ID is required')
];

module.exports = {
  getSemestersByYear,
  getSemester,
  createSemester,
  updateSemester,
  deleteSemester,
  validateSemester
};
