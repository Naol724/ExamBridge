const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true,
    enum: [
      'Software Engineering',
      'Computer Science',
      'Information Systems',
      'Information Technology',
      'Information Science'
    ]
  },
  total_years: {
    type: Number,
    required: [true, 'Total years is required'],
    enum: [4, 5],
    validate: {
      validator: function(value) {
        // Software Engineering should have 5 years, others should have 4 years
        if (this.name === 'Software Engineering') {
          return value === 5;
        } else {
          return value === 4;
        }
      },
      message: function(props) {
        if (props.value === 5 && props.root.name !== 'Software Engineering') {
          return 'Only Software Engineering can have 5 years';
        }
        if (props.value === 4 && props.root.name === 'Software Engineering') {
          return 'Software Engineering must have 5 years';
        }
        return 'Invalid total years value';
      }
    }
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);
