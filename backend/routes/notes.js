const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, adminOnly } = require('../middleware/auth');
const {
  getNotesByCourse,
  getNote,
  uploadNote,
  updateNote,
  deleteNote,
  getAllNotes,
  getPopularNotes,
  validateNote
} = require('../controllers/noteController');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept PDF and Word documents only
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'), false);
    }
  }
});

// @route   GET /api/notes
// @desc    Get all notes (admin view)
// @access  Private/Admin
router.get('/', protect, adminOnly, getAllNotes);

// @route   GET /api/notes/popular
// @desc    Get popular notes
// @access  Public
router.get('/popular', getPopularNotes);

// @route   GET /api/courses/:courseId/notes
// @desc    Get notes by course
// @access  Public
router.get('/courses/:courseId', getNotesByCourse);

// @route   GET /api/notes/:id
// @desc    Get single note
// @access  Public
router.get('/:id', getNote);

// @route   POST /api/notes
// @desc    Upload note
// @access  Private/Admin
router.post('/', protect, adminOnly, upload.single('file'), validateNote, uploadNote);

// @route   PUT /api/notes/:id
// @desc    Update note
// @access  Private/Admin
router.put('/:id', protect, adminOnly, validateNote, updateNote);

// @route   DELETE /api/notes/:id
// @desc    Delete note
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, deleteNote);

module.exports = router;
