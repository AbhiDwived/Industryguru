import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Form, Formik, Field } from "formik";
import { apiLink } from "../../utils/utils";
import Wrapper from "./Wrapper";

const getImage = (img) => {
  if (!img || img === "") {
    return DEFAULT_PROFILE_IMAGE;
  }
  
  if (img.startsWith("data:image")) {
    return img; // base64 preview
  }
  
  if (img.startsWith("http")) {
    return img; // absolute URL
  }
  
  // Use the correct path to access the image
  return `${apiLink}/users/${img}`;
};

// Default profile image - use absolute path
const DEFAULT_PROFILE_IMAGE = `${window.location.origin}/assets/img/User.png`;

export default function VendorProfile() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    pic: "",
    email: "",
    phone: "",
    addressline1: "",
    addressline2: "",
    addressline3: "",
    pin: "",
    city: "",
    state: "",
    photo: "",
    pan: "",
    bank_no: "",
    bank_ifsc: "",
    bank_branch: "",
    bank_name: "",
    upi: "",
    bank_ac_name: "",
  });
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState("");

  async function getAPIData() {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userid");
      const token = localStorage.getItem("token");
      
      if (!userId || !token) {
        setError("Missing user ID or token. Please log in again.");
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${apiLink}/api/vendor/${userId}`, {
        method: "get",
        headers: {
          "content-type": "application/json",
          "authorization": token
        }
      });
      
      const result = await response.json();
      
      if (result.result === "Done") {
        // Map vendor data structure to the form fields
        const mappedData = {
          _id: result.data._id,
          name: result.data.name || "",
          email: result.data.email || "",
          phone: result.data.phone || "",
          pic: result.data.pic || "",
          photo: "",  // This will hold the file for upload
          addressline1: result.data.address || "",
          addressline2: result.data.address2 || "",
          addressline3: "",
          pin: result.data.pincode || "",
          city: result.data.city || "",
          state: result.data.state || "",
          pan: result.data.pan || "",
          bank_no: result.data.bank_no || "",
          bank_ifsc: result.data.bank_ifsc || "",
          bank_branch: result.data.bank_branch || "",
          bank_name: result.data.bank_name || "",
          bank_ac_name: result.data.bank_ac_name || "",
          upi: result.data.upi || ""
        };
        
        setData(mappedData);
        setError("");
      } else {
        setError(result.message || "Failed to load vendor profile.");
      }
    } catch (err) {
      setError("Error loading profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Check if user is logged in as vendor
    const isLoggedIn = localStorage.getItem("login") === "true";
    const role = localStorage.getItem("role");
    const isApproved = localStorage.getItem("isApproved") === "true";
    const userId = localStorage.getItem("userid");
    
    if (!isLoggedIn || role !== "Vendor") {
      navigate("/vendor-login");
      return;
    }
    
    if (!isApproved) {
      navigate("/vendor-approval-pending");
      return;
    }
    
    if (!userId) {
      setError("No user ID found. Please log in again.");
      setLoading(false);
      return;
    }
    
    getAPIData();
  }, [navigate]);

  if (loading) {
    return (
      <Wrapper>
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading profile...</p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="box__layout">
        <div className="header__layout">
          <h3>Profile Settings</h3>
        </div>
      
        {error && (
          <div className="alert alert-danger mb-4">
            {error}
          </div>
        )}
        
        {updated && (
          <div className="alert alert-success mb-4">
            Profile updated successfully!
          </div>
        )}
      
        <Formik
          initialValues={data}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setError("");
              setUpdated(false);
              
              const { photo, ...others } = values;
              const formData = new FormData();
              
              // Map form fields to vendor data structure
              formData.append("name", others.name);
              formData.append("email", others.email);
              formData.append("phone", others.phone);
              formData.append("address", others.addressline1);
              formData.append("address2", others.addressline2);
              formData.append("pincode", others.pin);
              formData.append("city", others.city);
              formData.append("state", others.state);
              
              // Bank details
              formData.append("pan", others.pan);
              formData.append("bank_no", others.bank_no);
              formData.append("bank_ac_name", others.bank_ac_name);
              formData.append("bank_ifsc", others.bank_ifsc);
              formData.append("bank_branch", others.bank_branch);
              formData.append("bank_name", others.bank_name);
              formData.append("upi", others.upi);

              // Handle photo upload
              if (photo && photo instanceof File) {
                formData.append("pic", photo);
              }

              const updateUrl = `${apiLink}/api/vendor/profile/${others._id || localStorage.getItem("userid")}`;
              
              const response = await fetch(updateUrl, {
                method: "put",
                headers: {
                  authorization: localStorage.getItem("token"),
                },
                body: formData,
              });

              const result = await response.json();

              if (result.result === "Done") {
                getAPIData();
                setUpdated(true);
                setTimeout(() => {
                  setUpdated(false);
                }, 5000);
              } else {
                setError(result.message || "Failed to update profile.");
              }
            } catch (err) {
              setError("Error updating profile. Please try again.");
            } finally {
              setSubmitting(false);
            }
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required("Enter valid name"),
            email: Yup.string().email().required("Enter valid email address"),
            phone: Yup.string()
              .required("Enter valid phone number")
              .matches(
                /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){9}\d$/,
                "Enter valid phone number"
              ),
            pin: Yup.string()
              .required("Enter pin code")
              .matches(/^[1-9][0-9]{5}$/, "Enter valid pin code"),
          })}
          enableReinitialize
        >
          {(prop) => {
            const { errors, values, setFieldValue, isSubmitting } = prop;
            return (
              <Form noValidate>
                <div className="row">
                  <div className="col-md-3">
                    <div className="profile__photo">
                        <div
                          className="profile__photo__inner"
                          style={{
                            backgroundImage: `url(${getImage(values.pic)})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            height: "200px",
                            width: "200px",
                            position: "relative",
                            border: "1px solid #ddd",
                            borderRadius: "50%",
                            overflow: "hidden",
                            margin: "0 auto"
                          }}
                        >
                          <input
                            id="photo"
                            name="photo"
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
                            onChange={(event) => {
                            if (event.currentTarget.files && event.currentTarget.files[0]) {
                                const fileReader = new FileReader();
                                fileReader.onload = (event) => {
                                  setFieldValue("pic", event.target.result);
                                };
                                fileReader.readAsDataURL(event.currentTarget.files[0]);
                                setFieldValue("photo", event.currentTarget.files[0]);
                              }
                            }}
                          />
                          <div className="overlay text-center">
                            <p>
                            <i className="fa fa-image"></i>
                              <br />
                            Update Photo
                            </p>
                          </div>
                        </div>
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="ui__form">
                          <label htmlFor="name" className="ui__form__label">
                            Name
                          </label>
                          <Field
                            id="name"
                            name="name"
                            placeholder=""
                            className={`ui__form__field ${errors.name ? "error" : ""}`}
                          />
                          {errors.name && (
                            <div className="ui__form__error">{errors.name}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="ui__form">
                          <label htmlFor="email" className="ui__form__label">
                            Email
                          </label>
                          <Field
                            id="email"
                            name="email"
                            placeholder=""
                            className={`ui__form__field ${errors.email ? "error" : ""}`}
                          />
                          {errors.email && (
                            <div className="ui__form__error">
                              {errors.email}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="ui__form">
                          <label htmlFor="phone" className="ui__form__label">
                            Phone
                          </label>
                          <Field
                            id="phone"
                            name="phone"
                            placeholder=""
                            className={`ui__form__field ${errors.phone ? "error" : ""}`}
                          />
                          {errors.phone && (
                            <div className="ui__form__error">
                              {errors.phone}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="ui__form">
                          <label
                            htmlFor="addressline1"
                            className="ui__form__label"
                          >
                            Address Line 1
                          </label>
                          <Field
                            id="addressline1"
                            name="addressline1"
                            placeholder=""
                            className={`ui__form__field ${errors.addressline1 ? "error" : ""}`}
                          />
                          {errors.addressline1 && (
                            <div className="ui__form__error">
                              {errors.addressline1}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="ui__form">
                          <label
                            htmlFor="addressline2"
                            className="ui__form__label"
                          >
                            Address Line 2
                          </label>
                          <Field
                            id="addressline2"
                            name="addressline2"
                            placeholder=""
                            className={`ui__form__field ${errors.addressline2 ? "error" : ""}`}
                          />
                          {errors.addressline2 && (
                            <div className="ui__form__error">
                              {errors.addressline2}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="ui__form">
                          <label
                            htmlFor="addressline3"
                            className="ui__form__label"
                          >
                            Address Line 3
                          </label>
                          <Field
                            id="addressline3"
                            name="addressline3"
                            placeholder=""
                            className={`ui__form__field ${errors.addressline3 ? "error" : ""}`}
                          />
                          {errors.addressline3 && (
                            <div className="ui__form__error">
                              {errors.addressline3}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="ui__form">
                          <label htmlFor="pin" className="ui__form__label">
                            Pin Code
                          </label>
                          <Field
                            id="pin"
                            name="pin"
                            placeholder=""
                            className={`ui__form__field ${errors.pin ? "error" : ""}`}
                          />
                          {errors.pin && (
                            <div className="ui__form__error">{errors.pin}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="ui__form">
                          <label htmlFor="city" className="ui__form__label">
                            City
                          </label>
                          <Field
                            id="city"
                            name="city"
                            placeholder=""
                            className={`ui__form__field ${errors.city ? "error" : ""}`}
                          />
                          {errors.city && (
                            <div className="ui__form__error">{errors.city}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="ui__form">
                          <label htmlFor="state" className="ui__form__label">
                            State
                          </label>
                          <Field
                            id="state"
                            name="state"
                            placeholder=""
                            className={`ui__form__field ${errors.state ? "error" : ""}`}
                          />
                          {errors.state && (
                            <div className="ui__form__error">
                              {errors.state}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="header__layout">
                        <h3>Payment Information</h3>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="ui__form">
                            <label htmlFor="pan" className="ui__form__label">
                              PAN
                            </label>
                            <Field
                              id="pan"
                              name="pan"
                              placeholder=""
                              className={`ui__form__field ${errors.pan ? "error" : ""}`}
                            />
                            {errors.pan && (
                              <div className="ui__form__error">
                                {errors.pan}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="ui__form">
                            <label
                              htmlFor="bank_ac_name"
                              className="ui__form__label"
                            >
                              Account Holder Name
                            </label>
                            <Field
                              id="bank_ac_name"
                              name="bank_ac_name"
                              placeholder=""
                              className={`ui__form__field ${errors.bank_ac_name ? "error" : ""}`}
                            />
                            {errors.bank_ac_name && (
                              <div className="ui__form__error">
                                {errors.bank_ac_name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="ui__form">
                            <label
                              htmlFor="bank_no"
                              className="ui__form__label"
                            >
                              Account Number
                            </label>
                            <Field
                              id="bank_no"
                              name="bank_no"
                              placeholder=""
                              className={`ui__form__field ${errors.bank_no ? "error" : ""}`}
                            />
                            {errors.bank_no && (
                              <div className="ui__form__error">
                                {errors.bank_no}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="ui__form">
                            <label
                              htmlFor="bank_ifsc"
                              className="ui__form__label"
                            >
                              IFSC
                            </label>
                            <Field
                              id="bank_ifsc"
                              name="bank_ifsc"
                              placeholder=""
                              className={`ui__form__field ${errors.bank_ifsc ? "error" : ""}`}
                            />
                            {errors.bank_ifsc && (
                              <div className="ui__form__error">
                                {errors.bank_ifsc}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="ui__form">
                            <label
                              htmlFor="bank_branch"
                              className="ui__form__label"
                            >
                              Branch
                            </label>
                            <Field
                              id="bank_branch"
                              name="bank_branch"
                              placeholder=""
                              className={`ui__form__field ${errors.bank_branch ? "error" : ""}`}
                            />
                            {errors.bank_branch && (
                              <div className="ui__form__error">
                                {errors.bank_branch}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="ui__form">
                            <label
                              htmlFor="bank_name"
                              className="ui__form__label"
                            >
                              Bank Name
                            </label>
                            <Field
                              id="bank_name"
                              name="bank_name"
                              placeholder=""
                              className={`ui__form__field ${errors.bank_name ? "error" : ""}`}
                            />
                            {errors.bank_name && (
                              <div className="ui__form__error">
                                {errors.bank_name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="ui__form">
                            <label htmlFor="upi" className="ui__form__label">
                              UPI ID
                            </label>
                            <Field
                              id="upi"
                              name="upi"
                              placeholder=""
                              className={`ui__form__field ${errors.upi ? "error" : ""}`}
                            />
                            {errors.upi && (
                              <div className="ui__form__error">
                                {errors.upi}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <button 
                          type="submit" 
                          className="ui__form__button"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Saving...' : 'Save Profile'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Wrapper>
  );
}