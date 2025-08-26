const express = require('express');
const { getRandomQuestions } = require('../data/quizQuestions');
const router = express.Router();

// Test endpoint for quiz questions without database
router.get('/quiz/:weekNumber', (req, res) => {
  try {
    const weekNumber = parseInt(req.params.weekNumber);
    
    if (weekNumber < 1 || weekNumber > 6) {
      return res.status(400).json({ error: 'Invalid week number' });
    }

    const questions = getRandomQuestions(weekNumber, 10);
    
    res.json({
      weekNumber,
      questions: questions.map(q => ({
        question: q.q,
        options: q.options,
        // Don't send the answer in the response for security
      })),
      totalQuestions: questions.length,
      message: 'Test endpoint - questions loaded successfully!'
    });
  } catch (error) {
    console.error('Error in test quiz endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch quiz questions' });
  }
});

// Test authentication status
router.get('/auth-status', (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
    user: req.user || null,
    message: 'Auth status check'
  });
});

// Test all quiz data
router.get('/all-quizzes', (req, res) => {
  const allQuizzes = {};
  
  for (let week = 1; week <= 6; week++) {
    const questions = getRandomQuestions(week, 5); // Get 5 sample questions per week
    allQuizzes[`week${week}`] = {
      totalAvailable: getRandomQuestions(week, 100).length, // Get max available
      sampleQuestions: questions.map(q => ({
        question: q.q.substring(0, 80) + '...',
        hasOptions: q.options.length,
        hasAnswer: typeof q.answer === 'number'
      }))
    };
  }
  
  res.json({
    message: 'All quiz data loaded successfully!',
    quizzes: allQuizzes
  });
});

module.exports = router;