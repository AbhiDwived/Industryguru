import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../Store/ActionCreators/ProductActionCreators";
import { addCart, getCart } from "../Store/ActionCreators/CartActionCreators";
import { addWishlist, getWishlist } from "../Store/ActionCreators/WishlistActionCreators";
import { apiLink } from "../utils/utils";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { showToast } from "../utils/toast";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const allCarts = useSelector((state) => state.CartStateData);
  const allWishlists = useSelector((state) => state.WishlistStateData);

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

  const renderStars = (rating) => {
    const stars = [];
    const rate = rating || 4;
    for (let i = 1; i <= 5; i++) {
      if (i <= rate) {
        stars.push(<FaStar key={i} />);
      } else if (i - 0.5 <= rate) {
        stars.push(<FaStarHalfAlt key={i} />);
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return stars;
  };

  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const displayPrice = getDisplayPrice(product);
    const variant = product.variants && product.variants.length > 0 ? product.variants[0] : product;
    
    var existingItem = allCarts.find(
      (x) =>
        x.userid === localStorage.getItem("userid") &&
        x.productid === product._id &&
        x.color === variant.color &&
        x.size === variant.size
    );
    
    if (existingItem) {
      showToast.info("Item already in cart!");
    } else {
      var cartItem = {
        userid: localStorage.getItem("userid"),
        productid: product._id,
        name: product.name,
        color: variant.color,
        size: variant.size,
        brand: product.brand,
        price: displayPrice.finalprice,
        qty: 1,
        total: displayPrice.finalprice,
        pic: product.pic1,
        review: product.review,
        rating: product.rating
      };
      dispatch(addCart(cartItem));
      dispatch(getCart());
      showToast.success("Added to cart!");
    }
  };

  const addToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const displayPrice = getDisplayPrice(product);
    const variant = product.variants && product.variants.length > 0 ? product.variants[0] : product;
    
    var existingItem = allWishlists.find(
      (x) => x.userid === localStorage.getItem("userid") && x.productid === product._id
    );
    
    if (existingItem) {
      showToast.info("Item already in wishlist!");
    } else {
      var wishlistItem = {
        userid: localStorage.getItem("userid"),
        productid: product._id,
        name: product.name,
        color: variant.color,
        size: variant.size,
        brand: product.brand,
        price: displayPrice.finalprice,
        pic: product.pic1,
        review: product.review,
        rating: product.rating
      };
      dispatch(addWishlist(wishlistItem));
      dispatch(getWishlist());
      showToast.success("Added to wishlist!");
    }
  };

  return (
    <Card>
      <Link to={`/single-product/${product._id}`}>
        <ImageContainer>
          <ProductImage src={`${apiLink}/public/products/${product.pic1}`} alt={product.name} />
          <ActionButtons>
            <ActionButton onClick={addToCart}>
              <FaShoppingCart />
            </ActionButton>
            <ActionButton onClick={addToWishlist}>
              <FaHeart />
            </ActionButton>
          </ActionButtons>
        </ImageContainer>
        <CardContent>
          <ProductTitle>{product.name}</ProductTitle>
          <RatingContainer>
            <Stars>{renderStars(product.rating)}</Stars>
            <RatingCount>({product.rating || 4})</RatingCount>
          </RatingContainer>
          <PriceContainer>
            {(() => {
              const displayPrice = getDisplayPrice(product);
              return (
                <>
                  <CurrentPrice>₹{displayPrice.finalprice}</CurrentPrice>
                  <OriginalPrice>₹{displayPrice.baseprice}</OriginalPrice>
                  <Discount>({displayPrice.discount}% off)</Discount>
                </>
              );
            })()}
          </PriceContainer>
          <DeliveryInfo>FREE delivery</DeliveryInfo>
        </CardContent>
      </Link>
    </Card>
  );
};

function Hotsell() {
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.ProductStateData);
  const [hotProducts, setHotProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const getHotProducts = () => {
    return allProducts
      .filter((product) => {
        const displayPrice = getDisplayPrice(product);
        return displayPrice.discount > 0;
      })
      .sort((a, b) => {
        const aPrice = getDisplayPrice(a);
        const bPrice = getDisplayPrice(b);
        return bPrice.discount - aPrice.discount;
      })
      .slice(0, 18);
  };

  useEffect(() => {
    dispatch(getProduct());
    dispatch(getCart());
    dispatch(getWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (allProducts.length) {
      setHotProducts(getHotProducts());
    }
  }, [allProducts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex >= hotProducts.length - 6 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [hotProducts.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= hotProducts.length - 6 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex <= 0 ? hotProducts.length - 6 : prevIndex - 1
    );
  };

  return (
    <Container>
      <div className="trending-carousel-container container-fluid pt-3 pb-3">
      <h2 className="section-title text-center position-relative text-uppercase featuredMargin">
        <span className="bg-secondary pr-3">Hot Selling Products</span>
      </h2>
      </div>
      {/* <SectionTitle></SectionTitle> */}
      <SliderContainer>
        <NavButton onClick={prevSlide} position="left">
          <FaChevronLeft />
        </NavButton>
        <SliderWrapper>
          <SliderTrack currentIndex={currentIndex}>
            {hotProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </SliderTrack>
        </SliderWrapper>
        <NavButton onClick={nextSlide} position="right">
          <FaChevronRight />
        </NavButton>
      </SliderContainer>
    </Container>
  );
}

export default Hotsell;

// Slider styled components
const Container = styled.div`
  width: 100%;
  padding: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #0F1111;
  margin-bottom: 20px;
`;

const SliderContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SliderWrapper = styled.div`
  overflow: hidden;
  width: 100%;
`;

const SliderTrack = styled.div`
  display: flex;
  transition: transform 0.5s ease;
  transform: translateX(-${props => props.currentIndex * (100/6)}%);
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.position}: 10px;
  background: rgba(255,255,255,0.9);
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: all 0.2s ease;
  
  &:hover {
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
`;

const Card = styled.div`
  background: white;
  border: 1px solid #DDD;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
  min-width: calc(100% / 6 - 16px);
  margin-right: 16px;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
  
  @media (max-width: 768px) {
    min-width: calc(100% / 2 - 16px);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  padding: 3px;
  position: relative;
  
  &:hover .action-buttons {
    opacity: 1;
  }
`;

const ActionButtons = styled.div.attrs({ className: 'action-buttons' })`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const ActionButton = styled.button`
  background: white;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #007185;
    color: white;
    border-color: #007185;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const CardContent = styled.div`
  padding: 12px;
`;

const ProductTitle = styled.h3`
  font-size: 14px;
  font-weight: 400;
  color: #0F1111;
  margin: 0 0 8px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const Stars = styled.div`
  display: flex;
  color: #FF9900;
  font-size: 12px;
  margin-right: 6px;
`;

const RatingCount = styled.span`
  font-size: 12px;
  color: #007185;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 4px;
`;

const CurrentPrice = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #B12704;
  margin-right: 8px;
`;

const OriginalPrice = styled.span`
  font-size: 12px;
  color: #565959;
  text-decoration: line-through;
  margin-right: 4px;
`;

const Discount = styled.span`
  font-size: 12px;
  color: #CC0C39;
  font-weight: 400;
`;

const DeliveryInfo = styled.div`
  font-size: 12px;
  color: #007185;
  font-weight: 700;
`;
