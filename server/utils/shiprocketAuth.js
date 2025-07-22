const axios = require('axios');

let shiprocketToken = null;
let tokenExpiry = null;

const getShiprocketToken = async () => {
  if (shiprocketToken && Date.now() < tokenExpiry) return shiprocketToken;

  const { data } = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });

  shiprocketToken = data.token;
  tokenExpiry = Date.now() + 3600000; // 1 hour
  return shiprocketToken;
};

module.exports = { getShiprocketToken };
