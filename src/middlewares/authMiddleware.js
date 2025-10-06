const logger = require('../utils/logger');

class AuthMiddleware {

  // Check if user is authenticated
  static requireAuth(req, res, next) {
    if (req?.isAuthenticated()) {
      logger.debug(`Authenticated request from user: ${req.user?.username}`);
      return next();
    }

    logger.warn(`Unauthorized access attempt to ${req.path}`);
    return res.status(401).json({
      error: 'Authentication required',
      redirectTo: '/auth/github'
    });
  }

  // Optional authentication - continues regardless
  static optionalAuth(req, res, next) {
    if (req?.isAuthenticated()) {
      logger.debug(`Authenticated request from user: ${req.user?.username}`);
    } else {
      logger.debug('Unauthenticated request');
    }
    next();
  }

  // Check for specific user roles (if implemented)
  static requireRole(roles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const userRoles = req.user.roles || [];
      const hasRequiredRole = roles.some(role => userRoles.includes(role));

      if (!hasRequiredRole) {
        logger.warn(`Access denied for user ${req.user.username}. Required roles: ${roles.join(', ')}`);
        return res.status(403).json({
          error: 'Insufficient permissions',
          requiredRoles: roles
        });
      }

      next();
    };
  }

  // Development-only bypass (use with caution)
  static devBypass(req, res, next) {
    if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
      req.user = {
        id: 'dev-user',
        username: 'developer',
        displayName: 'Development User'
      };
      logger.warn('Authentication bypassed for development');
    }
    next();
  }
}

module.exports = AuthMiddleware;