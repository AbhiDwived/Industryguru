const express = require("express");
const compression = require("compression");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const validator = require("validator");
require('./Controller/UserController')

const port = process.env.PORT || 8001;

dotenv.config();

const router = require("./Routes/index");
const { performanceMonitor } = require('./performanceMonitor');
const imageOptimizer = require('./imageOptimizer');
<<<<<<< HEAD

=======
const { csrfProtection } = require('./middleware/csrf');
>>>>>>> d16e7f6 (feat: add performance optimizations and security enhancements)

require("./dbConnect");
const app = express();

// Compression middleware
app.use(compression({
  level: 6,
  threshold: 1024
}));

// Security middleware
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
}));

app.use(performanceMonitor);
app.use(express.urlencoded({ extended: true }))
<<<<<<< HEAD
// app.use(cors({
//   origin: ['https://www.industryguru.in', 'http://www.industryguru.in', 'https://industryguru-backend.hcx5k4.easypanel.host', 'http://localhost:3000', 'http://localhost:5173'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
// }));
=======
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://industryguru-backend.hcx5k4.easypanel.host']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
>>>>>>> d16e7f6 (feat: add performance optimizations and security enhancements)

// Ensure public directories exist
const publicDir = path.join(__dirname, "public");
const usersDir = path.join(publicDir, "users");
const productsDir = path.join(publicDir, "products");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}
if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir);
}
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir);
}

// Serve static files with optimization
app.use("/public/products", imageOptimizer);
app.use("/public", express.static("public", {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.js') || path.endsWith('.css')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    if (path.endsWith('.jpg') || path.endsWith('.png') || path.endsWith('.webp')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));
app.use("/users", express.static(path.join(__dirname, "public/users")));
app.use("/products", express.static(path.join(__dirname, "public/products")));

app.use(express.static(path.join(__dirname, "build")));

// Add a route to check if an image exists
app.get("/api/check-image", (req, res) => {
  const { validatePath, sanitizeLog } = require('./middleware/security');
  const imagePath = req.query.path;
  
  if (!imagePath) {
    return res.status(400).json({ exists: false, message: "No image path provided" });
  }
  
  // Validate path to prevent traversal attacks
  if (!validatePath(imagePath)) {
    return res.status(400).json({ exists: false, message: "Invalid path" });
  }
  
  const fullPath = path.join(__dirname, imagePath);
  console.log(`Checking if image exists at: ${sanitizeLog(fullPath)}`);
  
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`Image not found: ${sanitizeLog(fullPath)}`);
      return res.json({ exists: false, message: "Image not found" });
    }
    console.log(`Image found: ${sanitizeLog(fullPath)}`);
    return res.json({ exists: true, message: "Image found" });
  });
});

// app.use(
//   cors({
//     origin:'http://localhost:3000',
//     credentials:true,
//   })
// )

// Security middleware
const { sanitizeInput } = require('./middleware/security');
app.use(sanitizeInput);
<<<<<<< HEAD
=======
app.use(csrfProtection);
>>>>>>> d16e7f6 (feat: add performance optimizations and security enhancements)

app.use(express.json({ limit: '10mb' }));
app.use("/api", router);

// 👇 Default route for browser
app.get("/", (req, res) => {
  res.send("<h2>🚀 Server is running successfully! Welcome to the backend!</h2>");
});

app.use("*", express.static(path.join(__dirname, "build")));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        result: "Fail",
        message: "Something broke!"
    });
});

const startServer = async (port) => {
  try {
    app.listen(port, () => {
      console.log(`Server is running at PORT ${port}`);
    });
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}`);
      startServer(port + 1);
    } else {
      console.error('Error starting server:', error);
    }
  }
};

startServer(port);
