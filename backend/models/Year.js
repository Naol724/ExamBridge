const mongoose = require('mongoose');

const yearSchema = new mongoose.Schema({
  year_number: {
    type: Number,
    required: [true, 'Year number is required'],
    min: [1, 'Year number must be at least 1'],
    max: [5, 'Year number cannot exceed 5']
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department is required']
  },
  name: {
    type: String,
    required: true,
    enum: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5']
  }
}, {
  timestamps: true
});

// Compound index to ensure unique year per department
yearSchema.index({ year_number: 1, department: 1 }, { unique: true });

// Pre-save middleware to set name based on year_number
yearSchema.pre('save', function(next) {
  this.name = `Year ${this.year_number}`;
  next();
});

module.exports = mongoose.model('Year', yearSchema);
