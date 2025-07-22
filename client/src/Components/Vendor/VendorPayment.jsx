import React, { useEffect, useState } from "react";
import Wrapper from "./Wrapper";

import { getVendorPayment } from "../../Store/Services/ProductService";

function formatShortDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export default function VendorPayment() {
  const [allproducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(new Date().getTime());
  const limit = 10;
  function getAPIData() {
    const id = localStorage.getItem("userid");
    getVendorPayment(page, search).then((data) => {
      setAllProducts(data?.data || []);
      setCount(data?.count || 0);
    });
  }
  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);
  return (
    <Wrapper>
      <div className="box__layout">
        <div className="header__layout">
          <div className="row">
            <h3 className="flex-1">Vendor Payment</h3>
          </div>
        </div>
        <div className="ui__form position-relative search_product">
          <label htmlFor="name" className="ui__form__label">
            Search By ID
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

        <div className="responsive">
          <table className="ui__table">
            <thead>
              <tr>
                <th>Payment Id</th>
                <th>Date</th>
                <th>Payment Mode</th>
                <th>Payment Reference</th>
                <th>Total Amount</th>
                <th>GST</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              {allproducts.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{formatShortDate(new Date(item.createdAt))}</td>
                  <td>{item.mode}</td>
                  <td>{item.reference}</td>
                  <td>₹{item.amount}</td>
                  <td>₹{item.gst || 0}</td>
                  <td>₹{item.commission || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {allproducts.length == 0 && (
            <div className="alert alert-danger">No Payments</div>
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
    </Wrapper>
  );
}
