# Radar Chart AI Backend

LLM-based AI project for generating radar chart profiles from CVs using Node.js, Express, and Langchain.

## Features

- CV file upload and parsing (PDF support)
- LLM-powered profile extraction
- Manual data correction interface
- AI-driven radar chart scoring
- GitHub OAuth authentication
- Rate limiting and security middleware
- Comprehensive logging
- Modular architecture

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Required API Keys:**
   - OpenAI API Key for LLM functionality
   - GitHub OAuth App credentials

## Running the Application

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

## API Endpoints

### Authentication

- `GET /auth/github` - GitHub OAuth login
- `GET /auth/github/callback` - OAuth callback
- `POST /auth/logout` - Logout

### Profile Processing

- `POST /api/upload-cv` - Upload CV file
- `POST /api/extract-profile` - Extract structured profile data
- `POST /api/submit-manual-data` - Submit manual corrections
- `POST /api/generate-radar-scores` - Generate radar chart scores

## Project Structure

```
src/
├── controllers/     # Route handlers
├── middlewares/     # Custom middleware
├── routes/         # Route definitions
├── services/       # Business logic & LLM integration
├── utils/          # Utility functions
└── prompts/        # LLM prompt templates
```

## Configuration

Edit configuration files in the `config/` directory to customize:

- GitHub OAuth settings
- Rate limiting parameters
- Logging levels

## Security Features

- Rate limiting on all endpoints
- File size validation (300KB max)
- Input sanitization
- CORS protection
- Helmet security headers

## Logging

Logs are stored in the `logs/` directory with different levels:

- `error.log` - Error messages
- `combined.log` - All log messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
