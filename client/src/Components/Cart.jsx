import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  updateCart,
  deleteCart,
} from "../Store/ActionCreators/CartActionCreators";
import { apiLink } from "../utils/utils";
import { showToast } from "../utils/toast";

export default function Cart() {
  const [subtotal, setSubTotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [carts, setCarts] = useState([]);
  const allCarts = useSelector((state) => state.CartStateData);
  const dispatch = useDispatch();

  useEffect(() => {
    getAPIData();
  }, [allCarts.length]);

  function getAPIData() {
    dispatch(getCart());
    if (allCarts.length) {
      let data = allCarts;
      setCarts(data);
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

  function update(_id, op) {
    let item = carts.find((x) => x._id === _id);
    const variant = item.selectedVariant || item;
    const unitPrice = variant.finalprice || variant.price;
    if (op === "Dec" && item.qty === 1) {
      showToast.warning("Minimum quantity is 1");
      return;
    }
    else if (op === "Dec") {
      item.qty = item.qty - 1;
      showToast.info("Quantity decreased");
    } else {
      item.qty = item.qty + 1;
      showToast.info("Quantity increased");
    }
    item.total = item.qty * unitPrice;
    dispatch(updateCart({ ...item }));
    getAPIData();
  }

  function deleteItem(_id) {
    dispatch(deleteCart({ _id: _id }));
    showToast.success("Item removed from cart");
    getAPIData();
  }

  return (
    <div className="page_section">
      <div className="container-fluid">
        {carts.length ? (
          <div className="row">
            <div className="col-lg-8 table-responsive mb-5">
              <table className="table table-borderless table-hover text-center mb-0">
                <thead className="header-color">
                  <tr>
                    <th>Products</th>
                    <th>Brand/Color/Size</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {carts &&
                    carts.map((item, index) => {
                      const variant = item.selectedVariant || item;
                      return (
                        <tr key={index}>
                          <td className="align-middle d-flex">
                            <img
                              src={`${apiLink}/public/products/${item.pic}`}
                              style={{ height: "50px", width: "50px" }}
                              className="rounded"
                              alt=""
                            />{" "}
                            {item.name} {((item.innerSlug || item.innerSubSlug) ? `(${item.innerSlug || ''}${item.innerSlug && item.innerSubSlug ? ', ' : ''}${item.innerSubSlug || ''})` : `(${item.color}, ${item.size})`)}
                          </td>
                          <td className="align-middle">
                            {item.brand}/{variant.color}/{variant.size}
                          </td>
                          <td className="align-middle">&#8377;{variant.finalprice || variant.price}</td>
                          <td className="align-middle">
                            <div
                              className="input-group quantity mx-auto"
                              style={{ width: "150px" }}
                            >
                              <div className="input-group-btn">
                                <button
                                  className="btn btn-sm main-color btn-minus"
                                  onClick={() => update(item._id, "Dec")}
                                >
                                  <i className="fa fa-minus"></i>
                                </button>
                              </div>
                              <p style={{ width: "50px" }}>{item.qty}</p>
                              <div className="input-group-btn">
                                <button
                                  className="btn btn-sm main-color btn-plus"
                                  onClick={() => update(item._id, "Inc")}
                                >
                                  <i className="fa fa-plus"></i>
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="align-middle">
                            &#8377;{(variant.finalprice ? variant.finalprice * item.qty : item.total).toFixed(2)}
                          </td>
                          <td className="align-middle">
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteItem(item._id)}
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="col-lg-4">
              <h5 className="section-title position-relative text-uppercase mb-3">
                <span className="header-color pr-3">Cart Summary</span>
              </h5>
              <div className="bg-light p-30 mb-5">
                <div className="border-bottom pb-2">
                  {/* Product names with variants */}
                  {carts.map((item, idx) => (
                    <div key={idx} className="mb-2">
                      <strong>
                        {item.name} {((item.innerSlug || item.innerSubSlug) ? `(${item.innerSlug || ''}${item.innerSlug && item.innerSubSlug ? ', ' : ''}${item.innerSubSlug || ''})` : `(${item.color}, ${item.size})`)}
                      </strong>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between mb-3">
                    <h6>Subtotal</h6>
                    <h6>&#8377;{subtotal.toFixed(2)}</h6>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6 className="font-weight-medium">Shipping</h6>
                    <h6 className="font-weight-medium">
                      &#8377;{shipping.toFixed(2)}
                    </h6>
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
                    <h5>&#8377;{total.toFixed(2)}</h5>
                  </div>
                  <Link
                    to="/checkout"
                    className="btn btn-block main-color font-weight-bold my-3 py-3"
                  >
                    Proceed To Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="m-5 text-center" style={{ fontSize: "35px" }}>
            No Items in Cart
          </div>
        )}
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
  );
}
