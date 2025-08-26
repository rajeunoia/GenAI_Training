const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  bestScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  lastAttemptAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index to ensure one progress record per user per week
userProgressSchema.index({ userId: 1, weekNumber: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);