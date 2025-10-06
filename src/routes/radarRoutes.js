const express = require('express');
const RadarController = require('../controllers/radarController');
const AuthMiddleware = require('../middlewares/authMiddleware');
const rateLimiter = require('../middlewares/rateLimiter');

const router = express.Router();

// Apply authentication to all radar routes
router.use(AuthMiddleware.requireAuth);

// Generate radar chart scores
router.post('/generate-radar-scores', 
  rateLimiter.llm,
  RadarController.generateRadarScores
);

// Get radar chart configuration
router.get('/radar-config', 
  RadarController.getRadarConfig
);

module.exports = router;