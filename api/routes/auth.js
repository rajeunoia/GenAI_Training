const express = require('express');
const passport = require('../config/passport');
const { generateToken, setTokenCookie, clearTokenCookie, authenticateToken, isAuthenticated } = require('../middleware/jwt-auth');
const router = express.Router();

// Initiate Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google OAuth callback with error handling
router.get('/google/callback', (req, res, next) => {
  console.log('OAuth callback initiated');
  console.log('Query params:', req.query);
  
  passport.authenticate('google', (err, user, info) => {
    console.log('Passport authenticate result:');
    console.log('Error:', err);
    console.log('User:', user ? { id: user._id, email: user.email } : null);
    console.log('Info:', info);
    
    if (err) {
      console.error('OAuth authentication error:', err);
      return res.status(500).json({ 
        error: 'Authentication failed', 
        details: err.message,
        timestamp: new Date().toISOString()
      });
    }
    
    if (!user) {
      console.log('No user returned from authentication');
      return res.status(401).json({ 
        error: 'Authentication failed - no user',
        info: info,
        timestamp: new Date().toISOString()
      });
    }
    
    // Generate JWT token and set cookie
    try {
      console.log('Generating JWT token for user:', user.email);
      const token = generateToken(user);
      setTokenCookie(res, token);
      
      console.log('JWT authentication successful');
      console.log('Token generated for user:', {
        userId: user._id,
        email: user.email,
        name: user.name
      });
      
      console.log('Redirecting to dashboard');
      res.redirect('/dashboard');
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      return res.status(500).json({ 
        error: 'Token generation failed', 
        details: tokenError.message,
        timestamp: new Date().toISOString()
      });
    }
  })(req, res, next);
});

// Logout route
router.post('/logout', (req, res) => {
  console.log('User logout requested');
  clearTokenCookie(res);
  res.json({ message: 'Logged out successfully' });
});

// Check authentication status
router.get('/status', authenticateToken, (req, res) => {
  console.log('Auth status check:', {
    hasAuthToken: !!req.cookies.authToken,
    hasUser: !!req.user,
    userId: req.user ? req.user._id : 'No user',
    userEmail: req.user ? req.user.email : 'No email',
    cookies: req.headers.cookie ? 'Has cookies' : 'No cookies',
    authMethod: 'JWT'
  });
  
  if (isAuthenticated(req)) {
    res.json({
      authenticated: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
      },
      authMethod: 'JWT'
    });
  } else {
    res.json({
      authenticated: false,
      user: null,
      authMethod: 'JWT'
    });
  }
});

// Debug endpoint to check OAuth configuration and recent users
router.get('/debug', async (req, res) => {
  try {
    const User = require('../models/User');
    const mongoose = require('mongoose');
    
    // Get recent users (last 10)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('email name createdAt lastLogin googleId');
    
    const config = {
      environment: process.env.NODE_ENV,
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasSessionSecret: !!process.env.SESSION_SECRET,
      clientIdPrefix: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 'Missing',
      callbackURL: process.env.NODE_ENV === 'production' 
        ? "https://turingdata-genai-training.vercel.app/api/auth/google/callback"
        : "/api/auth/google/callback",
      dbConnection: mongoose.connection.readyState,
      dbName: mongoose.connection.name,
      totalUsers: await User.countDocuments(),
      recentUsers: recentUsers.map(user => ({
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        googleId: user.googleId.substring(0, 10) + '...'
      })),
      timestamp: new Date().toISOString()
    };
    
    console.log('OAuth Debug Info:', config);
    res.json(config);
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      error: 'Debug failed',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test deserialization with known user ID
router.get('/test-deserialize/:userId', async (req, res) => {
  try {
    const User = require('../models/User');
    const userId = req.params.userId;
    
    console.log('Testing deserialization for user ID:', userId);
    
    // Try to find the user directly
    const user = await User.findById(userId);
    
    if (user) {
      console.log('User found directly:', {
        id: user._id,
        email: user.email,
        name: user.name
      });
      
      res.json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        },
        directQuery: 'success'
      });
    } else {
      console.log('No user found for ID:', userId);
      res.json({
        success: false,
        message: 'User not found',
        userId: userId
      });
    }
  } catch (error) {
    console.error('Test deserialization error:', error);
    res.status(500).json({
      error: 'Deserialization test failed',
      details: error.message,
      userId: req.params.userId
    });
  }
});

module.exports = router;