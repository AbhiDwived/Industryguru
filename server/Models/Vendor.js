const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name Must Required!!!"],
  },
  username: {
    type: String,
    required: [true, "Username Must Required!!!"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email Must Required!!!"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "Phone Must Required!!!"],
  },
  password: {
    type: String,
    required: [true, "Password Must Required!!!"],
  },
  company: {
    type: String,
  },
  shopName: {
    type: String,
    default: "",
  },
  pic: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    required: [true, "Address Must Required!!!"],
  },
  address2: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    required: [true, "City Must Required!!!"],
  },
  state: {
    type: String,
    required: [true, "State Must Required!!!"],
  },
  pincode: {
    type: String,
    required: [true, "Pincode Must Required!!!"],
  },
  category: {
    type: String,
  },
  pan: {
    type: String,
    required: [true, "Pancard Must Required!!!"],
  },
  gst: {
    type: String,
    required: [true, "GST Must Required!!!"],
  },
  // Bank account details
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
  bank_ac_name: {
    type: String,
    default: "",
  },
  upi: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "Vendor",
  },
  termsAccepted: {
    type: Boolean,
    required: [true, "Terms acceptance is required"],
  },
  otp: {
    type: Number,
    default: null,
  },
  otpGeneratedAt: {
    type: Date,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });


const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
