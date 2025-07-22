import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCheckoutUser } from "../Store/ActionCreators/CheckoutActionCreators";
import { apiLink } from "../utils/utils";

export default function Profile() {
  const orderData = useSelector((state) => state.CheckoutStateData);
  const dispatch = useDispatch();
  const [totalWithGST, setTotalWithGST] = useState(0);
  const [trackingInfo, setTrackingInfo] = useState({});
  const [loadingTracking, setLoadingTracking] = useState({});

  useEffect(() => {
    dispatch(getCheckoutUser());
  }, []);

  useEffect(() => {
    if (orderData.length) {
      let totalAmount = 0;
      orderData.forEach((item) => {
        totalAmount += parseFloat(item.total);
      });

      const gstRate = 0.18; // Assuming a GST rate of 18%
      const gstAmount = totalAmount * gstRate;
      setTotalWithGST(totalAmount + gstAmount);
    }
  }, [orderData]);

  const payAgain = (item) => {
    fetch(`${apiLink}/api/payment`, {
      method: "post",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        ...item,
        id: item._id,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        return (window.location.href = response.payment_links.web);
      });
  };

  const handleOrderCancel = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const response = await fetch(`${apiLink}/api/checkout/${orderId}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            orderstatus: "Cancelled",
          }),
        });
        
        const data = await response.json();
        if (data.result === "Done") {
          dispatch(getCheckoutUser()); // Refresh orders
          alert("Order cancelled successfully");
        } else {
          alert(data.message || "Failed to cancel order");
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  const fetchTrackingInfo = async (orderId) => {
    setLoadingTracking(prev => ({ ...prev, [orderId]: true }));
    
    try {
      const response = await fetch(`${apiLink}/api/checkout/track/${orderId}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });
      
      const data = await response.json();
      if (data.result === "Done") {
        setTrackingInfo(prev => ({ 
          ...prev, 
          [orderId]: data.tracking 
        }));
      }
    } catch (error) {
      console.error("Error fetching tracking info:", error);
    } finally {
      setLoadingTracking(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusClass = (status) => {
    if (!status) return "";
    
    status = status.toLowerCase();
    if (status.includes("delivered")) return "text-success";
    if (status.includes("out for delivery")) return "text-primary";
    if (status.includes("transit")) return "text-info";
    if (status.includes("pickup") || status.includes("processed")) return "text-warning";
    if (status.includes("cancel") || status.includes("rto")) return "text-danger";
    return "";
  };

  return (
    <div className="page_section">
      <div className="container-fluid">
        <div className="table-responsive">
          <h5 className="mt-2 header-color p-2 text-center">Order History</h5>
          {orderData.length ? (
            orderData.map((item, index) => {
              const gstAmount = parseFloat(item.subtotal) * 0.18;
              const totalWithGST =
                parseFloat(item.subtotal) + item.shipping + gstAmount;
              const hasShippingDetails = item.shipping_details && item.shipping_details.awb_code;

              return (
                <div key={index} className="row">
                  <div className="col-lg-3">
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered">
                        <tbody>
                          <tr>
                            <th>Order Id</th>
                            <td>{item._id}</td>
                          </tr>
                          <tr>
                            <th>Order Status</th>
                            <td className={getStatusClass(item.orderstatus)}>{item.orderstatus}</td>
                          </tr>
                          <tr>
                            <th>Payment Mode</th>
                            <td>{item.paymentmode}</td>
                          </tr>
                          <tr>
                            <th>Payment Status</th>
                            <td>
                              {item.paymentstatus}
                              {item.paymentmode === "Net Banking" &&
                              item.paymentstatus !== "CHARGED" ? (
                                <button
                                  onClick={() => payAgain(item)}
                                  className="btn btn-primary btn-sm ml-2"
                                >
                                  Pay Again
                                </button>
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th>Subtotal</th>
                            <td>&#8377;{item.subtotal}</td>
                          </tr>
                          <tr>
                            <th>Shipping</th>
                            <td>&#8377;{item.shipping}</td>
                          </tr>
                          <tr>
                            <th>GST (18%)</th>
                            <td>&#8377;{gstAmount.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <th>Total</th>
                            <td>&#8377;{totalWithGST.toFixed(2)}</td>
                          </tr>
                          <tr>
                            <th>Date</th>
                            <td>{new Date(item.date).toLocaleDateString()}</td>
                          </tr>
                          
                          {/* Shipping Details Section */}
                          {hasShippingDetails && (
                            <>
                              <tr className="bg-light">
                               <th colSpan="2" className="header-color text-center" style={{ backgroundColor: '#6068bf' }}>Shipping Details</th>
                              </tr>
                              <tr>
                                <th>AWB Number</th>
                                <td>{item.shipping_details.awb_code}</td>
                              </tr>
                              <tr>
                                <th>Courier</th>
                                <td>{item.shipping_details.courier_name || "To be assigned"}</td>
                              </tr>
                              <tr>
                                <th>Status</th>
                                <td className={getStatusClass(item.shipping_details.status)}>
                                  {item.shipping_details.status || "Processing"}
                                </td>
                              </tr>
                              {item.shipping_details.tracking_url && (
                                <tr>
                                  <th>Track</th>
                                  <td>
                                    <a 
                                      href={item.shipping_details.tracking_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="btn btn-sm btn-outline-primary"
                                    >
                                      Track on Shiprocket
                                    </a>
                                  </td>
                                </tr>
                              )}
                              <tr>
                                <th>Tracking</th>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => fetchTrackingInfo(item._id)}
                                    disabled={loadingTracking[item._id]}
                                    style={{ backgroundColor: 'grey' }}
                                  >
                                    {loadingTracking[item._id] ? (
                                      <span>Loading...</span>
                                    ) : (
                                      <span>Refresh Tracking</span>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-lg-9">
                    {/* Tracking Timeline Section */}
                    {trackingInfo[item._id]?.shipment_track?.[0]?.scan?.length > 0 && (
                      <div className="mb-4">
                        <h6 className="text-center">Tracking Timeline</h6>
                        <div className="table-responsive">
                          <table className="table table-sm table-bordered">
                            <thead>
                              <tr>
                                <th>Date & Time</th>
                                <th>Status</th>
                                <th>Location</th>
                                <th>Activity</th>
                              </tr>
                            </thead>
                            <tbody>
                              {trackingInfo[item._id].shipment_track[0].scan.map((scan, idx) => (
                                <tr key={idx}>
                                  <td>{new Date(scan.time).toLocaleString()}</td>
                                  <td className={getStatusClass(scan.status)}>{scan.status}</td>
                                  <td>{scan.location}</td>
                                  <td>{scan.activity || "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <h6 className="text-center">Order Products</h6>
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered">
                        <tbody>
                          <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Color</th>
                            <th>Size</th>
                            <th>Price</th>
                            <th>GST(18%)</th>
                            <th>Qty</th>
                            <th>Total</th>
                          </tr>
                          {item.products.map((product, productIndex) => {
                            const productGst = (product.price * product.qty * 0.18).toFixed(2);
                            const productTotal = (product.price * product.qty * 1.18).toFixed(2);
                            
                            return (
                              <tr key={productIndex}>
                                <td>
                                  <Link
                                    to={`/single-product/${product.productid}`}
                                  >
                                    <img
                                      src={`${apiLink}/public/products/${product.pic}`}
                                      height="70px"
                                      width="70px"
                                      className="rounded"
                                      alt=""
                                    />
                                  </Link>
                                </td>
                                <td>
                                  {product.name}
                                  {(product.innerSlug || product.innerSubSlug) && (
                                    ` (${product.innerSlug || ''}${product.innerSlug && product.innerSubSlug ? ', ' : ''}${product.innerSubSlug || ''})`
                                  )}
                                </td>
                                <td>{product.brand}</td>
                                <td>{product.color}</td>
                                <td>{product.size}</td>
                                <td>&#8377;{product.price}</td>
                                <td>&#8377;{productGst}</td>
                                <td>{product.qty}</td>
                                <td>&#8377;{productTotal}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <div className="d-flex justify-content-end">
                        {item.orderstatus !== "Cancelled" && item.orderstatus !== "Delivered" && (
                          <button
                            className="btn btn-danger"
                            onClick={() => handleOrderCancel(item._id)}
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <hr
                    style={{ border: "5px solid lightgray", width: "100%" }}
                  />
                </div>
              );
            })
          ) : (
            <div className="text-center">No Order History Found!!!</div>
          )}
        </div>
      </div>
    </div>
  );
}