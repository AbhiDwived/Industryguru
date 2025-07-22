import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { getProduct } from "../Store/ActionCreators/ProductActionCreators";
import { Link } from "react-router-dom";
import { apiLink } from "../utils/utils";

const TrendingProductsCarousel = () => {
  const [products, setProducts] = useState([]);
  const allproducts = useSelector((state) => state.ProductStateData);
  const dispatch = useDispatch();

  const getTrendingProducts = () => {
    return allproducts
      .filter((product) => product.discount > 0)
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 12);
  };

  const trendingProducts = getTrendingProducts();

  useEffect(() => {
    dispatch(getProduct());
    // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    if (allproducts.length) {
      setProducts(allproducts.slice(0, 12));
    }
    // eslint-disable-next-line
  }, [allproducts]);

  return (
    <>
    <div className="trending-carousel-container container-fluid pt-3 pb-3">
      <h2 className="section-title text-center position-relative text-uppercase featuredMargin">
        <span className="bg-secondary pr-3">Today's Hot Deals</span>
      </h2>
      <OwlCarousel
        className="product-item bg-light"
        loop
        margin={10}
        nav
        dots={false}
        items={1}
        autoplay
        autoplayTimeout={3000}
        navText={false}
        responsive={{
          450: { items: 2 },
          576: { items: 3 },
          768: { items: 4 },
          992: { items: 5 },
          1200: { items: 6 },
        }}
      >
        {trendingProducts.map((item) => (
          <Link
            to={`/single-product/${item._id}`}
            key={item._id}
            className="Slider-card"
          >
            <img
              className="w-100"
              src={`${apiLink}/public/products/${item.pic1}`}
              alt={item.name}
              style={{ height: "150px" }}
            />
            <div className="mt-2 text-center">
              <h6>
                {/* {item.name.length > 24
                  ? `${item.name.slice(0, 26)}... `
                  : `item.name`} */}
                  {item.name}
              </h6>
              <div>
                <h5>&#8377;{item.finalprice}</h5>
                <h6 className="text-muted">
                  <del className="text-danger">&#8377;{item.baseprice}</del>{" "}
                  <sup className="text-success">{item.discount}% Off</sup>
                </h6>
              </div>
            </div>
          </Link>
        ))}
      </OwlCarousel>
    </div>
    </>
  );
};

export default TrendingProductsCarousel;
