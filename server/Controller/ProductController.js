const jwt = require("jsonwebtoken");
const Product = require("../Models/Product");
const Checkout = require("../Models/Checkout");
const fs = require("fs");
const { MongoClient, ObjectId } = require("mongodb");
const mongoose = require("mongoose");

async function createProduct(req, res) {
  try {
    var decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_ADMIN_KEY
    );
    
    // Enhanced data validation
    const productData = {
      ...req.body,
      addedBy: decoded.data._id,
    };
    
    // Ensure numeric fields are properly converted
    if (productData.baseprice) {
      productData.baseprice = Number(productData.baseprice);
    }
    if (productData.discount) {
      productData.discount = Number(productData.discount);
    }
    if (productData.finalprice) {
      productData.finalprice = Number(productData.finalprice);
    }
    if (productData.stock) {
      productData.stock = Number(productData.stock);
    }
    
    // Ensure innerSlug and innerSubSlug are properly handled
    if (req.body.innerSlug) {
      productData.innerSlug = req.body.innerSlug;
    }
    if (req.body.innerSubSlug) {
      productData.innerSubSlug = req.body.innerSubSlug;
    }
    
    // Handle variants array
    if (req.body.variants) {
      try {
        productData.variants = JSON.parse(req.body.variants);
        // Ensure numeric fields in variants are properly converted
        productData.variants = productData.variants.map(variant => ({
          ...variant,
          baseprice: Number(variant.baseprice),
          discount: Number(variant.discount),
          finalprice: Number(variant.finalprice),
          stock: Number(variant.stock),
        }));
      } catch (parseError) {
        console.error("Error parsing variants:", parseError);
        productData.variants = [];
      }
    }
    
    var data = new Product(productData);

    // Handle file uploads with better error handling
    try {
      data.pic1 = req.files.pic1[0].filename;
      console.log("data.pic1 uploaded:", data.pic1);
    } catch (error) {
      console.log("pic1 not provided");
    }
    try {
      data.pic2 = req.files.pic2[0].filename;
      console.log("data.pic2 uploaded:", data.pic2);
    } catch (error) {
      console.log("pic2 not provided");
    }
    try {
      data.pic3 = req.files.pic3[0].filename;
      console.log("data.pic3 uploaded:", data.pic3);
    } catch (error) {
      console.log("pic3 not provided");
    }
    try {
      data.pic4 = req.files.pic4[0].filename;
      console.log("data.pic4 uploaded:", data.pic4);
    } catch (error) {
      console.log("pic4 not provided");
    }
    
    // Enhanced specification handling
    if (data.specification) {
      try {
        data.specification = JSON.parse(data.specification);
      } catch (parseError) {
        console.error("Error parsing specification:", parseError);
        data.specification = [];
      }
    }
    
    await data.save();
    console.log("Product created successfully:", data._id);
    res.send({ result: "Done", message: "Record is Created!!!", data: data });
  } catch (error) {
    console.error("Error creating product:", error);
    
    // Enhanced error handling with more specific messages
    if (error.errors?.name)
      res.status(400).send({ result: "Fail", message: error.errors.name.message });
    else if (error.errors?.maincategory)
      res.status(400).send({ result: "Fail", message: error.errors.maincategory.message });
    else if (error.errors?.subcategory)
      res.status(400).send({ result: "Fail", message: error.errors.subcategory.message });
    else if (error.errors?.brand)
      res.status(400).send({ result: "Fail", message: error.errors.brand.message });
    else if (error.errors?.color)
      res.status(400).send({ result: "Fail", message: error.errors.color.message });
    else if (error.errors?.size)
      res.status(400).send({ result: "Fail", message: error.errors.size.message });
    else if (error.errors?.baseprice)
      res.status(400).send({ result: "Fail", message: error.errors.baseprice.message });
    else if (error.errors?.finalprice)
      res.status(400).send({ result: "Fail", message: error.errors.finalprice.message });
    else if (error.errors?.pic1)
      res.status(400).send({ result: "Fail", message: error.errors.pic1.message });
    else if (error.errors?.stock)
      res.status(400).send({ result: "Fail", message: error.errors.stock.message });
    else if (error.errors?.innerSlug)
      res.status(400).send({ result: "Fail", message: error.errors.innerSlug.message });
    else if (error.errors?.innerSubSlug)
      res.status(400).send({ result: "Fail", message: error.errors.innerSubSlug.message });
    else if (error.errors?.variants)
      res.status(400).send({ result: "Fail", message: "Invalid variants data" });
    else
      res
        .status(500)
        .send({ result: "Fail", message: "Internal Server Error!!!", error: error.message });
  }
}
async function CreateProductByVendor(req, res) {
  try {
    var decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_VENDOR_KEY
    );
    // Enhanced data validation for vendor products
    const productData = {
      ...req.body,
      addedBy: decoded.data._id,
    };
    // Ensure numeric fields are properly converted
    if (productData.baseprice) {
      productData.baseprice = Number(productData.baseprice);
    }
    if (productData.discount) {
      productData.discount = Number(productData.discount);
    }
    if (productData.finalprice) {
      productData.finalprice = Number(productData.finalprice);
    }
    if (productData.stock) {
      productData.stock = Number(productData.stock);
    }
    // Ensure innerSlug and innerSubSlug are properly handled
    if (req.body.innerSlug) {
      productData.innerSlug = req.body.innerSlug;
    }
    if (req.body.innerSubSlug) {
      productData.innerSubSlug = req.body.innerSubSlug;
    }
    // Handle variants array (parse JSON, convert numeric fields)
    if (req.body.variants) {
      try {
        productData.variants = JSON.parse(req.body.variants);
        productData.variants = productData.variants.map(variant => ({
          ...variant,
          baseprice: Number(variant.baseprice),
          discount: Number(variant.discount),
          finalprice: Number(variant.finalprice),
          stock: Number(variant.stock),
        }));
      } catch (parseError) {
        console.error("Error parsing vendor variants:", parseError);
        productData.variants = [];
      }
    }
    var data = new Product(productData);
    // Handle file uploads with better error handling
    try {
      data.pic1 = req.files.pic1[0].filename;
      console.log("Vendor product pic1 uploaded:", data.pic1);
    } catch (error) {
      console.log("Vendor product pic1 not provided");
    }
    try {
      data.pic2 = req.files.pic2[0].filename;
      console.log("Vendor product pic2 uploaded:", data.pic2);
    } catch (error) {
      console.log("Vendor product pic2 not provided");
    }
    try {
      data.pic3 = req.files.pic3[0].filename;
      console.log("Vendor product pic3 uploaded:", data.pic3);
    } catch (error) {
      console.log("Vendor product pic3 not provided");
    }
    try {
      data.pic4 = req.files.pic4[0].filename;
      console.log("Vendor product pic4 uploaded:", data.pic4);
    } catch (error) {
      console.log("Vendor product pic4 not provided");
    }
    // Enhanced specification handling
    if (data.specification) {
      try {
        data.specification = JSON.parse(data.specification);
      } catch (parseError) {
        console.error("Error parsing vendor product specification:", parseError);
        data.specification = [];
      }
    }
    await data.save();
    res.send({ result: "Done", message: "Record is Created!!!", data: data });
  } catch (error) {
    console.error("Error creating vendor product:", error);
    if (error.errors?.name)
      res.status(400).send({ result: "Fail", message: error.errors.name.message });
    else if (error.errors?.maincategory)
      res.status(400).send({ result: "Fail", message: error.errors.maincategory.message });
    else if (error.errors?.subcategory)
      res.status(400).send({ result: "Fail", message: error.errors.subcategory.message });
    else if (error.errors?.brand)
      res.status(400).send({ result: "Fail", message: error.errors.brand.message });
    else if (error.errors?.color)
      res.status(400).send({ result: "Fail", message: error.errors.color.message });
    else if (error.errors?.size)
      res.status(400).send({ result: "Fail", message: error.errors.size.message });
    else if (error.errors?.baseprice)
      res.status(400).send({ result: "Fail", message: error.errors.baseprice.message });
    else if (error.errors?.finalprice)
      res.status(400).send({ result: "Fail", message: error.errors.finalprice.message });
    else if (error.errors?.pic1)
      res.status(400).send({ result: "Fail", message: error.errors.pic1.message });
    else if (error.errors?.stock)
      res.status(400).send({ result: "Fail", message: error.errors.stock.message });
    else if (error.errors?.innerSlug)
      res.status(400).send({ result: "Fail", message: error.errors.innerSlug.message });
    else if (error.errors?.innerSubSlug)
      res.status(400).send({ result: "Fail", message: error.errors.innerSubSlug.message });
    else if (error.errors?.variants)
      res.status(400).send({ result: "Fail", message: "Invalid variants data" });
    else
      res.status(500).send({ result: "Fail", message: "Internal Server Error!!!", error: error.message });
  }
}
async function getAllProduct(req, res) {
  try {
    var data = await Product.find()
      .populate("brand")
      .populate({
        path: "slug",
        model: "slug"
      })
      .populate({
        path: "subSlug",
        model: "subslug"
      })
      .sort({ _id: -1 });
      
    console.log("Product data fetched successfully");
    res.send({ result: "Done", count: data.length, data: data });
  } catch (error) {
    console.error("Error in getAllProduct:", error);
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}
async function getAllProductByVendor(req, res) {
  const limit = 20;
  const skip = (req.query?.page || 0) * limit;
  const search = req.query?.search || "";
  try {
    var decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_VENDOR_KEY
    );
    const user = decoded.data._id;
    const query = {
      addedBy: user,
    };
    if (search) {
      query.name = { $regex: new RegExp(search, "i") };
    }
    var data = await Product.find(query)
      .populate("brand")
      .populate({
        path: "slug",
        model: "slug"
      })
      .populate({
        path: "subSlug",
        model: "subslug"
      })
      .sort({ _id: -1 })
      .limit(limit)
      .skip(skip);
      
    var count = await Product.count(query);
    console.log(`Found ${data.length} products for vendor ${user}`);
    res.send({ result: "Done", count: count, data: data });
  } catch (error) {
    console.error("Error in getAllProductByVendor:", error);
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}
async function getSingleProduct(req, res) {
  try {
    var data = await Product.findOne({ _id: req.params._id })
      .populate("brand")
      .populate({
        path: "slug",
        model: "slug"
      })
      .populate({
        path: "subSlug",
        model: "subslug"
      });
      
    console.log("Single product data fetched:", data ? "Found" : "Not found");
    if (data) res.send({ result: "Done", data: data });
    else res.send({ result: "Fail", message: "Invalid Id!!!" });
  } catch (error) {
    console.error("Error in getSingleProduct:", error);
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}
async function getProductByMainCategory(req, res) {
  try {
    var data = await Product.find({ maincategory: req.params._id });
    if (data) res.send({ result: "Done", data: data });
    else res.send({ result: "Fail", message: "Invalid Id!!!" });
  } catch (error) {
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}
async function getProductBySubCategory(req, res) {
  try {
    var data = await Product.find({ subcategory: req.params._id });
    if (data) res.send({ result: "Done", data: data });
    else res.send({ result: "Fail", message: "Invalid Id!!!" });
  } catch (error) {
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}
async function getProductByBrand(req, res) {
  try {
    var data = await Product.find({ brand: req.params._id });
    if (data) res.send({ result: "Done", data: data });
    else res.send({ result: "Fail", message: "Invalid Id!!!" });
  } catch (error) {
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}
async function updateProduct(req, res) {
  try {
    console.log("Update request body:", req.body);
    console.log("Update request files:", req.files);
    
    var data = await Product.findOne({ _id: req.params._id });
    if (data) {
      // Update basic fields
      if (req.body.name) data.name = req.body.name;
      if (req.body.maincategory) data.maincategory = req.body.maincategory;
      if (req.body.subcategory) data.subcategory = req.body.subcategory;
      if (req.body.brand) data.brand = req.body.brand;
      if (req.body.slug) data.slug = req.body.slug;
      if (req.body.subSlug) data.subSlug = req.body.subSlug;
      if (req.body.color !== undefined) data.color = req.body.color;
      if (req.body.size !== undefined) data.size = req.body.size;
      if (req.body.baseprice !== undefined) data.baseprice = Number(req.body.baseprice);
      if (req.body.discount !== undefined) data.discount = Number(req.body.discount);
      if (req.body.finalprice !== undefined) data.finalprice = Number(req.body.finalprice);
      if (req.body.stock !== undefined) data.stock = Number(req.body.stock);
      if (req.body.description !== undefined) data.description = req.body.description;
      
      // Handle specification
      if (req.body.specification) {
        try {
          data.specification = JSON.parse(req.body.specification);
        } catch (parseError) {
          console.error("Error parsing specification:", parseError);
        }
      }
      
      // Handle variants
      if (req.body.variants) {
        try {
          data.variants = JSON.parse(req.body.variants);
        } catch (parseError) {
          console.error("Error parsing variants:", parseError);
        }
      }

      // Handle file uploads
      try {
        if (req.files?.pic1?.[0]) {
          if (data.pic1) {
            try {
              fs.unlinkSync("public/products/" + data.pic1);
            } catch (unlinkError) {}
          }
          data.pic1 = req.files.pic1[0].filename;
        }
      } catch (error) {}
      try {
        if (req.files?.pic2?.[0]) {
          if (data.pic2) {
            try {
              fs.unlinkSync("public/products/" + data.pic2);
            } catch (unlinkError) {}
          }
          data.pic2 = req.files.pic2[0].filename;
        }
      } catch (error) {}
      try {
        if (req.files?.pic3?.[0]) {
          if (data.pic3) {
            try {
              fs.unlinkSync("public/products/" + data.pic3);
            } catch (unlinkError) {}
          }
          data.pic3 = req.files.pic3[0].filename;
        }
      } catch (error) {}
      try {
        if (req.files?.pic4?.[0]) {
          if (data.pic4) {
            try {
              fs.unlinkSync("public/products/" + data.pic4);
            } catch (unlinkError) {}
          }
          data.pic4 = req.files.pic4[0].filename;
        }
      } catch (error) {}

      await data.save();
      console.log("Product updated successfully:", data._id);
      res.send({ result: "Done", message: "Record is Updated!!!" });
    } else {
      res.status(404).send({ result: "Fail", message: "Product not found!!!" });
    }
  } catch (error) {
    console.error("Update product error:", error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      res.status(400).send({ result: "Fail", message: validationErrors.join(', ') });
    } else if (error.keyValue) {
      res.status(400).send({ result: "Fail", message: "Name Must Be Unique!!!" });
    } else {
      res.status(500).send({ result: "Fail", message: "Internal Server Error!!!", error: error.message });
    }
  }
}
async function updateProductByVendor(req, res) {
  try {
    var decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_VENDOR_KEY
    );
    const user = decoded.data._id;
    var data = await Product.findOne({ _id: req.params._id, addedBy: user });
    if (data) {
      data.name = req.body.name ?? data.name;
      data.maincategory = req.body.maincategory ?? data.maincategory;
      data.subcategory = req.body.subcategory ?? data.subcategory;
      data.brand = req.body.brand ?? data.brand;
      data.color = req.body.color ?? data.color;
      data.size = req.body.size ?? data.size;
      data.baseprice = req.body.baseprice ?? data.baseprice;
      data.discount = req.body.discount ?? data.discount;
      data.finalprice = req.body.finalprice ?? data.finalprice;
      data.stock = req.body.stock ?? data.stock;
      data.description = req.body.description ?? data.description;
      data.specification = JSON.parse(req.body.specification);
      try {
        if (req.files.pic1[0] && data.pic1) {
          fs.unlinkSync("public/products/" + data.pic1);
        }
        data.pic1 = req.files.pic1[0].filename;
      } catch (error) {}
      try {
        if (req.files.pic2[0] && data.pic2) {
          fs.unlinkSync("public/products/" + data.pic2);
        }
        data.pic2 = req.files.pic2[0].filename;
      } catch (error) {}
      try {
        if (req.files.pic3[0] && data.pic3) {
          fs.unlinkSync("public/products/" + data.pic3);
        }
        data.pic3 = req.files.pic3[0].filename;
      } catch (error) {}
      try {
        if (req.files.pic4[0] && data.pic4) {
          fs.unlinkSync("public/products/" + data.pic4);
        }
        data.pic4 = req.files.pic4[0].filename;
      } catch (error) {}

      await data.save();
      res.send({ result: "Done", message: "Record is Updated!!!" });
    } else res.send({ result: "Fail", message: "Invalid Id!!!" });
  } catch (error) {
    if (error.keyValue)
      res.send({ result: "Fail", message: "Name Must Be Unique!!!" });
    else
      res
        .status(500)
        .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}
async function deleteProduct(req, res) {
  try {
    var data = await Product.findOne({ _id: req.params._id });
    try {
      fs.unlink("public/products/" + data.pic1);
    } catch (error) {}
    try {
      fs.unlink("public/products/" + data.pic2);
    } catch (error) {}
    try {
      fs.unlink("public/products/" + data.pic3);
    } catch (error) {}
    try {
      fs.unlink("public/products/" + data.pic4);
    } catch (error) {}

    await data.deleteOne();
    res.send({ result: "Done", message: "Record is Deleted!!!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}
async function deleteProductByVendor(req, res) {
  try {
    var decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_VENDOR_KEY
    );
    const user = decoded.data._id;
    var data = await Product.findOne({ _id: req.params._id, addedBy: user });
    try {
      fs.unlink("public/products/" + data.pic1);
    } catch (error) {}
    try {
      fs.unlink("public/products/" + data.pic2);
    } catch (error) {}
    try {
      fs.unlink("public/products/" + data.pic3);
    } catch (error) {}
    try {
      fs.unlink("public/products/" + data.pic4);
    } catch (error) {}

    await data.deleteOne();
    res.send({ result: "Done", message: "Record is Deleted!!!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

async function searchProduct(req, res) {
  try {
    const search = req.body.search;
    var data = await Product.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { innerSlug: { $regex: search, $options: "i" } },
        { innerSubSlug: { $regex: search, $options: "i" } },
        { color: { $regex: search, $options: "i" } },
        { size: { $regex: search, $options: "i" } },
      ],
    })
      .populate("brand")
      .populate("maincategory")
      .populate("subcategory")
      .populate({
        path: "slug",
        model: "slug"
      })
      .populate({
        path: "subSlug",
        model: "subslug"
      })
      .sort({ _id: -1 });
    res.send({ result: "Done", count: data.length, data: data });
  } catch (error) {
    console.error("Error in searchProduct:", error);
    res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

function getLast7Days() {
  let dates = [];
  for (let i = 6; i >= 0; i--) {
    let date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().slice(0, 10)); // Get YYYY-MM-DD format
  }
  return dates;
}

function getCurrentMonthDates() {
  let dates = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  console.log(today.getDate())
  // Loop through from the 1st day of the month until today's date
  for (let i = 2; i <= today.getDate() + 1; i++) {
    let date = new Date(year, month, i);
    dates.push(date.toISOString().slice(0, 10)); // Get YYYY-MM-DD format
  }
  return dates;
}

function getLastMonthDates() {
  let dates = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // Calculate the previous month
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = prevMonth === 11 ? year - 1 : year;

  // Get the last day of the previous month
  const lastDayPrevMonth = new Date(year, month, 0).getDate();

  // Loop through from the 1st day of the previous month until the last day
  for (let i = 1; i <= lastDayPrevMonth; i++) {
    let date = new Date(prevYear, prevMonth, i);
    dates.push(date.toISOString().slice(0, 10)); // Get YYYY-MM-DD format
  }
  return dates;
}

function getLast3MonthsNames(size = 3) {
  let today = new Date();
  let month = today.getMonth(); // current month index (0-11)
  let year = today.getFullYear();

  let result = [];
  for (let i = 0; i < size; i++) {
    if (month < 0) {
      month = 11; // adjust back to December if we loop back
      year--; // move back a year
    }
    result.unshift(months[month] + " " + year);
    month--;
  }
  return result;
}
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getThisYearMonthsNames(last = 0) {
  const today = new Date();
  const year = today.getFullYear() - last;

  let result = [];
  for (let month = 0; month < 12; month++) {
    result.push(months[month] + " " + year);
  }
  return result;
}

async function getVendorDashboard(req, res) {
  var decoded = jwt.verify(
    req.headers.authorization,
    process.env.JWT_VENDOR_KEY
  );
  const user = decoded.data._id;
  try {
    var totalProducts = await Product.count({
      addedBy: user,
    })
      .populate("brand")
      .sort({ _id: -1 });

    const search = req.query.search || "7days";
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    let labels = getLast7Days();

    switch (search) {
      case "7days":
        startOfToday.setDate(startOfToday.getDate() - 7);
        labels = getLast7Days();
        break;
      case "month":
        startOfToday.setDate(1);
        labels = getCurrentMonthDates();
        break;
      case "lastmonth":
        startOfToday.setDate(1);
        startOfToday.setMonth(startOfToday.getMonth() - 1);
        endOfToday.setMonth(startOfToday.getMonth());
        endOfToday.setDate(0); // Set to last day of previous month
        labels = getLastMonthDates();
        break;
      case "last3month":
        startOfToday.setMonth(startOfToday.getMonth() - 3);
        labels = getLast3MonthsNames();
        break;
      case "last6month":
        startOfToday.setMonth(startOfToday.getMonth() - 6);
        labels = getLast3MonthsNames(6);
        break;
      case "last12month":
        startOfToday.setMonth(startOfToday.getMonth() - 12);
        labels = getLast3MonthsNames(12);
        break;
      case "year":
        startOfToday.setMonth(0);
        startOfToday.setDate(1);
        endOfToday.setMonth(11);
        endOfToday.setDate(31);
        labels = getThisYearMonthsNames();
        break;
      case "lastyear":
        startOfToday.setMonth(0);
        startOfToday.setDate(1);
        startOfToday.setFullYear(startOfToday.getFullYear() - 1);
        endOfToday.setMonth(11);
        endOfToday.setDate(31);
        endOfToday.setFullYear(endOfToday.getFullYear() - 1);
        labels = getThisYearMonthsNames(1);
        break;
      default:
        // Handle default case or throw an error
        break;
    }
    const size = labels.length;

    var totalOrder = await Checkout.count({
      "products.addedBy": user,
      createdAt: { $gte: startOfToday.getTime(), $lte: endOfToday.getTime() },
    });

    var totalPending = await Checkout.count({
      "products.addedBy": user,
      orderstatus: { $ne: "Delivered" },
      createdAt: { $gte: startOfToday.getTime(), $lte: endOfToday.getTime() },
    });

    const statuses = [
      "Order Placed",
      "Packed",
      "Ready to Ship",
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ];

    const orderReport = [0, 0, 0, 0, 0, 0];
    const salesReport = {
      labels,
      datasets: statuses.map((item) => {
        return {
          label: item,
          borderWidth: 1,
          data: Array.from(Array(size), () => 0),
        };
      }),
    };

    const earningReport = {
      labels,
      datasets: statuses.map((item) => {
        return {
          label: item,
          borderWidth: 1,
          data: Array.from(Array(size), () => 0),
        };
      }),
    };

    var totalOrders = await Checkout.find({
      "products.addedBy": user,
      // orderstatus: { $ne: "Delivered" },
      createdAt: { $gte: startOfToday.getTime(), $lte: endOfToday.getTime() },
    }).select("products.addedBy products.total orderstatus date");
    let totalEarning = 0;
    totalOrders.forEach((item) => {
      const index = statuses.indexOf(item.orderstatus);
      orderReport[index] += 1;

      const date = new Date(item.date);
      const d = ["7days", "month", "lastmonth"].includes(search)
        ? date.toISOString().slice(0, 10)
        : `${months[date.getMonth()]} ${date.getFullYear()}`;
      let i = labels.indexOf(d);
      salesReport.datasets[index].data[i] += 1;
      item.products.forEach((product) => {
        if (product.addedBy == user) {
          earningReport.datasets[index].data[i] += product.total;
          totalEarning += product.total;
        }
      });
    });

    res.send({
      result: "Done",
      totalProducts,
      totalEarning,
      totalOrder,
      totalPending,
      orderReport,
      salesReport,
      earningReport,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      result: "Fail",
      message: "Internal Server Error!!!",
      error: error,
    });
  }
}
async function getAllCheckoutByVendor(req, res) {
  var decoded = jwt.verify(
    req.headers.authorization,
    process.env.JWT_VENDOR_KEY
  );
  const user = decoded.data._id;
  const limit = 10;
  const skip = (req.query?.page || 0) * limit;
  const search = req.query?.search || "";
  const paymentstatus = req.query?.paymentstatus || "";
  const orderStatus = req.query?.orderStatus || "";

  const query = {
    "products.addedBy": user,
  };
  if (search) {
    query._id = search;
  }
  if ( paymentstatus ) {
    query.paymentstatus = { $regex: new RegExp(paymentstatus, "i") };
  }

  if ( orderStatus ) {
    query.orderstatus = { $regex: new RegExp(orderStatus, "i") };
  }

  try {
    var checkouts = await Checkout.find(query).populate("userid", "name _id").select("products orderstatus date paymentmode paymentstatus").sort({ _id: -1 })
    .limit(limit)
    .skip(skip);
    var count = await Checkout.count(query);
    res.send({
      result: "Done",
      checkouts,
      count,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      result: "Fail",
      message: "Internal Server Error!!!",
      error: error,
    });
  }
}

async function getSingleProductByVendor(req, res) {
  try {
    // Check for valid ID
    if (!req.params._id || req.params._id === 'undefined') {
      return res.status(400).send({
        result: "Fail",
        message: "Invalid or missing product ID"
      });
    }

    var decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_VENDOR_KEY
    );
    const user = decoded.data._id;
    console.log(`Fetching product: ID=${req.params._id}, User=${user}`);
    
    // Find product by ID where the vendor is the owner (addedBy)
    const data = await Product.findOne({ 
      _id: req.params._id,
      addedBy: user
    })
    .populate("brand")
    .populate({
      path: "slug",
      model: "slug"
    })
    .populate({
      path: "subSlug",
      model: "subslug"
    });

    if (data) {
      return res.send({ result: "Done", data: data });
    } else {
      return res.status(404).send({ 
        result: "Fail", 
        message: "Product not found or you are not authorized to access this product" 
      });
    }
  } catch (error) {
    console.error("getSingleProductByVendor error:", error);
    return res.status(500).send({ 
      result: "Fail", 
      message: "Internal Server Error!!!" 
    });
  }
}

// New function to get products by slug and sub-slug combination
async function getProductBySlugCombination(req, res) {
  try {
    const { slug, subSlug, innerSlug, innerSubSlug } = req.query;
    
    let query = {};
    
    if (slug) query.slug = slug;
    if (subSlug) query.subSlug = subSlug;
    if (innerSlug) query.innerSlug = innerSlug;
    if (innerSubSlug) query.innerSubSlug = innerSubSlug;
    
    var data = await Product.find(query)
      .populate("brand")
      .populate("maincategory")
      .populate("subcategory")
      .populate({
        path: "slug",
        model: "slug"
      })
      .populate({
        path: "subSlug",
        model: "subslug"
      })
      .sort({ _id: -1 });
      
    res.send({ result: "Done", count: data.length, data: data });
  } catch (error) {
    console.error("Error in getProductBySlugCombination:", error);
    res.status(500).send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

module.exports = [
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
];

