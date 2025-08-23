import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../Store/ActionCreators/ProductActionCreators";
import { getCart, addCart } from "../Store/ActionCreators/CartActionCreators";
import { getWishlist, addWishlist } from "../Store/ActionCreators/WishlistActionCreators";
import { getSlug } from "../Store/ActionCreators/SlugActionCreators";
import { getSubSlugByParent } from "../Store/ActionCreators/SubSlugActionCreators";
import { apiLink } from "../utils/utils";
import Comment from "./Comment";
import './SingleProduct.css';
import { showToast } from "../utils/toast";

const SingleProduct = () => {
  const { _id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [selectedSubSlug, setSelectedSubSlug] = useState('');
  const [selectedInnerSlug, setSelectedInnerSlug] = useState('');
  const [selectedInnerSubSlug, setSelectedInnerSubSlug] = useState('');
  const [isLoadingVariant, setIsLoadingVariant] = useState(false);
  const [qty, setQty] = useState(1);
  const [showDescription, setShowDescription] = useState(true);

  // State for dropdown visibility
  const [showInnerSlugDropdown, setShowInnerSlugDropdown] = useState(false);
  const [showInnerSubSlugDropdown, setShowInnerSubSlugDropdown] = useState(false);

  // Derived state for dropdowns
  const [innerSlugs, setInnerSlugs] = useState([]);
  const [innerSubSlugs, setInnerSubSlugs] = useState([]);

  // State for selected variant
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Redux state
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.ProductStateData);
  const allCarts = useSelector((state) => state.CartStateData);
  const allWishlists = useSelector((state) => state.WishlistStateData);
  const allSlugs = useSelector((state) => state.SlugStateData);
  const allSubSlugs = useSelector((state) => state.SubSlugStateData);

  // Function to get available inner slugs and sub slugs from variants
  const getAvailableOptions = (variants) => {
    const innerSlugOptions = [...new Set(variants.map(v => v.innerSlug).filter(Boolean))];
    const innerSubSlugOptions = [...new Set(variants.map(v => v.innerSubSlug).filter(Boolean))];
    
    return {
      innerSlugs: innerSlugOptions,
      innerSubSlugs: innerSubSlugOptions
    };
  };

  useEffect(() => {
    // Load initial data
    dispatch(getProduct());
    dispatch(getCart());
    dispatch(getWishlist());
    dispatch(getSlug());
  }, [dispatch]);

  useEffect(() => {
    if (allProducts.length && _id) {
      const foundProduct = allProducts.find(p => p._id === _id);
      
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Check if product has variants
        if (foundProduct.variants && foundProduct.variants.length > 0) {
          console.log('Product has variants:', foundProduct.variants);
          
          // Get available options from variants
          const options = getAvailableOptions(foundProduct.variants);
          console.log('Available options:', options);
          
          if (options.innerSlugs.length > 0) {
            setInnerSlugs(options.innerSlugs);
            setSelectedInnerSlug(options.innerSlugs[0]);
          }

          if (options.innerSubSlugs.length > 0) {
            setInnerSubSlugs(options.innerSubSlugs);
            setSelectedInnerSubSlug(options.innerSubSlugs[0]);
            }
          
          // Set first variant as selected
          setSelectedVariant(foundProduct.variants[0]);
        } else {
          // No variants, use the product itself
          setSelectedVariant(foundProduct);
        }
      }
    }
  }, [allProducts, _id]);

  // Update innerSubSlugs when inner slug changes
  useEffect(() => {
    if (product && product.variants && selectedInnerSlug) {
      const filteredVariants = product.variants.filter(v => v.innerSlug === selectedInnerSlug);
      
      if (filteredVariants.length > 0) {
        const subSlugs = [...new Set(filteredVariants.map(v => v.innerSubSlug).filter(Boolean))];
        setInnerSubSlugs(subSlugs);
        
        // If the current selectedInnerSubSlug is not in the new subSlugs, reset to first
        if (!subSlugs.includes(selectedInnerSubSlug)) {
          setSelectedInnerSubSlug(subSlugs[0]);
              }
            }
          }
  }, [product, selectedInnerSlug]);

  // Update selected variant when inner slug or inner sub slug changes
  useEffect(() => {
    if (product && product.variants && selectedInnerSlug && selectedInnerSubSlug) {
      const matchingVariant = product.variants.find(v => 
        v.innerSlug === selectedInnerSlug && v.innerSubSlug === selectedInnerSubSlug
      );
      
      console.log('Looking for variant:', { selectedInnerSlug, selectedInnerSubSlug });
      console.log('Available variants:', product.variants);
      console.log('Matching variant:', matchingVariant);
      
      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
        console.log('Selected variant details:', {
          description: matchingVariant.description,
          specifications: matchingVariant.specification,
          price: matchingVariant.finalprice,
          stock: matchingVariant.stock
        });
      } else {
        setSelectedVariant(null);
        console.log('No matching variant found');
      }
    }
  }, [product, selectedInnerSlug, selectedInnerSubSlug]);

  // Handlers for slug and sub-slug interactions
  const handleInnerSlugChange = (innerSlug) => {
    setIsLoadingVariant(true);
    setSelectedInnerSlug(innerSlug);
    setShowInnerSlugDropdown(false);

    // Reset inner sub slug to first available for this inner slug
    if (product && product.variants) {
      const filteredVariants = product.variants.filter(v => v.innerSlug === innerSlug);
      
      if (filteredVariants.length > 0) {
        const availableInnerSubSlugs = [...new Set(filteredVariants.map(v => v.innerSubSlug).filter(Boolean))];
        if (availableInnerSubSlugs.length) {
          setSelectedInnerSubSlug(availableInnerSubSlugs[0]);
    }
      }
    }

    setTimeout(() => setIsLoadingVariant(false), 300);
  };

  const handleInnerSubSlugChange = (innerSubSlug) => {
    setIsLoadingVariant(true);
    setSelectedInnerSubSlug(innerSubSlug);
    setShowInnerSubSlugDropdown(false);

    setTimeout(() => setIsLoadingVariant(false), 300);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.slug-dropdown-container')) {
        setShowInnerSlugDropdown(false);
        setShowInnerSubSlugDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cart and Wishlist functions
  const addToCart = () => {
    if (!selectedVariant) return;
        
    // Check for duplicate by productid, color, and size
    var item = allCarts.find(
      (x) =>
        x.userid === localStorage.getItem("userid") &&
        x.productid === product._id &&
        x.color === selectedVariant.color &&
        x.size === selectedVariant.size
    );
    if (item) {
      showToast.info("Item already in cart!");
    } else {
      var cartItem = {
        userid: localStorage.getItem("userid"),
        productid: product._id,
        name: product.name,
        color: selectedVariant.color,
        size: selectedVariant.size,
        innerSlug: selectedVariant.innerSlug, // include variant slug
        innerSubSlug: selectedVariant.innerSubSlug, // include variant subslug
        brand: product.brand,
        price: selectedVariant.finalprice, // use variant price
        qty: qty,
        total: selectedVariant.finalprice * qty, // use variant price
        pic: product.pic1,
        review: product.review,
        rating: product.rating
      };
      dispatch(addCart(cartItem));
      dispatch(getCart()); // Refresh cart data
      showToast.success("Item added to cart!");
    }
  };

  const addToWishlist = () => {
    if (!selectedVariant) return;

    var item = allWishlists.find(
      (x) => x.userid === localStorage.getItem("userid") && x.productid === product._id
    );
    if (item) {
      showToast.info("Item already in wishlist!");
    } else {
      var wishlistItem = {
        userid: localStorage.getItem("userid"),
        productid: product._id,
        name: product.name,
        color: selectedVariant.color,
        size: selectedVariant.size,
        brand: product.brand,
        price: selectedVariant.finalprice, // use variant price
        pic: product.pic1,
        review: product.review,
        rating: product.rating
        // Do NOT include selectedVariant here
      };
      dispatch(addWishlist(wishlistItem));
      dispatch(getWishlist()); // Refresh wishlist data
      showToast.success("Item added to wishlist!");
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="page_section">
      <div className="container-fluid pb-5">
        <div className="row ">
          <div className="col-lg-5 mb-30">
            {isLoadingVariant && (
              <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center" 
                   style={{ backgroundColor: 'rgba(255,255,255,0.8)', zIndex: 10 }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            <div id="carouselExampleIndicators" className="carousel slide">
              <div className="carousel-indicators">
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="0"
                  className="active"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="2"
                  aria-label="Slide 3"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="3"
                  aria-label="Slide 4"
                ></button>
              </div>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src={`${apiLink}/public/products/${product.pic1}`}
                    className="d-block w-100"
                    alt="Product Image 1"
                  />
                </div>
                {product.pic2 && (
                <div className="carousel-item">
                  <img
                      src={`${apiLink}/public/products/${product.pic2}`}
                    className="d-block w-100"
                      alt="Product Image 2"
                  />
                </div>
                )}
                {product.pic3 && (
                <div className="carousel-item">
                  <img
                      src={`${apiLink}/public/products/${product.pic3}`}
                    className="d-block w-100"
                      alt="Product Image 3"
                  />
                </div>
                )}
                {product.pic4 && (
                <div className="carousel-item">
                  <img
                      src={`${apiLink}/public/products/${product.pic4}`}
                    className="d-block w-100"
                      alt="Product Image 4"
                  />
                </div>
                )}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleIndicators"
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
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
            <div className="d-flex align-items-center mb-2  pt-2 ">
              <button className="btn main-color px-5 w-50" onClick={addToCart} disabled={isLoadingVariant}>
                <i className="fa fa-shopping-cart mr-1"></i> Buy Now
              </button>
              <button
                className="btn btn-danger px-3 w-50"
                onClick={addToWishlist}
                disabled={isLoadingVariant}
              >
                <i className="fa fa-heart mr-1"></i> Add To Wishlist
              </button>
            </div>
          </div>
          <div className="col-lg-7 h-auto mb-30 ">
            <div className="h-100 bg-light p-30 ">
              {isLoadingVariant && (
                <div className="text-center mb-3">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Updating product...</span>
                  </div>
                  <small className="text-muted ms-2">Updating product details...</small>
                </div>
              )}
              <h6>
                {product?.maincategory?.name}/{product?.subcategory?.name}/
                {product?.brand?.name}
              </h6>
              <h5>{product.name} {((selectedVariant?.innerSlug || selectedVariant?.innerSubSlug) ? `(${selectedVariant?.innerSlug || ''}${selectedVariant?.innerSlug && selectedVariant?.innerSubSlug ? ', ' : ''}${selectedVariant?.innerSubSlug || ''})` : `(${selectedVariant?.color || product.color}, ${selectedVariant?.size || product.size})`)}</h5>
              <div style={{ marginTop: 5, color: "#878787", fontSize: 14 }}>
                {/* Ratings and reviews placeholder, add your logic if needed */}
              </div>
              <h6 className="font-weight-semi-bold mb-4">
                <del className="text-danger">&#8377;{selectedVariant?.baseprice || product.baseprice}</del>
                &#8377; {selectedVariant?.finalprice || product.finalprice}
                <sup className="text-success">{selectedVariant?.discount || product.discount}% OFF</sup>
              </h6>
              {selectedVariant?.stock > 0 && selectedVariant?.stock < 10 && (
                <p className="text-danger font-weight-bold">Limited Stock!</p>
              )}

              <div>
                <div className="d-flex flex-wrap align-items-center mb-3">
                  <button
                    className="btn main-color px-3 mr-3 mb-2"
                    onClick={() => setShowDescription(true)}
                  >
                    Description
                  </button>
                  <button
                    className="btn main-color px-3 mr-3 mb-2"
                    onClick={() => setShowDescription(false)}
                  >
                    Specification
                  </button>

                  {/* Variant Dropdowns */}
                  {innerSlugs.length > 0 && (
                  <div className="dropdown mr-3 mb-2 slug-dropdown-container" style={{ position: 'relative' }}>
                    <button
                      className="btn main-color dropdown-toggle"
                      type="button"
                        onClick={() => setShowInnerSlugDropdown(!showInnerSlugDropdown)}
                      style={{ 
                        minWidth: "120px",
                        maxWidth: "250px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                        disabled={isLoadingVariant}
                    >
                        {selectedInnerSlug || "Select Curve"}
                    </button>
                      {showInnerSlugDropdown && (
                      <div className="dropdown-menu show" style={{ 
                        position: 'absolute', 
                        top: '100%', 
                        left: 0, 
                        minWidth: '120px',
                        maxWidth: '300px',
                        width: 'max-content',
                        maxHeight: '200px',
                        overflowY: 'auto',
                          zIndex: 1050
                      }}>
                          {innerSlugs.map((innerSlug) => (
                          <a 
                              key={innerSlug}
                            className={`dropdown-item ${selectedInnerSlug === innerSlug ? 'active' : ''}`}
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                                handleInnerSlugChange(innerSlug);
                            }}
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}
                          >
                            {innerSlug}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  )}
                  {innerSubSlugs.length > 0 && (
                  <div className="dropdown mr-3 mb-2 slug-dropdown-container" style={{ position: 'relative' }}>
                    <button
                      className="btn main-color dropdown-toggle"
                      type="button"
                        onClick={() => setShowInnerSubSlugDropdown(!showInnerSubSlugDropdown)}
                      style={{ 
                        minWidth: "120px",
                        maxWidth: "250px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                        disabled={isLoadingVariant || !selectedInnerSlug}
                    >
                        {selectedInnerSubSlug || "Select Poles/Current"}
                    </button>
                      {showInnerSubSlugDropdown && (
                      <div className="dropdown-menu show" style={{ 
                        position: 'absolute', 
                        top: '100%', 
                          right: 0, 
                        minWidth: '120px',
                        maxWidth: '300px',
                        width: 'max-content',
                        maxHeight: '200px',
                        overflowY: 'auto',
                          zIndex: 1050
                      }}>
                          {innerSubSlugs.map((innerSubSlug) => (
                          <a 
                              key={innerSubSlug}
                            className={`dropdown-item ${selectedInnerSubSlug === innerSubSlug ? 'active' : ''}`}
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                                handleInnerSubSlugChange(innerSubSlug);
                            }}
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}
                          >
                            {innerSubSlug}
                          </a>
                        ))}
                      </div>
                    )}
                    </div>
                  )}
                  {selectedVariant && (
                    <div className="w-100 mt-2">
                      <small className="text-muted">
                        Selected: {selectedInnerSlug} {selectedInnerSubSlug && `- ${selectedInnerSubSlug}`}
                      </small>
                    </div>
                  )}
                </div>
                {showDescription ? (
                  <div className="single-product-description mb-4">
                    <h3>Description</h3>
                    <div className="card">
                      <div className="card-body">
                        <p className="mb-0">{selectedVariant?.description || product.description}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="single-product-specifications mb-4">
                    <h3>Specifications</h3>
                    <div className="card">
                      <div className="card-body">
                        {(() => {
                          const specsToShow = selectedVariant?.specification && selectedVariant?.specification.length > 0 
                            ? selectedVariant.specification 
                            : (product.specification && product.specification.length > 0 ? product.specification : []);
                          return specsToShow.length > 0 ? (
                            <ul className="list-unstyled mb-0">
                              {specsToShow.map((spec, index) => (
                                <li key={index} className="mb-2">
                                  <strong>{spec.key}:</strong> {spec.value}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-muted mb-0">No specifications available for this variant.</p>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="d-flex mb-1">
                <strong className="text-dark mr-3">Size:</strong>
                <p>{selectedVariant?.size || product.size}</p>
              </div>
              <div className="d-flex mb-1">
                <strong className="text-dark mr-3">Color:</strong>
                <p>{selectedVariant?.color || product.color}</p>
              </div>
              <div>
                <div className="d-flex mb-1">
                  <strong className="text-dark mr-3">Delivery:</strong>
                  <p className="text-dark" style={{ fontWeight: 600 }}>
                    Delivery by {new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toDateString()}
                  </p>
                </div>
              </div>
              <div className="single-product-stock-info mb-3">
                {selectedVariant?.stock > 0 ? (
                  <span className="badge bg-success">
                    In Stock: {selectedVariant.stock} available
                  </span>
                ) : (
                  <span className="badge bg-danger">Out of Stock</span>
                )}
                </div>
              <div className="single-product-quantity mb-3">
                <label className="form-label">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={selectedVariant?.stock || product.stock}
                  value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                  className="form-control"
                  style={{ width: "80px", display: "inline-block", marginLeft: "10px" }}
                />
                </div>
              {/* Comments Section */}
              <div className="single-product-comments">
                <Comment />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;