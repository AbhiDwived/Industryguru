import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getProduct } from "../Store/ActionCreators/ProductActionCreators";
import Hotsell from "./Hotsell";
import Client from "./Client";
import TrendingProductsCarousel from "./Trending";
import ClientSidebar from "./ClientSidebar";
import Carousel from "../assets/img/Carousel.png";
import Carousel1 from "../assets/img/Carousel1.png";
import Carousel2 from "../assets/img/Carousel2.png";
import { apiLink } from "../utils/utils";

export default function Home() {
  var [products, setProducts] = useState([]);
  var allproducts = useSelector((state) => state.ProductStateData);
  var dispatch = useDispatch();
  function getAPIData() {
    dispatch(getProduct());
  }
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

  const sortedProducts = products.sort((a, b) => {
    const aPrice = getDisplayPrice(a);
    const bPrice = getDisplayPrice(b);
    return bPrice.discount - aPrice.discount;
  });
  
  const getTrendingProducts = () => {
    return allproducts
      .filter((product) => {
        const displayPrice = getDisplayPrice(product);
        return displayPrice.discount > 0;
      })
      .sort((a, b) => {
        const aPrice = getDisplayPrice(a);
        const bPrice = getDisplayPrice(b);
        return bPrice.discount - aPrice.discount;
      })
      .slice(0, 6);
  };
  const trendingProducts = getTrendingProducts();
  useEffect(() => {
    getAPIData();
    if (allproducts.length) {
      setProducts(allproducts.slice(0, 6));
    }
    // eslint-disable-next-line
  }, [allproducts.length]);
  return (
    <div className="page_section">
      <div className="container-fluid mb-3">
        <div className="row">
          <div className="col-lg-3 col-md-4">
            <ClientSidebar />
          </div>
          <div className="col-lg-9 col-md-8">
            <div
              id="carouselExampleRide"
              className="carousel slide carousel-fade"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner pl-2">
                <div className="carousel-item active" data-bs-interval="2000">
                  <img src={Carousel} className="d-block w-100  " alt="..." />
                </div>
                <div className="carousel-item" data-bs-interval="2000">
                  <img src={Carousel1} className="d-block w-100 " alt="..." />
                </div>
                <div className="carousel-item" data-bs-interval="2000">
                  <img src={Carousel2} className="d-block w-100 " alt="..." />
                </div>
                <div className="carousel-item" data-bs-interval="2000">
                  <img src={Carousel} className="d-block w-100 " alt="..." />
                </div>
                <div className="carousel-item" data-bs-interval="2000">
                  <img src={Carousel1} className="d-block w-100 " alt="..." />
                </div>
                <div className="carousel-item" data-bs-interval="2000">
                  <img src={Carousel2} className="d-block w-100 " alt="..." />
                </div>
                <div className="carousel-item" data-bs-interval="2000">
                  <img src={Carousel1} className="d-block w-100 " alt="..." />
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleRide"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleRide"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Hotsell />

      <TrendingProductsCarousel />

      <div className="col-lg-12">
        <img
          src="/assets/img/newArrival.png"
          className="img-fluid"
        />
      </div>

      <div className="container-fluid pt-2 mt-2">
        <div className="row">
          <div className="col-lg-9">
            <div className="row">
              {products.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="col-lg-3 col-md-4 product-div col-sm-6 pb-1"
                  >
                    <div className="product-item bg-light mb-2">
                      <div className="product-img position-relative overflow-hidden">
                        <Link to={`/single-product/${item._id}`} href="">
                          <img
                            className="img-fluid w-100"
                            src={`${apiLink}/public/products/${item.pic1}`}
                            style={{ height: "150px", objectFit: "cover" }}
                            width="150"
                            height="150"
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                          />
                        </Link>
                      </div>
                      <div className="text-center py-4">
                        <Link
                          className="h6 text-decoration-none text-truncate"
                          to={`/single-product/${item._id}`}
                        >
                          {item.name.length > 24
                            ? `${item.name.slice(0, 24)}..`
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
                                  </del>{" "}
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
                );
              })}
            </div>
          </div>
          <div className="col-lg-3">
            <div className="right-bar">
              <img
                src="/assets/img/clientside.png"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
      {/* discounted product */}
      <div className="container-fluid ">
        <h2 className="section-title text-center position-relative text-uppercase mx-xl-5 mb-4 mt-sm-4 mt-md-4 mt-lg-1 featuredMargin">
          <span className="bg-secondary pr-3">Discounted Products</span>
        </h2>
        <div className="row">
          {sortedProducts.map((item, index) => (
            <div
              key={index}
              className="col-lg-2 product-div  col-md-4 col-sm-6  pb-1"
            >
              <div className="product-item  mb-4 bg-white overflow-hide">
                <div className="product-img position-relative overflow-hidden">
                  <Link to={`/single-product/${item._id}`} href="">
                    <img
                      className="img-fluid w-100"
                      src={`${apiLink}/public/products/${item.pic1}`}
                      style={{ height: "150px", objectFit: "cover" }}
                      width="150"
                      height="150"
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>
                </div>
                <div className="text-center py-4">
                  <Link
                    className="h6 text-s text-decoration-none text-truncate"
                    to={`/single-product/${item._id}`}
                  >
                    {item.name.length > 25
                      ? `${item.name.slice(0, 25)}..`
                      : `${item.name}`}
                  </Link>
                  <div className="d-flex align-items-center justify-content-center mt-2 text-s">
                    {(() => {
                      const displayPrice = getDisplayPrice(item);
                      return (
                        <>
                          <h6>&#8377;{displayPrice.finalprice}</h6>
                          <h6 className="text-muted ml-2 text-s">
                            <del className="text-danger">&#8377;{displayPrice.baseprice}</del>{" "}
                            <sup className="text-success">{displayPrice.discount}% Off</sup>
                          </h6>
                        </>
                      );
                    })()} 
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* discounted product end */}

      {/* Display Trending Products */}
      <div className="row">
        <div className="col-12 pb-1">
          <h2 className="section-title text-center position-relative text-uppercase mx-xl-5 mb-4 featuredMargin">
            <span className="bg-secondary pr-3">Trending Products</span>
          </h2>
          <div className="row ">
            {trendingProducts.map((item, index) => (
              <div
                key={index}
                className="col-lg-2 col-md-4 col-sm-6 product-div pb-1"
              >
                {/* Render trending product information here */}
                <div className="product-item bg-light mb-4 overflow-hide">
                  <div className="product-img position-relative overflow-hidden">
                    <Link to={`/single-product/${item._id}`}>
                      <img
                        className="img-fluid w-100"
                        src={`${apiLink}/public/products/${item.pic1}`}
                        style={{ height: "150px", objectFit: "cover" }}
                        width="150"
                        height="150"
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                      />
                    </Link>
                  </div>
                  <div className="text-center py-4">
                    <Link
                      className="h6 text-decoration-none text-truncate"
                      to={`/single-product/${item._id}`}
                    >
                      {item.name.length > 25
                        ? `${item.name.slice(0, 25)}..`
                        : `${item.name}`}
                    </Link>
                    <div className="d-flex align-items-center justify-content-center mt-2 text-s">
                      {(() => {
                        const displayPrice = getDisplayPrice(item);
                        return (
                          <>
                            <h6>&#8377;{displayPrice.finalprice}</h6>
                            <h6 className="text-muted ml-2 text-s">
                              <del className="text-danger">
                                &#8377;{displayPrice.baseprice}
                              </del>{" "}
                              <sup className="text-success">{displayPrice.discount}% OFF</sup>
                            </h6>
                          </>
                        );
                      })()} 
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-fluid pt-5 pb-3">
        <div className="row">
          <div className="col-md-6">
            <div className="product-offer mb-30" style={{ height: "300px" }}>
              <img className="img-fluid" src="/assets/img/home4.jpg" alt="" />
              <div className="offer-text">
                <h6 className="text-white text-uppercase">Save Upto 50%</h6>
                <h3 className="text-white mb-3">Special Offer</h3>
                <Link to="/shop/All/All/All" className="btn main-color">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="product-offer mb-30" style={{ height: "300px" }}>
              <img className="img-fluid" src="/assets/img/Driver.webp" alt="" />
              <div className="offer-text">
                <h6 className="text-white text-uppercase">Save Upto 90%</h6>
                <h3 className="text-white mb-3">Big Sale</h3>
                <Link to="/shop/All/All/All" className="btn main-color">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid pt-5">
          <div className="row pb-3">
            <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
              <div
                className="d-flex align-items-center bg-light mb-4"
                style={{ padding: "30px" }}
              >
                <h1 className="fa fa-check text-primary m-0 mr-3">Quality Product</h1>
                <h5 className="font-weight-semi-bold m-0">Quality Product</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
              <div
                className="d-flex align-items-center bg-light mb-4"
                style={{ padding: "30px" }}
              >
                <h1 className="fa fa-shipping-fast text-primary m-0 mr-2">Free Shipping</h1>
                <h5 className="font-weight-semi-bold m-0">Free Shipping</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
              <div
                className="d-flex align-items-center bg-light mb-4"
                style={{ padding: "30px" }}
              >
                <h1 className="fas fa-exchange-alt text-primary m-0 mr-3">14-Day Return</h1>
                <h5 className="font-weight-semi-bold m-0">14-Day Return</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
              <div
                className="d-flex align-items-center bg-light mb-4"
                style={{ padding: "30px" }}
              >
                <h1 className="fa fa-phone-volume text-primary m-0 mr-3">24/7 Support</h1>
                <h5 className="font-weight-semi-bold m-0">24/7 Support</h5>
              </div>
            </div>
          </div>
        </div>
        <Client />
      </div>
    </div>
  );
}
