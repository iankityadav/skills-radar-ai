const multer = require('multer');
const pdfParse = require('pdf-parse');
const logger = require('../utils/logger');
const llmService = require('../services/llmService');
const Joi = require('joi');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: (process.env.MAX_FILE_SIZE_KB || 300) * 1024 // Default 300KB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, TXT, and DOC files are allowed.'));
    }
  }
});

// Validation schemas
const manualDataSchema = Joi.object({
  yearsOfExperience: Joi.number().min(0).max(50),
  technicalSkills: Joi.object().pattern(Joi.string(), Joi.number().min(1).max(10)),
  softSkills: Joi.array().items(Joi.string()),
  education: Joi.object({
    collegeName: Joi.string(),
    tier: Joi.number().min(1).max(10)
  }),
  pastCompanies: Joi.array().items(Joi.string()),
  certifications: Joi.array().items(Joi.string()),
  jobTenureYears: Joi.array().items(Joi.number().min(0))
});

class ProfileController {

  // Upload CV and extract text
  static uploadCV = [
    upload.single('cvFile'),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: 'CV file is required' });
        }

        logger.info(`CV uploaded: ${req.file.originalname}, size: ${req.file.size} bytes`);

        let cvText = '';

        // Extract text based on file type
        if (req.file.mimetype === 'application/pdf') {
          const pdfData = await pdfParse(req.file.buffer);
          cvText = pdfData.text;
        } else {
          cvText = req.file.buffer.toString('utf-8');
        }

        // Limit text size for LLM processing
        cvText = cvText.slice(0, 10000);

        logger.info(`CV text extracted, length: ${cvText.length} characters`);

        res.json({
          success: true,
          cvText: cvText,
          fileName: req.file.originalname,
          fileSize: req.file.size
        });

      } catch (error) {
        logger.error('CV upload error:', error);
        res.status(500).json({ error: 'Failed to process CV file' });
      }
    }
  ];

  // Extract structured profile from CV text
  static async extractProfile(req, res) {
    try {
      const { cvText } = req.body;

      if (!cvText || typeof cvText !== 'string') {
        return res.status(400).json({ error: 'Valid CV text is required' });
      }

      logger.info(`Starting profile extraction for text length: ${cvText.length}`);

      const profile = await llmService.extractProfile(cvText);

      logger.info('Profile extraction completed successfully');

      res.json({
        success: true,
        profile: profile,
        extractedAt: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Profile extraction error:', error);
      res.status(500).json({ 
        error: 'Failed to extract profile data',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Submit manual data corrections
  static async submitManualData(req, res) {
    try {
      const { error, value: manualData } = manualDataSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ 
          error: 'Invalid manual data',
          details: error.details.map(d => d.message)
        });
      }

      logger.info('Manual data received and validated');

      // Store or process the manual data as needed
      // This could be merged with extracted data or stored separately

      res.json({
        success: true,
        message: 'Manual data received successfully',
        data: manualData,
        receivedAt: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Manual data submission error:', error);
      res.status(500).json({ error: 'Failed to process manual data' });
    }
  }
}

module.exports = ProfileController;