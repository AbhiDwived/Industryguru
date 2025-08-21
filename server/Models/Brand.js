const mongoose = require("mongoose");

const BrandShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name Must Required!!!"],
    unique: true,
  },
});

const Brand = new mongoose.model("Brand", BrandShema);

// Drop unique indexes if they exist (only after connection is established)
setTimeout(() => {
  // Drop compound index
  Brand.collection.dropIndex({ name: 1, subcategory: 1 }).catch(() => {
    console.log('Compound index drop attempted - may not have existed');
  });
  
  // Drop single name index
  Brand.collection.dropIndex({ name: 1 }).catch(() => {
    console.log('Name index drop attempted - may not have existed');
  });
  
  // Drop by index name if it exists
  Brand.collection.dropIndex('name_1').catch(() => {
    console.log('name_1 index drop attempted - may not have existed');
  });
}, 1000);

module.exports = Brand;
