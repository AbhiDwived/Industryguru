const express = require("express");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require('../Models/User');
const OTP = require('../Models/OtpGenerator')
const Vendor = require("../Models/Vendor");
const Slug = require('../Models/Slug');
const SubSlug = require('../Models/SubSlug');
const { verifyVendor, checkVendorApproval } = require('../middleware/vendorAuthMiddleware');


// Import Controllers
const [
  createMaincategory,
  getAllMaincategory,
  getSingleMaincategory,
  updateMaincategory,
  deleteMaincategory,
] = require("../Controller/MaincategoryController");
const {
  createSubcategory,
  getAllSubcategory,
  getSingleSubcategory,
  updateSubcategory,
  getSubcategoryByMainCategory,
  deleteSubcategory,
} = require("../Controller/SubcategoryController");
const [
  createBrand,
  getAllBrand,
  getSingleBrand,
  getBrandBySubCategory,
  updateBrand,
  deleteBrand,
] = require("../Controller/BrandController");
const [
  createProduct,
  CreateProductByVendor,
  getAllProduct,
  getAllProductByVendor,
  getVendorDashboard,
  getAllCheckoutByVendor,
  getSingleProduct,
  getProductByMainCategory,
  getProductBySubCategory,
  getProductByBrand,
  updateProduct,
  updateProductByVendor,
  deleteProduct,
  deleteProductByVendor,
  searchProduct,
  getSingleProductByVendor,
  getProductBySlugCombination,
] = require("../Controller/ProductController");
const [
  getAllPaymentByVendor,
  createPayment,
  getAllPaymentsAdmin,
  getAdminVendors,
] = require("../Controller/Payment");
const [
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
  login,
  forgetPassword1,
  forgetPassword2,
  forgetPassword3,
  verifyOtp,// 👈 Make sure this is exported from your controller
] = require("../Controller/UserController");
const [
  createCart,
  getAllCart,
  getSingleCart,
  updateCart,
  deleteCart,
] = require("../Controller/CartController");
const [
  createWishlist,
  getAllWishlist,
  deleteWishlist,
] = require("../Controller/WishlistController");
const [
  createCheckout,
  getAllCheckout,
  getUserAllCheckout,
  getSingleCheckout,
  getSingleCheckoutUser,
  updateCheckout,
  deleteCheckout,
  order,
  verify,
  getAllPayments,
  getSingleCheckoutByVendor,
  updateCheckoutByVendor,
  deleteCheckoutByVendor,
] = require("../Controller/CheckoutController");
const [
  createNewslatter,
  getAllNewslatter,
  deleteNewslatter,
] = require("../Controller/NewslatterController");
const [
  createContact,
  getAllContact,
  getSingleContact,
  updateContact,
  deleteContact,
] = require("../Controller/ContactController");
const [
  getRatingsByProductId,
  createRating,
  updateRatingById,
  deleteRatingById,
] = require("../Controller/RatingController");
const [
  initializePayment,
  postPayment,
] = require("../Controller/PaymentController");
const [
  OtpSendVendor,
  VerifyOtp,
  getCategories
] = require('../Controller/OTPSendVendor');
const [
  getAllVendors,
  approveVendor,
  getPendingVendors
] = require('../Controller/GetAllVendors');

// const [controller] = require('../Controller/ShiprocketController');

const controller = require('../Controller/ShiprocketController');

// Import routes
const slugRoutes = require('./slugRoutes');
const subSlugRoutes = require('./subSlugRoutes');
const vendorRoutes = require('./vendorRoutes');
const vendorSlugRoutes = require('./vendorSlugRoutes');
const adminSlugRoutes = require('./adminSlugRoutes');

// Multer Storage Configurations
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/products");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
  limits: { fieldSize: 10485760 },
});
const upload = multer({ storage });

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/users");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
  limits: { fieldSize: 10485760 },
});
const upload2 = multer({ storage: storage2 });

// Middleware for Role-Based Authorization

async function verifyAdmin(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ result: "Fail", message: "Token missing!" });
  jwt.verify(token, process.env.JWT_ADMIN_KEY, (error) => {
    if (error) return res.status(401).send({ result: "Fail", message: "Invalid or expired admin token." });
    next();
  });
}

async function verifyBuyer(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ result: "Fail", message: "Token missing!" });
  jwt.verify(token, process.env.JWT_BUYER_KEY, (error) => {
    if (error) return res.status(401).send({ result: "Fail", message: "Invalid or expired buyer token." });
    next();
  });
}

async function verifyUser(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send({ result: "Fail", message: "Token missing!" });
  }

  // Try to verify with BUYER_KEY
  jwt.verify(token, process.env.JWT_BUYER_KEY, (buyerError) => {
    if (!buyerError) {
      return next();
    }

    // If buyer verification fails, try with ADMIN_KEY
    jwt.verify(token, process.env.JWT_ADMIN_KEY, (adminError) => {
      if (!adminError) {
        return next();
      }

      // If admin verification fails, try with VENDOR_KEY
      jwt.verify(token, process.env.JWT_VENDOR_KEY, (vendorError) => {
        if (!vendorError) {
          return next();
        }

        // If all verifications fail
        return res.status(401).send({ result: "Fail", message: "Invalid token." });
      });
    });
  });
}

// Router Initialization
const router = express.Router();

// Register Seller
// Create shipping order

// OR use other methods directly
router.post('/shiprocket/create-pickup', controller.createVendorPickup);
router.post('/shiprocket/create-shipping-order', controller.createShippingOrder);


const [createVendor, verifyVendorOtp] = require("../Controller/VendorController");

// Vendor registration routes
router.post("/vendor/register", async (req, res) => {
    try {
        // Validate required fields
        const requiredFields = [
            'name', 'username', 'email', 'phone', 'password',
            'address', 'city', 'state', 'pincode', 'pan', 'gst'
        ];

        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                result: "Fail",
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Check if email already exists
        const existingEmail = await Vendor.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json({
                result: "Fail",
                message: "Email already registered"
            });
        }

        // Check if username already exists
        const existingUsername = await Vendor.findOne({ username: req.body.username });
        if (existingUsername) {
            return res.status(400).json({
                result: "Fail",
                message: "Username already taken"
            });
        }

        // Create vendor
        await createVendor(req, res);

    } catch (error) {
        console.error("Vendor Registration Error:", error);
        res.status(500).json({
            result: "Fail",
            message: error.message || "Internal Server Error!!!"
        });
    }
});

// Get All Vendors From Admin Panel
router.get('/admin/vendors', verifyAdmin, getAllVendors);
router.put('/admin/approve-vendor/:_id', verifyAdmin, approveVendor);
router.get('/admin/pending-vendors', verifyAdmin, getPendingVendors);

router.post("/send-otp", OtpSendVendor)
router.post("/verify-otp", VerifyOtp)
router.post("/category", getCategories)

router.post("/maincategory", verifyAdmin, createMaincategory);
router.get("/maincategory", getAllMaincategory);
router.get("/maincategory/:_id", getSingleMaincategory);
router.put("/maincategory/:_id", verifyAdmin, updateMaincategory);
router.delete("/maincategory/:_id", verifyAdmin, deleteMaincategory);

router.post("/subcategory", verifyAdmin, createSubcategory);
router.get("/subcategory", getAllSubcategory);
router.get("/subcategory/:_id", getSingleSubcategory);
router.get("/subcategoryByMainId/:id", getSubcategoryByMainCategory);
router.put("/subcategory/:_id", verifyAdmin, updateSubcategory);
router.delete("/subcategory/:_id", verifyAdmin, deleteSubcategory);

router.post("/brand", verifyAdmin, createBrand);
router.get("/brand", getAllBrand);
router.get("/brand/:_id", getSingleBrand);
router.get("/brandBySubCategoryId/:id", getBrandBySubCategory);
router.put("/brand/:_id", verifyAdmin, updateBrand);
router.delete("/brand/:_id", verifyAdmin, deleteBrand);

router.post(
  "/product",
  upload.fields([
    { name: "pic1", maxCount: 1 },
    { name: "pic2", maxCount: 1 },
    { name: "pic3", maxCount: 1 },
    { name: "pic4", maxCount: 1 },
  ]),
  verifyAdmin,
  createProduct
);
router.get("/product", getAllProduct);
router.get("/product/:_id", getSingleProduct);
router.get("/productByMainCategory/:_id", getProductByMainCategory);
router.get("/productBySubCategory/:_id", getProductBySubCategory);
router.get("/productByBrand/:_id", getProductByBrand);
router.get("/productBySlug", getProductBySlugCombination);
router.put("/product/:_id", upload.array("pic", 4), verifyAdmin, updateProduct);
router.delete("/product/:_id", verifyAdmin, deleteProduct);

router.post(
  "/vendor-product",
  upload.fields([
    { name: "pic1", maxCount: 1 },
    { name: "pic2", maxCount: 1 },
    { name: "pic3", maxCount: 1 },
    { name: "pic4", maxCount: 1 },
  ]),
  verifyVendor,
  checkVendorApproval,
  CreateProductByVendor
);
router.get("/vendor-product", verifyVendor, checkVendorApproval, getAllProductByVendor);
router.get("/vendor-product/:_id", verifyVendor, checkVendorApproval, getSingleProductByVendor);
router.get("/vendor-dashboard", verifyVendor, checkVendorApproval, getVendorDashboard);
router.get("/vendor-checkout", verifyVendor, checkVendorApproval, getAllCheckoutByVendor);
router.get(
  "/vendor-checkout/single/:_id",
  verifyVendor,
  checkVendorApproval,
  getSingleCheckoutByVendor
);
router.put("/vendor-checkout/:_id", verifyVendor, checkVendorApproval, updateCheckoutByVendor);
router.delete("/vendor-checkout/:_id", verifyVendor, checkVendorApproval, deleteCheckoutByVendor);
router.get("/vendor-payment", verifyVendor, checkVendorApproval, getAllPaymentByVendor);
router.post("/vendor-payment", verifyAdmin, createPayment);
router.get("/admin-vendor-payment", verifyAdmin, getAllPaymentsAdmin);
router.get("/admin-vendor-list", verifyAdmin, getAdminVendors);

router.put(
  "/vendor-product/:_id",
  upload.fields([
    { name: "pic1", maxCount: 1 },
    { name: "pic2", maxCount: 1 },
    { name: "pic3", maxCount: 1 },
    { name: "pic4", maxCount: 1 },
  ]),
  verifyVendor,
  checkVendorApproval,
  updateProductByVendor
);
router.delete("/vendor-product/:_id", verifyVendor, checkVendorApproval, deleteProductByVendor);

router.post("/product/search", searchProduct);

router.post("/user", createUser);
router.post("/user/verify-otp", verifyOtp);
router.get("/user", verifyAdmin, getAllUser);
router.get("/user/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Fetching user with ID:", id);
        
        // Validate if ID is a valid MongoDB ObjectId
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.json({
                result: "Fail",
                message: "Invalid ID format"
            });
        }
        
        // Try to find the user
        const user = await User.findById(id);
        
        if (!user) {
            return res.json({
                result: "Fail",
                message: "User not found"
            });
        }
        
        res.json({
            result: "Done",
            data: user
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.json({
            result: "Fail",
            message: error.message || "Error fetching user"
        });
    }
});
router.put("/user/:id", upload2.single('pic'), async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Updating user with ID:", id);
        
        // Check if ID is valid MongoDB ObjectId
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({
                result: "Fail",
                message: "Invalid Id format"
            });
        }
        
        // Find the user first to check if it exists
        const user = await User.findById(id);
        
        if (!user) {
            return res.json({
                result: "Fail",
                message: "User not found"
            });
        }
        
        // Process form data
        if (req.file) {
            req.body.pic = req.file.filename;
        }
        
        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );
        
        res.json({
            result: "Done",
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.json({
            result: "Fail",
            message: error.message || "Error updating user"
        });
    }
});
router.delete("/user/:_id", verifyAdmin, deleteUser);
router.post("/user/login", login);
router.post("/user/forget-password-1", forgetPassword1);
router.post("/user/forget-password-2", forgetPassword2);
router.post("/user/forget-password-3", forgetPassword3);

router.post("/cart", verifyUser, createCart);
router.get("/cart/:userid", verifyUser, getAllCart);
router.get("/cart/single/:_id", verifyUser, getSingleCart);
router.put("/cart/:_id", verifyUser, updateCart);
router.delete("/cart/:_id", verifyUser, deleteCart);

router.post("/wishlist", verifyUser, createWishlist);
router.get("/wishlist/:userid", verifyUser, getAllWishlist);
router.delete("/wishlist/:_id", verifyUser, deleteWishlist);

router.post("/checkout", verifyBuyer, createCheckout);
router.get("/checkout", verifyAdmin, getAllCheckout);
router.get("/payments/:orderid", verifyAdmin, getAllPayments);
router.get("/checkout/:userid", verifyBuyer, getUserAllCheckout);
router.get("/checkout/single/:_id", verifyAdmin, getSingleCheckout);
router.get("/checkout/singleuser/:_id/:userid", verifyUser, getSingleCheckoutUser);
router.put("/checkout/:_id", verifyAdmin, updateCheckout);
router.delete("/checkout/:_id", verifyAdmin, deleteCheckout);
router.post("/checkout/order", verifyBuyer, order);
router.post("/checkout/verify", verifyBuyer, verify);

router.post("/newslatter", createNewslatter);
router.get("/newslatter/", verifyAdmin, getAllNewslatter);
router.delete("/newslatter/:_id", verifyAdmin, deleteNewslatter);

router.post("/contact", createContact);
router.get("/contact", verifyAdmin, getAllContact);
router.get("/contact/:_id", verifyAdmin, getSingleContact);
router.put("/contact/:_id", verifyAdmin, updateContact);
router.delete("/contact/:_id", verifyAdmin, deleteContact);

// Get Ratings by Product ID
router.get("/ratings/:productId", verifyUser, getRatingsByProductId);

// Create Rating
router.post("/ratings/:_id", verifyUser, createRating);

// Update Rating by ID
router.put("/ratings/:_id", verifyUser, updateRatingById);

// Delete Rating by ID
router.delete("/ratings/:_id", verifyUser, deleteRatingById);

router.post("/processpayment/:_id/:_url", postPayment);
router.post("/payment", initializePayment);

// Mount routes
router.use('/vendor', vendorRoutes);
router.use('/vendor', vendorSlugRoutes);
router.use('/slugs', slugRoutes); // Legacy routes - consider deprecating
router.use('/sub-slugs', subSlugRoutes); // Legacy routes - consider deprecating
router.use('/admin', adminSlugRoutes); // New admin routes



// Admin middleware to check if user is admin
const adminAuthMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                result: "Fail",
                message: "No token provided"
            });
        }
        
        // Add your admin verification logic here
        next();
    } catch (error) {
        res.status(401).json({
            result: "Fail",
            message: "Authentication failed"
        });
    }
};

// Get pending vendors
router.get("/admin/pending-vendors", async (req, res) => {
    try {
        const vendors = await Vendor.find({ 
            isApproved: false 
        });
        
        res.json({
            result: "Done",
            vendors: vendors
        });
    } catch (error) {
        res.status(500).json({
            result: "Fail",
            message: "Error fetching vendors"
        });
    }
});

// Approve vendor - Simple route
router.put("/vendor/approve/:id", async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        
        if (!vendor) {
            return res.json({
                result: "Fail",
                message: "Vendor not found"
            });
        }

        vendor.isApproved = true;
        await vendor.save();

        res.json({
            result: "Done",
            message: "Vendor approved successfully"
        });
    } catch (error) {
        res.json({
            result: "Fail",
            message: "Error approving vendor"
        });
    }
});

// Get vendor status by ID
router.get("/vendor/status/:id", async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        
        if (!vendor) {
            return res.json({
                result: "Fail",
                message: "Vendor not found"
            });
        }

        res.json({
            result: "Done",
            isApproved: vendor.isApproved,
            name: vendor.name,
            email: vendor.email
        });
    } catch (error) {
        console.error("Error getting vendor status:", error);
        res.json({
            result: "Fail",
            message: "Error fetching vendor status"
        });
    }
});

// Verify vendor token and approval status
router.get("/vendor/verify", async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                result: "Fail",
                message: "No token provided"
            });
        }
        
        // Verify token (adjust according to your JWT implementation)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Find vendor by ID
        const vendor = await Vendor.findById(decoded._id || decoded.id);
        
        if (!vendor) {
            return res.status(404).json({
                result: "Fail",
                message: "Vendor not found"
            });
        }
        
        res.json({
            result: "Done",
            isApproved: vendor.isApproved,
            vendor: {
                _id: vendor._id,
                name: vendor.name,
                email: vendor.email
            }
        });
    } catch (error) {
        console.error("Vendor verification error:", error);
        res.status(401).json({
            result: "Fail",
            message: "Invalid token"
        });
    }
});

// Get vendor profile
router.get("/vendor/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Fetching vendor with ID:", id);
        
        // Validate if ID is a valid MongoDB ObjectId
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.json({
                result: "Fail",
                message: "Invalid ID format"
            });
        }
        
        // Try to find the vendor
        let vendor = null;
        
        // First try in Vendor collection
        try {
            vendor = await Vendor.findById(id);
        } catch (err) {
            console.log("Error finding in Vendor collection:", err.message);
        }
        
        // If not found, try in User collection
        if (!vendor) {
            try {
                vendor = await User.findOne({ _id: id, role: "Vendor" });
            } catch (err) {
                console.log("Error finding in User collection:", err.message);
            }
        }
        
        if (!vendor) {
            return res.json({
                result: "Fail",
                message: "Vendor not found"
            });
        }
        
        res.json({
            result: "Done",
            data: vendor
        });
    } catch (error) {
        console.error("Error fetching vendor:", error);
        res.json({
            result: "Fail",
            message: error.message || "Error fetching vendor"
        });
    }
});

// Update vendor profile
router.put("/vendor/profile/:id", upload2.single('pic'), async (req, res) => {
    try {
        const id = req.params.id;
        
        // Query the Vendor model directly
        let vendor = await Vendor.findById(id);
        
        if (!vendor) {
            return res.json({
                result: "Fail",
                message: "Vendor not found"
            });
        }
        
        // Process file upload
        if (req.file) {
            vendor.pic = req.file.filename;
        }
        
        // Update the vendor fields
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                vendor[key] = req.body[key];
            }
        });
        
        await vendor.save();
        
        res.json({
            result: "Done",
            message: "Vendor profile updated successfully",
            data: vendor  // Return the updated vendor data
        });
    } catch (error) {
        console.error("Error updating vendor profile:", error);
        res.json({
            result: "Fail",
            message: error.message || "Error updating vendor profile"
        });
    }
});

// Debug endpoint for vendor profile issues
router.post("/vendor/debug", async (req, res) => {
    try {
        const { userId } = req.body;
        
        console.log("Debug request for user ID:", userId);
        
        // Check if the ID is valid MongoDB ObjectId
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(userId);
        
        // Try to find in both collections
        let vendorResult = null;
        let userResult = null;
        
        if (isValidObjectId) {
            try {
                vendorResult = await Vendor.findById(userId);
            } catch (err) {
                console.log("Error finding vendor:", err.message);
            }
            
            try {
                userResult = await User.findById(userId);
            } catch (err) {
                console.log("Error finding user:", err.message);
            }
        }
        
        res.json({
            result: "Done",
            debug: {
                userId,
                isValidObjectId,
                vendorExists: !!vendorResult,
                userExists: !!userResult,
                vendorData: vendorResult ? {
                    id: vendorResult._id,
                    name: vendorResult.name,
                    role: vendorResult.role,
                    isApproved: vendorResult.isApproved
                } : null,
                userData: userResult ? {
                    id: userResult._id,
                    name: userResult.name,
                    role: userResult.role
                } : null
            }
        });
    } catch (error) {
        console.error("Debug error:", error);
        res.status(500).json({
            result: "Fail",
            message: "Debug error",
            error: error.message
        });
    }
});

module.exports = router;