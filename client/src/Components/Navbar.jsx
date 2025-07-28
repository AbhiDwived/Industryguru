import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faMicrosoft } from "@fortawesome/free-brands-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { getMaincategory } from "../Store/ActionCreators/MaincategoryActionCreators";
import { getSubcategory } from "../Store/ActionCreators/SubcategoryActionCreators";
import { getBrand } from "../Store/ActionCreators/BrandActionCreators";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Logo from "../../src/assets/img/white-indusrty1.png";
import MobileLogo from "../assets/img/MobileLogo.jpg";
import { useDispatch, useSelector } from "react-redux";
import Badge from "@mui/material/Badge";
import { apiLink } from "../utils/utils";
import { Button, Dropdown } from "react-bootstrap";

export default function Navbar({ product }) {
  var [user, setUser] = useState({});
  var [search, setSearch] = useState("");
  var [setProduct] = useState([]);
  var allProducts = useSelector((state) => state.ProductStateData);
  var allMaincategories = useSelector((state) => state.MaincategoryStateData);
  var allSubcategories = useSelector((state) => state.SubcategoryStateData);
  var allWishlists = useSelector((state) => state.WishlistStateData);
  var allBrands = useSelector((state) => state.BrandStateData || []);
  var allCart = useSelector((state) => state.CartStateData);
  var dispatch = useDispatch();
  const containerRef = useRef(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false); // State for mobile menu
  const [showSidebar, setShowSidebar] = useState(false); // State for sidebar

  // Assuming you have data file
  // const allMaincategories = allMaincategories;

  useEffect(() => {
    dispatch(getMaincategory());
    dispatch(getSubcategory());
    dispatch(getBrand());
    getAPIData();
  }, [dispatch]);

  var navigate = useNavigate();
  function postSearch(e) {
    e.preventDefault();
    navigate({
      pathname: "/shop/All/All/All",
      search: "?search=" + search,
    });
  }

  function logout() {
    localStorage.clear();
    // Dispatch custom event to notify App component of localStorage changes
    window.dispatchEvent(new Event('localStorageChange'));
    navigate("/login");
  }

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
    if (query.get("search")) searchPage();
    else if (allProducts.length)
      if (response.result === "Done") setUser(response.data);
      else navigate("/login");
  }

  function postSearch(e) {
    e.preventDefault();
    navigate({
      pathname: "/shop/All/All/All",
      search: "?search=" + search,
    });
  }

  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }
  let query = useQuery();
  useEffect(() => {
    const handleResize = () => {
      setShowMobileMenu(window.innerWidth <= 500);
    };
    // Call handleResize initially
    handleResize();
    const container = containerRef.current;
    window.addEventListener("resize", handleResize);

    const cloneChildren = () => {
      const children = container.children;
      if (children.length > 0) {
        const firstChild = children[0].cloneNode(true);
        const lastChild = children[children.length - 1].cloneNode(true);

        container.appendChild(firstChild);
        container.insertBefore(lastChild, container.firstChild);
      }
    };

    cloneChildren();

    let scrollAmount = 1;

    const startScrolling = () => {
      container.scrollLeft += scrollAmount;

      if (
        container.scrollLeft >=
        container.scrollWidth - container.clientWidth
      ) {
        container.scrollLeft = 0;
      }
    };

    let scrollInterval = setInterval(startScrolling, 15);

    const handleMouseEnter = () => {
      clearInterval(scrollInterval);
    };

    const handleMouseLeave = () => {
      scrollInterval = setInterval(startScrolling, 15);
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    dispatch(getMaincategory());
    getAPIData();

    return () => {
      clearInterval(scrollInterval);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  const handleChange = (_id) => {
    navigate(`/shop/${_id}/All/All`);
    setShowSidebar(false); // Close the sidebar
  };

  function toggleSidebar() {
    setShowSidebar(!showSidebar);
  }

  function searchPage() {
    var search = query.get("search").toLocaleLowerCase();
    var p = allProducts.filter((x) => {
      const brand = typeof x.brand === "string" ? x.brand.toLowerCase() : "";
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

  const handleChangeMain = (_id) => {
    console.log("handleChangeMain");
    navigate(`/shop/${_id}/All/All/`);
  };
  const handleChangeSub = (_id) => {
    console.log("handleChangeSub");
    navigate(`/shop/All/${_id}/All/`);
  };
  const handleChangeBrand = (_id) => {
    console.log("handleChangeBrand");
    navigate(`/shop/All/All/${_id}`);
  };

  const filterData = () => {
    return allMaincategories?.map((main) => {
      const subCategories = allSubcategories
        .filter((sub) => sub.maincategory === main._id)
        .map((sub) => {
          const brand = allBrands
            .filter((br) => br.subcategory === sub._id)
            .map((br) => {
              const product = allProducts
                ?.filter((prod) => prod.subcategory === br._id)
                ?.map((prod) => {
                  return {
                    name: prod.name,
                    _id: prod._id,
                  };
                });
              return { name: br.name, _id: br._id, product };
            });
          return { name: sub.name, _id: sub._id, brand };
        });
      return { name: main.name, _id: main._id, subCategories };
    });
  };

  return (
    <header className="main-header bg-dark sticky-top">
      <div className="row">
        {/* <div className="col-lg-12"> */}
        <nav className="navbar navbar-expand-lg py-lg-0 px-0">
          <div className="container-fluid">
            {/* Hamburger icon to toggle sidebar */}
            <button
              className="navbar-toggler"
              type="button"
              onClick={toggleSidebar}
              style={{ display: window.innerWidth <= 500 ? "block" : "none" }}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            {/* ... (rest of your code) */}
            <div className="navbar-nav col-md-3 col-lg-3">
              <Link to="/" className="nav-item ">
                <img src={Logo} className="LogoIcon" alt="logo" srcSet="" />
                <img
                  src={MobileLogo}
                  className="MobileLogo"
                  alt="logo"
                  srcSet=""
                />
              </Link>

              {/* <Dropdown>
                <Dropdown.Toggle
                  variant="primary"
                  id="nested-dropdown"
                  className="Category mt-1"
                >
                  <FontAwesomeIcon icon={faMicrosoft} className=" mr-2" />
                  All Categories
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {filterData()?.map((item, i) => (
                    <div key={i}>
                      <Dropdown.Item
                        className="dropdown-hover truncate"
                        onClick={() => handleChangeMain(item._id)}
                        style={{
                          width: "250px",
                          maxHeight: "400px",
                          overflowY: "scroll",
                          overflowX: "hidden",
                        }}
                      >
                        {item.name}
                        <Dropdown.Menu
                          className="submenu"
                          style={{ width: "200px", height: "430px" }}
                        >
                          {item.subCategories.map((sub, i) => (
                            <Dropdown.Item
                              key={i}
                              onClick={() => handleChangeSub(item._id)}
                              className="sub-action-item dropdown-hover truncate"
                            >
                              {sub?.name}
                              <Dropdown.Menu
                                className="mini-submenu truncate"
                                style={{ width: "150px", height: "430px" }}
                              >
                                {sub?.brand?.map((br, i) => (
                                  <Dropdown.Item
                                    onClick={() => handleChangeBrand(item._id)}
                                    key={i}
                                  >
                                    {br.name}
                                  </Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown.Item>
                    </div>
                  ))}
                </Dropdown.Menu>
              </Dropdown> */}

              <div className="d-flex align-items-center">
                <Link to="/shop/All/All/All" className="Category">
                  <FontAwesomeIcon icon={faMicrosoft} className="px-2" fade />
                  Shop
                </Link>
              </div>
            </div>

            <div className="navbar-nav col-md-6 col-lg-6 justify-content-lg-center">
              <form onSubmit={postSearch}>
                <div className="input-group searchBarContainer">
                  <input
                    type="text"
                    name="search"
                    onChange={(e) =>
                      setSearch(e.target.value.toLocaleLowerCase())
                    }
                    className="form-control searchBar"
                    placeholder="Search for products"
                  />
                  <div className="input-group-append">
                    <button className="input-group-text searchicon  text-primary">
                      <i className="fa fa-search "></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
            {/* </div> */}

            <div className="Login_Section col-md-3 col-lg-3">
              <div className="d-flex align-items-center justify-content-end">
                <Link
                  to="/cart"
                  className="icon1 mt-1 nav-item nav-link active text-white"
                >
                  <Badge badgeContent={allCart.length || 0} color="primary">
                    <ShoppingCartIcon color="danger" />
                  </Badge>
                </Link>

                <Link to="/wishlist" className="Login wishlist mt-2  mr-4">
                  <div className="sm mr-1">
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="fa-thin fa-user-large"
                    />
                  </div>
               
                    <Badge
                      badgeContent={allWishlists.length}
                      color="primary"
                    ></Badge>
                  
                </Link>
                {localStorage.getItem("login") ? (
                  <div className="nav-item dropdown ">
                    <a href="#/" data-toggle="dropdown">
                      <div className="col-md-6 navbarPic">
                        <div
                          style={{
                            borderRadius: "50%",
                            overflow: "hidden",
                            width: "30px",
                            height: "30px",
                            float: "right",
                          }}
                        >
                          {user.pic ? (
                            <img
                              src={`${apiLink}/public/users/${user.pic}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              alt=""
                            />
                          ) : (
                            <img
                              src={`/assets/img/noimage.png`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              alt=""
                            />
                          )}
                        </div>
                      </div>
                    </a>
                    <div
                      className="dropdown-menu header-color rounded-0 border-0"
                      style={{ marginLeft: "-90px", marginTop: "18px" }}
                    >
                      {localStorage.getItem("role") === "Admin" ||
                      localStorage.getItem("role") === "Vendor" ? (
                        <>
                          <Link
                            to={
                              localStorage.getItem("role") === "Admin"
                                ? "/admin"
                                : "/vendor"
                            }
                            className="dropdown-item"
                          >
                            Profile
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to="/profile" className="dropdown-item">
                            Profile
                          </Link>
                          <Link to="/cart" className="dropdown-item">
                            Cart
                          </Link>
                          <Link to="/order" className="dropdown-item">
                            Order History
                          </Link>
                        </>
                      )}
                      <button className="dropdown-item" onClick={logout}>
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className="Login" onClick={logout}>
                    <div className="sm mr-1">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="fa-thin fa-user-large"
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        className="Upper"
                        style={{ marginBottom: "-3px", marginRight: "10px" }}
                      >
                        {" "}
                        Sign In{" "}
                      </span>
                      <span className="Down">Account</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
      {/* Sidebar */}
      <div className={`sidebar ${showSidebar ? "show" : ""}`}>
        <div className="sidebar-content">
          <div className="sidebar-row">
            {/* Logo */}
            <Link to="/" className="nav-item" onClick={toggleSidebar}>
              <img src={Logo} className="SideMobileLogo" alt="logo" srcSet="" />
            </Link>
            <button className="close-btn" onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faTimes} size="2x" />
            </button>
          </div>

          {/* Sidebar navigation */}
          <nav className="navbar-expand-lg py-lg-0 px-0">
            <div className="container-fluid">
              {/* ... (rest of your code) */}
              <div className="sidebar-column">
                <div className="col-md-3 col-lg-3">
                  {/* Sidebar links */}
                  <div className="d-flex align-items-center">
                    <div className="btn-group">
                      <button
                        type="button"
                        className="SideCategory dropdown-toggle"
                        data-toggle="dropdown"
                      >
                        <div className="sm mr-1">
                          <FontAwesomeIcon icon={faMicrosoft} />
                        </div>
                        All Categories
                      </button>
                      <div className="dropdown-menu dropdown-menu-right allcat dropdown-menu-scrollable">
                        <button className="dropdown-item ">All</button>
                        {allMaincategories.map((category, index) => (
                          category && category.name ? (
                            <button
                              key={index}
                              className="dropdown-item "
                              onClick={() => handleChange(category._id)}
                            >
                              {category.name}
                            </button>
                          ) : null
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Shop link */}
                  <div className="d-flex align-items-center">
                    <Link
                      to="/shop/All/All/All"
                      className="SideLogin Sidewishlist mt-2"
                      onClick={toggleSidebar}
                    >
                      <div className="sm mr-1">
                        <FontAwesomeIcon icon={faMicrosoft} />
                      </div>
                      Shop
                    </Link>
                  </div>
                </div>

                {/* Login section */}
                <div className="SideLogin_Section">
                  <Link
                    to="/wishlist"
                    className="SideLogin Sidewishlist mt-2"
                    onClick={toggleSidebar}
                  >
                    <div className="sm mr-1">
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="fa-thin fa-user-large"
                      />
                    </div>
                    wishlist
                  </Link>
                  <Link
                    to="/contact"
                    className="SideLogin Sidewishlist mt-2"
                    onClick={toggleSidebar}
                  >
                    <div className="sm mr-1">
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="fa-thin fa-user-large"
                      />
                    </div>
                    Contact
                  </Link>
                  <Link
                    to="/about"
                    className="SideLogin Sidewishlist mt-2"
                    onClick={toggleSidebar}
                  >
                    <div className="sm mr-1">
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="fa-thin fa-user-large"
                      />
                    </div>
                    About
                  </Link>
                  {localStorage.getItem("login") ? (
                    <div className=" dropdown">
                      <Link
                        to="#"
                        className="nav-link dropdown-toggle text-white"
                        data-toggle="dropdown"
                      >
                        {localStorage.getItem("name")}{" "}
                        <i className="ml-3 mt-1"></i>
                      </Link>
                      <div
                        className="dropdown-menu header-color rounded-0 border-0"
                        style={{ minWidth: "10rem" }}
                      >
                        {localStorage.getItem("role") === "Admin" ? (
                          <>
                            <Link to="/admin" className="dropdown-item">
                              Profile
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link to="/profile" className="dropdown-item">
                              Profile
                            </Link>
                            <Link to="/cart" className="dropdown-item">
                              Cart
                            </Link>
                            <Link to="/order" className="dropdown-item">
                              Order History
                            </Link>
                          </>
                        )}
                        <button className="dropdown-item" onClick={logout}>
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="Login"
                      onClick={() => {
                        logout();
                        toggleSidebar();
                      }}
                    >
                      <div className="sm mr-1">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="fa-thin fa-user-large"
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <span
                          className="Upper"
                          style={{
                            marginBottom: "-3px",
                            marginRight: "10px",
                          }}
                        >
                          Sign In{" "}
                        </span>
                        <span className="Down">Account</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </nav>
          {/* Add your sidebar content here */}
        </div>
      </div>
      <div className="" style={{ borderTop: "2px solid white" }}>
        <div className="d-flex align-items-center">
          <Link
            to="/contact"
            className="Downnav"
            style={{ fontWeight: "bold" }}
          >
            Contact
          </Link>
          <Link to="/about" className="Downnav" style={{ fontWeight: "bold" }}>
            About
          </Link>
          <div
            className="d-flex align-items-center overflow-hidden justify-content"
            style={{
              display: "flex",
              flexDirection: "row",
              whiteSpace: "nowrap",
              maxWidth: "100%",
              overflow: "auto",
            }}
            ref={containerRef}
          >
            {allBrands.map((item, index) => (
              item && item.name ? (
                <div
                  key={index}
                  className="brand-item mr-2"
                  style={{ fontSize: "12px", maxWidth: "100%" }}
                >
                  {/* Your button content */}
                  {item.name.length > 10
                    ? `${item.name.slice(0, 10)}...`
                    : item.name}
                </div>
              ) : null
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
