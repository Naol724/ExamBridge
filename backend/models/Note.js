const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  title: {
    type: String,
    required: [true, 'Note title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  file_url: {
    type: String,
    required: [true, 'File URL is required']
  },
  file_name: {
    type: String,
    required: [true, 'File name is required']
  },
  file_size: {
    type: Number,
    required: [true, 'File size is required']
  },
  file_type: {
    type: String,
    required: [true, 'File type is required'],
    enum: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  },
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader information is required']
  },
  download_count: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }]
}, {
  timestamps: true
});

// Index for better query performance
noteSchema.index({ course: 1, title: 1 });
noteSchema.index({ uploaded_by: 1 });

module.exports = mongoose.model('Note', noteSchema);
