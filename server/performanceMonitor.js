const mongoose = require('mongoose');

// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) { // Log slow requests (>1 second)
      console.warn(`Slow request: ${req.method} ${req.url} - ${duration}ms`);
    }
  });
  
  next();
};

// Database query performance monitoring
mongoose.set('debug', (collectionName, method, query, doc) => {
  const start = Date.now();
  console.log(`MongoDB Query: ${collectionName}.${method}`, JSON.stringify(query));
  
  // Log slow queries
  setTimeout(() => {
    const duration = Date.now() - start;
    if (duration > 500) {
      console.warn(`Slow MongoDB Query: ${collectionName}.${method} - ${duration}ms`);
    }
  }, 0);
});

module.exports = { performanceMonitor };