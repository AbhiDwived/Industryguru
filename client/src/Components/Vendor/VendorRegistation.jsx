import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { apiLink } from "../../utils/utils";
// Import Redux Actions
import { getMaincategory } from "../../Store/ActionCreators/MaincategoryActionCreators";
import { showToast } from "../../utils/toast";

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function BecomeSeller() {
  const [otpSent, setOtpSent] = useState(false);
  const [phoneSent, setPhoneSent] = useState(""); // Store phone after OTP is sent
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get categories from Redux
  const mainCategories = useSelector((state) => state.MaincategoryStateData);

  useEffect(() => {
    dispatch(getMaincategory());
  }, [dispatch]);

  // Format Time for Timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Timer Logic
  useEffect(() => {
    let interval;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled, timer]);

  // Updated Initial values for Formik
  const initialValues = {
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
    role: "Vendor",
    company: "",
    shopName: "",
    address: "",  // Added
    address2: "", // Added
    city: "",     // Added
    state: "",
    pincode: "",  // Added
    category: "",
    pan: "",
    gst: "",
    termsAccepted: false,
  };

  // Updated validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .required("Enter valid phone number")
      .matches(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    cpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    company: Yup.string(),
    shopName: Yup.string(),
    address: Yup.string().required("Address is required"),  // Added
    address2: Yup.string(),
    city: Yup.string().required("City is required"),       // Added
    state: Yup.string().required("State is required"),     // Updated
    pincode: Yup.string()                                  // Added
      .required("Pincode is required")
      .matches(/^[1-9][0-9]{5}$/, "Invalid pincode"),
    category: Yup.string(),
    pan: Yup.string()
      .required("PAN number is required")
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number"),
    gst: Yup.string()
      .required("GST number is required")
      .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number"),
    termsAccepted: Yup.boolean()
      .oneOf([true], "You must accept the terms and conditions")
      .required("Terms acceptance is required"),
  });

  async function sendOtp(values) {
    try {
      const { phone, ...rest } = values;

      // Add +91 only when sending request
      const formattedPhone = "+91" + phone.replace(/^(\+91)?/, "");

      const response = await fetch(`${apiLink}/api/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: formattedPhone, ...rest }),
      });

      const result = await response.json();

      if (result.success) {
        setOtpSent(true);
        setPhoneSent(formattedPhone); // Save phone for next step
        setTimer(300); // Start 5-minute timer
        setIsResendDisabled(true);
        showToast.success("OTP sent successfully!");
      } else {
        showToast.error(result.message || "Failed to send OTP.");
      }
    } catch (error) {
      showToast.error("Failed to send OTP.");
    }
  }

  async function verifyOtp(values) {
    try {
      const response = await fetch(`${apiLink}/api/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneSent, otp: values.otp }),
      });

      const result = await response.json();

      if (result.success) {
        showToast.success("OTP verified successfully!");
        await registerVendor({ ...values, phone: phoneSent });
      } else {
        showToast.error(result.message || "Invalid OTP!");
      }
    } catch (error) {
      showToast.error("Failed to verify OTP.");
    }
  }

  async function registerVendor(data) {
    try {
      const response = await fetch(`${apiLink}/api/vendor/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.result === "Done") {
        showToast.success("Registration successful! Please login.");
        navigate("/vendor/login");
      } else {
        showToast.error(result.message);
      }
    } catch (error) {
      showToast.error("Registration failed. Please try again.");
    }
  }

  const resendOtpHandler = async () => {
    try {
      const response = await fetch(`${apiLink}/api/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneSent }),
      });

      const result = await response.json();

      if (result.success) {
        showToast.success("OTP resent successfully!");
        setTimer(300);
        setIsResendDisabled(true);
      } else {
        showToast.error(result.message || "Failed to resend OTP.");
      }
    } catch (error) {
      showToast.error("Error sending OTP.");
    }
  };

  return (
    <div className="page-container">
      <div className="container-fluid">
        <div className="sign-up-login mx-auto">
          <h3 className="text-center">Vendor Registration</h3>
          <h5>Create your vendor account to start selling</h5>
          
          {!otpSent ? (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={sendOtp}
            >
              {({ errors, touched }) => (
                <Form>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="ui__form">
                      <label htmlFor="name" className="ui__form__label">
                        Full Name
                      </label>
                      <Field
                        id="name"
                        name="name"
                        placeholder=""
                        className={`ui__form__field ${
                          errors.name ? "error" : ""
                        }`}
                      />
                      {errors.name && (
                        <div className="ui__form__error">{errors.name}</div>
                      )}
                    </div>

                    <div className="ui__form">
                      <label htmlFor="username" className="ui__form__label">
                        User Name
                      </label>
                      <Field
                        id="username"
                        name="username"
                        placeholder=""
                        className={`ui__form__field ${
                          errors.username ? "error" : ""
                        }`}
                      />
                      {errors.username && (
                        <div className="ui__form__error">{errors.username}</div>
                      )}
                    </div>

                    <div className="ui__form">
                      <label htmlFor="email" className="ui__form__label">
                        Email
                      </label>
                      <Field
                        id="email"
                        name="email"
                        placeholder=""
                        className={`ui__form__field ${
                          errors.email ? "error" : ""
                        }`}
                      />
                      {errors.email && (
                        <div className="ui__form__error">{errors.email}</div>
                      )}
                    </div>

                    <div className="ui__form">
                      <label htmlFor="phone" className="ui__form__label">
                        Phone
                      </label>
                      <Field
                        id="phone"
                        name="phone"
                        placeholder=""
                        className={`ui__form__field ${
                          errors.phone ? "error" : ""
                        }`}
                      />
                      {errors.phone && (
                        <div className="ui__form__error">{errors.phone}</div>
                      )}
                    </div>

                    <div className="ui__form">
                      <label htmlFor="company" className="ui__form__label">
                        Company Name
                      </label>
                      <Field
                        id="company"
                        name="company"
                        placeholder=""
                        className={`ui__form__field ${
                          errors.company ? "error" : ""
                        }`}
                      />
                      {errors.company && (
                        <div className="ui__form__error">{errors.company}</div>
                      )}
                    </div>

                    <div className="ui__form">
                      <label htmlFor="category" className="ui__form__label">
                        Select Category
                      </label>
                      <Field
                        as="select"
                        id="category"
                        name="category"
                        className={`ui__form__field ${
                          errors.category ? "error" : ""
                        }`}
                      >
                        <option value="">Select Category</option>
                        {mainCategories.map((cat) => (
                          <option key={cat._id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </Field>
                      {errors.category && (
                        <div className="ui__form__error">{errors.category}</div>
                      )}
                    </div>

                    <div className="ui__form">
                      <label htmlFor="city" className="ui__form__label">
                        City
                      </label>
                      <Field
                        id="city"
                        name="city"
                        placeholder=""
                        className={`ui__form__field ${
                          errors.city ? "error" : ""
                        }`}
                      />
                      {errors.city && (
                        <div className="ui__form__error">{errors.city}</div>
                      )}
                    </div>

                    <div className="ui__form">
                      <label htmlFor="state" className="ui__form__label">
                        State
                      </label>
                      <Field
                        as="select"
                        id="state"
                        name="state"
                        className={`ui__form__field ${
                          errors.state ? "error" : ""
                        }`}
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </Field>
                      {errors.state && (
                        <div className="ui__form__error">{errors.state}</div>
                      )}
                    </div>

                    <div className="ui__form">
                      <label htmlFor="pincode" className="ui__form__label">
                        Pincode
                      </label>
                      <Field
                        id="pincode"
                        name="pincode"
                        placeholder=""
                        className={`ui__form__field ${
                          errors.pincode ? "error" : ""
                        }`}
                      />
                      {errors.pincode && (
                        <div className="ui__form__error">{errors.pincode}</div>
                      )}
                    </div>

                    <div className="ui__form">
                      <label htmlFor="pan" className="ui__form__label">
                        PAN Number
                      </label>
                      <Field
                        id="pan"
                        name="pan"
                        placeholder=""
                        className={`ui__form__field ${
                          errors.pan ? "error" : ""
                        }`}
                      />
                      {errors.pan && (
                        <div className="ui__form__error">{errors.pan}</div>
                      )}
                    </div>

                    <div className="ui__form">
                      <label htmlFor="gst" className="ui__form__label">
                        GST Number
                      </label>
                      <Field
                        id="gst"
                        name="gst"
                        placeholder=""
                        className={`ui__form__field ${
                          errors.gst ? "error" : ""
                        }`}
                      />
                      {errors.gst && (
                        <div className="ui__form__error">{errors.gst}</div>
                      )}
                    </div>

                    <div className="ui__form">
                      <label htmlFor="password" className="ui__form__label">
                        Password
                      </label>
                      <Field
                        id="password"
                        name="password"
                        placeholder=""
                        type="password"
                        className={`ui__form__field ${
                          errors.password ? "error" : ""
                        }`}
                      />
                      {errors.password && (
                        <div className="ui__form__error">{errors.password}</div>
                      )}
                    </div>

                    <div className="ui__form">
                      <label htmlFor="cpassword" className="ui__form__label">
                        Confirm Password
                      </label>
                      <Field
                        id="cpassword"
                        name="cpassword"
                        placeholder=""
                        type="password"
                        className={`ui__form__field ${
                          errors.cpassword ? "error" : ""
                        }`}
                      />
                      {errors.cpassword && (
                        <div className="ui__form__error">{errors.cpassword}</div>
                      )}
                    </div>
                  </div>

                  <div className="ui__form">
                    <label htmlFor="address" className="ui__form__label">
                      Address Line 1
                    </label>
                    <Field
                      id="address"
                      name="address"
                      placeholder=""
                      className={`ui__form__field ${
                        errors.address ? "error" : ""
                      }`}
                    />
                    {errors.address && (
                      <div className="ui__form__error">{errors.address}</div>
                    )}
                  </div>

                  <div className="ui__form">
                    <label htmlFor="address2" className="ui__form__label">
                      Address Line 2
                    </label>
                    <Field
                      id="address2"
                      name="address2"
                      placeholder=""
                      className="ui__form__field"
                    />
                  </div>

                  <div className="ui__form">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Field
                        id="termsAccepted"
                        name="termsAccepted"
                        type="checkbox"
                        className={errors.termsAccepted ? "error" : ""}
                      />
                      <label htmlFor="termsAccepted" className="ui__form__label" style={{ margin: 0 }}>
                        I accept the terms and conditions
                      </label>
                    </div>
                    {errors.termsAccepted && (
                      <div className="ui__form__error">{errors.termsAccepted}</div>
                    )}
                  </div>

                  <button className="ui__form__button">Register</button>
                  
                  <p className="form__info">
                    Already have a vendor account?{" "}
                    <Link to="/vendor/login">Login</Link>
                  </p>
                  
                  <p className="form__desc">
                    By registering, I agree to industryguru{" "}
                    <Link to="/terms-of-use">Terms</Link> and{" "}
                    <Link to="/privacy-policy">Privacy policy</Link>.
                  </p>
                </Form>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={{ otp: "" }}
              validationSchema={Yup.object().shape({
                otp: Yup.string().required("OTP is required"),
              })}
              onSubmit={verifyOtp}
            >
              {(props) => {
                const { errors, touched } = props;
                return (
                  <Form noValidate>
                    <h4 className="text-center mb-3">Enter OTP</h4>
                    <p className="text-center mb-3">We've sent a 6-digit code to your mobile.</p>

                    <div className="ui__form">
                      <label htmlFor="otp" className="ui__form__label">
                        OTP Code
                      </label>
                      <Field
                        id="otp"
                        name="otp"
                        placeholder="Enter 6-digit OTP"
                        autoComplete="one-time-code"
                        maxLength="6"
                        className={`ui__form__field ${
                          touched.otp && errors.otp ? "error" : ""
                        }`}
                      />
                      {touched.otp && errors.otp && (
                        <div className="ui__form__error">{errors.otp}</div>
                      )}
                    </div>

                    <button className="ui__form__button">
                      Verify OTP & Register
                    </button>

                    <p className="form__info">
                      Didn't receive OTP?{" "}
                      <button
                        type="button"
                        onClick={resendOtpHandler}
                        disabled={isResendDisabled}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#007bff',
                          textDecoration: 'underline',
                          cursor: isResendDisabled ? 'not-allowed' : 'pointer',
                          opacity: isResendDisabled ? 0.5 : 1
                        }}
                      >
                        Resend OTP
                      </button>
                      {isResendDisabled && (
                        <span className="text-muted">
                          {" "}(Available in {formatTime(timer)})
                        </span>
                      )}
                    </p>

                    <p className="form__desc">
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6c757d',
                          textDecoration: 'underline',
                          cursor: 'pointer'
                        }}
                      >
                        ← Back to Form
                      </button>
                    </p>
                  </Form>
                );
              }}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}
