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

    // Generate professional email content
    let userDetails = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - IndustryGuru</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">IndustryGuru</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your Industrial Solutions Partner</p>
          </div>
          
          <!-- Order Confirmation -->
          <div style="padding: 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 24px;">Order Confirmed!</h2>
              <p style="color: #7f8c8d; font-size: 16px; margin: 0;">Thank you for your order. We're processing it now.</p>
            </div>
            
            <!-- Order Details Card -->
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #667eea;">
              <h3 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">📋 Order Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 5px 0; font-weight: bold;">Order ID:</td><td style="padding: 5px 0;">#${data._id.toString().slice(-8).toUpperCase()}</td></tr>
                <tr><td style="padding: 5px 0; font-weight: bold;">Date:</td><td style="padding: 5px 0;">${new Date(data.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
                <tr><td style="padding: 5px 0; font-weight: bold;">Payment:</td><td style="padding: 5px 0;">${data.paymentmode}</td></tr>
              </table>
            </div>
            
            <!-- Shipping Details Card -->
            <div style="background-color: #e8f5e8; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #28a745;">
              <h3 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">🚚 Shipping Information</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 5px 0; font-weight: bold;">AWB Number:</td><td style="padding: 5px 0;">${data.shipping_details?.awb_code || 'Will be assigned soon'}</td></tr>
                <tr><td style="padding: 5px 0; font-weight: bold;">Courier Partner:</td><td style="padding: 5px 0;">${data.shipping_details?.courier_name || 'To be assigned'}</td></tr>
                <tr><td style="padding: 5px 0; font-weight: bold;">Tracking:</td><td style="padding: 5px 0;">${data.shipping_details?.tracking_url ? '<a href="' + data.shipping_details.tracking_url + '" style="color: #667eea;">Track Your Order</a>' : 'Available once shipped'}</td></tr>
              </table>
            </div>
            
            <!-- Delivery Address Card -->
            <div style="background-color: #fff3cd; border-radius: 8px; padding: 20px; margin-bottom: 25px; border-left: 4px solid #ffc107;">
              <h3 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">📍 Delivery Address</h3>
              <div style="color: #495057;">
                <strong>${user.name}</strong><br>
                ${user.addressline1}<br>
                ${user.addressline2 ? user.addressline2 + '<br>' : ''}
                ${user.addressline3 ? user.addressline3 + '<br>' : ''}
                ${user.city}, ${user.state} - ${user.pin}<br>
                📞 ${user.phone}
              </div>
            </div>
    `;

    // Add products section
    userDetails += `
            <!-- Products Section -->
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 18px;">📦 Order Items</h3>
    `;
    
    data.products.forEach((product, index) => {
      let variantStr = '';
      if (product.innerSlug || product.innerSubSlug) {
        variantStr = ` (${product.innerSlug || ''}${product.innerSlug && product.innerSubSlug ? ', ' : ''}${product.innerSubSlug || ''})`;
      }
      userDetails += `
              <div style="${index > 0 ? 'border-top: 1px solid #dee2e6; padding-top: 15px; margin-top: 15px;' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                  <div style="flex: 1;">
                    <h4 style="color: #2c3e50; margin: 0 0 8px 0; font-size: 16px;">${product.name}${variantStr}</h4>
                    <p style="color: #6c757d; margin: 0 0 5px 0; font-size: 14px;">Brand: ${product.brand}</p>
                    <p style="color: #6c757d; margin: 0 0 5px 0; font-size: 14px;">Specification: ${product.color}, ${product.size}</p>
                    <p style="color: #6c757d; margin: 0; font-size: 14px;">Quantity: ${product.qty}</p>
                  </div>
                  <div style="text-align: right; margin-left: 20px;">
                    <p style="color: #2c3e50; margin: 0 0 5px 0; font-size: 16px; font-weight: bold;">₹${product.total}</p>
                    <p style="color: #6c757d; margin: 0; font-size: 14px;">₹${product.price} each</p>
                  </div>
                </div>
              </div>
      `;
    });
    
    userDetails += `
            </div>
            
            <!-- Order Summary -->
            <div style="background-color: #e3f2fd; border-radius: 8px; padding: 20px; margin-bottom: 30px; border-left: 4px solid #2196f3;">
              <h3 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px;">💰 Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;">Subtotal:</td><td style="padding: 8px 0; text-align: right; border-bottom: 1px solid #dee2e6;">₹${data.subtotal}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #dee2e6;">GST (18%):</td><td style="padding: 8px 0; text-align: right; border-bottom: 1px solid #dee2e6;">₹${gstAmount.toFixed(2)}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 2px solid #2196f3;">Shipping:</td><td style="padding: 8px 0; text-align: right; border-bottom: 2px solid #2196f3;">₹${data.shipping}</td></tr>
                <tr><td style="padding: 12px 0; font-size: 18px; font-weight: bold; color: #2c3e50;">Total Amount:</td><td style="padding: 12px 0; text-align: right; font-size: 18px; font-weight: bold; color: #2c3e50;">₹${data.total}</td></tr>
              </table>
              ${data.gstRequired ? `<div style="margin-top: 15px; padding: 10px; background-color: #fff3cd; border-radius: 4px; border-left: 4px solid #ffc107;"><strong>Customer GST Number:</strong> ${data.gstNumber}</div>` : ''}
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 20px 0; border-top: 1px solid #dee2e6;">
              <p style="color: #6c757d; margin: 0 0 10px 0;">Need help? Contact us at <a href="mailto:support@industryguru.com" style="color: #667eea;">support@industryguru.com</a></p>
              <p style="color: #6c757d; margin: 0; font-size: 14px;">Thank you for choosing IndustryGuru!</p>
            </div>
            
          </div>
        </div>
      </body>
      </html>
    `;

    // Generate PDF
    const pdfPath = `./orderDetails_${user.name}_${Date.now()}.pdf`;
    const doc = new PDFDocument();
    const pdfStream = fs.createWriteStream(pdfPath);
    doc.pipe(pdfStream);

    // Professional GST Invoice Design
    const pageWidth = doc.page.width;
    const margin = 40;
    let yPos = 40;
    
    // 1. Company Details Header
    doc.rect(0, 0, pageWidth, 120).fillAndStroke('#2c3e50', '#2c3e50');
    doc.fontSize(24).fillColor('white').text('TAX INVOICE', margin, 20, { align: 'center' });
    
    doc.fontSize(16).fillColor('white').text('OPTIMA CONNECT PVT. LTD.', margin, 50);
    doc.fontSize(10).fillColor('white');
    doc.text('CIN: U47912UP2023PTC193933', margin, 70);
    doc.text('Plot No. 11, Kharsa No. 921, New Karhera Colony,', margin, 85);
    doc.text('Mohan Nagar, Ghaziabad, U.P - 201007', margin, 100);
    
    const contactX = pageWidth - 200;
    doc.text('Email: industryguruinfo@gmail.com', contactX, 70);
    doc.text('Mobile: +91 9810092418', contactX, 85);
    
    yPos = 140;
    
    // 2. GST & UDYAM Details
    doc.rect(margin, yPos, pageWidth - 2 * margin, 40).fillAndStroke('#f8f9fa', '#dee2e6');
    doc.fontSize(10).fillColor('#2c3e50');
    doc.text('GSTIN: 09ANDPK2026E1ZH', margin + 10, yPos + 10);
    doc.text('UDYAM No: UDYAM-UP-29-0024491', margin + 10, yPos + 25);
    
    yPos += 60;
    
    // 3. Invoice Information
    doc.fontSize(12).fillColor('#2c3e50');
    const invoiceNo = `AE/2025-26/${data._id.toString().slice(-4).padStart(4, '0')}`;
    doc.text(`Invoice No: ${invoiceNo}`, margin, yPos);
    doc.text(`Date: ${new Date(data.date).toLocaleDateString('en-IN')}`, margin, yPos + 15);
    doc.text('Place of Supply: Uttar Pradesh (09)', margin, yPos + 30);
    
    doc.text(`Payment Terms: ${data.paymentmode}`, contactX, yPos);
    doc.text('P.O. No: -', contactX, yPos + 15);
    doc.text('P.O. Date: -', contactX, yPos + 30);
    
    yPos += 60;
    
    // 4. Customer (Billed To) & 5. Shipping Details
    const billToWidth = (pageWidth - 3 * margin) / 2;
    
    doc.rect(margin, yPos, billToWidth, 100).fillAndStroke('#fff', '#dee2e6');
    doc.fontSize(12).fillColor('#2c3e50').text('BILLED TO:', margin + 10, yPos + 10);
    doc.fontSize(10).fillColor('#495057');
    doc.text(user.name, margin + 10, yPos + 25);
    doc.text(user.addressline1, margin + 10, yPos + 40, { width: billToWidth - 20 });
    if (user.addressline2) doc.text(user.addressline2, margin + 10, yPos + 55, { width: billToWidth - 20 });
    doc.text(`${user.city}, ${user.state} - ${user.pin}`, margin + 10, yPos + 70);
    if (data.gstRequired && data.gstNumber) {
      doc.text(`GSTIN: ${data.gstNumber}`, margin + 10, yPos + 85);
    }
    
    const shipToX = margin + billToWidth + 20;
    doc.rect(shipToX, yPos, billToWidth, 100).fillAndStroke('#fff', '#dee2e6');
    doc.fontSize(12).fillColor('#2c3e50').text('SHIPPED TO:', shipToX + 10, yPos + 10);
    doc.fontSize(10).fillColor('#495057');
    doc.text(user.name, shipToX + 10, yPos + 25);
    doc.text(user.addressline1, shipToX + 10, yPos + 40, { width: billToWidth - 20 });
    if (user.addressline2) doc.text(user.addressline2, shipToX + 10, yPos + 55, { width: billToWidth - 20 });
    doc.text(`${user.city}, ${user.state} - ${user.pin}`, shipToX + 10, yPos + 70);
    if (data.gstRequired && data.gstNumber) {
      doc.text(`GSTIN: ${data.gstNumber}`, shipToX + 10, yPos + 85);
    }
    
    yPos += 120;
    
    // 6. Transport Details
    doc.rect(margin, yPos, pageWidth - 2 * margin, 60).fillAndStroke('#f8f9fa', '#dee2e6');
    doc.fontSize(11).fillColor('#2c3e50').text('TRANSPORT DETAILS:', margin + 10, yPos + 10);
    doc.fontSize(9).fillColor('#495057');
    doc.text('Mode of Transport: By Road', margin + 10, yPos + 25);
    doc.text(`GR/RR No.: ${data.shipping_details?.awb_code || 'Pending'}`, margin + 10, yPos + 40);
    
    doc.text(`Vehicle No.: ${data.shipping_details?.awb_code || 'Pending'}`, contactX, yPos + 25);
    doc.text(`Station: ${user.city?.toUpperCase() || 'NOIDA'}`, contactX, yPos + 40);
    
    yPos += 80;
    
    // 7. Items Details Table
    const tableWidth = pageWidth - 2 * margin;
    const colSN = 30;
    const colDesc = 200;
    const colHSN = 60;
    const colPack = 40;
    const colQty = 50;
    const colUnit = 40;
    const colRate = 60;
    const colAmount = 80;
    
    // Table Header
    doc.rect(margin, yPos, tableWidth, 25).fillAndStroke('#2c3e50', '#2c3e50');
    doc.fontSize(9).fillColor('white');
    doc.text('S.N.', margin + 5, yPos + 8, { width: colSN, align: 'center' });
    doc.text('Description of Goods', margin + colSN + 5, yPos + 8, { width: colDesc });
    doc.text('HSN', margin + colSN + colDesc + 5, yPos + 8, { width: colHSN, align: 'center' });
    doc.text('Pack', margin + colSN + colDesc + colHSN + 5, yPos + 8, { width: colPack, align: 'center' });
    doc.text('Qty', margin + colSN + colDesc + colHSN + colPack + 5, yPos + 8, { width: colQty, align: 'center' });
    doc.text('Unit', margin + colSN + colDesc + colHSN + colPack + colQty + 5, yPos + 8, { width: colUnit, align: 'center' });
    doc.text('Rate', margin + colSN + colDesc + colHSN + colPack + colQty + colUnit + 5, yPos + 8, { width: colRate, align: 'center' });
    doc.text('Amount', margin + colSN + colDesc + colHSN + colPack + colQty + colUnit + colRate + 5, yPos + 8, { width: colAmount, align: 'center' });
    
    yPos += 25;
    
    // Products
    data.products.forEach((product, index) => {
      const rowHeight = 30;
      
      if (index % 2 === 0) {
        doc.rect(margin, yPos, tableWidth, rowHeight).fillAndStroke('#f8f9fa', '#f8f9fa');
      }
      
      doc.fontSize(9).fillColor('#2c3e50');
      doc.text((index + 1).toString(), margin + 5, yPos + 8, { width: colSN, align: 'center' });
      doc.text(product.name, margin + colSN + 5, yPos + 8, { width: colDesc });
      doc.text('38231190', margin + colSN + colDesc + 5, yPos + 8, { width: colHSN, align: 'center' });
      doc.text('1', margin + colSN + colDesc + colHSN + 5, yPos + 8, { width: colPack, align: 'center' });
      doc.text(parseFloat(product.qty).toFixed(2), margin + colSN + colDesc + colHSN + colPack + 5, yPos + 8, { width: colQty, align: 'right' });
      doc.text('Nos', margin + colSN + colDesc + colHSN + colPack + colQty + 5, yPos + 8, { width: colUnit, align: 'center' });
      doc.text(parseFloat(product.price).toFixed(2), margin + colSN + colDesc + colHSN + colPack + colQty + colUnit + 5, yPos + 8, { width: colRate, align: 'right' });
      doc.text(parseFloat(product.total).toFixed(2), margin + colSN + colDesc + colHSN + colPack + colQty + colUnit + colRate + 5, yPos + 8, { width: colAmount, align: 'right' });
      
      yPos += rowHeight;
    });
    
    // 8. Tax & Total Summary
    yPos += 20;
    const summaryX = pageWidth - 200;
    const summaryWidth = 160;
    
    doc.rect(summaryX, yPos, summaryWidth, 100).fillAndStroke('#f8f9fa', '#dee2e6');
    doc.fontSize(10).fillColor('#2c3e50');
    
    const sgstAmount = gstAmount / 2;
    const cgstAmount = gstAmount / 2;
    
    doc.text('Sub Total:', summaryX + 10, yPos + 10);
    doc.text(`₹${parseFloat(data.subtotal).toFixed(2)}`, summaryX + 90, yPos + 10, { width: 60, align: 'right' });
    
    doc.text('Add: SGST @ 9%:', summaryX + 10, yPos + 25);
    doc.text(`₹${sgstAmount.toFixed(2)}`, summaryX + 90, yPos + 25, { width: 60, align: 'right' });
    
    doc.text('Add: CGST @ 9%:', summaryX + 10, yPos + 40);
    doc.text(`₹${cgstAmount.toFixed(2)}`, summaryX + 90, yPos + 40, { width: 60, align: 'right' });
    
    doc.rect(summaryX + 5, yPos + 60, summaryWidth - 10, 25).fillAndStroke('#2c3e50', '#2c3e50');
    doc.fontSize(12).fillColor('white');
    doc.text('Grand Total:', summaryX + 15, yPos + 70);
    doc.text(`₹${parseFloat(data.total).toFixed(2)}`, summaryX + 95, yPos + 70, { width: 60, align: 'right' });
    
    yPos += 120;
    
    // 9. Amount in Words
    function numberToWords(num) {
      const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
      const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      
      if (num === 0) return 'Zero';
      if (num < 10) return ones[num];
      if (num < 20) return teens[num - 10];
      if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + ones[num % 10] : '');
      if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + numberToWords(num % 100) : '');
      if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 !== 0 ? ' ' + numberToWords(num % 1000) : '');
      if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 !== 0 ? ' ' + numberToWords(num % 100000) : '');
      return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 !== 0 ? ' ' + numberToWords(num % 10000000) : '');
    }
    
    const totalInWords = numberToWords(Math.floor(parseFloat(data.total))) + ' Only';
    doc.fontSize(10).fillColor('#2c3e50');
    doc.text(`Amount in Words: ${totalInWords}`, margin, yPos);
    
    yPos += 30;
    
    // 10. Bank Details
    doc.rect(margin, yPos, pageWidth - 2 * margin, 60).fillAndStroke('#f8f9fa', '#dee2e6');
    doc.fontSize(11).fillColor('#2c3e50').text('BANK DETAILS:', margin + 10, yPos + 10);
    doc.fontSize(9).fillColor('#495057');
    doc.text('Bank: Canara Bank', margin + 10, yPos + 25);
    doc.text('Account No: 4808261000023', margin + 10, yPos + 40);
    
    doc.text('Branch: Raj Nagar Extension, Ghaziabad', margin + 250, yPos + 25);
    doc.text('IFSC Code: CNRB0004808', margin + 250, yPos + 40);
    
    yPos += 80;
    
    // 11. Terms & Conditions
    doc.fontSize(10).fillColor('#2c3e50').text('TERMS & CONDITIONS:', margin, yPos);
    doc.fontSize(9).fillColor('#495057');
    doc.text('1. Subject to Ghaziabad jurisdiction only.', margin, yPos + 15);
    doc.text('2. Interest @ 18% p.a. will be charged if not paid in time.', margin, yPos + 30);
    
    yPos += 60;
    
    // 12. Signatory
    doc.fontSize(10).fillColor('#2c3e50');
    doc.text('For OPTIMA CONNECT PVT. LTD.', pageWidth - 200, yPos);
    doc.text('Authorized Signatory', pageWidth - 200, yPos + 40);
    
    // Footer
    yPos += 80;
    if (yPos < doc.page.height - 50) {
      doc.rect(0, doc.page.height - 40, pageWidth, 40).fillAndStroke('#2c3e50', '#2c3e50');
      doc.fontSize(9).fillColor('white');
      doc.text('This is a computer generated invoice | Email: industryguruinfo@gmail.com', margin, doc.page.height - 25, { align: 'center', width: pageWidth - 2 * margin });
    }

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
      "industryguruinfo@gmail.com",
      `New Order #${data._id.toString().slice(-8).toUpperCase()} - ₹${data.total}`,
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
