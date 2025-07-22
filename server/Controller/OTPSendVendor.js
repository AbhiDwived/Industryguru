const express = require("express");
const router = express.Router();
const vendorDB = require("../Models/OtpGenerator");
const { sendSMS } = require("../Services/sms-service"); // Reuse SMS service from user side
const otpGenerator = require("otp-generator");

let otpStore = {};

// Generate and send OTP via SMS
const OtpSendVendor = async (req, res) => {
  const { email, phone } = req.body;

  if (!phone) {
    return res.json({ success: false, message: "Phone number is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  // Store OTP with timestamp (expires in 5 minutes)
  otpStore[phone] = {
    otp,
    expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
  };

  // Prepare SMS message
  const smsMessage = `Your OTP for registration on industry guru web portal is ${otp}. Valid for 30 minutes. Please do not share this OTP.Regards,Optima connect`;

  try {
    await sendSMS(phone, smsMessage); // Send SMS using your existing SMS service
    return res.json({ success: true, message: "OTP sent successfully via SMS." });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return res.json({ success: false, message: "Failed to send OTP via SMS." });
  }
};

// Verify OTP
const VerifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.json({ success: false, message: "Phone and OTP are required." });
  }

  const storedOtp = otpStore[phone];

  if (!storedOtp) {
    return res.json({ success: false, message: "No OTP found for this phone." });
  }

  if (storedOtp.expiresAt < Date.now()) {
    delete otpStore[phone];
    return res.json({ success: false, message: "OTP has expired." });
  }

  if (storedOtp.otp === otp) {
    delete otpStore[phone];
    return res.json({ success: true, message: "OTP verified successfully!" });
  } else {
    return res.json({ success: false, message: "Invalid OTP." });
  }
};


// Dummy route to get categories (you can replace with real data)
const getCategories = async (req, res) => {
  const categories = ["Electronics", "Clothing", "Home & Kitchen"];
  res.json({ result: true, categories });
};

// Save vendor info (after OTP success)
const CreateVendor = async (req, res) => {
  try {
    const newVendor = new vendorDB({
      ...req.body,
      isPhoneVerified: true, // Mark phone as verified here
    });
    await newVendor.save();
    res.json({ result: "Done" });
  } catch (err) {
    res.json({ result: "error", message: err.message });
  }
};


module.exports = [OtpSendVendor, VerifyOtp, getCategories, CreateVendor];