import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
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
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={10}
        navigation
        loop
        autoplay={{ delay: 3000 }}
        breakpoints={{
          450: { slidesPerView: 2 },
          576: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          992: { slidesPerView: 5 },
          1200: { slidesPerView: 6 },
        }}
        slidesPerView={1}
      >
        {trendingProducts.map((item) => (
          <SwiperSlide key={item._id}>
            <Link
              to={`/single-product/${item._id}`}
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
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
    </>
  );
};

export default TrendingProductsCarousel;
