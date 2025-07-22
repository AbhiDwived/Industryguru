const Vendor = require("../Models/Vendor");
const bcrypt = require("bcrypt");
const passwordValidator = require("password-validator");
const { sendSMS } = require("../Services/sms-service");

// Password Schema
var schema = new passwordValidator()
schema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase(1)
  .has()
  .lowercase(1)
  .has()
  .digits(1)
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123", "Admin123", "Qwerty@123"]);

// Register Vendor
async function createVendor(req, res) {
  try {
    // Validate password
    if (!schema.validate(req.body.password)) {
      return res.status(400).json({
        result: "Fail",
        message: "Password must be 8–100 characters long, contain at least 1 digit, uppercase, lowercase letter, and no spaces."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // Create new vendor
    const vendor = new Vendor({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
      company: req.body.company || "",
      shopName: req.body.shopName || "",
      address: req.body.address,
      address2: req.body.address2 || "",
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      category: req.body.category || "",
      pan: req.body.pan,
      gst: req.body.gst,
      role: "Vendor",
      termsAccepted: req.body.termsAccepted || false,
      isVerified: false,
      isApproved: false
    });

    // Save vendor
    await vendor.save();

    // Send success response
    res.status(201).json({
      result: "Done",
      message: "Registration successful! Please wait for admin approval.",
      data: {
        _id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone
      }
    });

  } catch (error) {
    console.error("Vendor Registration Error:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        result: "Fail",
        message: messages.join(', ')
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        result: "Fail",
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      result: "Fail",
      message: "Internal Server Error!!!"
    });
  }
}

// Verify Vendor OTP
async function verifyVendorOtp(req, res) {
  const { username, otp } = req.body;

  try {
    const vendor = await Vendor.findOne({ username });

    if (!vendor) {
      return res.send({ result: "Fail", message: "Vendor not found" });
    }

    // If OTP doesn't match or is expired
    const now = new Date();
    const expiry = new Date(vendor.otpGeneratedAt);
    expiry.setMinutes(expiry.getMinutes() + 30); // 30 minutes expiry

    if (
      !vendor.otp ||
      parseInt(vendor.otp) !== parseInt(otp) ||
      now > expiry
    ) {
      return res.send({ result: "Fail", message: "Invalid or expired OTP" });
    }

    // Clear OTP and verify phone
    vendor.otp = null;
    vendor.otpGeneratedAt = null;
    vendor.isPhoneVerified = true;
    await vendor.save();

    res.send({ 
      result: "Done", 
      message: "Phone verified successfully! Please wait for admin approval to access your account." 
    });

  } catch (error) {
    console.error("Vendor OTP Verification Error:", error);
    res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

module.exports = [createVendor, verifyVendorOtp]; 