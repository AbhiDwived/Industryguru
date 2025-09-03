const axios = require('axios');

// === STEP 1: Auth ===
async function getShiprocketToken() {
  const credentials = {
    email: 'abhidwivedi687@gmail.com',
    password: 'tvs8e5*zYcYQNC*F'
  };

  const res = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', credentials);
  return res.data.token;
}

// === STEP 2: Add Pickup Location ===
async function addPickupLocation(token) {
  try {
    const pickupCode = "Aasish_" + Date.now(); // Unique pickup location name
    const pickupData = {
      pickup_location: pickupCode,
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

    const response = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/settings/company/addpickup',
      pickupData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Correct success check
    if (response.data && response.data.success === true && response.data.pickup_id) {
      console.log('Pickup location added successfully:', pickupCode);
      return pickupCode;
    } else {
      console.error('Unexpected response from Shiprocket:', response.data);
      throw new Error('Failed to add pickup location');
    }

  } catch (err) {
    console.error('Error adding pickup location:', err.response?.data || err.message);
    throw err;
  }
}

// === STEP 3: Create Order ===
async function createOrder(token, pickupCode) {
const orderData = {
  order_id: "224-" + Math.floor(Math.random() * 100000),
  order_date: (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  })(),
  pickup_location: pickupCode,
  comment: "Reseller: M/s Goku",
  billing_customer_name: "Hitesh",
  billing_last_name: "User",
  billing_address: "G-1, 357 Shalimar Garden Extension 1",
  billing_address_2: "Sahibabad Ghaziabad",
  billing_city: "Ghaziabad",
  billing_pincode: 274508,
  billing_state: "Uttar Pradesh",
  billing_country: "India",
  billing_email: "hitesh.smkt@gmail.com",
  billing_phone: "9810092418",
  shipping_is_billing: true,
  order_items: [
    {
      name: "SSE 2.5 x 100 mm",
      sku: "68357f12608e4189ab438d26",
      units: 1,
      selling_price: 235,
      discount: "8",
      tax: "",
      hsn: 441122
    }
  ],
  payment_method: "COD",
  shipping_charges: 40,
  giftwrap_charges: 0,
  transaction_charges: 0,
  total_discount: 0,
  sub_total: 216,
  length: 10,
  breadth: 15,
  height: 20,
  weight: 0.3
};

  const res = await axios.post(
    'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
    orderData,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
}

// === STEP 4: Generate AWB ===
async function generateAWB(token, shipmentId, courierId) {
  const res = await axios.post(
    'https://apiv2.shiprocket.in/v1/external/courier/assign/awb',
    {
      shipment_id: shipmentId,
      courier_id: courierId
    },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return res.data;
}

// === STEP 5: Track Order ===
async function trackOrder(token, awb) {
  const res = await axios.get(
    `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return res.data;
}

// === STEP 6: Check Serviceability ===
async function checkPincodeService(token, pickup, delivery) {
  const res = await axios.get(
    'https://apiv2.shiprocket.in/v1/external/courier/serviceability/',
    {
      params: {
        pickup_postcode: pickup,
        delivery_postcode: delivery,
        cod: 0,
        weight: 2.5
      },
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return res.data;
}

// === MAIN SCRIPT ===
(async () => {
  try {
    console.log('🔐 Authenticating...');
    const token = await getShiprocketToken();

    console.log('\n📍 Adding Pickup Location...');
    const pickupCode = await addPickupLocation(token);
    console.log('✅ Pickup Location Code:', pickupCode);

    console.log('\n📦 Creating Order...');
    const order = await createOrder(token, pickupCode);
    console.log('✅ Order Created:', order);

    const shipmentId = order.shipment_id;

    console.log('\n📊 Checking Serviceability (Delhi → Mumbai)...');
    const service = await checkPincodeService(token, '201301', '110002');
    console.log('🚚 Serviceability:', service);

    console.log('\n📦 Delivery Price Estimates from Available Couriers:');
    service.data.available_courier_companies.forEach(courier => {
      console.log(`- ${courier.courier_name} (ID: ${courier.courier_company_id}): ₹${courier.freight_charges}`);
    });

    if (shipmentId) {
      const availableCouriers = service.data.available_courier_companies;
      let awbCode = '';
      let awbResponse = null;

      for (const courier of availableCouriers) {
        const courierId = courier.courier_company_id;
        console.log(`\n📄 Trying AWB generation with Courier ID: ${courierId}`);

        try {
          const response = await generateAWB(token, shipmentId, courierId);
          awbCode = response?.awb_code || response?.response?.data?.awb_code;

          if (response?.awb_assign_status === 1 || awbCode) {
            awbResponse = response;
            console.log('✅ AWB Generated:', response);
            break;
          } else {
            console.warn('⚠️ AWB assign failed:', response?.response?.data?.awb_assign_error || 'Unknown reason');
          }
        } catch (awbError) {
          console.warn('⚠️ Error generating AWB:', awbError.response?.data || awbError.message);
        }
      }

      if (awbCode) {
        console.log('\n📡 Tracking Order...');
        const tracking = await trackOrder(token, awbCode);
        console.log('📍 Tracking Info:', tracking);
      } else {
        console.log('\n❌ AWB generation failed with all couriers. Cannot track.');
      }
    } else {
      console.log('\n⚠️ Shipment ID missing, skipping AWB generation.');
    }

  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
})();
