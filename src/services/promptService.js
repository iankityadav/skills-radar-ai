const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

class PromptService {
  constructor() {
    this.promptsPath = path.join(__dirname, '../prompts');
    this.promptsCache = new Map();
  }

  async loadPrompt(filename) {
    try {
      if (this.promptsCache.has(filename)) {
        return this.promptsCache.get(filename);
      }

      const promptPath = path.join(this.promptsPath, filename);
      const promptContent = await fs.readFile(promptPath, 'utf-8');

      this.promptsCache.set(filename, promptContent);
      return promptContent;
    } catch (error) {
      logger.error(`Failed to load prompt: ${filename}`, error);
      throw new Error(`Prompt loading failed: ${filename}`);
    }
  }

  async getExtractionPrompt(cvText) {
    const template = await this.loadPrompt('extractionPrompt.md');
    return template.replace('{{cvText}}', cvText);
  }

  async getScoringPrompt(profileData) {
    const template = await this.loadPrompt('scoringPrompt.md');
    const profileJson = JSON.stringify(profileData, null, 2);
    return template.replace('{{profileJson}}', profileJson);
  }

  // Clear cache if needed (useful for development)
  clearCache() {
    this.promptsCache.clear();
    logger.info('Prompt cache cleared');
  }
}

module.exports = new PromptService();