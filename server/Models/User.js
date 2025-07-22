const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name Must Required!!!"],
  },
  username: {
    type: String,
    required: [true, "User Name Must Required!!!"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email Must Required!!!"],
  },
  phone: {
    type: String,
    required: [true, "Phone Must Required!!!"],
  },
  password: {
    type: String,
    required: [true, "Password Must Required!!!"],
  },
  addressline1: String,
  addressline2: String,
  addressline3: String,
  pin: String,
  city: String,
  state: String,
  pic: String,
  role: {
    type: String,
    default: "Buyer",
  },

  // OTP fields
  otp: {
    type: Number,
    default: null,
  },
  otpGeneratedAt: {
    type: Date,
    default: null,
  },

  // Phone verification flag
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },

  // Vendor status (optional, used in updateUser logic)
  isActive: {
    type: Boolean,
    default: true,
  },

  // Bank & PAN details
  pan: {
    type: String,
    default: "",
  },
  bank_no: {
    type: String,
    default: "",
  },
  bank_ifsc: {
    type: String,
    default: "",
  },
  bank_branch: {
    type: String,
    default: "",
  },
  bank_name: {
    type: String,
    default: "",
  },
  upi: {
    type: String,
    default: "",
  },
  bank_ac_name: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
