const mongoose = require('mongoose');
require('dotenv').config();

async function dropIndex() {
  try {
    await mongoose.connect(process.env.DBKEY);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('products');
    
    // Drop the compound index
    await collection.dropIndex('slug_1_subSlug_1_innerSlug_1_innerSubSlug_1');
    console.log('Successfully dropped the compound unique index');
    
    // List remaining indexes to verify
    const indexes = await collection.indexes();
    console.log('Remaining indexes:', indexes.map(idx => idx.name));
    
  } catch (error) {
    console.error('Error dropping index:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

dropIndex(); 