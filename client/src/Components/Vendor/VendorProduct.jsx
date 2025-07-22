import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Wrapper from "./Wrapper";

import { deleteVendorProduct } from "../../Store/ActionCreators/ProductActionCreators";
import { useDispatch, useSelector } from "react-redux";
import { apiLink } from "../../utils/utils";
import { getVendorProductAPI } from "../../Store/Services/ProductService";

export default function VendorProduct() {
  var dispatch = useDispatch();
  const [allproducts, setAllProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 20;

  // Function to get product data from API with pagination and search functionality
  function getAPIData() {
    setLoading(true);
    setError(null);
    
    getVendorProductAPI(page, search)
      .then((data) => {
        console.log("Product data received from API:", data);
        if (data?.result === "Done") {
          setAllProducts(data?.data || []);
          setCount(data?.count || 0);
        } else {
          setError(data?.message || "Failed to fetch products");
          setAllProducts([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Error loading products. Please try again.");
        setAllProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Debug: Log products in state
  useEffect(() => {
    console.log("All products in state:", allproducts);
  }, [allproducts]);

  // Trigger API data fetch whenever page or search changes
  useEffect(() => {
    getAPIData();
  }, [page, search]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0); // Reset to first page when searching
    getAPIData();
  };

  // Delete product handler
  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are You Sure You Want to Delete this Item?")) {
      dispatch(deleteVendorProduct({ _id: productId }));
      // Refresh the product list after deletion
      setTimeout(() => getAPIData(), 500);
    }
  };

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
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <div className="ui__form position-relative search_product">
            <label htmlFor="name" className="ui__form__label">
              Search Product
            </label>
            <input
              id="name"
              name="name"
              placeholder="Search by product name"
              className="ui__form__field"
              value={search}
              onChange={handleSearchChange}
            />
            <button type="submit" className="ui__form__button">
              Search
            </button>
          </div>
        </form>

        {/* Loading indicator */}
        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2">Loading products...</p>
          </div>
        )}

        {/* Error message */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* No products found message */}
        {!loading && !error && allproducts.length === 0 && (
          <div className="alert alert-info">
            No products found.<br/>
            <b>Debug info:</b> If you just added a product and don't see it, try logging out and logging in again as the correct vendor.<br/>
            If the problem persists, check your browser console for API response details and share them with your developer.<br/>
            {search && <span>Try a different search term or </span>}
            <Link to="/vendor/add-product">add a new product</Link>.
          </div>
        )}

        {/* Product List Display */}
        {!loading && !error && allproducts.length > 0 && (
          <div className="row">
            {allproducts.map((item) => (
              <div className="col-md-3" key={item._id}>
                <div className="product__item">
                  {/* Product Image */}
                  <div>
                    {item.pic1 ? (
                      <img
                        className="product__item__image"
                        src={
                          item.pic1.startsWith("data:image")
                            ? item.pic1
                            : `${apiLink}/public/products/${encodeURIComponent(item.pic1)}`
                        }
                        alt={item.name}
                        style={{ width: "100%", height: "200px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `${apiLink}/public/products/noimage.png`;
                        }}
                      />
                    ) : (
                      <div
                        className="product__item__image"
                        style={{
                          width: "100%",
                          height: "200px",
                          background: "#f0f0f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#bbb",
                          fontSize: "2rem",
                          border: "1px solid #eee"
                        }}
                      >
                        <span>
                          <i className="fa fa-image" style={{ fontSize: "2.5rem" }}></i>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="product__item__content text-left">
                    {/* Product Name */}
                    <h4 title={item.name}>{item.name}</h4>
                    <p>
                      <span>Color:</span> {item.color}
                    </p>
                    {item.brand && typeof item.brand === 'object' && (
                      <p>
                        <span>Brand:</span> {item.brand.name}
                      </p>
                    )}
                    <p>
                      <span>Price:</span> ₹{item.finalprice} 
                      {item.discount > 0 && (
                        <span className="ml-2 text-muted text-decoration-line-through">
                          ₹{item.baseprice}
                        </span>
                      )}
                    </p>
                    <div className="product__item__actions">
                      {/* Edit Product Link */}
                      <Link to={"/vendor/update-product/" + item._id}>
                        <i className="fa fa-edit"></i> Edit
                      </Link>
                      {/* View Product Link */}
                      <Link to={"/single-product/" + item._id} target="_blank">
                        <i className="fa fa-eye"></i> View
                      </Link>
                      {/* Delete Product Button */}
                      <button onClick={() => handleDeleteProduct(item._id)}>
                        <i className="fa fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {count > limit && (
              <div className="col-12">
                <div className="pagination__items d-flex justify-content-between align-items-center mt-4">
                  <div>
                    Showing {page * limit + 1} - {Math.min((page + 1) * limit, count)} of {count} products
                  </div>
                  <div>
                    <button
                      className="mr-2"
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 0}
                    >
                      <i className="fa fa-chevron-left mr-1"></i> Previous
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page >= Math.ceil(count / limit) - 1}
                    >
                      Next <i className="fa fa-chevron-right ml-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Wrapper>
  );
}
