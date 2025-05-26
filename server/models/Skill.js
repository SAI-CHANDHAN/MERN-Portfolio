const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['frontend', 'backend', 'database', 'devops', 'mobile', 'design', 'tools', 'other']
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  proficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  icon: {
    type: String, // URL or icon class
    default: ''
  },
  color: {
    type: String,
    default: '#007bff'
  },
  description: {
    type: String,
    default: ''
  },
  yearsOfExperience: {
    type: Number,
    default: 0
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);