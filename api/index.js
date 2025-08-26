require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const connectDB = require('./config/database');
const passport = require('./config/passport');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const quizRoutes = require('./routes/quiz');
const testRoutes = require('./routes/test');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true  // Allow all origins in production for now
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/test', testRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Dashboard route (needs authentication)
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, '..', 'dashboard.html'));
  } else {
    res.redirect('/');
  }
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Catch-all handler for other routes (serve static files)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (req.path.startsWith('/api/')) {
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
  } else {
    res.status(500).send('Something went wrong');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'Connected' : 'Using default'}`);
});

module.exports = app;