import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
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
  let [min, setMin] = useState("");
  let [max, setMax] = useState("");
  var [priceFilter] = useState("None");
  var [activeButton, setActiveButton] = useState("allCategory");
  var dispatch = useDispatch();

  // Helper function to get display price for products with variants
  const getDisplayPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      return {
        finalprice: firstVariant.finalprice,
        baseprice: firstVariant.baseprice,
        discount: firstVariant.discount
      };
    }
    return {
      finalprice: product.finalprice,
      baseprice: product.baseprice,
      discount: product.discount
    };
  };
  var allProducts = useSelector((state) => state.ProductStateData);
  var allMaincategories = useSelector((state) => state.MaincategoryStateData);
  var allSubcategories = useSelector((state) => state.SubcategoryStateData);
  var allBrands = useSelector((state) => state.BrandStateData);
  var { maincat, subcat, brnd } = useParams();

  var [mc, setMc] = useState(maincat || "All");
  var [sc, setSc] = useState(subcat || "All");
  var [br, setBr] = useState(brnd || "All");

  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }

  let query = useQuery();

  function filterData(mc, sc, br, min, max, priceFilter) {
    let filteredProducts = [...allProducts];
    
    // Main category filter
    if (mc !== "All" && mc !== "all") {
      filteredProducts = filteredProducts.filter((x) => {
        return x.maincategory === mc || x.maincategory?._id === mc;
      });
    }
    
    // Subcategory filter
    if (sc !== "All" && sc !== "all") {
      filteredProducts = filteredProducts.filter((x) => {
        return x.subcategory === sc || x.subcategory?._id === sc;
      });
    }
    
    // Brand filter
    if (br !== "All" && br !== "all") {
      filteredProducts = filteredProducts.filter((x) => {
        return x.brand === br || x.brand?._id === br;
      });
    }
    
    // Price filter
    const minPrice = min ? Number(min) : 0;
    const maxPrice = max ? Number(max) : Infinity;
    if (min !== "" || max !== "") {
      filteredProducts = filteredProducts.filter((x) => {
        const displayPrice = getDisplayPrice(x);
        const price = Number(displayPrice.finalprice);
        return price >= minPrice && price <= maxPrice;
      });
    }
    
    setProduct(filteredProducts);
  }

  function postSearch(e) {
    e.preventDefault();
    if (!search.trim()) return;
    
    setProduct(
      allProducts.filter((x) => {
        const brandName = allBrands.find(b => b._id === x.brand)?.name?.toLowerCase() || "";
        const subcategoryName = allSubcategories.find(s => s._id === x.subcategory)?.name?.toLowerCase() || "";
        const maincategoryName = allMaincategories.find(m => m._id === x.maincategory)?.name?.toLowerCase() || "";
        
        return (
          x.name?.toLowerCase().includes(search) ||
          brandName.includes(search) ||
          subcategoryName.includes(search) ||
          maincategoryName.includes(search) ||
          x.color?.toLowerCase().includes(search) ||
          x.size?.toLowerCase().includes(search) ||
          x.description?.toLowerCase().includes(search)
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
    dispatch(getProduct());
    dispatch(getMaincategory());
    dispatch(getSubcategory());
    dispatch(getBrand());
    if (query.get("search")) {
      searchPage();
    } else {
      setMc(maincat || "All");
      setSc(subcat || "All");
      setBr(brnd || "All");
    }
  }

  function searchPage() {
    var search = query.get("search")?.toLowerCase() || "";
    if (!search) return;
    
    var p = allProducts.filter(x => {
      const brandName = allBrands.find(b => b._id === x.brand)?.name?.toLowerCase() || "";
      const subcategoryName = allSubcategories.find(s => s._id === x.subcategory)?.name?.toLowerCase() || "";
      const maincategoryName = allMaincategories.find(m => m._id === x.maincategory)?.name?.toLowerCase() || "";
      
      return (
        x.name?.toLowerCase().includes(search) ||
        brandName.includes(search) ||
        subcategoryName.includes(search) ||
        maincategoryName.includes(search) ||
        x.color?.toLowerCase().includes(search) ||
        x.size?.toLowerCase().includes(search) ||
        x.description?.toLowerCase().includes(search)
      );
    });
    setProduct(p);
  }
  
  const handleChange = (_id) => {
    setMc(_id);
    setSc("All");
    setBr("All");
    filterData(_id, "All", "All", min, max, priceFilter);
  };

  const handleChangeSub = (_id) => {
    setSc(_id);
    setBr("All");
    filterData(mc, _id, "All", min, max, priceFilter);
  };

  const handleChangeBrand = (_id) => {
    setBr(_id);
    filterData(mc, sc, _id, min, max, priceFilter);
  };
  
  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (allProducts.length > 0 && !query.get("search")) {
      filterData(mc, sc, br, min, max, priceFilter);
    }
    // eslint-disable-next-line
  }, [allProducts, mc, sc, br]);

  useEffect(() => {
    if (query.get("search") && allProducts.length > 0 && allBrands.length > 0 && allSubcategories.length > 0 && allMaincategories.length > 0) {
      searchPage();
    }
  }, [query.get("search"), allProducts, allBrands, allSubcategories, allMaincategories]);

  useEffect(() => {
    setMc(maincat || "All");
    setSc(subcat || "All");
    setBr(brnd || "All");
  }, [maincat, subcat, brnd]);

  const AllCategory = () => (
    <div className="list-group" style={{ height: "24rem", overflow: "auto" }}>
      <button
        className={`list-group-item list-group-item-action ${mc === "All" ? "active" : ""}`}
        onClick={() => {
          setMc("All");
          filterData("All", sc, br, min, max, priceFilter);
        }}
      >
        All
      </button>
      {allMaincategories.map((item, index) => {
        return (
          <button
            key={index}
            onClick={() => handleChange(item._id)}
            className={`list-group-item list-group-item-action ${mc === item._id ? "active" : ""}`}
          >
            {item.name}
          </button>
        );
      })}
    </div>
  );

  const AllSubCategory = () => {
    const filteredSubcategories = mc !== "All" 
      ? allSubcategories.filter(sub => sub.maincategory === mc)
      : allSubcategories;
    
    return (
      <div className="list-group" style={{ height: "24rem", overflow: "auto" }}>
        <button
          className={`list-group-item list-group-item-action ${sc === "All" ? "active" : ""}`}
          onClick={() => {
            setSc("All");
            filterData(mc, "All", br, min, max, priceFilter);
          }}
        >
          All
        </button>
        {filteredSubcategories.map((item, index) => {
          return (
            <button
              key={index}
              onClick={() => handleChangeSub(item._id)}
              className={`list-group-item list-group-item-action ${sc === item._id ? "active" : ""}`}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    );
  };

  const AllBrand = () => {
    const filteredBrands = sc !== "All" 
      ? allBrands.filter(brand => brand.subcategory === sc)
      : allBrands;
    
    return (
      <div className="list-group" style={{ height: "24rem", overflow: "auto" }}>
        <button
          className={`list-group-item list-group-item-action ${br === "All" ? "active" : ""}`}
          onClick={() => {
            setBr("All");
            filterData(mc, sc, "All", min, max, priceFilter);
          }}
        >
          All
        </button>
        {filteredBrands.map((item, index) => {
          return (
            <button
              key={index}
              onClick={() => handleChangeBrand(item._id)}
              className={`list-group-item list-group-item-action ${br === item._id ? "active" : ""}`}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    );
  };

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
                            src={`${apiLink}/products/${item.pic1}`}
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
                          {(() => {
                            const displayPrice = getDisplayPrice(item);
                            return (
                              <>
                                <h5>&#8377;{displayPrice.finalprice}</h5>
                                <h6 className="text-muted ml-2">
                                  <del className="text-danger">
                                    &#8377;{displayPrice.baseprice}
                                  </del>
                                  <sup className="text-success">
                                    {displayPrice.discount}% OFF
                                  </sup>
                                </h6>
                              </>
                            );
                          })()}  
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
