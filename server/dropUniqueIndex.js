const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function dropUniqueIndex() {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('brands');
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);
    
    // Drop the unique compound index if it exists
    try {
      await collection.dropIndex({ name: 1, subcategory: 1 });
      console.log('Unique index dropped successfully');
    } catch (error) {
      console.log('Index might not exist or already dropped:', error.message);
    }
    
    // Verify indexes after dropping
    const newIndexes = await collection.indexes();
    console.log('Indexes after dropping:', newIndexes);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

dropUniqueIndex();