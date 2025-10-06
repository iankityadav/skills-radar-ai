// Rate limiting configuration
const rateLimitConfig = {
  // General API rate limiting
  general: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // requests per window
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },

  // File upload specific limits
  upload: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // uploads per window
    message: 'Too many file uploads from this IP, please try again later.',
  },

  // LLM API call limits (more restrictive)
  llm: {
    windowMs: 60 * 1000, // 1 minute
    max: 5, // LLM calls per minute
    message: 'Too many AI processing requests, please try again later.',
  },

  // Auth attempts
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // auth attempts per window
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: true,
  }
};

module.exports = rateLimitConfig;