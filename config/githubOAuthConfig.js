const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const logger = require('../src/utils/logger');

// Configure GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/auth/github/callback"
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      // save/update user in database

      const user = {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value,
        githubUrl: profile.profileUrl,
        accessToken: accessToken,
        createdAt: new Date(),
        lastLogin: new Date()
      };

      logger.info(`GitHub OAuth successful for user: ${user.username}`);
      return done(null, user);

    } catch (error) {
      logger.error('GitHub OAuth error:', error);
      return done(error, null);
    }
  }));

// Serialize user for session storage
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    // fetch user from database by ID
    const user = {
      id: id,
      username: 'github-user' // This should come from database
    };

    done(null, user);
  } catch (error) {
    logger.error('User deserialization error:', error);
    done(error, null);
  }
});

module.exports = passport;