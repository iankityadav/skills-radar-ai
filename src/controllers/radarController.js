const logger = require('../utils/logger');
const llmService = require('../services/llmService');
const Joi = require('joi');

// Validation schema for profile data
const profileSchema = Joi.object({
  yearsOfExperience: Joi.number().min(0).max(50).default(0),
  technicalSkills: Joi.object().pattern(Joi.string(), Joi.number().min(1).max(10)).default({}),
  softSkills: Joi.array().items(Joi.string()).default([]),
  education: Joi.object({
    collegeName: Joi.string().default(''),
    tier: Joi.number().min(1).max(10).default(5)
  }).default({}),
  pastCompanies: Joi.array().items(Joi.string()).default([]),
  certifications: Joi.array().items(Joi.string()).default([]),
  jobTenureYears: Joi.array().items(Joi.number().min(0)).default([])
});

class RadarController {

  // Generate radar chart scores from profile data
  static async generateRadarScores(req, res) {
    try {
      const { error, value: profile } = profileSchema.validate(req.body.profile || req.body);

      if (error) {
        return res.status(400).json({ 
          error: 'Invalid profile data',
          details: error.details.map(d => d.message)
        });
      }

      logger.info('Starting radar chart score generation');

      const radarData = await llmService.generateRadarScores(profile);

      // Validate that the radar data has the expected structure
      if (!radarData.labels || !radarData.scores || 
          radarData.labels.length !== radarData.scores.length) {
        throw new Error('Invalid radar data structure returned from LLM');
      }

      logger.info('Radar chart scores generated successfully');

      res.json({
        success: true,
        radarData: radarData,
        generatedAt: new Date().toISOString(),
        profileSummary: {
          totalSkills: Object.keys(profile.technicalSkills).length,
          yearsExperience: profile.yearsOfExperience,
          companiesWorked: profile.pastCompanies.length,
          certificationsCount: profile.certifications.length
        }
      });

    } catch (error) {
      logger.error('Radar score generation error:', error);
      res.status(500).json({ 
        error: 'Failed to generate radar chart scores',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get radar chart configuration/metadata
  static getRadarConfig(req, res) {
    const config = {
      categories: [
        {
          name: "Years of Experience",
          description: "Total professional work experience",
          weight: 1.0
        },
        {
          name: "Technical Skills",
          description: "Proficiency in technical competencies",
          weight: 1.2
        },
        {
          name: "Soft Skills",
          description: "Communication, leadership, and interpersonal skills",
          weight: 0.8
        },
        {
          name: "College Tier",
          description: "Quality and reputation of educational institution",
          weight: 0.7
        },
        {
          name: "Company Reputation",
          description: "Quality and reputation of past employers",
          weight: 0.9
        },
        {
          name: "Relevant Experience",
          description: "Experience matching the target role/domain",
          weight: 1.1
        },
        {
          name: "Certifications/Awards",
          description: "Professional certifications and achievements",
          weight: 0.6
        },
        {
          name: "Job Stability",
          description: "Consistency and tenure in previous roles",
          weight: 0.8
        }
      ],
      scoreRange: {
        min: 1,
        max: 10
      },
      chartOptions: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 10,
            ticks: {
              stepSize: 2
            }
          }
        }
      }
    };

    res.json({
      success: true,
      config: config
    });
  }
}

module.exports = RadarController;