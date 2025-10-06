const express = require('express');
const passport = require('passport');
const AuthController = require('../controllers/authController');
const AuthMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// GitHub OAuth routes
router.get('/github', passport.authenticate('github', { 
  scope: ['user:email'] 
}));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  AuthController.githubCallback
);

// Logout
router.post('/logout', AuthController.logout);

// Get current user info
router.get('/me', AuthMiddleware.requireAuth, AuthController.getCurrentUser);

// Auth status check
router.get('/status', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated ? req.isAuthenticated() : false,
    user: req.user ? {
      id: req.user.id,
      username: req.user.username,
      displayName: req.user.displayName
    } : null
  });
});

module.exports = router;