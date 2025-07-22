import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCheckoutAPI } from "../../Store/Services/CheckoutService"; // Import the updateCheckoutAPI
import { apiLink } from "../../utils/utils";
import { getVendorOrdersAPI } from "../../Store/Services/ProductService";
import Wrapper from "./Wrapper";

function formatShortDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const statuses = [
  "Order Placed",
  "Packed",
  "Ready to Ship",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export default function VendorOrders() {
  const [allproducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [paymentstatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [date, setDate] = useState(new Date().getTime());
  const limit = 10;
  const [loading, setLoading] = useState(true); // Loading state for better UX
  const [modal, setModal] = useState(null);

  function getAPIData() {
    const id = localStorage.getItem("userid");
    setLoading(true); // Set loading state to true before fetching
    getVendorOrdersAPI(page, search, paymentstatus, orderStatus).then(
      (data) => {
        const items = (data?.checkouts || []).map((item) => {
          const products = item.products.filter((p) => p.addedBy == id);
          item.mode =
            products.length == item.products.length
              ? "Single Vendor"
              : "Multi Vendor";
          item.products = products;
          item.total = products.reduce((a, b) => a + b.total, 0);
          return item;
        });
        setAllProducts(items);
        setCount(data?.count || 0);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("Failed to load order data."); // Show error message
      })
      .finally(() => {
        setLoading(false); // Set loading state to false after fetching
      });
  }

  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, page, search, paymentstatus, orderStatus]);

  // Update order status with Shiprocket API
  async function updateOrderStatusShiprocket(orderId, newStatus) {
    try {
      const response = await fetch(`${apiLink}/api/shiprocket/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();
      return updatedOrder;
    } catch (error) {
      console.error("Error updating order status with Shiprocket:", error);
      throw error;
    }
  }

  return (
    <Wrapper>
      <div className="box__layout">
        <div className="header__layout">
          <div className="row">
            <h3 className="flex-1">Vendor Orders</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="ui__form position-relative">
              <label htmlFor="search" className="ui__form__label">
                Payment Status
              </label>
              <select
                id="paymentstatus"
                name="paymentstatus"
                className="ui__form__field"
                value={paymentstatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <option defaultChecked value={""}>
                  --All--
                </option>
                <option value={"Done"}>Done</option>
                <option value={"Pending"}>Pending</option>
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="ui__form position-relative">
              <label htmlFor="search" className="ui__form__label">
                Order Status
              </label>
              <select
                id="orderStatus"
                name="orderStatus"
                className="ui__form__field"
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
              >
                <option defaultChecked value={""}>
                  --All--
                </option>
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="ui__form position-relative search_product">
              <label htmlFor="name" className="ui__form__label">
                Search Product
              </label>
              <input
                id="name"
                name="name"
                placeholder=""
                className="ui__form__field"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="ui__form__button"
                onClick={() => {
                  setDate(new Date().getTime());
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="responsive">
          <table className="ui__table">
            <thead>
              <tr>
                <th>Order Id</th>
                <th>Order Status</th>
                <th>Date</th>
                <th>Payment Mode</th>
                <th>Payment Status</th>
                <th>Total Products</th>
                <th>Order Type</th>
                <th>Total Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allproducts.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>
                    <span className="badge badge-success">
                      {item.orderstatus}
                    </span>
                  </td>
                  <td>{formatShortDate(new Date(item.date))}</td>
                  <td>{item.paymentmode}</td>
                  <td>{item.paymentstatus}</td>
                  <td>{item.products.length}</td>
                  <td>{item.mode}</td>
                  <td>₹{item.total}</td>
                  <td>
                    <button onClick={() => setModal(item)}>
                      <i className="fa fa-eye"></i> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {allproducts.length == 0 && (
            <div className="alert alert-danger">No orders</div>
          )}
        </div>

        <div className="pagination__items">
          <button
            onClick={() => {
              setPage(page - 1);
              setDate(new Date().getTime());
            }}
            disabled={page <= 0}
          >
            Previous
          </button>
          <button
            onClick={() => {
              setPage(page + 1);
              setDate(new Date().getTime());
            }}
            disabled={page >= Math.ceil(count / limit) - 1}
          >
            Next
          </button>
        </div>
      </div>

      {modal && (
        <div className="box_modal">
          <div className="">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-12">
                  <div className="box__layout">
                    <button
                      className="modal__close"
                      onClick={() => setModal(null)}
                    >
                      <i className="fa fa-times-circle"></i>
                    </button>
                    <div className="header__layout">
                      <h3 className="flex-1">Order Info</h3>
                    </div>
                    <div className="responsive mb-5">
                      <table className="ui__table">
                        <thead>
                          <tr>
                            <th>Order Id</th>
                            <th>Order Status</th>
                            <th>Date</th>
                            <th>Payment Mode</th>
                            <th>Payment Status</th>
                            <th>Total Products</th>
                            <th>Order Type</th>
                            <th>Total Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr key={modal?._id}>
                            <td>{modal?._id}</td>
                            <td>
                              <span className="badge badge-success">
                                {modal?.orderstatus}
                              </span>
                            </td>
                            <td>{formatShortDate(new Date(modal?.date))}</td>
                            <td>{modal?.paymentmode}</td>
                            <td>{modal?.paymentstatus}</td>
                            <td>{modal?.products.length}</td>
                            <td>{modal?.mode}</td>
                            <td>₹{modal?.total}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Order Status Update */}
                    <div className="header__layout mt-4">
                      <h3 className="flex-1">Update Order Status</h3>
                    </div>
                    <div
                      className="ui__form"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginBottom: "20px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <label
                          htmlFor="orderStatus"
                          className="ui__form__label"
                          style={{ marginBottom: "0", fontSize: "14px" }}
                        >
                          Status
                        </label>
                        <select
                          id="orderStatus"
                          className="ui__form__field"
                          style={{
                            width: "180px",
                            height: "36px",
                            fontSize: "14px",
                            padding: "4px 8px",
                          }}
                          value={modal?.orderstatus}
                          onChange={(e) =>
                            setModal({
                              ...modal,
                              orderstatus: e.target.value,
                            })
                          }
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        className="ui__form__button"
                        style={{
                          height: "36px",
                          fontSize: "14px",
                          padding: "0 16px",
                          marginTop: "0",
                        }}
                        onClick={async () => {
                          try {
                            // Call Shiprocket API to update status
                            const updatedOrderData = await updateOrderStatusShiprocket(
                              modal._id,
                              modal.orderstatus
                            );
                            alert("Order status updated successfully.");
                            setModal(null); // Close modal after update
                          } catch (error) {
                            alert("Failed to update order status.");
                          }
                        }}
                      >
                        Update Status
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="header__layout">
                      <h3 className="flex-1">Product Details</h3>
                    </div>
                    <div className="responsive">
                      <table className="ui__table">
                        <thead>
                          <tr>
                            <th>Product Id</th>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {modal?.products?.map((item) => (
                            <tr key={item._id}>
                              <td>{item._id}</td>
                              <td>{item.name}</td>
                              <td>
                                <div
                                  className="product__item__image1"
                                  style={{
                                    backgroundImage: `url(${apiLink}/public/products/${item.pic})`,
                                  }}
                                ></div>
                              </td>
                              <td>₹{item.price}</td>
                              <td>{item.qty}</td>
                              <td>₹{item.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
}
