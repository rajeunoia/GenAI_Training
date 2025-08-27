const express = require('express');
const { authenticateToken, isAuthenticated } = require('../middleware/jwt-auth');
const UserProgress = require('../models/UserProgress');
const QuizAttempt = require('../models/QuizAttempt');
const router = express.Router();

// JWT Authentication middleware for all user routes
const requireAuth = (req, res, next) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Get user profile
router.get('/profile', authenticateToken, requireAuth, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
    createdAt: req.user.createdAt,
    lastLogin: req.user.lastLogin
  });
});

// Get user's overall progress
router.get('/progress', authenticateToken, requireAuth, async (req, res) => {
  try {
    const progress = await UserProgress.find({ 
      userId: req.user._id 
    }).sort({ weekNumber: 1 });

    // Get recent quiz attempts for each week
    const recentAttempts = await QuizAttempt.find({ 
      userId: req.user._id 
    }).sort({ weekNumber: 1, attemptNumber: -1 });

    // Create progress array for all 6 weeks
    const weeklyProgress = [];
    for (let week = 1; week <= 6; week++) {
      const weekProgress = progress.find(p => p.weekNumber === week);
      const weekAttempts = recentAttempts.filter(a => a.weekNumber === week);
      const lastAttempt = weekAttempts[0]; // Most recent attempt
      
      weeklyProgress.push({
        weekNumber: week,
        completed: weekProgress ? weekProgress.completed : false,
        bestScore: weekProgress ? weekProgress.bestScore : 0,
        totalAttempts: weekProgress ? weekProgress.totalAttempts : 0,
        completedAt: weekProgress ? weekProgress.completedAt : null,
        lastAttemptAt: weekProgress ? weekProgress.lastAttemptAt : null,
        lastAttempt: lastAttempt ? {
          score: lastAttempt.score,
          correctAnswers: lastAttempt.userResponses.filter(r => r.isCorrect).length,
          totalQuestions: lastAttempt.userResponses.length,
          submittedAt: lastAttempt.submittedAt,
          timeSpent: lastAttempt.timeSpent,
          passed: lastAttempt.score >= 70
        } : null
      });
    }

    // Calculate overall statistics
    const completedWeeks = weeklyProgress.filter(w => w.completed).length;
    const weeksWithAttempts = weeklyProgress.filter(w => w.totalAttempts > 0);
    const totalScore = weeksWithAttempts.reduce((sum, w) => sum + w.bestScore, 0);
    const averageScore = weeksWithAttempts.length > 0 ? Math.round(totalScore / weeksWithAttempts.length) : 0;
    const totalAttempts = weeklyProgress.reduce((sum, w) => sum + w.totalAttempts, 0);

    res.json({
      weeklyProgress,
      overallStats: {
        completedWeeks,
        totalWeeks: 6,
        completionPercentage: Math.round((completedWeeks / 6) * 100),
        averageScore,
        totalAttempts,
        isCompleted: completedWeeks === 6
      }
    });

  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Get detailed progress for a specific week
router.get('/progress/:weekNumber', authenticateToken, requireAuth, async (req, res) => {
  try {
    const weekNumber = parseInt(req.params.weekNumber);
    
    if (weekNumber < 1 || weekNumber > 6) {
      return res.status(400).json({ error: 'Invalid week number' });
    }

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
        totalAttempts: 0,
        completedAt: null,
        lastAttemptAt: null
      },
      attempts: attempts.map(attempt => ({
        attemptNumber: attempt.attemptNumber,
        score: attempt.score,
        submittedAt: attempt.submittedAt,
        timeSpent: attempt.timeSpent,
        correctAnswers: attempt.userResponses.filter(r => r.isCorrect).length,
        totalQuestions: attempt.userResponses.length
      }))
    });

  } catch (error) {
    console.error('Error fetching week progress:', error);
    res.status(500).json({ error: 'Failed to fetch week progress' });
  }
});

// Get user's quiz history
router.get('/history', authenticateToken, requireAuth, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ 
      userId: req.user._id 
    }).sort({ submittedAt: -1 }).limit(50);

    const history = attempts.map(attempt => ({
      weekNumber: attempt.weekNumber,
      attemptNumber: attempt.attemptNumber,
      score: attempt.score,
      submittedAt: attempt.submittedAt,
      timeSpent: attempt.timeSpent,
      correctAnswers: attempt.userResponses.filter(r => r.isCorrect).length,
      totalQuestions: attempt.userResponses.length
    }));

    res.json({ history });

  } catch (error) {
    console.error('Error fetching quiz history:', error);
    res.status(500).json({ error: 'Failed to fetch quiz history' });
  }
});

module.exports = router;