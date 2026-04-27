const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getChatMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  addReaction,
  getChatStats,
  validateMessage,
  validateEditMessage,
  validateReaction
} = require('../controllers/chatController');

// @route   GET /api/courses/:courseId/chat
// @desc    Get messages for a course chat room
// @access  Private
router.get('/courses/:courseId', protect, getChatMessages);

// @route   GET /api/courses/:courseId/chat/stats
// @desc    Get chat statistics
// @access  Private
router.get('/courses/:courseId/stats', protect, getChatStats);

// @route   POST /api/courses/:courseId/chat
// @desc    Send a chat message
// @access  Private
router.post('/courses/:courseId', protect, validateMessage, sendMessage);

// @route   PUT /api/chat/:messageId
// @desc    Edit a chat message
// @access  Private
router.put('/chat/:messageId', protect, validateEditMessage, editMessage);

// @route   DELETE /api/chat/:messageId
// @desc    Delete a chat message
// @access  Private
router.delete('/chat/:messageId', protect, deleteMessage);

// @route   POST /api/chat/:messageId/reactions
// @desc    Add reaction to message
// @access  Private
router.post('/chat/:messageId/reactions', protect, validateReaction, addReaction);

module.exports = router;
