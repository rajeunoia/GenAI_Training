// Mock authentication for local testing without database
const { ObjectId } = require('mongoose').Types;

const mockUser = {
  _id: new ObjectId('507f1f77bcf86cd799439011'),
  googleId: '12345678901234567890',
  email: 'test@example.com',
  name: 'Test User',
  avatar: 'https://via.placeholder.com/150'
};

const mockAuth = (req, res, next) => {
  // In development without DB, simulate an authenticated user
  if (process.env.NODE_ENV === 'development' && req.query.mock === 'true') {
    req.user = mockUser;
    req.isAuthenticated = () => true;
    return next();
  }
  
  // Otherwise use normal auth flow
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ 
      error: 'Authentication required',
      loginUrl: '/api/auth/google',
      hint: 'For local testing without DB, add ?mock=true to API calls'
    });
  }
  
  res.redirect('/api/auth/google');
};

module.exports = {
  mockAuth,
  mockUser
};