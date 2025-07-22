import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="page_section">
       {/* <!-- About Start --> */}
       <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6 pt-4" style={{ minHeight: "400px" }}>
              <div
                className="position-relative h-100 wow fadeIn"
                data-wow-delay="0.1s"
              >
                <img
                  className="position-absolute img-fluid w-100 h-100"
                  src="assets/img/images.png"
                  style={{ objectFit: "cover" }}
                  alt=""
                />
                <div
                  className="position-absolute top-0 end-0 mt-n4 me-n4 py-4 px-5"
                  style={{ background: "rgba(0, 0, 0, .08)" }}
                >
                  <h1 className="display-4 text-white mb-0">
                    5 <span className="fs-4">Years</span>
                  </h1>
                  <h4 className="text-white">Experience</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <h6 className="text-primary text-uppercase"> About Us</h6>
              <h1 className="mb-4">
                <span className="text-primary">Industry Guru</span> Is The Best
                Place For Your Industry Gadgets
              </h1>
              <p className="mb-4">
                At Industryguru, we stand as a unique e-commerce platform,
                selling range of utility products to fulfill various industrial
                needs. We are looking forward to establish as ‘trusted seller’
                hub giving our sellers a secure platform to grow their
                businesses on a wider prospect
              </p>
              <div className="row g-4 mb-3 pb-3">
                <div className="col-12 wow fadeIn" data-wow-delay="0.1s">
                  <div className="d-flex">
                    <div
                      className="bg-light d-flex flex-shrink-0 align-items-center justify-content-center mt-1"
                      style={{ width: "45px", height: "45px" }}
                    >
                      <span className="fw-bold text-dark">01</span>
                    </div>
                    <div className="ps-3">
                      <h6>Professional & Expert</h6>
                      <span>
                        Yes, you heard it correctly. Our platform is completely
                        free for you to kickstart your selling business. You can
                        begin today without worrying about any hidden fees or
                        penalties.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-12 wow fadeIn" data-wow-delay="0.3s">
                  <div className="d-flex">
                    <div
                      className="bg-light d-flex flex-shrink-0 align-items-center justify-content-center mt-1"
                      style={{ width: "45px", height: "45px" }}
                    >
                      <span className="fw-bold text-dark">02</span>
                    </div>
                    <div className="ps-3">
                      <h6>Quality Servicing Center</h6>
                      <span>
                        We are delighted to cater your freight job on single and
                        bulk orders without charging any fee. You just need to
                        focus on building a huge selling business.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Link to="" className="btn main-color py-3 px-5">
                Read More<i className="fa fa-arrow-right ms-3"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- About End --> */}
      <div className="container-xxl py-5">
        <div className="container wrapper">
          <div className="row g-4">
            <div
              className="col-lg-4 col-md-6 col-sm-6 wow fadeInUp"
              data-wow-delay="0.1s"
            >
              <div className="d-flex py-5 px-4 contact-shadow">
                <i className="fa fa-certificate fa-3x text-primary flex-shrink-0"></i>
                <div className="ps-4">
                  <h5 className="mb-3">Price</h5>
                  <p>
                    A Price is the amount of cash or Payment given by one person
                    to another in tabulation for one unit of goods or services
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 col-sm-6 wow fadeInUp"
              data-wow-delay="0.3s"
            >
              <div className="d-flex bg-light py-5 px-4 contact-shadow">
                <i className="fa fa-users-cog fa-3x text-primary flex-shrink-0"></i>
                <div className="ps-4">
                  <h5 className="mb-3">Reliability</h5>
                  <p>
                    The Ability of the equipment machine ,or rule to
                    consistently
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 col-sm-6 wow fadeInUp"
              data-wow-delay="0.5s"
            >
              <div className="d-flex py-5 px-4 contact-shadow">
                <i className="fa fa-tools fa-3x text-primary flex-shrink-0"></i>
                <div className="ps-4">
                  <h5 className="mb-3">Product Features</h5>
                  <p>
                    Product Features are components of your product that explain
                    its look,elements and skills
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 col-sm-6 wow fadeInUp"
              data-wow-delay="0.5s"
            >
              <div className="d-flex py-5 px-4 contact-shadow">
                <i className="fa fa-tools fa-3x text-primary flex-shrink-0"></i>
                <div className="ps-4">
                  <h5 className="mb-3">Overall Sales</h5>
                  <p>
                    Over sales revenue,sometimes called gross sales,the entire
                    amount of buisness in a given period
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 col-sm-6 wow fadeInUp"
              data-wow-delay="0.3s"
            >
              <div className="d-flex bg-light py-5 px-4 contact-shadow">
                <i className="fa fa-users-cog fa-3x text-primary flex-shrink-0"></i>
                <div className="ps-4">
                  <h5 className="mb-3">Service/Support</h5>
                  <p>
                    Service support is a collection of processes that are
                    designed to ensure the operational effeciency of service
                  </p>
                </div>
              </div>
            </div>
            <div
              className="col-lg-4 col-md-6 col-sm-6 wow fadeInUp"
              data-wow-delay="0.5s"
            >
              <div className="d-flex py-5 px-4 contact-shadow">
                <i className="fa fa-tools fa-3x text-primary flex-shrink-0"></i>
                <div className="ps-4">
                  <h5 className="mb-3">Return & refund policy</h5>
                  <p>
                    1 month refund policy if product is defective or
                    manufacturing defect
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Service End --> */}

       <div className="container-fluid pt-5">
          <div className="row px-xl-5 pb-3">
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
    </div>
  );
};

export default About;
