const express = require('express');
const { authenticateToken, isAuthenticated } = require('../middleware/jwt-auth');
const { mockAuth } = require('../middleware/mock-auth');
const UserProgress = require('../models/UserProgress');
const QuizAttempt = require('../models/QuizAttempt');
const { getRandomQuestions } = require('../data/quizQuestions');
const router = express.Router();

// JWT Authentication middleware for all quiz routes
const requireAuth = (req, res, next) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Use JWT auth middleware with fallback to mock auth in development when needed
const authMiddleware = (req, res, next) => {
  // First try JWT authentication
  authenticateToken(req, res, () => {
    if (isAuthenticated(req)) {
      return next();
    }
    
    // Fallback to mock auth in development if JWT fails
    if (process.env.NODE_ENV === 'development') {
      return mockAuth(req, res, next);
    }
    
    return res.status(401).json({ error: 'Authentication required' });
  });
};

// Get quiz questions for a specific week
router.get('/:weekNumber/questions', authMiddleware, async (req, res) => {
  try {
    const weekNumber = parseInt(req.params.weekNumber);
    
    if (weekNumber < 1 || weekNumber > 6) {
      return res.status(400).json({ error: 'Invalid week number' });
    }

    // Check if user has already completed this week's quiz
    const progress = await UserProgress.findOne({ 
      userId: req.user._id, 
      weekNumber,
      completed: true 
    });

    if (progress) {
      return res.status(400).json({ 
        error: 'Quiz already completed',
        canRetake: false 
      });
    }

    // Get quiz questions (we'll need to extract these from the HTML files)
    // For now, return a sample structure
    const questions = await getQuizQuestions(weekNumber);
    
    res.json({
      weekNumber,
      questions: questions.slice(0, 10), // Random 10 questions
      totalQuestions: 10,
      timeLimit: null // No time limit for now
    });
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    res.status(500).json({ error: 'Failed to fetch quiz questions' });
  }
});

// Submit quiz attempt
router.post('/:weekNumber/submit', requireAuth, async (req, res) => {
  try {
    const weekNumber = parseInt(req.params.weekNumber);
    const { responses, timeSpent, questionsShown } = req.body;

    console.log('\n=== QUIZ SUBMISSION DEBUG ===');
    console.log('Week:', weekNumber);
    console.log('Responses received:', responses.length);
    console.log('Questions received:', questionsShown?.length || 'none');
    console.log('Time spent:', timeSpent);
    
    if (responses) {
      console.log('Response details:');
      responses.forEach((r, i) => {
        console.log(`  Q${i}: selected=${r.selectedAnswer}`);
      });
    }

    if (weekNumber < 1 || weekNumber > 6) {
      return res.status(400).json({ error: 'Invalid week number' });
    }

    // Check if already completed
    const existingProgress = await UserProgress.findOne({ 
      userId: req.user._id, 
      weekNumber,
      completed: true 
    });

    if (existingProgress) {
      return res.status(400).json({ 
        error: 'Quiz already completed' 
      });
    }

    // Use questions from the request if provided, otherwise get from database
    let questionsForScoring;
    if (questionsShown && questionsShown.length > 0) {
      // Use questions sent from frontend (for consistency)
      console.log('Using questions from frontend submission');
      questionsForScoring = questionsShown;
    } else {
      // Fallback to generating questions server-side
      console.log('Generating questions server-side');
      const questions = await getQuizQuestions(weekNumber);
      questionsForScoring = questions.slice(0, 10);
    }

    // Calculate score
    let correctAnswers = 0;
    console.log('\n=== SCORE CALCULATION ===');
    console.log('Checking answers against questions...');
    
    const userResponses = responses.map((response, index) => {
      const question = questionsForScoring[index];
      const isCorrect = response.selectedAnswer === (question.correctAnswer ?? question.answer);
      
      console.log(`Q${index + 1}: selected=${response.selectedAnswer}, correct=${question.correctAnswer ?? question.answer}, match=${isCorrect}`);
      console.log(`  Question: ${question.question?.substring(0, 60)}...`);
      
      if (isCorrect) correctAnswers++;
      
      return {
        questionIndex: index,
        selectedAnswer: response.selectedAnswer,
        isCorrect
      };
    });
    
    console.log(`Total correct: ${correctAnswers}/${questionsForScoring.length}`);
    console.log('============================\n');

    const score = Math.round((correctAnswers / questionsForScoring.length) * 100);

    // Get attempt number
    const attemptCount = await QuizAttempt.countDocuments({
      userId: req.user._id,
      weekNumber
    });

    // Save quiz attempt
    const quizAttempt = new QuizAttempt({
      userId: req.user._id,
      weekNumber,
      attemptNumber: attemptCount + 1,
      questionsShown: questionsForScoring.map((q, index) => ({
        questionIndex: index,
        question: q.q || q.question,
        options: q.options,
        correctAnswer: q.correctAnswer ?? q.answer
      })),
      userResponses,
      score,
      timeSpent: timeSpent || 0,
      ipAddress: req.ip
    });

    await quizAttempt.save();

    // Update or create progress record
    let progress = await UserProgress.findOne({ 
      userId: req.user._id, 
      weekNumber 
    });

    if (!progress) {
      progress = new UserProgress({
        userId: req.user._id,
        weekNumber
      });
    }

    progress.totalAttempts += 1;
    progress.lastAttemptAt = new Date();
    
    if (score > progress.bestScore) {
      progress.bestScore = score;
    }

    // Mark as completed if score >= 70%
    if (score >= 70) {
      progress.completed = true;
      progress.completedAt = new Date();
    }

    await progress.save();

    res.json({
      score,
      passed: score >= 70,
      correctAnswers,
      totalQuestions: questionsForScoring.length,
      attemptNumber: attemptCount + 1,
      message: score >= 70 ? 'Congratulations! You passed!' : 'Keep studying and try again!'
    });

  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// Get user's progress for a specific week
router.get('/:weekNumber/progress', requireAuth, async (req, res) => {
  try {
    const weekNumber = parseInt(req.params.weekNumber);
    
    const progress = await UserProgress.findOne({ 
      userId: req.user._id, 
      weekNumber 
    });

    const attempts = await QuizAttempt.find({ 
      userId: req.user._id, 
      weekNumber 
    }).sort({ attemptNumber: -1 });

    res.json({
      weekNumber,
      progress: progress || {
        completed: false,
        bestScore: 0,
        totalAttempts: 0
      },
      attempts: attempts.map(attempt => ({
        attemptNumber: attempt.attemptNumber,
        score: attempt.score,
        submittedAt: attempt.submittedAt,
        timeSpent: attempt.timeSpent
      }))
    });

  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Helper function to get quiz questions for a specific week
async function getQuizQuestions(weekNumber) {
  return getRandomQuestions(weekNumber, 10);
}

module.exports = router;