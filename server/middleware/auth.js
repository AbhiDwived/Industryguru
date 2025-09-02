const jwt = require('jsonwebtoken');

// Authorization middleware
const requireAuth = (userType = 'buyer') => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        result: 'Fail', 
        message: 'Access denied. No token provided.' 
      });
    }

    try {
      let secretKey;
      switch (userType) {
        case 'admin':
          secretKey = process.env.JWT_ADMIN_KEY;
          break;
        case 'vendor':
          secretKey = process.env.JWT_VENDOR_KEY;
          break;
        default:
          secretKey = process.env.JWT_BUYER_KEY;
      }

      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ 
        result: 'Fail', 
        message: 'Invalid token.' 
      });
    }
  };
};

module.exports = { requireAuth };