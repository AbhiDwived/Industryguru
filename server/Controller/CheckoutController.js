const fs = require("fs");
const jwt = require("jsonwebtoken");
const Checkout = require("../Models/Checkout");
const Product = require("../Models/Product");
const User = require("../Models/User");
const Razorpay = require("razorpay");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const { MongoClient } = require("mongodb");
const PaymentInfo = require("../Models/PaymentInfo");
const { createVendorPickup, createShippingOrder } = require('../Controller/ShiprocketController');


// Function to send email using nodemailer
async function sendEmailWithAttachment(receiver, subject, text, attachment) {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let info = await transporter.sendMail({
      from: `"IndustryGuru" <${process.env.SMTP_USER}>`,
      to: receiver,
      subject: subject,
      html: text,
      attachments: [
        {
          filename: "Invoice.pdf", // Include user name in filename
          content: attachment,
          contentType: "application/pdf",
        },
      ],
    });

    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
  }
}

// Payment API
function order(req, res) {
  try {
    const instance = new Razorpay({
      key_id: process.env.RPKEYID,
      key_secret: process.env.RPSECRETKEY,
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ result: "Fail", message: "Something Went Wrong!" });
      }
      res.status(200).json({ result: "Done", data: order });
    });
  } catch (error) {
    res.status(500).json({ result: "Fail", message: "Internal Server Error!" });
    console.log(error);
  }
}



async function verify(req, res) {
  try {
    var check = await Checkout.findOne({ _id: req.body.checkid });

    for (const item of check.products) {
      const p = await Product.findOne({ _id: item.productid }).select("addedBy");
      item.addedBy = p?.addedBy;
    }

    check.rppid = req.body.razorpay_payment_id;
    check.paymentstatus = "Done";
    check.paymentmode = "Net Banking";
    await check.save();

    res.status(200).send({ result: "Done" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
}


async function createCheckout(req, res) {
  try {
    var data = new Checkout(req.body);
    for (const item of data.products) {
      const p = await Product.findOne({ _id: item.productid }).select("addedBy");
      item.addedBy = p?.addedBy;
      // Ensure variant info is preserved
      if (typeof item.innerSlug === 'undefined' && typeof item.selectedVariant !== 'undefined') {
        // If cart used selectedVariant, copy its fields
        item.innerSlug = item.selectedVariant?.innerSlug;
        item.innerSubSlug = item.selectedVariant?.innerSubSlug;
      }
      // If present directly, keep as is
      // (No else needed, as item.innerSlug/innerSubSlug will be present if sent from frontend)
    }
    data.date = new Date();

 // ✅ Fixed GST and Total Calculation
    const gstAmount = data.subtotal * 0.18;
    const shippingAmount = parseFloat(data.shipping) || 0;
    const totalWithGST = data.subtotal + gstAmount + shippingAmount;
    data.total = totalWithGST;

    const user = await User.findOne({ _id: data.userid });
    if (!user) {
      return res.status(404).send({ result: "Fail", message: "User not found" });
    }

    // Format order items correctly for Shiprocket
    const orderItems = data.products.map(product => {
      return {
        name: product.name || "Product",
        sku: product.productid?.toString() || Date.now().toString(),
        units: parseInt(product.qty) || 1,
        selling_price: parseFloat(product.price) || 0,
        discount: 0,
        tax: parseFloat((gstAmount / data.products.length).toFixed(2)) || 0,
        hsn: 441122 // Add default HSN code
      };
    });

    console.log("Order Items:", orderItems); // Debug log

    const shippingPayload = {
      order_id: `IG${Date.now()}`, // Remove hyphen
      order_date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
      pickup_location: "Primary",
      channel_id: "",
      comment: "Handle with care",
      billing_customer_name: (user.name || "").trim(),
      billing_last_name: (user.lastname || "").trim(),
      billing_address: (user.addressline1 || "").trim(),
      billing_city: (user.city || "").trim(),
      billing_pincode: (user.pin || "").trim(),
      billing_state: (user.state || "").trim(),
      billing_country: "India",
      billing_email: (user.email || "").trim(),
      billing_phone: (user.phone || "").trim(),
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: data.paymentmode === "COD" ? "COD" : "Prepaid",
      shipping_charges: parseFloat(data.shipping) || 0,
      sub_total: parseFloat(data.subtotal) || 0,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5
    };

    console.log("Shipping Payload:", shippingPayload); // Debug log

    try {
      // Create Shiprocket order
      const shipResponse = await createShippingOrder(shippingPayload);
      console.log("Shiprocket Response:", shipResponse);

      // Store shipping details in your order
      data.shipping_details = {
        shiprocket_order_id: shipResponse.order_id,
        channel_order_id: shipResponse.channel_order_id,
        shipment_id: shipResponse.shipment_id,
        status: shipResponse.status,
        awb_code: shipResponse.awb_code || 'Pending',
        courier_company_id: shipResponse.courier_company_id,
        courier_name: shipResponse.courier_name || 'To be assigned',
        created_at: new Date(),
        tracking_url: null // Will be updated once AWB is generated
      };

      // If order is created successfully, try to generate AWB
      if (shipResponse.status_code === 1) {
        try {
          // Wait for 5 seconds before requesting AWB
          await new Promise(resolve => setTimeout(resolve, 5000));

          const awbResponse = await generateAWB(shipResponse.shipment_id);
          if (awbResponse.awb_code) {
            data.shipping_details.awb_code = awbResponse.awb_code;
            data.shipping_details.courier_name = awbResponse.courier_name;
            data.shipping_details.tracking_url = `https://shiprocket.co/tracking/${awbResponse.awb_code}`;
          }
        } catch (awbError) {
          console.log("AWB generation will be retried automatically by Shiprocket");
        }
      }

    } catch (shipError) {
      console.error("Shiprocket Error Details:", shipError);
      data.shipping_details = {
        error: "Shipping creation failed",
        message: shipError.message
      };
    }

    // Save the order
    await data.save();

    // Create vendor pickup after successful order creation
try {
  console.log("Preparing to call createVendorPickup with data:", {
    orderId: data._id,
    products: data.products.map(p => ({
      name: p.name,
      addedBy: p.addedBy
    }))
  });

  const pickupResponse = await createVendorPickup(data);
  console.log("Vendor pickup created successfully:", pickupResponse);
} catch (pickupError) {
  console.error("Vendor pickup creation failed:", pickupError?.message || pickupError);
}

    // Generate email content
    let userDetails = `
      <div style="width: 80%; margin: 30px auto; background-color: #fff; padding: 10px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="border-top: 1px solid #ccc; margin-top: 5px; padding-top: 5px;">
          <h2 style="color: #333; margin-bottom: 10px;">Order Confirmation</h2>
          <p>Your order has been successfully placed!</p>
          
          <h3>Shipping Details</h3>
          <p>AWB: ${data.shipping_details?.awb_code || 'Pending'}</p>
          <p>Courier: ${data.shipping_details?.courier_name || 'To be assigned'}</p>
          <p>Tracking: ${data.shipping_details?.tracking_url || 'Available soon'}</p>

          <h3>Order Summary</h3>
          <p>Order ID: ${data._id}</p>
          <p>Date: ${data.date}</p>
          <p>Subtotal: ₹${data.subtotal}</p>
          <p>GST (18%): ₹${gstAmount}</p>
          <p>Shipping: ₹${data.shipping}</p>
          <p>Total: ₹${data.total}</p>
          
          <h3>Delivery Address</h3>
          <p>${user.name}</p>
          <p>${user.addressline1}</p>
          <p>${user.addressline2 || ''}</p>
          <p>${user.city}, ${user.state} - ${user.pin}</p>
          <p>Phone: ${user.phone}</p>
        </div>
      </div>
    `;

    // Add product details to email
    data.products.forEach((product) => {
      let variantStr = '';
      if (product.innerSlug || product.innerSubSlug) {
        variantStr = ` (${product.innerSlug || ''}${product.innerSlug && product.innerSubSlug ? ', ' : ''}${product.innerSubSlug || ''})`;
      }
      userDetails += `
        <div style="width: 80%; margin: 10px auto; background-color: #fff; padding: 10px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h3>Product Details</h3>
          <p>Name: ${product.name}${variantStr}</p>
          <p>Brand: ${product.brand}</p>
          <p>Color: ${product.color}</p>
          <p>Size: ${product.size}</p>
          <p>Quantity: ${product.qty}</p>
          <p>Price: ₹${product.price}</p>
          <p>Total: ₹${product.total}</p>
        </div>
      `;
    });

    // Generate PDF
    const pdfPath = `./orderDetails_${user.name}_${Date.now()}.pdf`;
    const doc = new PDFDocument();
    const pdfStream = fs.createWriteStream(pdfPath);
    doc.pipe(pdfStream);

    // Add content to PDF
    doc.fontSize(16).text('Order Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);

    // Add order details
    doc.text(`Order ID: ${data._id}`);
    doc.text(`Date: ${data.date}`);
    doc.moveDown();

    // Add shipping details if available
    if (data.shipping_details?.awb_code) {
      doc.text(`AWB: ${data.shipping_details.awb_code}`);
      doc.text(`Courier: ${data.shipping_details.courier_name}`);
    }
    doc.moveDown();

    // Add customer details
    doc.text(`Customer Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Phone: ${user.phone}`);
    doc.moveDown();

    // Add address
    doc.text('Shipping Address:');
    doc.text(user.addressline1);
    if (user.addressline2) doc.text(user.addressline2);
    doc.text(`${user.city}, ${user.state} - ${user.pin}`);
    doc.moveDown();

    // Add products
    doc.text('Products:', { underline: true });
    data.products.forEach(product => {
      let variantStr = '';
      if (product.innerSlug || product.innerSubSlug) {
        variantStr = ` (${product.innerSlug || ''}${product.innerSlug && product.innerSubSlug ? ', ' : ''}${product.innerSubSlug || ''})`;
      }
      doc.moveDown(0.5);
      doc.text(`${product.name}${variantStr} (${product.brand})`);
      doc.text(`Quantity: ${product.qty} x ₹${product.price} = ₹${product.total}`);
    });
    doc.moveDown();

    // Add totals
    doc.text(`Subtotal: ₹${data.subtotal}`);
    doc.text(`GST (18%): ₹${gstAmount}`);
    doc.text(`Shipping: ₹${data.shipping}`);
    doc.text(`Total: ₹${data.total}`, { bold: true });

    doc.end();

    // Wait for PDF generation
    await new Promise((resolve) => pdfStream.on('finish', resolve));

    // Read PDF file
    const pdfBuffer = fs.readFileSync(pdfPath);

    // Send emails
    await sendEmailWithAttachment(
      user.email,
      "Order Confirmation",
      userDetails,
      pdfBuffer
    );

    await sendEmailWithAttachment(
      "admin@yourdomain.com",
      "New Order Received",
      userDetails,
      pdfBuffer
    );

    // Save PDF to database
    await savePdfToDatabase(pdfPath, user, data);

    // Clean up PDF file
    fs.unlinkSync(pdfPath);

    res.send({
      result: "Done",
      message: "Order created successfully!",
      data: {
        order: data,
        shipping_details: data.shipping_details,
        tracking_url: data.shipping_details.tracking_url
      }
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).send({
      result: "Fail",
      message: "Internal Server Error!",
      error: error.message
    });
  }
}

// Add this function to generate AWB
async function generateAWB(shipment_id) {
  try {
    const token = await getShiprocketToken();

    const response = await axios.post(
      `${BASE_URL}/courier/assign/awb`,
      { shipment_id },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("AWB Generation Error:", error.response?.data || error);
    throw error;
  }
}

// Add a tracking function
async function trackShipment(req, res) {
  try {
    const order = await Checkout.findById(req.params.orderId);
    if (!order?.shipping_details?.awb_code) {
      return res.status(404).send({
        result: "Fail",
        message: "Tracking information not available yet"
      });
    }

    const token = await getShiprocketToken();
    const response = await axios.get(
      `${BASE_URL}/courier/track/awb/${order.shipping_details.awb_code}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    res.send({
      result: "Done",
      tracking: response.data,
      order_status: order.shipping_details.status
    });

  } catch (error) {
    console.error("Tracking Error:", error);
    res.status(500).send({
      result: "Fail",
      message: "Failed to fetch tracking information"
    });
  }
}

// Add tracking endpoint
async function trackShipment(req, res) {
  try {
    const order = await Checkout.findById(req.params.orderId);
    if (!order?.shipping_details?.awb_code) {
      return res.status(404).send({
        result: "Fail",
        message: "No tracking information available"
      });
    }

    const { trackOrder } = require('../utils/shiprocket');
    const token = await getShiprocketToken();
    const tracking = await trackOrder(token, order.shipping_details.awb_code);

    // Update order with latest tracking info
    if (tracking?.tracking_data?.shipment_track) {
      const trackData = tracking.tracking_data.shipment_track[0];
      await order.updateShippingStatus({
        status: trackData.current_status,
        location: trackData.current_location,
        activity: trackData.activity
      });
    }

    res.send({
      result: "Done",
      tracking: tracking?.tracking_data,
      current_status: order.getCurrentShippingStatus()
    });

  } catch (error) {
    console.error("Error tracking shipment:", error);
    res.status(500).send({
      result: "Fail",
      message: "Failed to fetch tracking information"
    });
  }
}

// Add webhook handler
async function handleShiprocketWebhook(req, res) {
  try {
    const { awb_code, current_status, location, activity } = req.body;

    const order = await Checkout.findOne({
      'shipping_details.awb_code': awb_code
    });

    if (order) {
      await order.updateShippingStatus({
        status: current_status,
        location: location,
        activity: activity
      });
    }

    res.send({ result: "Done" });
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).send({ result: "Fail" });
  }
}

async function savePdfToDatabase(pdfPath, user, checkoutData) {
  try {
    const pdfBuffer = fs.readFileSync(pdfPath);
    const client = new MongoClient(process.env.DBKEY, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();

    const database = client.db("Industryguru");
    const collection = database.collection("invoices");

    const document = {
      UserName: user.name,
      CheckOut: [
        checkoutData._id,
        checkoutData.orderstatus,
        checkoutData.paymentmode,
      ],
      pdfData: pdfBuffer,
    };

    await collection.insertOne(document);

    console.log("PDF saved to database.");

    await client.close();
  } catch (error) {
    console.error("Error saving PDF to database:", error);
  }
}

async function getAllCheckout(req, res) {
  try {
    var data = await Checkout.find().sort({ _id: -1 });
    res.send({ result: "Done", count: data.length, data: data });
  } catch (error) {
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

async function getAllPayments(req, res) {
  try {
    var data = await PaymentInfo.find({ orderId: req.params.orderid });
    console.log(data);
    res.send({ result: "Done", count: data.length, data: data });
  } catch (error) {
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

async function getUserAllCheckout(req, res) {
  try {
    var data = await Checkout.find(
      req.params.userid == "admin-li" ? {} : { userid: req.params.userid }
    ).sort({
      _id: -1,
    });
    res.send({
      result: "Done",
      count: data.length,
      data: data,
      p: req.params.userid,
    });
  } catch (error) {
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

async function getSingleCheckout(req, res) {
  try {
    var data = await Checkout.findOne({ _id: req.params._id });
    if (data) res.send({ result: "Done", data: data });
    else res.send({ result: "Fail", message: "Invalid Id!!!" });
  } catch (error) {
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

async function getSingleCheckoutUser(req, res) {
  try {
    var data = await Checkout.findOne({
      _id: req.params._id,
      userid: req.params.userid,
    });
    if (data) res.send({ result: "Done", data: data });
    else res.send({ result: "Fail", message: "Invalid Id!!!" });
  } catch (error) {
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

async function updateCheckout(req, res) {
  try {
    var data = await Checkout.findOne({ _id: req.params._id });
    if (data) {
      data.paymentmode = req.body.paymentmode ?? data.paymentmode;
      data.paymentstatus = req.body.paymentstatus ?? data.paymentstatus;
      data.orderstatus = req.body.orderstatus ?? data.orderstatus;
      data.rppid = req.body.rppid ?? data.rppid;
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

async function deleteCheckout(req, res) {
  try {
    await Checkout.deleteOne({ _id: req.params._id });
    res.send({ result: "Done", message: "Record is Deleted!!!" });
  } catch (error) {
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

async function getSingleCheckoutByVendor(req, res) {
  try {
    const data = await Checkout.findOne({
      _id: req.params._id,
      "products.addedBy": req.vendorId,
    }).populate("userid", "name email");
    // .populate("products.productId", "name price")
    // .select("products orderstatus paymentstatus date paymentmode");

    if (data) {
      res.send({ result: "Done", data: data });
    } else {
      res.send({
        result: "Fail",
        message: "Invalid Id or Unauthorized access!!!",
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

async function updateCheckoutByVendor(req, res) {
  try {
    const data = await Checkout.findOne({
      _id: req.params._id,
      "products.addedBy": req.vendorId,
    });

    if (data) {
      data.paymentmode = req.body.paymentmode ?? data.paymentmode;
      data.paymentstatus = req.body.paymentstatus ?? data.paymentstatus;
      data.orderstatus = req.body.orderstatus ?? data.orderstatus;
      data.rppid = req.body.rppid ?? data.rppid;

      await data.save();
      res.send({ result: "Done", message: "Record is Updated!!!" });
    } else {
      res.send({
        result: "Fail",
        message: "Invalid Id or Unauthorized access!!!",
      });
    }
  } catch (error) {
    if (error.keyValue) {
      res.send({ result: "Fail", message: "Data conflict!!!" });
    } else {
      res
        .status(500)
        .send({ result: "Fail", message: "Internal Server Error!!!" });
    }
  }
}

async function deleteCheckoutByVendor(req, res) {
  try {
    const data = await Checkout.findOne({
      _id: req.params._id,
      "products.addedBy": req.vendorId,
    });

    if (data) {
      await Checkout.deleteOne({ _id: req.params._id });
      res.send({ result: "Done", message: "Record is Deleted!!!" });
    } else {
      res.send({
        result: "Fail",
        message: "Invalid Id or Unauthorized access!!!",
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ result: "Fail", message: "Internal Server Error!!!" });
  }
}

module.exports = [
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
  trackShipment,
  handleShiprocketWebhook,
];
