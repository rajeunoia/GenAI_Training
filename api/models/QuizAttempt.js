const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
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
  attemptNumber: {
    type: Number,
    required: true,
    default: 1
  },
  questionsShown: [{
    questionIndex: Number,
    question: String,
    options: [String],
    correctAnswer: Number
  }],
  userResponses: [{
    questionIndex: Number,
    selectedAnswer: Number,
    isCorrect: Boolean
  }],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient querying
quizAttemptSchema.index({ userId: 1, weekNumber: 1, attemptNumber: 1 });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);