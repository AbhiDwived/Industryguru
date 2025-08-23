import React, { useState, useEffect } from "react";
import {
  getWishlist,
  deleteWishlist,
} from "../Store/ActionCreators/WishlistActionCreators";
import { getCheckoutUser } from "../Store/ActionCreators/CheckoutActionCreators";
import { addCart, getCart } from "../Store/ActionCreators/CartActionCreators";
import { showToast } from "../utils/toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { apiLink } from "../utils/utils";

const Wishlist = () => {
  var [user, setUser] = useState({});
  var [wishlist, setWishlist] = useState([]);
  var [order, setOrder] = useState([]);

  var allWishlists = useSelector((state) => state.WishlistStateData);
  var allCheckouts = useSelector((state) => state.CheckoutStateData);
  var allCarts = useSelector((state) => state.CartStateData);

  var dispatch = useDispatch();
  var navigate = useNavigate();
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
    dispatch(getWishlist()); // Refresh wishlist after deletion
  }

  function addToCart(item) {
    var existingItem = allCarts.find(
      (x) =>
        x.userid === localStorage.getItem("userid") &&
        x.productid === item.productid &&
        x.color === item.color &&
        x.size === item.size
    );
    if (existingItem) {
      showToast.info("Item already in cart!");
      navigate("/cart");
    } else {
      var cartItem = {
        userid: localStorage.getItem("userid"),
        productid: item.productid,
        name: item.name,
        color: item.color,
        size: item.size,
        brand: item.brand,
        price: item.price,
        qty: 1,
        total: item.price,
        pic: item.pic,
        review: item.review,
        rating: item.rating
      };
      dispatch(addCart(cartItem));
      dispatch(getCart());
      showToast.success("Item added to cart!");
      navigate("/cart");
    }
  }
  useEffect(() => {
    dispatch(getWishlist());
    dispatch(getCheckoutUser());
  }, [dispatch]);

  useEffect(() => {
    if (allWishlists.length) {
      setWishlist(allWishlists);
    }
    if (allCheckouts.length) {
      setOrder(
        allCheckouts.filter((x) => x.userid === localStorage.getItem("userid"))
      );
    }
  }, [allWishlists, allCheckouts]);

  return (
    <div className="page_section">
      <div className="container-fluid">
        {wishlist.length ? (
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Brand</th>
                <th>Color</th>
                <th>Size</th>
                <th>Price</th>
                <th></th>
                <th></th>
              </tr>
              {wishlist.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`/public/products/${item.pic}`}
                      >
                        <img
                          src={`${apiLink}/public/products/${item.pic}`}
                          height="100px"
                          width="100%"
                          className="rounded"
                          alt=""
                        />
                      </a>
                    </td>
                    <td>{item.name}</td>
                    <td>{item.brand}</td>
                    <td>{item.color}</td>
                    <td>{item.size}</td>
                    <td>&#8377;{item.price}</td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => addToCart(item)}
                      >
                        <i className="fa fa-shopping-cart text-success"></i>
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => deleteItem(item._id)}
                      >
                        <i className="fa fa-trash text-danger"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="m-5 text-center" style={{ fontSize: "35px" }}>
            No Items in Wishlist
          </div>
        )}
      </div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <a href="/shop/All/All/All" className="btn main-color btn-block">
              Shop More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
