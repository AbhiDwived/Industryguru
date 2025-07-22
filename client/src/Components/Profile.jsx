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
      <div className="container-fluid ">
        <div className="row">
          <div className="col-md-6">
            {user.pic ? (
              <img
                src={`${apiLink}/public/users/${user.pic}`}
                height="600px"
                width="100%"
                alt=""
              />
            ) : (
              <img
                src={`/assets/img/noimage.png`}
                height="600px"
                width="100%"
                alt=""
              />
            )}
          </div>
          <div className="col-md-6">
            <h5 className="text-center  header-color  p-2">My Profile</h5>
            <BuyerProfile user={user} onAddressUpdated={() => setRefresh(r => !r)} />
          </div>
        </div>
        <h5 className="mt-2 text-center  header-color p-2">Wishlists</h5>
        <div className="table-responsive">
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
                        <Link
                          target="_blank"
                          rel="noreferrer"
                          to={`${apiLink}/public/products/${item.pic}`}
                        >
                          <img
                            src={`${apiLink}/public/products/${item.pic}`}
                            height="100px"
                            width="100%"
                            className="rounded"
                            alt=""
                          />
                        </Link>
                      </td>
                      <td>{item.name}</td>
                      <td>{item.brand}</td>
                      <td>{item.color}</td>
                      <td>{item.size}</td>
                      <td>&#8377;{item.price}</td>
                      <td>
                        <Link
                          to={`${apiLink}/single-product/${item.productid}`}
                        >
                          <i className="fa fa-shopping-cart text-success"></i>
                        </Link>
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
            <div className="text-center">No Items in Wishlist</div>
          )}
        </div>
      </div>
    </div>
  );
}
