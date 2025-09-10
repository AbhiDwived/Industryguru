const jwt = require('jsonwebtoken');
const Vendor = require('../Models/Vendor');

// Verify vendor token
const verifyVendor = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '') || req.headers.authorization;
    
    if (!token) {
      return res.status(401).json({ 
        result: 'Fail', 
        message: 'No authentication token found' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_VENDOR_KEY);
    
    // Find vendor
    const vendor = await Vendor.findOne({ _id: decoded.data._id });
    
    if (!vendor) {
      return res.status(401).json({ 
        result: 'Fail', 
        message: 'Vendor not found' 
      });
    }

    // Add vendor info to request
    req.vendor = vendor;
    req.token = token;
    
    next();
  } catch (error) {
    res.status(401).json({ 
      result: 'Fail', 
      message: 'Please authenticate' 
    });
  }
};

// Check if vendor is approved
const checkVendorApproval = async (req, res, next) => {
  try {
    const vendor = req.vendor;

    if (!vendor.isApproved) {
      return res.status(403).json({ 
        result: 'Fail', 
        message: 'Vendor account is pending approval' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ 
      result: 'Fail', 
      message: 'Error checking vendor approval status' 
    });
  }
};

module.exports = {
  verifyVendor,
  checkVendorApproval
}; 