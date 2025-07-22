const axios = require('axios');
const dotenv = require("dotenv");
dotenv.config();

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

async function getToken() {
  const credentials = {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD
  };
  const res = await axios.post(`${BASE_URL}/auth/login`, credentials);
  return res.data.token;
}

async function addPickupLocation(token) {
  const pickup_location = 'Warehouse_' + Date.now();
  const pickupData = {
    pickup_location,
    name: 'Abhinandan Dwivedi',
    email: 'abhidwivedi687@gmail.com',
    phone: '8433208146',
    address: 'A-27 Sector 62 Road No 3',
    address_2: 'Opposite Metro Pillar 111',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    pin_code: '201301'
  };

  await axios.post(`${BASE_URL}/settings/company/addpickup`, pickupData, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return pickup_location;
}

async function createOrder(token, pickup_location) {
  const orderData = {
    order_id: "ORD-" + Date.now(),
    order_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    pickup_location,
    billing_customer_name: "Naruto",
    billing_last_name: "Uzumaki",
    billing_address: "House 221B, Leaf Village",
    billing_address_2: "Near Hokage House",
    billing_city: "New Delhi",
    billing_pincode: 110002,
    billing_state: "Delhi",
    billing_country: "India",
    billing_email: "naruto@uzumaki.com",
    billing_phone: "9876543210",
    shipping_is_billing: true,
    order_items: [
      {
        name: "Kunai",
        sku: "chakra123",
        units: 1,
        selling_price: 90,
        hsn: 441122
      }
    ],
    payment_method: "Prepaid",
    sub_total: 90,
    length: 10,
    breadth: 15,
    height: 20,
    weight: 0.3
  };

  const res = await axios.post(`${BASE_URL}/orders/create/adhoc`, orderData, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
}

async function checkServiceability(token, pickupPin, deliveryPin, weight = 0.3) {
  const res = await axios.get(`${BASE_URL}/courier/serviceability/`, {
    params: {
      pickup_postcode: pickupPin,
      delivery_postcode: deliveryPin,
      cod: 0,
      weight
    },
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

async function generateAWB(token, shipment_id, courier_id) {
  const res = await axios.post(`${BASE_URL}/courier/assign/awb`, {
    shipment_id,
    courier_id
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
}

async function trackOrder(token, awb_code) {
  const res = await axios.get(`${BASE_URL}/courier/track/awb/${awb_code}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
}

module.exports = {
  getToken,
  addPickupLocation,
  createOrder,
  checkServiceability,
  generateAWB,
  trackOrder
};
