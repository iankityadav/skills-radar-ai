const express = require('express');
const ProfileController = require('../controllers/profileController');
const AuthMiddleware = require('../middlewares/authMiddleware');
const rateLimiter = require('../middlewares/rateLimiter');

const router = express.Router();

// Apply authentication to all profile routes
router.use(AuthMiddleware.requireAuth);

// CV upload and processing
router.post('/upload-cv', 
  rateLimiter.upload,
  ProfileController.uploadCV
);

// Extract structured profile data
router.post('/extract-profile', 
  rateLimiter.llm,
  ProfileController.extractProfile
);

// Submit manual data corrections
router.post('/submit-manual-data', 
  ProfileController.submitManualData
);

module.exports = router;