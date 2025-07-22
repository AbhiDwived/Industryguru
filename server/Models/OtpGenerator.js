const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    phone: String,
    password: String,
    role: { type: String, default: "vendor" },
    createdAt:{type:Date, default:Date.now, expires:300},
    company: String,
    state: String,
    category: String,
    pan: String,
    gst: String,
  });

module.exports = mongoose.model("vendorDB",VendorSchema)
