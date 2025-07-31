const mongoose = require("mongoose");

const ProductShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name Must Required!!!"],
  },
  maincategory: {
    type: mongoose.Types.ObjectId,
    required: [true, "Maincategory Must Required!!!"],
    ref: "maincategory",
  },
  subcategory: {
    type: mongoose.Types.ObjectId,
    required: [true, "Subcategory Must Required!!!"],
    ref: "Subcategory",
  },
  
  brand: {
    type: mongoose.Types.ObjectId,
    required: [true, "Brand Must Required!!!"],
    ref: "Brand",
  },
  slug: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slug',
  },
  subSlug: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubSlug',
  },
  innerSlug: {
    type: String,
  },
  innerSubSlug: {
    type: String,
  },
  color: {
    type: String,
  },
  size: {
    type: String,
  },
  baseprice: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  finalprice: {
    type: Number,
  },
  stock: {
    type: Number,
    default: 0,
  },
  specification: [],
  description: {
    type: String,
    default: "This is Sample Product",
  },
  pic1: {
    type: String,
    required: function() {
      return this.isNew;
    },
  },
  pic2: {
    type: String,
    default: "",
  },
  pic3: {
    type: String,
    default: "",
  },
  pic4: {
    type: String,
    default: "",
  },
  variants: [{
    innerSlug: {
      type: String,
      required: false,
    },
    innerSubSlug: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    baseprice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    finalprice: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "This is a sample variant description",
    },
    specification: [{
      key: String,
      value: String,
    }],
  }],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true
});

const Product = new mongoose.model("Product", ProductShema);
module.exports = Product;
