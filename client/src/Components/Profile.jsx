import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  getWishlist,
  deleteWishlist,
} from "../Store/ActionCreators/WishlistActionCreators";
import { getCheckoutUser } from "../Store/ActionCreators/CheckoutActionCreators";
import { useDispatch, useSelector } from "react-redux";
import BuyerProfile from "./BuyerProfile";
import { apiLink } from "../utils/utils";

export default function Profile() {
  var [user, setUser] = useState({});
  var [wishlist, setWishlist] = useState([]);
  var [order, setOrder] = useState([]);
  var [refresh, setRefresh] = useState(false); // Add refresh state
  const [imagePreview, setImagePreview] = useState(null);

  var allWishlists = useSelector((state) => state.WishlistStateData);
  var allCheckouts = useSelector((state) => state.CheckoutStateData);

  var dispatch = useDispatch();
  var navigate = useNavigate();
  var location = useLocation();
  async function getAPIData() {
    var response = await fetch(
      `${apiLink}/api/user/` + localStorage.getItem("userid"),
      {
        method: "get",
        headers: {
          "content-type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      }
    );
    response = await response.json();
    if (response.result === "Done") setUser(response.data);
    else navigate("/login");

    dispatch(getWishlist());
    dispatch(getCheckoutUser());
    if (allWishlists.length) {
      setWishlist(allWishlists);
    }
    if (allCheckouts.length) {
      setOrder(
        allCheckouts.filter((x) => x.userid === localStorage.getItem("userid"))
      );
    }
  }
  function deleteItem(_id) {
    dispatch(deleteWishlist({ _id: _id }));
  }
  useEffect(() => {
    if (location.state && location.state.refresh) {
      setRefresh(r => !r);
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line
  }, [location.state]);
  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, [allWishlists.length, allCheckouts.length, refresh]); // Add refresh to dependencies
  console.log(user.pic);
  return (
    <div className="page_section">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="box__layout">
              <div className="header__layout">
                <h3>Profile Settings</h3>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <div className="profile__photo" style={{ display: "flex", justifyContent: "center" }}>
                    <div
                      className="profile__photo__inner"
                      style={{
                        width: "200px",
                        position: "relative",
                        border: "1px solid #ddd",
                        borderRadius: "50%",
                        overflow: "hidden",
                        cursor: "pointer",
                        backgroundColor: "#f5f5f5"
                      }}
                    >
                      <img
                        src={imagePreview || (user.pic ? `${apiLink}/users/${user.pic}` : '/assets/img/noimage.png')}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                        onError={(e) => {
                          e.target.src = '/assets/img/noimage.png';
                        }}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          opacity: 0,
                          cursor: "pointer",
                          zIndex: 2
                        }}
                      />
                      <div className="overlay text-center" style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.3s",
                        borderRadius: "50%"
                      }}>
                        <p style={{ margin: 0 }}>
                          <i className="fa fa-camera"></i>
                          <br />
                          Update Photo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-9">
                  <BuyerProfile user={user} onAddressUpdated={() => setRefresh(r => !r)} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="box__layout mt-4">
          <div className="header__layout">
            <h3>My Wishlist</h3>
          </div>
          {wishlist.length ? (
            <div className="row">
              {wishlist.map((item, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div style={{ height: '200px', overflow: 'hidden' }}>
                      <img
                        src={`${apiLink}/products/${item.pic}`}
                        className="card-img-top"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        alt={item.name}
                      />
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title">{item.name}</h6>
                      <p className="card-text text-muted mb-1">Brand: {item.brand}</p>
                      <p className="card-text text-muted mb-1">Color: {item.color} | Size: {item.size}</p>
                      <p className="card-text fw-bold text-primary">₹{item.price}</p>
                      <div className="mt-auto d-flex gap-2">
                        <Link
                          to={`/single-product/${item.productid}`}
                          className="btn btn-primary btn-sm flex-fill"
                        >
                          <i className="fa fa-shopping-cart me-1"></i>Buy Now
                        </Link>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => deleteItem(item._id)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fa fa-heart-o fa-3x text-muted mb-3"></i>
              <p className="text-muted">No Items in Wishlist</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
