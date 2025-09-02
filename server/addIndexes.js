const mongoose = require('mongoose');
require('./dbConnect');

async function addIndexes() {
  try {
    await new Promise((resolve) => {
      mongoose.connection.once('open', resolve);
    });
    const db = mongoose.connection.db;
    
    // Add indexes for Product collection
    await db.collection('products').createIndex({ name: 1 });
    await db.collection('products').createIndex({ maincategory: 1 });
    await db.collection('products').createIndex({ subcategory: 1 });
    await db.collection('products').createIndex({ brand: 1 });
    await db.collection('products').createIndex({ slug: 1 });
    await db.collection('products').createIndex({ subSlug: 1 });
    await db.collection('products').createIndex({ addedBy: 1 });
    await db.collection('products').createIndex({ finalprice: 1 });
    await db.collection('products').createIndex({ discount: -1 });
    await db.collection('products').createIndex({ createdAt: -1 });
    
    // Compound indexes for common queries
    await db.collection('products').createIndex({ addedBy: 1, createdAt: -1 });
    await db.collection('products').createIndex({ maincategory: 1, subcategory: 1 });
    await db.collection('products').createIndex({ slug: 1, subSlug: 1 });
    
    // Text index for search
    await db.collection('products').createIndex({ 
      name: 'text', 
      description: 'text',
      innerSlug: 'text',
      innerSubSlug: 'text'
    });
    
    console.log('All indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating indexes:', error);
    process.exit(1);
  }
}

addIndexes();