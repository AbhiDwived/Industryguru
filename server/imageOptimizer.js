const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Serve optimized images with proper headers
router.get('/products/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, 'public', 'products', filename);
  
  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    return res.status(404).send('Image not found');
  }
  
  // Set cache headers for better performance
  res.set({
    'Cache-Control': 'public, max-age=31536000', // 1 year
    'ETag': `"${filename}"`,
    'Last-Modified': fs.statSync(imagePath).mtime.toUTCString()
  });
  
  // Check if client has cached version
  if (req.headers['if-none-match'] === `"${filename}"`) {
    return res.status(304).end();
  }
  
  res.sendFile(imagePath);
});

module.exports = router;