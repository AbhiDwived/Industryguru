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

export default function Checkout() {
  const [user, setUser] = useState({});
  const [cart, setCart] = useState([]);
  const [subtotal, setSubTotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [mode, setMode] = useState("COD");
  const allCarts = useSelector((state) => state.CartStateData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getAPIData();
  }, [allCarts.length]);

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
    if (userData.result === "Done") setUser(userData.data);
    else navigate("/login");

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

      // Apply GST here
      const gstRate = 0.18; // Assuming a GST rate of 18%
      const gstAmount = count * gstRate;
      setTotal(count + shipping + gstAmount);
    }
  }

  function getMode(e) {
    setMode(e.target.value);
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
      const confirmation = window.confirm(
        "Please update your address before placing the order. Do you want to update now?"
      );
      if (confirmation) {
        navigate("/update-profile");
      }
      return false;
    }
  }

  const [processing, setProcessing] = useState(false);

  async function placeOrder() {
    if (!valideCheckoutAddress()) return;
    setProcessing(true);
    const item = {
      userid: localStorage.getItem("userid"),
      paymentmode: mode,
      paymentstatus: "Pending",
      orderstatus: "Order Placed",  
      subtotal: subtotal,
      shipping: shipping,
      total: total,
      products: cart,
      date: new Date(),
    };
    if (mode === "COD") {
      dispatch(addCheckout(item));
      for (let item of cart) {
        dispatch(deleteCart({ _id: item._id }));
      }
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
        alert(response.message||"");
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
                {/* Display GST amount */}
                <div className="d-flex justify-content-between">
                  <h6 className="font-weight-medium">GST @ 18%</h6>
                  <h6 className="font-weight-medium">
                    &#8377;{(total - subtotal - shipping).toFixed(2)}
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
                <span className="bg-secondary pr-3">Payment</span>
              </h5>
              <div className="bg-light p-30">
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
