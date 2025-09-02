const validator = require('validator');
const path = require('path');
const xss = require('xss');

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = xss(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  
  next();
};

// Path traversal protection
const validatePath = (filePath) => {
  const normalizedPath = path.normalize(filePath);
  return !normalizedPath.includes('../') && !normalizedPath.includes('..\\');
};

// Log sanitization
const sanitizeLog = (input) => {
  if (typeof input === 'string') {
    return xss(input.replace(/[\r\n]/g, ''));
  }
  return input;
};

module.exports = {
  sanitizeInput,
  validatePath,
  sanitizeLog
};