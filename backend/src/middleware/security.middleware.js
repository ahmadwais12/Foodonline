const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const xss = require('xss');

// Rate limiting for general API requests
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for authentication endpoints
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Slow down middleware for brute force protection
exports.speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 5, // allow 5 requests per windowMs, then start slowing down
  delayMs: 500, // begin adding 500ms of delay per request
});

// XSS protection middleware using xss library
exports.xssProtection = (req, res, next) => {
  // Sanitize request body
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }

  // Sanitize query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = xss(req.query[key]);
      }
    }
  }

  next();
};

// SQL injection protection middleware
exports.sqlInjectionProtection = (req, res, next) => {
  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|FETCH|DECLARE|TRUNCATE)\b)/gi,
    /(;|--|\/\*|\*\/|xp_|sp_)/gi,
    /(WAITFOR\s+DELAY|BENCHMARK|SLEEP)/gi
  ];

  const checkForSqlInjection = (value) => {
    if (typeof value !== 'string') return false;
    
    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(value)) {
        return true;
      }
    }
    return false;
  };

  // Check request body
  if (req.body) {
    for (const key in req.body) {
      if (checkForSqlInjection(req.body[key])) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid input detected. SQL injection attempt blocked.'
        });
      }
    }
  }

  // Check query parameters
  if (req.query) {
    for (const key in req.query) {
      if (checkForSqlInjection(req.query[key])) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid input detected. SQL injection attempt blocked.'
        });
      }
    }
  }

  next();
};

// Input sanitization middleware
exports.sanitizeInput = (req, res, next) => {
  // Sanitize request body
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Remove null bytes
        req.body[key] = req.body[key].replace(/\x00/g, '');
        // Trim whitespace
        req.body[key] = req.body[key].trim();
      }
    }
  }

  // Sanitize query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        // Remove null bytes
        req.query[key] = req.query[key].replace(/\x00/g, '');
        // Trim whitespace
        req.query[key] = req.query[key].trim();
      }
    }
  }

  next();
};

// NoSQL injection protection middleware
exports.noSqlInjectionProtection = (req, res, next) => {
  const noSqlInjectionPatterns = [
    /\$where/gi,
    /\$mapReduce/gi,
    /\$group/gi,
    /\$function/gi
  ];

  const checkForNoSqlInjection = (value) => {
    if (typeof value !== 'string') return false;
    
    for (const pattern of noSqlInjectionPatterns) {
      if (pattern.test(value)) {
        return true;
      }
    }
    return false;
  };

  // Check request body
  if (req.body) {
    for (const key in req.body) {
      if (checkForNoSqlInjection(req.body[key])) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid input detected. NoSQL injection attempt blocked.'
        });
      }
    }
  }

  // Check query parameters
  if (req.query) {
    for (const key in req.query) {
      if (checkForNoSqlInjection(req.query[key])) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid input detected. NoSQL injection attempt blocked.'
        });
      }
    }
  }

  next();
};