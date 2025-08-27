const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production' 
    ? "https://turingdata-genai-training.vercel.app/api/auth/google/callback"
    : "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google Strategy called');
    console.log('Profile received:', {
      id: profile.id,
      displayName: profile.displayName,
      emails: profile.emails,
      photos: profile.photos
    });
    
    // Check database connection
    const mongoose = require('mongoose');
    console.log('Database connection state:', mongoose.connection.readyState);
    console.log('Database connection name:', mongoose.connection.name);
    
    // Check if user already exists
    console.log('Attempting to find user with googleId:', profile.id);
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      console.log('Existing user found:', user.email);
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      console.log('User last login updated');
      return done(null, user);
    } else {
      console.log('Creating new user with data:', {
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos[0].value
      });
      
      // Create new user
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos[0].value,
        lastLogin: new Date()
      });
      
      const savedUser = await user.save();
      console.log('New user created successfully:', {
        id: savedUser._id,
        email: savedUser.email
      });
      return done(null, savedUser);
    }
  } catch (error) {
    console.error('Error in Google Strategy:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack
    });
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user._id);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log('Deserializing user ID:', id);
    console.log('ID type:', typeof id);
    
    // Check database connection
    const mongoose = require('mongoose');
    console.log('DB connection state during deserialization:', mongoose.connection.readyState);
    
    const user = await User.findById(id);
    if (user) {
      console.log('User deserialized successfully:', {
        id: user._id,
        email: user.email,
        name: user.name
      });
    } else {
      console.log('No user found for ID:', id);
      console.log('Attempted to find user with ID type:', typeof id);
    }
    done(null, user);
  } catch (error) {
    console.error('Error deserializing user:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    done(error, null);
  }
});

module.exports = passport;