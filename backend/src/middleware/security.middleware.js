import aj from '#config/arcjet.js';
import logger from '#config/logger.js';

const securityMiddleware = async (req, res, next) => {
  try {
    const isDev = process.env.NODE_ENV !== 'production';

    // 🛡️ DEV BYPASS
    if (isDev) {
      console.log('🛡️ Arcjet Bypass Active (Dev Mode)');
      return next();
    }

    // Role-based logic from your WSL version
    const role = req.user?.role || 'guest';

    const limits = {
      admin: 20,
      user: 10,
      guest: 5,
    };

    const limit = limits[role] || 5;

    req.security = { role, limit };

    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      const reason = decision.reason;

      if (reason.isBot?.()) {
        logger.warn('Bot blocked', { ip: req.ip });
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Automated requests are not allowed',
        });
      }

      if (reason.isRateLimit?.()) {
        return res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded',
        });
      }
    }

    next();
  } catch (e) {
    console.error('Arcjet middleware error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default securityMiddleware;
