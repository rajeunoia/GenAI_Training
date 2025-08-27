const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'your-jwt-secret-key';
const JWT_EXPIRES_IN = '7d'; // 7 days

// Generate JWT token for user
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Set JWT cookie
const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  });
};

// Clear JWT cookie
const clearTokenCookie = (res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
};

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.authToken || 
                  (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      console.log('No auth token found');
      req.user = null;
      return next();
    }

    console.log('Verifying JWT token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.log('User not found for token:', decoded.id);
      req.user = null;
      return next();
    }

    console.log('JWT authentication successful for user:', user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error('JWT authentication error:', error.message);
    req.user = null;
    next();
  }
};

// Check if user is authenticated (replacement for req.isAuthenticated())
const isAuthenticated = (req) => {
  return !!req.user;
};

module.exports = {
  generateToken,
  setTokenCookie,
  clearTokenCookie,
  authenticateToken,
  isAuthenticated,
  JWT_SECRET
};