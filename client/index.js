const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require('./Controller/UserController')

const port = process.env.PORT || 8001;

dotenv.config();

const router = require("./Routes/index");

require("./dbConnect");
const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(cors());

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

// Serve static files
app.use("/public", express.static("public"));
// Also serve files directly from the users directory for easier access
app.use("/users", express.static(path.join(__dirname, "public/users")));
app.use("/products", express.static(path.join(__dirname, "public/products")));

app.use(express.static(path.join(__dirname, "build")));

// Add a route to check if an image exists
app.get("/api/check-image", (req, res) => {
  const imagePath = req.query.path;
  if (!imagePath) {
    return res.status(400).json({ exists: false, message: "No image path provided" });
  }
  
  const fullPath = path.join(__dirname, imagePath);
  console.log(`Checking if image exists at: ${fullPath}`);
  
  fs.access(fullPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`Image not found: ${fullPath}`);
      return res.json({ exists: false, message: "Image not found", path: fullPath });
    }
    console.log(`Image found: ${fullPath}`);
    return res.json({ exists: true, message: "Image found", path: fullPath });
  });
});

// app.use(
//   cors({
//     origin:'http://localhost:3000',
//     credentials:true,
//   })
// )

app.use(express.json());
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
