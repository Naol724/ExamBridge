const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const Course = require('../models/Course');
const { bucket } = require('../config/firebase');

// @desc    Get notes by course
// @route   GET /api/courses/:courseId/notes
// @access  Public
const getNotesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const notes = await Note.find({ course: courseId })
      .populate('uploaded_by', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Public
const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('course', 'name code')
      .populate('uploaded_by', 'name email');
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Increment download count
    await Note.findByIdAndUpdate(req.params.id, { $inc: { download_count: 1 } });

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload note
// @route   POST /api/notes
// @access  Private/Admin
const uploadNote = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { course, title, description, tags } = req.body;

    // Check if course exists
    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload file to Firebase Storage
    const fileName = `notes/${course}/${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(fileName);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // Make file public
    await file.makePublic();
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    const note = await Note.create({
      course,
      title,
      description,
      file_url: fileUrl,
      file_name: req.file.originalname,
      file_size: req.file.size,
      file_type: req.file.mimetype,
      uploaded_by: req.user.id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    const populatedNote = await Note.findById(note._id)
      .populate('course', 'name code')
      .populate('uploaded_by', 'name email');

    res.status(201).json({
      success: true,
      data: populatedNote
    });
  } catch (error) {
    console.error('Upload note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private/Admin
const updateNote = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // If updating course, validate it exists
    if (req.body.course) {
      const courseDoc = await Course.findById(req.body.course);
      if (!courseDoc) {
        return res.status(404).json({ message: 'Course not found' });
      }
    }

    // Handle tags
    if (req.body.tags) {
      req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('course', 'name code')
     .populate('uploaded_by', 'name email');

    res.status(200).json({
      success: true,
      data: updatedNote
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private/Admin
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Delete file from Firebase Storage
    try {
      const fileName = note.file_url.split('/').pop();
      const file = bucket.file(`notes/${note.course}/${fileName}`);
      await file.delete();
    } catch (firebaseError) {
      console.error('Error deleting file from Firebase:', firebaseError);
      // Continue with note deletion even if file deletion fails
    }

    await note.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all notes (admin view)
// @route   GET /api/notes
// @access  Private/Admin
const getAllNotes = async (req, res) => {
  try {
    const { course, uploaded_by } = req.query;
    
    // Build query
    const query = {};
    if (course) query.course = course;
    if (uploaded_by) query.uploaded_by = uploaded_by;

    const notes = await Note.find(query)
      .populate('course', 'name code')
      .populate('uploaded_by', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error('Get all notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get popular notes
// @route   GET /api/notes/popular
// @access  Public
const getPopularNotes = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const notes = await Note.find()
      .populate('course', 'name code')
      .populate('uploaded_by', 'name email')
      .sort({ download_count: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error('Get popular notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Validation rules
const validateNote = [
  body('course').isMongoId().withMessage('Valid course ID is required'),
  body('title').trim().notEmpty().withMessage('Note title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('tags').optional().trim().withMessage('Tags must be a comma-separated string')
];

module.exports = {
  getNotesByCourse,
  getNote,
  uploadNote,
  updateNote,
  deleteNote,
  getAllNotes,
  getPopularNotes,
  validateNote
};
