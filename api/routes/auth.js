const express = require('express');
const passport = require('../config/passport');
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
    
    // Log in the user
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Login error:', loginErr);
        return res.status(500).json({ 
          error: 'Login failed', 
          details: loginErr.message,
          timestamp: new Date().toISOString()
        });
      }
      
      console.log('Authentication successful, redirecting to dashboard');
      res.redirect('/dashboard');
    });
  })(req, res, next);
});

// Logout route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Session destruction failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// Check authentication status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar
      }
    });
  } else {
    res.json({
      authenticated: false,
      user: null
    });
  }
});

module.exports = router;