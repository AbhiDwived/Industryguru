const mongoose = require("mongoose");

const CheckoutSchema = new mongoose.Schema({
  userid: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: [true, "UserId is required"] 
  },
  paymentmode: { 
    type: String, 
    default: "COD",
    enum: ["COD", "Online", "UPI", "Card"] 
  },
  paymentstatus: { 
    type: String, 
    default: "Pending",
    enum: ["Pending", "Processing", "Completed", "Failed", "Refunded"] 
  },
  orderstatus: { 
    type: String, 
    default: 'Order Placed',
    enum: ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'] 
  },
  subtotal: { 
    type: Number, 
    required: [true, "Subtotal is required"] 
  },
  shipping: { 
    type: Number, 
    required: [true, "Shipping cost is required"] 
  },
  total: { 
    type: Number, 
    required: [true, "Total amount is required"] 
  },
  rppid: { 
    type: String, 
    default: "" 
  },
  date: { 
    type: String
  },
  createdAt: { 
    type: Number, 
    default: Date.now 
  },
  products: [{ 
    productid: { type: String },
    name: { type: String },
    brand: { type: String },
    color: { type: String },
    size: { type: String },
    price: { type: Number },
    qty: { type: Number, default: 1 },
    total: { type: Number },
    pic: { type: String },
    addedBy: { type: mongoose.Schema.Types.ObjectId },
    innerSlug: { type: String }, // Added for variant info
    innerSubSlug: { type: String } // Added for variant info
  }],
  paymentInfo: [{ 
    paymentid: { type: String }
  }],
  shipping_details: {
    shiprocket_order_id: { type: String },
    channel_order_id: { type: String },
    shipment_id: { type: String },
    status: {
      type: String,
      default: 'Pending'
    },
    awb_code: { type: String },
    courier_company_id: { type: String },
    courier_name: { type: String },
    tracking_url: { type: String },
    error: { type: String },
    error_message: { type: String }
  },
  shipping_address: {
    customer_name: { type: String },
    address_line_1: { type: String },
    address_line_2: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String, default: 'India' },
    pincode: { type: String },
    phone: { type: String },
    email: { type: String }
  },
  package_details: {
    weight: { type: Number, default: 0.5 }, // in kg
    length: { type: Number, default: 10 }, // in cm
    breadth: { type: Number, default: 10 }, // in cm
    height: { type: Number, default: 10 } // in cm
  }
});

// Add indexes for faster shipping tracking queries
CheckoutSchema.index({ 'shipping_details.awb_code': 1 });
CheckoutSchema.index({ 'shipping_details.shipment_id': 1 });
CheckoutSchema.index({ userid: 1, createdAt: -1 });

// Add a method to update shipping status
CheckoutSchema.methods.updateShippingStatus = async function(statusUpdate) {
  this.shipping_details.status = statusUpdate.status || this.shipping_details.status;
  
  if (statusUpdate.awb_code) {
    this.shipping_details.awb_code = statusUpdate.awb_code;
    this.shipping_details.tracking_url = `https://shiprocket.co/tracking/${statusUpdate.awb_code}`;
  }
  
  if (statusUpdate.courier_name) {
    this.shipping_details.courier_name = statusUpdate.courier_name;
  }
  
  if (statusUpdate.courier_company_id) {
    this.shipping_details.courier_company_id = statusUpdate.courier_company_id;
  }
  
  // Update order status based on shipping status
  if (statusUpdate.status === 'Delivered') {
    this.orderstatus = 'Delivered';
  } else if (statusUpdate.status === 'In Transit' || statusUpdate.status === 'Out for Delivery') {
    this.orderstatus = 'Shipped';
  }
  
  return this.save();
};

// Add a method to get current shipping status
CheckoutSchema.methods.getShippingDetails = function() {
  return {
    status: this.shipping_details.status || 'Pending',
    awb_code: this.shipping_details.awb_code,
    courier_name: this.shipping_details.courier_name,
    tracking_url: this.shipping_details.tracking_url,
    order_id: this.shipping_details.shiprocket_order_id,
    shipment_id: this.shipping_details.shipment_id
  };
};

const Checkout = mongoose.model("Checkout", CheckoutSchema);
module.exports = Checkout;