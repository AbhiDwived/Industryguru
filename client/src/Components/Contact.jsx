import React, { useState } from "react";
import { addContactUs } from "../Store/ActionCreators/ContactUsActionCreators";
import { useDispatch } from "react-redux";

export default function Contact() {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  function getInputData(e) {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setShow(false);
  }

  function postData(e) {
    e.preventDefault();
    const item = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      status: "Active",
      date: new Date(),
    };
    dispatch(addContactUs(item));
    setShow(true);
    setData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  }

  return (
    <section className="contact-section pt-5 pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-7 mb-5">
            <div className="contact-form bg-light p-4 rounded">
              {show && (
                <div className="alert alert-success text-center alert-dismissible fade show" role="alert">
                  Thanks for reaching out! Our team will get in touch with you soon.
                  <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              )}
              <h4 className="section-title text-uppercase mb-4">Contact Us</h4>
              <form onSubmit={postData}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={data.name}
                    onChange={getInputData}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={data.email}
                    onChange={getInputData}
                    placeholder="Your Email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={data.phone}
                    onChange={getInputData}
                    placeholder="Your Phone"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    value={data.subject}
                    onChange={getInputData}
                    placeholder="Subject"
                    required
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows="5"
                    name="message"
                    value={data.message}
                    onChange={getInputData}
                    placeholder="Message"
                    required
                  ></textarea>
                </div>
                <button className="btn main-color py-2 px-4 w-100" type="submit">
                  Send Message
                </button>
              </form>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="contact-info bg-light p-4 mb-4 rounded">
              <h4 className="section-title text-uppercase mb-4">Contact Information</h4>
              <p className="mb-3">
                <strong>OPTIMA CONNECT PVT. LTD.</strong>
                <br />
                CIN: U47912UP2023PTC193933
              </p>
              <p className="mb-3">
                <i className="fas fa-map-marker-alt text-primary me-2"></i>
                Plot no. 11, Kharsa No. 921, New Karhera Colony,
                <br />
                <span className="ms-4">Mohan Nagar, Ghaziabad, U.P - 201007</span>
              </p>
              <p className="mb-3">
                <i className="fas fa-envelope text-primary me-2"></i>
                <a href="mailto:industryguruinfo@gmail.com" className="text-dark">
                  industryguruinfo@gmail.com
                </a>
              </p>
              <p className="mb-3">
                <i className="fas fa-phone-alt text-primary me-2"></i>
                <a href="tel:+919810092418" className="text-dark">
                  +91 9810092418
                </a>
              </p>
            </div>
            <div className="map bg-light rounded">
              <iframe
                title="Google Map"
                src="https://maps.google.com/maps?q=Khasra%20No:%20401,%20402,%20First%20Floor,%20Ghitorni,%20Delhi%20-%20110030&t=&z=13&ie=UTF8&iwloc=&output=embed"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                width="100%"
                height="300"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
