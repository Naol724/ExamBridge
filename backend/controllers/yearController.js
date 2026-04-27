const { body, validationResult } = require('express-validator');
const Year = require('../models/Year');
const Semester = require('../models/Semester');
const Department = require('../models/Department');

// @desc    Get years by department
// @route   GET /api/departments/:departmentId/years
// @access  Public
const getYearsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    
    // Check if department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const years = await Year.find({ department: departmentId })
      .sort({ year_number: 1 });

    res.status(200).json({
      success: true,
      count: years.length,
      data: years
    });
  } catch (error) {
    console.error('Get years error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single year
// @route   GET /api/years/:id
// @access  Public
const getYear = async (req, res) => {
  try {
    const year = await Year.findById(req.params.id)
      .populate('department', 'name total_years');
    
    if (!year) {
      return res.status(404).json({ message: 'Year not found' });
    }

    res.status(200).json({
      success: true,
      data: year
    });
  } catch (error) {
    console.error('Get year error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create year
// @route   POST /api/years
// @access  Private/Admin
const createYear = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { year_number, department } = req.body;

    // Check if department exists
    const dept = await Department.findById(department);
    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if year doesn't exceed department's total years
    if (year_number > dept.total_years) {
      return res.status(400).json({ 
        message: `Year number cannot exceed department's total years (${dept.total_years})` 
      });
    }

    // Check if year already exists for this department
    const existingYear = await Year.findOne({ year_number, department });
    if (existingYear) {
      return res.status(400).json({ message: 'Year already exists for this department' });
    }

    const year = await Year.create({
      year_number,
      department
    });

    // Create semesters for this year
    const semesters = [
      { semester_number: 1, year: year._id },
      { semester_number: 2, year: year._id }
    ];
    await Semester.insertMany(semesters);

    const populatedYear = await Year.findById(year._id)
      .populate('department', 'name total_years');

    res.status(201).json({
      success: true,
      data: populatedYear
    });
  } catch (error) {
    console.error('Create year error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update year
// @route   PUT /api/years/:id
// @access  Private/Admin
const updateYear = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const year = await Year.findById(req.params.id);

    if (!year) {
      return res.status(404).json({ message: 'Year not found' });
    }

    // If updating year_number or department, validate constraints
    if (req.body.year_number || req.body.department) {
      const dept = await Department.findById(req.body.department || year.department);
      if (!dept) {
        return res.status(404).json({ message: 'Department not found' });
      }

      const newYearNumber = req.body.year_number || year.year_number;
      if (newYearNumber > dept.total_years) {
        return res.status(400).json({ 
          message: `Year number cannot exceed department's total years (${dept.total_years})` 
        });
      }
    }

    const updatedYear = await Year.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('department', 'name total_years');

    res.status(200).json({
      success: true,
      data: updatedYear
    });
  } catch (error) {
    console.error('Update year error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete year
// @route   DELETE /api/years/:id
// @access  Private/Admin
const deleteYear = async (req, res) => {
  try {
    const year = await Year.findById(req.params.id);

    if (!year) {
      return res.status(404).json({ message: 'Year not found' });
    }

    // Check if year has associated semesters
    const semestersCount = await Semester.countDocuments({ year: req.params.id });
    if (semestersCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete year with associated semesters. Delete semesters first.' 
      });
    }

    await year.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete year error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Validation rules
const validateYear = [
  body('year_number').isInt({ min: 1, max: 5 }).withMessage('Year number must be between 1 and 5'),
  body('department').isMongoId().withMessage('Valid department ID is required')
];

module.exports = {
  getYearsByDepartment,
  getYear,
  createYear,
  updateYear,
  deleteYear,
  validateYear
};
