const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  room_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Room ID (Course) is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  message: {
    type: String,
    required: [true, 'Message text is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  message_type: {
    type: String,
    enum: ['text', 'file', 'system'],
    default: 'text'
  },
  file_info: {
    file_name: String,
    file_url: String,
    file_size: Number
  },
  is_edited: {
    type: Boolean,
    default: false
  },
  edited_at: {
    type: Date
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  deleted_at: {
    type: Date
  },
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
chatMessageSchema.index({ room_id: 1, timestamp: -1 });
chatMessageSchema.index({ user: 1, timestamp: -1 });

// Pre-save middleware to set timestamp if not provided
chatMessageSchema.pre('save', function(next) {
  if (!this.timestamp) {
    this.timestamp = new Date();
  }
  next();
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
