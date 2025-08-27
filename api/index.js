require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const connectDB = require('./config/database');
const passport = require('./config/passport');
const { authenticateToken, isAuthenticated } = require('./middleware/jwt-auth');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const quizRoutes = require('./routes/quiz');
const testRoutes = require('./routes/test');

const app = express();
const PORT = process.env.PORT || 3000;

// Log environment variables (without secrets)
console.log('🚀 Server starting with environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: PORT,
  MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Missing',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing',
  SESSION_SECRET: process.env.SESSION_SECRET ? 'Set' : 'Missing'
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://turingdata-genai-training.vercel.app']
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
  name: 'genai.session', // Custom session name
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/genai-training',
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax',
    // Remove domain setting to let it default to the current domain
    path: '/' // Explicitly set path
  }
}));

console.log('Session configured with:', {
  nodeEnv: process.env.NODE_ENV,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  sessionName: 'genai.session'
});

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
app.get('/dashboard', authenticateToken, (req, res) => {
  if (isAuthenticated(req)) {
    res.sendFile(path.join(__dirname, '..', 'dashboard.html'));
  } else {
    res.redirect('/');
  }
});

// Evaluation routes (serve static HTML files)
app.get('/evaluation/:weekNumber', (req, res) => {
  const weekNumber = parseInt(req.params.weekNumber);
  
  if (weekNumber < 1 || weekNumber > 6) {
    return res.status(404).send('Evaluation not found');
  }
  
  const filePath = path.join(__dirname, '..', 'evaluation', `genai_week${weekNumber}_evaluation.html`);
  
  // Check if file exists
  const fs = require('fs');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Evaluation not found');
  }
});

// Training content route
app.get('/training', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'GenAi_Training.html'));
});

// How to take training route  
app.get('/how-to-take-training', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'how_to_take_training.html'));
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