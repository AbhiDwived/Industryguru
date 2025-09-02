const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// CSRF Protection
const csrfProtection = (req, res, next) => {
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;
  
  if (req.method !== 'GET' && token !== sessionToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next();
};

// Input Sanitization
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      }
    }
  };
  
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  next();
};

// Production Security Middleware
const productionSecurity = (app) => {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        scriptSrc: ["'self'", "https:"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    }
  }));
  
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests'
  }));
  
  app.use(sanitizeInput);
  app.use(csrfProtection);
};

module.exports = { productionSecurity };