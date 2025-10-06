const logger = require('../utils/logger');

class AuthController {

  // GitHub OAuth login
  static githubAuth(req, res, next) {
    logger.info('GitHub OAuth initiated');
    // Passport.js will handle the redirect
    next();
  }

  // GitHub OAuth callback
  static githubCallback(req, res) {
    logger.info(`User authenticated: ${req.user?.username || 'unknown'}`);

    if (req.user) {
      res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000/dashboard');
    } else {
      res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000/login?error=auth_failed');
    }
  }

  // Logout
  static logout(req, res) {
    const userId = req.user?.id;

    req.logout((err) => {
      if (err) {
        logger.error('Logout error:', err);
        return res.status(500).json({ error: 'Logout failed' });
      }

      logger.info(`User logged out: ${userId}`);
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
      });
    });
  }

  // Get current user
  static getCurrentUser(req, res) {
    if (req.user) {
      res.json({
        user: {
          id: req.user.id,
          username: req.user.username,
          displayName: req.user.displayName,
          avatar: req.user.photos?.[0]?.value
        }
      });
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  }
}

module.exports = AuthController;