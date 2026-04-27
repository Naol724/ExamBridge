const { body, validationResult } = require('express-validator');
const ChatMessage = require('../models/ChatMessage');
const Course = require('../models/Course');

// @desc    Get messages for a course chat room
// @route   GET /api/courses/:courseId/chat
// @access  Private
const getChatMessages = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await ChatMessage.find({ 
      room_id: courseId, 
      is_deleted: false 
    })
      .populate('user', 'name email')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Reverse to show oldest first
    const reversedMessages = messages.reverse();

    // Get total count for pagination
    const total = await ChatMessage.countDocuments({ 
      room_id: courseId, 
      is_deleted: false 
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: reversedMessages
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Send a chat message
// @route   POST /api/courses/:courseId/chat
// @access  Private
const sendMessage = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { courseId } = req.params;
    const { message, message_type = 'text' } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const chatMessage = await ChatMessage.create({
      room_id: courseId,
      user: req.user.id,
      message,
      message_type
    });

    const populatedMessage = await ChatMessage.findById(chatMessage._id)
      .populate('user', 'name email');

    // Emit the message to all clients in the room
    req.io.to(courseId).emit('newMessage', populatedMessage);

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Edit a chat message
// @route   PUT /api/chat/:messageId
// @access  Private
const editMessage = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;
    const messageId = req.params.messageId;

    const chatMessage = await ChatMessage.findById(messageId);

    if (!chatMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user owns the message
    if (chatMessage.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this message' });
    }

    // Check if message is deleted
    if (chatMessage.is_deleted) {
      return res.status(400).json({ message: 'Cannot edit deleted message' });
    }

    const updatedMessage = await ChatMessage.findByIdAndUpdate(
      messageId,
      {
        message,
        is_edited: true,
        edited_at: new Date()
      },
      { new: true }
    ).populate('user', 'name email');

    // Emit the edited message to all clients in the room
    req.io.to(chatMessage.room_id.toString()).emit('messageEdited', updatedMessage);

    res.status(200).json({
      success: true,
      data: updatedMessage
    });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a chat message
// @route   DELETE /api/chat/:messageId
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;

    const chatMessage = await ChatMessage.findById(messageId);

    if (!chatMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user owns the message or is admin
    if (chatMessage.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    // Soft delete
    const updatedMessage = await ChatMessage.findByIdAndUpdate(
      messageId,
      {
        is_deleted: true,
        deleted_at: new Date()
      },
      { new: true }
    ).populate('user', 'name email');

    // Emit the deleted message to all clients in the room
    req.io.to(chatMessage.room_id.toString()).emit('messageDeleted', {
      messageId,
      room_id: chatMessage.room_id
    });

    res.status(200).json({
      success: true,
      data: { messageId, deleted: true }
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add reaction to message
// @route   POST /api/chat/:messageId/reactions
// @access  Private
const addReaction = async (req, res) => {
  try {
    const { emoji } = req.body;
    const messageId = req.params.messageId;

    if (!emoji) {
      return res.status(400).json({ message: 'Emoji is required' });
    }

    const chatMessage = await ChatMessage.findById(messageId);

    if (!chatMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if reaction already exists
    const existingReaction = chatMessage.reactions.find(
      reaction => reaction.user.toString() === req.user.id && reaction.emoji === emoji
    );

    if (existingReaction) {
      // Remove existing reaction
      chatMessage.reactions = chatMessage.reactions.filter(
        reaction => !(reaction.user.toString() === req.user.id && reaction.emoji === emoji)
      );
    } else {
      // Add new reaction
      chatMessage.reactions.push({
        user: req.user.id,
        emoji,
        timestamp: new Date()
      });
    }

    await chatMessage.save();

    const updatedMessage = await ChatMessage.findById(messageId)
      .populate('user', 'name email')
      .populate('reactions.user', 'name');

    // Emit the reaction update to all clients in the room
    req.io.to(chatMessage.room_id.toString()).emit('messageReaction', {
      messageId,
      reactions: updatedMessage.reactions
    });

    res.status(200).json({
      success: true,
      data: updatedMessage.reactions
    });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get chat statistics
// @route   GET /api/courses/:courseId/chat/stats
// @access  Private
const getChatStats = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const [totalMessages, activeUsers, todayMessages] = await Promise.all([
      ChatMessage.countDocuments({ room_id: courseId, is_deleted: false }),
      ChatMessage.distinct('user', { room_id: courseId, is_deleted: false }),
      ChatMessage.countDocuments({ 
        room_id: courseId, 
        is_deleted: false,
        timestamp: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMessages,
        activeUsers: activeUsers.length,
        todayMessages
      }
    });
  } catch (error) {
    console.error('Get chat stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Validation rules
const validateMessage = [
  body('message').trim().notEmpty().withMessage('Message is required')
    .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters'),
  body('message_type').optional().isIn(['text', 'file', 'system']).withMessage('Invalid message type')
];

const validateEditMessage = [
  body('message').trim().notEmpty().withMessage('Message is required')
    .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters')
];

const validateReaction = [
  body('emoji').trim().notEmpty().withMessage('Emoji is required')
];

module.exports = {
  getChatMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  addReaction,
  getChatStats,
  validateMessage,
  validateEditMessage,
  validateReaction
};
