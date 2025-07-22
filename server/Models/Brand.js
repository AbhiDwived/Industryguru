const mongoose = require("mongoose");

const BrandShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name Must Required!!!"],
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true,
  },
});

// Add compound index to ensure uniqueness of name within a subcategory
BrandShema.index({ name: 1, subcategory: 1 }, { unique: true });

const Brand = new mongoose.model("Brand", BrandShema);
module.exports = Brand;
