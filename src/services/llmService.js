const { OpenAI } = require('langchain/llms/openai');
const promptService = require('./promptService');
const logger = require('../utils/logger');

class LLMService {
  constructor() {
    this.llm = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.1,
      maxTokens: 1000,
    });
  }

  async extractProfile(cvText) {
    try {
      logger.info('Starting LLM profile extraction');

      const prompt = await promptService.getExtractionPrompt(cvText);
      const response = await this.llm.call(prompt);

      // Try to parse JSON from the response
      const profile = this.parseJSONResponse(response, 'profile extraction');

      // Validate and normalize the extracted profile
      const normalizedProfile = this.normalizeProfile(profile);

      logger.info('Profile extraction completed successfully');
      return normalizedProfile;

    } catch (error) {
      logger.error('LLM profile extraction failed:', error);
      throw new Error(`Profile extraction failed: ${error.message}`);
    }
  }

  async generateRadarScores(profileData) {
    try {
      logger.info('Starting LLM radar score generation');

      const prompt = await promptService.getScoringPrompt(profileData);
      const response = await this.llm.call(prompt);

      // Parse JSON response
      const radarData = this.parseJSONResponse(response, 'radar scoring');

      // Validate radar data structure
      this.validateRadarData(radarData);

      logger.info('Radar score generation completed successfully');
      return radarData;

    } catch (error) {
      logger.error('LLM radar scoring failed:', error);
      throw new Error(`Radar scoring failed: ${error.message}`);
    }
  }

  parseJSONResponse(response, operation) {
    try {
      // Find JSON content in the response
      const jsonStart = response.indexOf('{');
      const jsonEnd = response.lastIndexOf('}');

      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No JSON found in response');
      }

      const jsonString = response.slice(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString);

    } catch (error) {
      logger.error(`JSON parsing failed for ${operation}:`, error);
      logger.debug('Raw response:', response);
      throw new Error(`Failed to parse LLM response for ${operation}`);
    }
  }

  normalizeProfile(profile) {
    return {
      yearsOfExperience: Math.max(0, parseInt(profile.yearsOfExperience) || 0),
      technicalSkills: profile.technicalSkills || {},
      softSkills: Array.isArray(profile.softSkills) ? profile.softSkills : [],
      education: {
        collegeName: profile.education?.collegeName || '',
        tier: Math.max(1, Math.min(10, parseInt(profile.education?.tier) || 5))
      },
      pastCompanies: Array.isArray(profile.pastCompanies) ? profile.pastCompanies : [],
      certifications: Array.isArray(profile.certifications) ? profile.certifications : [],
      jobTenureYears: Array.isArray(profile.jobTenureYears) ? profile.jobTenureYears : []
    };
  }

  validateRadarData(radarData) {
    if (!radarData.labels || !Array.isArray(radarData.labels)) {
      throw new Error('Invalid radar data: labels must be an array');
    }

    if (!radarData.scores || !Array.isArray(radarData.scores)) {
      throw new Error('Invalid radar data: scores must be an array');
    }

    if (radarData.labels.length !== 8) {
      throw new Error('Invalid radar data: must have exactly 8 categories');
    }

    if (radarData.scores.length !== 8) {
      throw new Error('Invalid radar data: must have exactly 8 scores');
    }

    // Validate score ranges
    for (let i = 0; i < radarData.scores.length; i++) {
      const score = radarData.scores[i];
      if (typeof score !== 'number' || score < 1 || score > 10) {
        throw new Error(`Invalid score at index ${i}: must be a number between 1 and 10`);
      }
    }
  }
}

module.exports = new LLMService();