// CSRF Protection Middleware
const csrfProtection = (req, res, next) => {
  // Skip CSRF check for GET requests
  if (req.method === 'GET') {
    return next();
  }

  const token = req.headers['x-csrf-token'];
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({
      result: 'Fail',
      message: 'Invalid CSRF token'
    });
  }

  next();
};

module.exports = csrfProtection;