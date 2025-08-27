"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getVendorCheckout, updateVendorCheckout } from "../../Store/ActionCreators/VendorCheckoutActionCreators"
import { apiLink } from "../../utils/utils"
import VendorSideNavbar from "./VendorSideNavbar"

export default function VendorSingleCheckout() {
  const [user, setUser] = useState({})
  const [checkout, setCheckout] = useState({})
  const [paymentstatus, setPaymentStatus] = useState("")
  const [orderstatus, setOrderStatus] = useState("")
  const [payments, setPayments] = useState([])
  const [showPayment, setShowPayment] = useState(false)

  const dispatch = useDispatch()
  const allCheckouts = useSelector((state) => state.VendorCheckoutStateData)
  const { _id } = useParams()

  useEffect(() => {
    dispatch(getVendorCheckout(_id))
  }, [dispatch, _id])

  useEffect(() => {
    if (_id && allCheckouts.length) {
      getAPIData()
    }
  }, [_id, allCheckouts])

  async function getAPIData() {
    try {
      // Fetch payments
      const paymentRes = await fetch(`${apiLink}/api/vendor-payment`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      })
      const paymentData = await paymentRes.json()
      setPayments(paymentData.data || [])

      const item = allCheckouts.find((x) => x._id === _id)
      if (item) {
        setCheckout(item)
        setPaymentStatus(item.paymentstatus || "Pending")
        setOrderStatus(item.orderstatus || "Order Placed")

        // Make sure we have a user ID before trying to fetch user data
        const userId = item?.userid?._id
        if (userId) {
          try {
            const userRes = await fetch(`${apiLink}/api/user/${userId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
              },
            })
            const userData = await userRes.json()
            if (userData.data) {
              setUser(userData.data)
            }
          } catch (error) {
            console.error("Error fetching user data", error)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data", error)
    }
  }

  function getPaymentStatus(e) {
    setPaymentStatus(e.target.value)
  }

  function getOrderStatus(e) {
    setOrderStatus(e.target.value)
  }

  function update() {
    dispatch(
      updateVendorCheckout({
        ...checkout,
        orderstatus,
        paymentstatus,
      }),
    )
    setCheckout((prev) => ({
      ...prev,
      orderstatus,
      paymentstatus,
    }))
  }

  const getPayment = (data) => {
    const { udf1, udf2, udf3, udf4, udf5, udf6, udf7, udf8, udf9, udf10, card, http, ...others } = data
    return { ...others }
  }

  return (
    <div className="page_section">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-12">
            <VendorSideNavbar />
          </div>
          <div className="col-md-9 col-12">
            <h5 className="header-color text-center p-2">Checkout</h5>
            <div className="table-responsive">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Id</th>
                    <td>{checkout?._id}</td>
                  </tr>
                  <tr>
                    <th>User</th>
                    <td>
                      <address>
                        {user?.name}
                        <br />
                        {user?.email}
                        <br />
                        {user?.addressline1}, {user?.addressline2}, {user?.addressline3}
                        <br />
                        {user?.city}, {user?.state}, {user?.pin}
                      </address>
                    </td>
                  </tr>
                  <tr>
                    <th>Payment Mode</th>
                    <td>{checkout.paymentmode}</td>
                  </tr>
                  <tr>
                    <th>Payment Status</th>
                    <td>
                      {checkout.paymentstatus}
                      <br />
                      {checkout.paymentmode === "COD" && paymentstatus === "Pending" ? (
                        <select
                          name="paymentstatus"
                          className="form-control mt-2"
                          onChange={getPaymentStatus}
                          value={paymentstatus}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Done">Done</option>
                        </select>
                      ) : null}
                      {payments.length > 0 && (
                        <>
                          <button className="btn btn-sm btn-primary mt-2" onClick={() => setShowPayment(!showPayment)}>
                            {showPayment ? "Hide" : "Show"} Payment Info
                          </button>
                          {showPayment &&
                            payments.map((item) => (
                              <div key={item._id} className="p-3 bg-white border mt-2">
                                <pre>{JSON.stringify(getPayment(item.paymentInfo), null, 2)}</pre>
                              </div>
                            ))}
                        </>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Order Status</th>
                    <td>
                      {checkout.orderstatus}
                      <br />
                      {checkout.orderstatus !== "Delivered" && (
                        <select
                          name="orderstatus"
                          onChange={getOrderStatus}
                          className="form-control mt-2"
                          value={orderstatus}
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Packed">Packed</option>
                          <option value="Ready to Ship">Ready to Ship</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Subtotal</th>
                    <td>&#8377;{checkout.subtotal}</td>
                  </tr>
                  <tr>
                    <th>Shipping</th>
                    <td>&#8377;{checkout.shipping}</td>
                  </tr>
                  <tr>
                    <th>GST Amount (18%)</th>
                    <td>&#8377;{checkout.gstAmount}</td>
                  </tr>
                  {checkout.gstRequired && (
                    <tr>
                      <th>Customer GST Number</th>
                      <td>{checkout.gstNumber}</td>
                    </tr>
                  )}
                  <tr>
                    <th>Total</th>
                    <td>&#8377;{checkout.total}</td>
                  </tr>
                  <tr>
                    <th>Date</th>
                    <td>{checkout.date}</td>
                  </tr>
                  {(paymentstatus !== checkout.paymentstatus || orderstatus !== checkout.orderstatus) && (
                    <tr>
                      <td colSpan={2}>
                        <button className="btn btn-primary w-100" onClick={update}>
                          Update
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <h6 className="text-center">Checkout Products</h6>
            <div className="table-responsive">
              <table className="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {checkout.products &&
                    checkout.products.map((p, index) => (
                      <tr key={index}>
                        <td>
                          <img src={`/products/${p.pic}`} height="70px" width="70px" className="rounded" alt="" />
                        </td>
                        <td>{p.name}</td>
                        <td>{p.brand}</td>
                        <td>{p.color}</td>
                        <td>{p.size}</td>
                        <td>&#8377;{p.price}</td>
                        <td>{p.qty}</td>
                        <td>&#8377;{p.total}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
