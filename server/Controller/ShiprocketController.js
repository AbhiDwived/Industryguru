const axios = require('axios');
const { getShiprocketToken } = require('../utils/shiprocketAuth');
const Vendor = require('../Models/Vendor.js'); // Ensure you have the model imported

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

// === Create Vendor Pickup ===
const createVendorPickup = async (orderData) => {
  try {
    console.log("Processing order data:", orderData);

    // Extract vendor IDs from products
    const vendorIds = [...new Set(orderData.products
      .filter(p => p.addedBy)
      .map(p => p.addedBy.toString()))];

    if (vendorIds.length === 0) {
      console.error("No vendor IDs found in order products");
      return { status: "error", message: "No vendor IDs found" };
    }

    const results = [];

    // Create pickup for each vendor
    for (const vendorId of vendorIds) {
      const vendor = await Vendor.findById(vendorId);

      if (!vendor) {
        console.error(`Vendor not found with ID: ${vendorId}`);
        results.push({ vendorId, status: "error", message: "Vendor not found" });
        continue;
      }

      const token = await getShiprocketToken();

      const pickupPayload = {
        shipment_id: orderData.shipping_details?.shipment_id,
        pickup_location: "Primary",
        name: "Aasish",
        email: "srindustriesraj121@gmail.com",
        phone: "+917838907428",
        address: "s-121, Harsha Compound Site-2, Loni Road Ind.Area",
        address_2: "Mohan Nagar, Ghaziabad",
        city: "Ghaziabad",
        state: "Uttar Pradesh",
        country: "India",
        pin_code: "201007"
      };

      try {
        const response = await axios.post(
          `${BASE_URL}/courier/generate/pickup`,
          pickupPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        results.push({
          vendorId,
          status: "success",
          data: response.data
        });
      } catch (apiErr) {
        results.push({
          vendorId,
          status: "error",
          message: apiErr.response?.data || apiErr.message
        });
      }
    }

    return { status: "done", results };
  } catch (err) {
    console.error("Unexpected Pickup Error:", err.message || err);
    return { status: "error", message: err.message || "Unknown error" };
  }
};


// === Refactored Create Shipping Order ===
const createShippingOrder = async (orderData) => {

  try {
    const token = await getShiprocketToken();

    // Validate order data before sending
    if (!orderData.order_items || !Array.isArray(orderData.order_items) || orderData.order_items.length === 0) {
      throw new Error('Invalid order items');
    }

    // Ensure all required fields are present
    const requiredFields = [
      'order_id',
      'order_date',
      'billing_customer_name',
      'billing_address',
      'billing_city',
      'billing_pincode',
      'billing_state',
      'billing_country',
      'billing_phone',
      'order_items'
    ];

    for (const field of requiredFields) {
      if (!orderData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const response = await axios.post(
      `${BASE_URL}/orders/create/adhoc`,
      orderData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log("Shiprocket API Response:", response.data); // Debug log

    if (response.data.status === 422) {
      throw new Error(response.data.message || 'Validation failed');
    }

    return response.data;

  } catch (error) {
    console.error("Shiprocket API Error:", error.response?.data || error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

module.exports = { createVendorPickup, createShippingOrder };
