const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
  points: 5, // Number of attempts
  duration: 60 * 15, // Per 15 minutes
});

const passwordResetLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    await rateLimiter.consume(ip);
    next();
  } catch (error) {
    res.status(429).json({
      success: false,
      message: 'Too many attempts. Please try again later.'
    });
  }
};

module.exports = passwordResetLimiter; 