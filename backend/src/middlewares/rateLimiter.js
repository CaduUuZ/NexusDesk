const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Muitas requisições. Tente novamente mais tarde.' },
});
module.exports = { rateLimiter };
