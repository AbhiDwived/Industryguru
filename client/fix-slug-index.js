const mongoose = require("mongoose");
require("dotenv").config();

async function fixSlugIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DBKEY);
    console.log("Connected to MongoDB");

    // Get the Product collection
    const Product = mongoose.connection.collection("products");

    // Drop existing indexes
    try {
      await Product.dropIndex("slug_1");
      console.log("Dropped existing slug_1 index");
    } catch (error) {
      console.log("No existing slug_1 index found or already dropped");
    }

    // Create new compound index
    await Product.createIndex(
      { 
        slug: 1, 
        subSlug: 1, 
        innerSlug: 1, 
        innerSubSlug: 1 
      }, 
      { 
        unique: true,
        sparse: true,
        name: "slug_combination_unique"
      }
    );
    console.log("Created new compound unique index");

    console.log("Index fix completed successfully");
  } catch (error) {
    console.error("Error fixing index:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

fixSlugIndex(); 