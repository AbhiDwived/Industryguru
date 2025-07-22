import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation,useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProduct,
  getProductByBrand,
  getProductByMaincategory,
  getProductBySubCategory,
} from "../Store/ActionCreators/ProductActionCreators";
import { getMaincategory } from "../Store/ActionCreators/MaincategoryActionCreators";
import { getSubcategory } from "../Store/ActionCreators/SubcategoryActionCreators";
import { getBrand } from "../Store/ActionCreators/BrandActionCreators";
import { apiLink } from "../utils/utils";

export default function Shop() {
  let [search, setSearch] = useState("");
  var [product, setProduct] = useState([]);
  let [min, setMin] = useState(0);
  let [max, setMax] = useState(1000);
  var [priceFilter] = useState("None");
  var [activeButton, setActiveButton] = useState("allCategory");
  var dispatch = useDispatch();
  var allProducts = useSelector((state) => state.ProductStateData);
  var allMaincategories = useSelector((state) => state.MaincategoryStateData);
  var allSubcategories = useSelector((state) => state.SubcategoryStateData);
  var allBrands = useSelector((state) => state.BrandStateData);
  var { maincat, subcat, brnd } = useParams();

  var [mc, setMc] = useState("All");
  var [sc, setSc] = useState("All");
  var [br, setBr] = useState("All");
  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  let query = useQuery();

  function filterData(mc, sc, br, min, max, priceFilter) {
    let filteredProducts = allProducts;
    if (mc !== "All") {
      filteredProducts = filteredProducts.filter((x) => x.maincategory === mc);
    }
    if (sc !== "All") {
      filteredProducts = filteredProducts.filter((x) => x.subcategory === sc);
    }
    if (br !== "All") {
      filteredProducts = filteredProducts.filter((x) => x.brand === br);
    }
    if (min !== -1 && max !== -1) {
      filteredProducts = filteredProducts.filter(
        (x) => x.finalprice >= min && x.finalprice <= max
      );
    } else if (priceFilter !== "None") {
      if (priceFilter === "first") {
        filteredProducts = filteredProducts.filter(
          (x) => x.finalprice >= 0 && x.finalprice <= 1000
        );
      } else if (priceFilter === "second") {
        filteredProducts = filteredProducts.filter(
          (x) => x.finalprice >= 1001 && x.finalprice <= 2000
        );
      } else if (priceFilter === "third") {
        filteredProducts = filteredProducts.filter(
          (x) => x.finalprice >= 2001 && x.finalprice <= 3000
        );
      } else if (priceFilter === "fourth") {
        filteredProducts = filteredProducts.filter(
          (x) => x.finalprice >= 3001 && x.finalprice <= 4000
        );
      } else if (priceFilter === "fifth") {
        filteredProducts = filteredProducts.filter(
          (x) => x.finalprice >= 4001 && x.finalprice <= 5000
        );
      } else {
        filteredProducts = filteredProducts.filter(
          (x) => x.finalprice >= 5001 && x.finalprice <= 989898000
        );
      }
    }
    if (mc === "All" && sc === "All" && br === "All") {
      setProduct(allProducts);
    } else {
      setProduct(filteredProducts);
    }
  }
  function postSearch(e) {
    e.preventDefault();
    setProduct(
      allProducts.filter((x) => {
        const brand = typeof x.brand === "string" ? x.brand.toLowerCase() : "";
        return (
          x.name.toLowerCase().includes(search) ||
          x.maincategory.toLowerCase() === search ||
          x.subcategory.toLowerCase() === search ||
          brand === search ||
          x.color.toLowerCase() === search ||
          x.size.toLowerCase() === search ||
          x.description.toLowerCase().includes(search)
        );
      })
    );
  }
  function getPriceFilter(e) {
    const { name, value } = e.target;
    if (name === "min") {
      setMin(value);
    } else {
      setMax(value);
    }
  }
  function applyPriceFilter() {
    filterData(mc, sc, br, min, max, priceFilter);
  }

  function getAPIData() {
    if (maincat && maincat !== "All") {
      dispatch(getProductByMaincategory(maincat));
    } else if (subcat && subcat !== "All") {
      dispatch(getProductBySubCategory(subcat));
    } else if (brnd && brnd !== "All") {
      dispatch(getProductByBrand(brnd));
    } else {
      dispatch(getProduct());
    }
    dispatch(getMaincategory());
    dispatch(getSubcategory());
    dispatch(getBrand());
    if (query.get("search")) {
      searchPage();
    } else {
      filterData(maincat, subcat, brnd, min, max, priceFilter);
    }
  }

  function searchPage() {
    var search = query.get("search").toLocaleLowerCase();
    var p = allProducts.filter(x => {
      const brand = typeof x.brand === 'string' ? x.brand.toLowerCase() : '';
      return (
        x.name.toLowerCase().search(search) !== -1 ||
        x.maincategory.toLowerCase() === search ||
        x.subcategory.toLowerCase() === search ||
        brand === search ||
        x.color.toLowerCase() === search ||
        x.size.toLowerCase() === search ||
        x.description.toLowerCase().search(search) !== -1
      );
    });
    setProduct(p);
  }
  

  const handleChange = (_id) => {
    setMc("All");
    setSc("All");
    setBr("All");
    filterData(_id, "All", "All", min, max, priceFilter);
  };
  const handleChangeSub = (_id) => {
    setSc("All");
    setBr("All");
    filterData(mc, _id, "All", min, max, priceFilter);
  };
  const handleChangeBrand = (_id) => {
    setBr(_id);
    setMc("All");
    setSc("All");
    filterData("All", "All", _id, min, max, priceFilter);
  };
  
  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, []);

  const AllCategory = () => (
    <div className="list-group" style={{ height: "24rem", overflow: "auto" }}>
      <button
        className="list-group-item list-group-item-action"
        onClick={() => filterData("All", sc, br)}
      >
        All
      </button>
      {allMaincategories.map((item, index) => {
        return (
          <button
            key={index}
            onClick={() => handleChange(item._id)}
            className="list-group-item list-group-item-action"
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );
  const AllSubCategory = () => (
    <div className="list-group" style={{ height: "24rem", overflow: "auto" }}>
      <button
        className="list-group-item list-group-item-action"
        onClick={() => filterData(mc, "All", br)}
      >
        All
      </button>
      {allSubcategories.map((item, index) => {
        return (
          <button
            key={index}
            onClick={() => handleChangeSub(item._id)}
            className="list-group-item list-group-item-action"
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );

  const AllBrand = () => (
    <div className="list-group" style={{ height: "24rem", overflow: "auto" }}>
      <button
        className="list-group-item list-group-item-action"
        onClick={() => filterData(mc, sc, "All")}
      >
        All
      </button>
      {allBrands.map((item, index) => {
        return (
          <button
            key={index}
            onClick={() => handleChangeBrand(item._id)}
            className="list-group-item list-group-item-action"
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );
  const handleButtonClick = (button) => {
    setActiveButton(button);
  };
  function getSortFilter(e) {
    const { value } = e.target;
    if (value === "1") {
      setProduct([...product].sort((x, y) => y._id - x._id));
    } else if (value === "2") {
      setProduct([...product].sort((x, y) => y.finalprice - x.finalprice));
    } else {
      setProduct([...product].sort((x, y) => x.finalprice - y.finalprice));
    }
  }
  return (

    <div className="page_section">
      <div className="container-fluid my-3">
        <div className="row">
          <div className="col-md-3">
            <button
              onClick={() => handleButtonClick("allCategory")}
              className="list-group-item list-group-item-action active "
            >
              All Categories
            </button>
            {activeButton === "allCategory" ? <AllCategory /> : ""}
            <button
              onClick={() => handleButtonClick("allSubCategory")}
              className="list-group-item list-group-item-action active mt-3 "
            >
              SubCategories
            </button>
            {activeButton === "allSubCategory" ? <AllSubCategory /> : ""}
            <button
              onClick={() => handleButtonClick("allBrand")}
              className="list-group-item list-group-item-action active mt-3"
            >
              Brand
            </button>
            {activeButton === "allBrand" ? <AllBrand /> : ""}
            <h5 className="header-color my-3 text-light p-2">Price Filter</h5>
            <div className="row">
              <div className="col-md-6">
                <label>Min</label>
                <input
                  type="number"
                  name="min"
                  onChange={getPriceFilter}
                  placeholder="Min Amount"
                  className="form-control"
                  value={min}
                />
              </div>
              <div className="col-md-6">
                <label>Max</label>
                <input
                  type="number"
                  name="max"
                  onChange={getPriceFilter}
                  placeholder="Max Amount"
                  className="form-control"
                  value={max}
                />
              </div>
              <div className="my-3">
                <button
                  className="btn main-color w-100"
                  onClick={applyPriceFilter}
                >
                  {" "}
                  Apply{" "}
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="row">
              <div className="col-md-9">
                <form onSubmit={postSearch}>
                  <div className="mb-3 btn-group w-100">
                    <input
                      type="search"
                      name="search"
                      onChange={(e) => setSearch(e.target.value.toLowerCase())}
                      placeholder="Enter Product Name,Brand,Category,Size,Color to Search"
                      className="form-control"
                    />
                    <button type="submit" className="btn main-color">
                      Search
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-md-3 mb-3">
                <select
                  name="sortFilter"
                  onChange={getSortFilter}
                  className="form-control"
                >
                  <option value="1">Latest</option>
                  <option value="2">Price: High to Low</option>
                  <option value="3">Price: Low to High</option>
                </select>
              </div>
            </div>
            <div className="row">
              {product.length === 0 ? (
                <div className="col-md-12 text-center">
                  <h5 className="text-danger text-center mt- 70">
                    No related products found
                  </h5>
                </div>
              ) : (
                product.map((item, index) => (
                  <div key={index} className="col-lg-3 col-md-4 col-sm-6 pb-1">
                    <div className="product-item bg-light mb-2">
                      <div className="product-img position-relative overflow-hidden">
                        <Link to={`/single-product/${item._id}`}>
                          <img
                            className="img-fluid w-100"
                            src={`${apiLink}/public/products/${item.pic1}`}
                            style={{ height: "200px", width: "100%" }}
                            alt=""
                          />
                        </Link>
                      </div>
                      <div className="text-center py-4">
                        <Link
                          className="h6 text-decoration-none text-truncate"
                          to={`/single-product/${item._id}`}
                        >
                          {item.name.length > 28
                            ? `${item.name.slice(0, 28)}..`
                            : `${item.name}`}
                        </Link>
                        <div className="d-flex align-items-center justify-content-center mt-2">
                          <h5>&#8377;{item.finalprice}</h5>
                          <h6 className="text-muted ml-2">
                            <del className="text-danger">
                              &#8377;{item.baseprice}
                            </del>
                            <sup className="text-success">
                              {item.discount}% OFF
                            </sup>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
