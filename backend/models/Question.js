const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  question_text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Question type is required'],
    enum: ['past', 'practice'],
    default: 'practice'
  },
  year_of_exam: {
    type: Number,
    min: [2015, 'Year of exam must be 2015 or later'],
    max: [new Date().getFullYear() + 1, 'Year of exam cannot be in the distant future']
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    is_correct: {
      type: Boolean,
      default: false
    }
  }],
  correct_answer: {
    type: String,
    trim: true
  },
  explanation: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  marks: {
    type: Number,
    min: [1, 'Marks must be at least 1'],
    default: 1
  }
}, {
  timestamps: true
});

// Index for better query performance
questionSchema.index({ course: 1, type: 1 });
questionSchema.index({ course: 1, year_of_exam: 1 });

// Validation: ensure at least one correct option for multiple choice questions
questionSchema.pre('save', function(next) {
  if (this.options.length > 0) {
    const hasCorrectOption = this.options.some(option => option.is_correct);
    if (!hasCorrectOption) {
      return next(new Error('Multiple choice questions must have at least one correct option'));
    }
  }
  next();
});

module.exports = mongoose.model('Question', questionSchema);
