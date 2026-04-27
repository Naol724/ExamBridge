const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
  semester_number: {
    type: Number,
    required: [true, 'Semester number is required'],
    enum: [1, 2]
  },
  year: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Year',
    required: [true, 'Year is required']
  },
  name: {
    type: String,
    required: true,
    enum: ['Semester 1', 'Semester 2']
  }
}, {
  timestamps: true
});

// Compound index to ensure unique semester per year
semesterSchema.index({ semester_number: 1, year: 1 }, { unique: true });

// Pre-save middleware to set name based on semester_number
semesterSchema.pre('save', function(next) {
  this.name = `Semester ${this.semester_number}`;
  next();
});

module.exports = mongoose.model('Semester', semesterSchema);
