import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Wrapper from "./Wrapper";
import { deleteVendorProduct } from "../../Store/ActionCreators/ProductActionCreators";
import { useDispatch } from "react-redux";
import { apiLink } from "../../utils/utils";
import { getVendorProductAPI } from "../../Store/Services/ProductService";

export default function VendorProduct() {
  const dispatch = useDispatch();
  const [allproducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(new Date().getTime());
  const limit = 20;

  function getAPIData() {
    getVendorProductAPI(page, search).then((data) => {
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
            <h3 className="flex-1">Products</h3>
            <div className="col-md-3 text-right">
              <Link to="/vendor/add-product" className="add__item">
                <span className="fa fa-plus mr-2"></span> Add Product
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar for filtering products */}
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

        {/* No products found message */}
        {allproducts.length === 0 && (
          <div className="alert alert-danger">No products</div>
        )}

        {/* Product List Display */}
        <div className="row">
          {allproducts.map((item) => (
            <div className="col-md-3" key={item._id}>
              <div className="product__item">
                {/* Product Image */}
                <img
                  className="product__item__image"
                  src={
                    item.pic1
                      ? item.pic1.startsWith("data:image")
                        ? item.pic1
                        : `${apiLink}/public/products/${encodeURIComponent(item.pic1)}`
                      : "/no-image.png"
                  }
                  alt={item.name}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                />
                <div className="product__item__content text-left">
                  <h4 title={item.name}>{item.name}</h4>
                  <p>
                    <span>Color:</span> {item.color}
                  </p>
                  <div className="product__item__actions">
                    <Link to={"/vendor-update-product/" + item._id}>
                      <i className="fa fa-edit"></i> Edit
                    </Link>
                    <Link to={"/single-product/" + item._id} target="_blank">
                      <i className="fa fa-eye"></i> View
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are You Sure You Want to Delete this Item?"
                          )
                        ) {
                          dispatch(deleteVendorProduct({ _id: item._id }));
                          setTimeout(() => setDate(new Date().getTime()), 300);
                        }
                      }}
                    >
                      <i className="fa fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
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