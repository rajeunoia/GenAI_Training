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
    
    // Check if user already exists
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      console.log('Existing user found:', user.email);
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      return done(null, user);
    } else {
      console.log('Creating new user');
      // Create new user
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos[0].value,
        lastLogin: new Date()
      });
      
      await user.save();
      console.log('New user created:', user.email);
      return done(null, user);
    }
  } catch (error) {
    console.error('Error in Google Strategy:', error);
    console.error('Error stack:', error.stack);
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
    const user = await User.findById(id);
    if (user) {
      console.log('User deserialized:', user.email);
    } else {
      console.log('No user found for ID:', id);
    }
    done(null, user);
  } catch (error) {
    console.error('Error deserializing user:', error);
    done(error, null);
  }
});

module.exports = passport;