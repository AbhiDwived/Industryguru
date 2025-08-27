import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCart,
  getCart,
} from "../Store/ActionCreators/CartActionCreators";
import { addCheckout } from "../Store/ActionCreators/CheckoutActionCreators";
import BuyerProfile from "./BuyerProfile";
import { apiLink } from "../utils/utils";
import { showToast } from "../utils/toast";
import "./checkout-gst.css";

export default function Checkout() {
  const [user, setUser] = useState({});
  const [cart, setCart] = useState([]);
  const [subtotal, setSubTotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [mode, setMode] = useState("COD");
  const [gstRequired, setGstRequired] = useState(false);
  const [gstNumber, setGstNumber] = useState("");
  const [gstAmount, setGstAmount] = useState(0);
  const allCarts = useSelector((state) => state.CartStateData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getAPIData();
  }, [allCarts.length]);

  useEffect(() => {
    // Load GST data when user data is available
    if (user.gstNumber && !gstRequired) {
      setGstRequired(true);
      setGstNumber(user.gstNumber);
    }
  }, [user]);

  async function getAPIData() {
    const response = await fetch(
      `${apiLink}/api/user/` + localStorage.getItem("userid"),
      {
        method: "get",
        headers: {
          "content-type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      }
    );
    const userData = await response.json();
    if (userData.result === "Done") {
      setUser(userData.data);
    } else navigate("/login");

    dispatch(getCart());
    if (allCarts.length) {
      const data = allCarts.filter(
        (x) => x.userid === localStorage.getItem("userid")
      );
      setCart(data);
      let count = 0;
      for (let item of data) {
        count = count + item.total;
      }
      let shipping = 0;
      if (count > 0 && count < 400) shipping = 30;
      if (count > 0 && count < 1000) shipping = 40;

      setShipping(shipping);
      setSubTotal(count);
      calculateTotal(count, shipping, gstRequired);
    }
  }

  function getMode(e) {
    setMode(e.target.value);
  }

  function calculateTotal(subtotal, shipping, hasGstNumber) {
    const gstRate = 0.18; // 18% GST - Always applied
    const calculatedGstAmount = subtotal * gstRate;
    setGstAmount(calculatedGstAmount);
    setTotal(subtotal + shipping + calculatedGstAmount);
  }

  function handleGstCheckbox(e) {
    const checked = e.target.checked;
    setGstRequired(checked);
    if (!checked) {
      setGstNumber("");
    }
    // GST is always calculated, checkbox only determines if user provides GST number
  }

  function handleGstNumber(e) {
    const value = e.target.value.toUpperCase();
    setGstNumber(value);
  }

  async function saveGstToProfile(gstNum) {
    try {
      await fetch(`${apiLink}/api/user/` + localStorage.getItem("userid"), {
        method: "put",
        headers: {
          "content-type": "application/json",
          authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ gstNumber: gstNum }),
      });
    } catch (error) {
      console.error("Error saving GST number:", error);
    }
  }

  function validateGstNumber(gstNumber) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
  }

  const valideCheckoutAddress = () => {
    if (
      user.addressline1 &&
      user.addressline2 &&
      user.addressline3 &&
      user.pin &&
      user.city &&
      user.state
    ) {
      return true;
    } else {
      showToast.warning("Please update your address before placing the order.");
      setTimeout(() => navigate("/update-profile"), 2000);
      return false;
    }
  }

  const [processing, setProcessing] = useState(false);

  async function placeOrder() {
    if (!valideCheckoutAddress()) return;
    setProcessing(true);
    if (gstRequired && !gstNumber.trim()) {
      showToast.warning("Please enter your GST number.");
      setProcessing(false);
      return;
    }

    if (gstRequired && !validateGstNumber(gstNumber)) {
      showToast.warning("Please enter a valid GST number.");
      setProcessing(false);
      return;
    }

    // Save GST number to user profile if it's new or different
    if (gstRequired && gstNumber && gstNumber !== user.gstNumber) {
      await saveGstToProfile(gstNumber);
    }

    const item = {
      userid: localStorage.getItem("userid"),
      paymentmode: mode,
      paymentstatus: "Pending",
      orderstatus: "Order Placed",  
      subtotal: subtotal,
      shipping: shipping,
      total: total,
      gstRequired: gstRequired,
      gstNumber: gstRequired ? gstNumber : "",
      gstAmount: gstAmount,
      products: cart,
      date: new Date(),
    };
    if (mode === "COD") {
      dispatch(addCheckout(item));
      for (let item of cart) {
        dispatch(deleteCart({ _id: item._id }));
      }
      showToast.success("Order placed successfully!");
      navigate("/confirmation")
      setProcessing(false);
      return
    }
    // else navigate("/payment/-1");

    fetch(`${apiLink}/api/payment`, {
      method: "post",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(item),
    })
    .then(res => res.json())
    .then((response) => {
      if (response.status === "NEW") {
        return window.location.href = response.payment_links.web;
      } else {
        showToast.error(response.message || "Payment failed. Please try again.");
      }
    }).finally(() => setProcessing(false));
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-lg-5">
            <h5 className="section-title text-center position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Billing Address</span>
            </h5>
            <BuyerProfile user={user} />
          </div>
          <div className="col-lg-7">
            <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">Order Total</span>
            </h5>
            <div className="bg-light p-30 mb-5">
              <div className="border-bottom">
                <h6 className="mb-3">Products</h6>
                {cart.map((item, index) => {
                  return (
                    <div key={index} className="d-flex justify-content-between">
                      <p>
                        {item.name} {((item.innerSlug || item.innerSubSlug) ? `(${item.innerSlug || ''}${item.innerSlug && item.innerSubSlug ? ', ' : ''}${item.innerSubSlug || ''})` : `(${item.color}, ${item.size})`)}
                      </p>
                      <p>&#8377;{item.total}</p>
                    </div>
                  );
                })}
              </div>
              <div className="border-bottom pt-3 pb-2">
                <div className="d-flex justify-content-between mb-3">
                  <h6>Subtotal</h6>
                  <h6>&#8377;{subtotal}</h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h6 className="font-weight-medium">Shipping</h6>
                  <h6 className="font-weight-medium">&#8377;{shipping}</h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h6 className="font-weight-medium">GST @ 18%</h6>
                  <h6 className="font-weight-medium">
                    &#8377;{gstAmount.toFixed(2)}
                  </h6>
                </div>
              </div>
              <div className="pt-2">
                <div className="d-flex justify-content-between mt-2">
                  <h5>Total</h5>
                  <h5>&#8377;{total}</h5>
                </div>
              </div>
            </div>
            <div className="mb-5">
              <h5 className="section-title position-relative text-uppercase mb-3">
                <span className="bg-secondary pr-3">GST & Payment</span>
              </h5>
              <div className="bg-light p-30">
                <div className="gst-section">
                  <div className="gst-checkbox-container">
                    <input
                      type="checkbox"
                      id="gstCheckbox"
                      checked={gstRequired}
                      onChange={handleGstCheckbox}
                    />
                    <label htmlFor="gstCheckbox">
                      <strong>I have GST Number</strong> (for GST invoice)
                    </label>
                  </div>
                  <div className="gst-info">
                    <small>Note: 18% GST is applicable on all products</small>
                  </div>
                  {gstRequired && (
                    <div className="gst-input">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter GST Number (e.g., 22AAAAA0000A1Z5)"
                        value={gstNumber}
                        onChange={handleGstNumber}
                        pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
                        title="Please enter a valid GST number"
                        maxLength="15"
                      />
                      <div className="gst-info">
                        Format: 15 characters (2 digits + 10 alphanumeric + 1 check digit + Z + 1 check digit)
                      </div>
                      {gstAmount > 0 && (
                        <div className="gst-amount-display">
                          GST Amount: ₹{gstAmount.toFixed(2)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <select name="mode" onChange={getMode} className="form-control">
                  <option value="COD">COD</option>
                  <option value="Net Banking">Net Banking/Card/UPI</option>
                </select>
                <button
                  className="btn w-100 header-color btn-sm mt-3"
                  onClick={placeOrder}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <a href="/shop/All/All/All" className="btn main-color btn-block">
                Shop More
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
