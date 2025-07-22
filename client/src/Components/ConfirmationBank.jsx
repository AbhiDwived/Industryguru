import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiLink } from "../utils/utils";

export default function ConfirmationBank() {
  const navigate = useNavigate();

  let { _id } = useParams();
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    fetch(
      `${apiLink}/api/checkout/singleuser/${_id}/${localStorage.getItem(
        "userid"
      )}`,
      {
        method: "get",
        headers: {
          "content-type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((response) => {
        if (response.result !== "Done") {
          navigate("/");
        }
        setOrderInfo(response.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(orderInfo);

  return (
    <div className="container-fluid my-3 text-center">
      {!orderInfo ? (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <div className="mt-5 mb-5">
          <div className="row d-flex justify-content-center">
            <div className="col-md-8">
              <div className="card">
                <div className="invoice p-5">
                  <h5>Your order Confirmed!</h5>

                  <span className="font-weight-bold d-block mt-4">
                    Hello, {localStorage.getItem("name")}
                  </span>
                  <span>
                    You order has been confirmed and will be shipped in next two
                    days!
                  </span>

                  {orderInfo?.paymentstatus !== "CHARGED" && (
                    <div className="alert alert-danger">Your payment not confirmed, please make payment from order screen</div>
                  )}

                  <div className="payment border-top mt-3 mb-3 border-bottom table-responsive">
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td>
                            <div className="py-2">
                              <span className="d-block text-muted">
                                Order Date
                              </span>
                              <span>{orderInfo?.date}</span>
                            </div>
                          </td>

                          <td>
                            <div className="py-2">
                              <span className="d-block text-muted">
                                Order No
                              </span>
                              <span>{orderInfo?._id}</span>
                            </div>
                          </td>

                          <td>
                            <div className="py-2">
                              <span className="d-block text-muted">
                                Payment
                              </span>
                              <span>{orderInfo?.paymentmode}</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="product border-bottom table-responsive">
                    <table className="table table-borderless">
                      <tbody>
                        {orderInfo?.products?.map((item) => (
                          <tr key={item._id}>
                            <td width="20%">
                              <img
                                src={`${apiLink}/public/products/${item.pic}`}
                                height="70px"
                                width="70px"
                                className="rounded"
                                alt=""
                              />
                            </td>
                            <td width="60%">
                              <span className="font-weight-bold">
                                {item.name}
                              </span>
                              <div className="product-qty">
                                <span className="d-block">
                                  Quantity: {item.qty}
                                </span>
                                <span>Size: {item.size}</span>
                              </div>
                            </td>
                            <td width="20%">
                              <div className="text-right">
                                <span className="font-weight-bold">
                                  ₹{item.total}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="row d-flex justify-content-end">
                    <div className="col-md-5">
                      <table className="table table-borderless">
                        <tbody className="totals">
                          <tr>
                            <td>
                              <div className="text-left">
                                <span className="text-muted">Subtotal</span>
                              </div>
                            </td>
                            <td>
                              <div className="text-right">
                                <span>₹{orderInfo.subtotal}</span>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td>
                              <div className="text-left">
                                <span className="text-muted">Shipping Fee</span>
                              </div>
                            </td>
                            <td>
                              <div className="text-right">
                                <span>₹{orderInfo.shipping}</span>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td>
                              <div className="text-left">
                                <span className="text-muted">Tax Fee</span>
                              </div>
                            </td>
                            <td>
                              <div className="text-right">
                                <span>₹{orderInfo.subtotal * 0.18}</span>
                              </div>
                            </td>
                          </tr>

                          <tr className="border-top border-bottom">
                            <td>
                              <div className="text-left">
                                <span className="font-weight-bold">
                                  Subtotal
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="text-right">
                                <span className="font-weight-bold">
                                  ₹{orderInfo.total}
                                </span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <p>
                    We will be sending shipping confirmation email when the item
                    shipped successfully!
                  </p>
                  <p className="font-weight-bold mb-0">
                    Thanks for shopping with us!
                  </p>
                  <span>Industryguru Team</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
