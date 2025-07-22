import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addNewslatter } from "../Store/ActionCreators/NewslatterActionCreators";
import { useDispatch, useSelector } from "react-redux";

export default function Footer() {
  var [email, setEmail] = useState("");
  var [show, setShow] = useState(false);
  var [message, setMessage] = useState("");
  var allNewslatters = useSelector((state) => state.NewslatterStateData);

  var dispatch = useDispatch();

  function getInputData(e) {
    setEmail(e.target.value);
  }
  function postData(e) {
    e.preventDefault();
    var item = allNewslatters.find((x) => x.email === email);
    if (item) {
      setShow(true);
      setMessage("Your Email Id is Already Registered!!!");
    } else {
      dispatch(addNewslatter({ email: email }));
      setShow(true);
      setMessage(
        "Thank to Subscribe Our Newslatter Service!!! Our Team Will Contact You Soon !!!"
      );
    }
  }
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  function getAPIData() {
    // dispatch(getNewslatter())
  }
  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, [allNewslatters.length]);
  return (
    <footer className="main-footer bg-dark">
      <div className="container-fluid text-secondary pt-2">
        <div className="row px-xl-5 pt-5">
          <div className="col-lg-4 col-md-12 mb-5 pr-3 pr-xl-5">
            <h4 className="text-secondary text-uppercase mb-2">
              OPTIMA CONNECT PVT. LTD.
            </h4>
            <h6 className="text-light" style={{ marginBottom: "1rem" }}>
              CIN : U47912UP2023PTC193933
            </h6>
            <p className="mb-2">
              <i className="fa fa-map-marker-alt footer-icon mr-3"></i> Plot no.
              11, Kharsa No. 921,
              <br />
              <span style={{ marginLeft: "2rem" }}>
                {" "}
                New Karhera Colony,
              </span>{" "}
              <br />{" "}
              <span style={{ marginLeft: "2rem" }}>
                Mohan Nagar, Gaahaziabad, <br />{" "}
                <span style={{ marginLeft: "2rem" }}> U.P - 201007</span>{" "}
              </span>
            </p>
            <p className="mb-2">
              <i className="fa fa-envelope footer-icon mr-3"></i>
              <Link
                className="footer-link"
                to="mailto:abhidwivedi687@gmail.com"
              >
                industryguruinfo@gmail.com
              </Link>
            </p>
            <p className="mb-0">
              <i className="fa fa-phone-alt text-light mr-3"></i>
              <Link className="footer-link" to="tel:9874563210">
                +91 9810092418
              </Link>
            </p>
          </div>
          <div className="col-lg-8 col-md-12">
            <div className="row">
              <div className="col-md-4 mb-5">
                <h5 className="text-secondary text-uppercase mb-4">Menu</h5>
                <div className="d-flex flex-column justify-content-start">
                  <Link
                    className="text-secondary mb-2"
                    to="/"
                    onClick={scrollToTop}
                  >
                    <i className="fa fa-angle-right mr-2"></i>Home
                  </Link>
                  <Link
                    className="text-secondary mb-2"
                    to="Shop/All/All/All"
                    onClick={scrollToTop}
                  >
                    <i className="fa fa-angle-right mr-2"></i>Our Shop
                  </Link>
                  <Link
                    className="text-secondary mb-2"
                    to="/about"
                    onClick={scrollToTop}
                  >
                    <i className="fa fa-angle-right mr-2"></i>About Us
                  </Link>
                  <Link
                    className="text-secondary mb-2"
                    to="/contact"
                    onClick={scrollToTop}
                  >
                    <i className="fa fa-angle-right mr-2"></i>Contact Us
                  </Link>
                  <Link
                    className="text-secondary mb-2"
                    to="/shipping-policy"
                    onClick={scrollToTop}
                  >
                    <i className="fa fa-angle-right mr-2"></i>Shipping Policy
                  </Link>
                  <Link
                    className="text-secondary mb-2"
                    to="/privacy-policy"
                    onClick={scrollToTop}
                  >
                    <i className="fa fa-angle-right mr-2"></i>Privacy Policy
                  </Link>
                  <Link
                    className="text-secondary mb-2"
                    to="/return-refund"
                    onClick={scrollToTop}
                  >
                    <i className="fa fa-angle-right mr-2"></i>Return & Refund Policy
                  </Link>
                  <Link
                    className="text-secondary mb-2"
                    to="/terms-of-use"
                    onClick={scrollToTop}
                  >
                    <i className="fa fa-angle-right mr-2"></i>Terms Of Use
                  </Link>
                  <Link
                    className="text-secondary mb-2"
                    to="/become-seller"
                    onClick={scrollToTop}
                  >
                    <i className="fa fa-angle-right mr-2"></i>Become a seller
                  </Link>
                </div>
              </div>
              <div className="col-md-8 mb-5">
                <h5 className="text-secondary text-uppercase mb-4">
                  Newsletter
                </h5>
                <p>
                  Stay updated with IndustryGuru latest offers and updates for a
                  seamless experience.
                </p>
                {show ? (
                  <div
                    className="alert alert-success text-center alert-dismissible fade show"
                    role="alert"
                  >
                    {message}
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="alert"
                      aria-label="Close"
                    ></button>
                  </div>
                ) : (
                  ""
                )}
                <form onSubmit={postData}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control gap"
                      name="email"
                      value={email}
                      onChange={getInputData}
                      placeholder="Your Email Address"
                    />
                    <div className="input-group-append">
                      <button className="btn sub-btn ">Subscribe</button>
                    </div>
                  </div>
                </form>
                <h6 className="text-secondary text-uppercase mt-4 mb-3">
                  Follow Us
                </h6>
                <div className="d-flex">
                  <Link
                    className="btn btn-square mr-2 shadow-input footer-icons"
                    to="#"
                  >
                    <i className="fab fa-twitter"></i>
                  </Link>
                  <Link
                    className="btn btn-square mr-2 shadow-input footer-icons"
                    to="#"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                  <Link
                    className="btn btn-square mr-2 shadow-input footer-icons"
                    to="#"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </Link>
                  <Link
                    className="btn btn-square shadow-input footer-icons"
                    to="#"
                  >
                    <i className="fab fa-instagram"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
