const fs = require("fs");
const SANDBOX_BASE_URL = "https://smartgatewayuat.hdfcbank.com";
const PRODUCTION_BASE_URL = "https://smartgateway.hdfcbank.com";
const config = require("../justpay/config.json");
const path = require("path");
const publicKey = fs.readFileSync(config.PUBLIC_KEY_PATH);
const privateKey = fs.readFileSync(config.PRIVATE_KEY_PATH);
const paymentPageClientId = config.PAYMENT_PAGE_CLIENT_ID; // used in orderSession request

const Checkout = require("../Models/Checkout");
const Product = require("../Models/Product");
const PaymentInfo = require("../Models/PaymentInfo");

const { Juspay, APIError } = require("expresscheckout-nodejs");
const juspay = new Juspay({
  merchantId: config.MERCHANT_ID,
  baseUrl: SANDBOX_BASE_URL,
  jweAuth: {
    keyId: config.KEY_UUID,
    publicKey,
    privateKey,
  },
});

function makeError(message) {
  return {
    message: message || "Something went wrong",
  };
}

function makeJuspayResponse(successRspFromJuspay) {
  if (successRspFromJuspay == undefined) return successRspFromJuspay;
  if (successRspFromJuspay.http != undefined) delete successRspFromJuspay.http;
  return successRspFromJuspay;
}

async function initializePayment(req, res) { 
  const requestUrl = `${req.protocol}://${req.get('host')}`;
  // makes return url
  var data = req.body;
  let total = 0;
  if (!data.id) {
    data = new Checkout(req.body);
    for (const item of data.products) {
      const p = await Product.findOne({ _id: item.productid }).select('addedBy finalprice');
      item.addedBy = p?.addedBy;
      item.price = p.finalprice;  
      item.total = (p.finalprice * item.qty);
      total += (p.finalprice * item.qty);
    }
    await data.save();
  }

  total = total + ( total * 0.18) + data.shipping;

  const orderId = `order_${data.id}`;
  const amount = data.total;
  console.log(total, amount)
  if ( total.toFixed(3) != amount.toFixed(3) ) {
    return res.status(400).json({
      message: "Something went wrong, please try again later",
    });
  }

  // makes return url
  const returnUrl = `https://api.industryguru.in/api/processpayment/${data.id}/47syujhjuhkl`;

  try {
    const sessionResponse = await juspay.orderSession.create({
      order_id: orderId,
      amount: total,
      payment_page_client_id: paymentPageClientId, // [required] shared with you, in config.json
      customer_id: data.userid, // [optional] your customer id here
      action: "paymentPage", // [optional] default is paymentPage
      return_url: returnUrl, // [optional] default is value given from dashboard
      currency: "INR", // [optional] default is INR
    });

    // removes http field from response, typically you won't send entire structure as response
    return res.json(makeJuspayResponse(sessionResponse));
  } catch (error) {
    if (error instanceof APIError) {
      // handle errors comming from juspay's api
      return res.status(400).json(makeError(error.message));
    }
    return res.status(400).json(makeError());
  }
}

async function postPayment(req, res) {
  const orderId = req.body.order_id || req.body.orderId;

  if (orderId == undefined) {
    return res.json(makeError("order_id not present or cannot be empty"));
  }

  var data = await Checkout.findOne({ _id: req.params._id });
  console.log(data);

  try {
    const statusResponse = await juspay.order.status(orderId);

    var paymentDetail = new PaymentInfo({
      userid: data.userid,
      paymentId: statusResponse.id,
      orderId: req.params._id,
      paymentOrderId: statusResponse.order_id,
      dateCreated: statusResponse.order_id,
      status: statusResponse.status,
      txnId: statusResponse.txn_id,
      paymentInfo: statusResponse,
    });
    await paymentDetail.save();

    const orderStatus = statusResponse.status;
    data.paymentstatus = orderStatus;
    data.paymentInfo.unshift({
      paymentid: paymentDetail.id,
    });
    await data.save();
  } catch (error) {}
  res.set("Content-Type", "text/html");
  return res.send(
    Buffer.from(
      `<h2>processing<script>window.location.href="https://industryguru.in/confirmation/${req.params._id}"</script></h2>`
    )
  );
}
module.exports = [initializePayment, postPayment];
