const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  // For API calls, return JSON error
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ 
      error: 'Authentication required',
      loginUrl: '/api/auth/google'
    });
  }
  
  // For regular requests, redirect to login
  res.redirect('/api/auth/google');
};

const optionalAuth = (req, res, next) => {
  // This middleware passes through regardless of auth status
  // Useful for pages that show different content for logged in users
  next();
};

module.exports = {
  requireAuth,
  optionalAuth
};