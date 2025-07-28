import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiLink } from "../utils/utils";
import * as Yup from "yup";
import { Form, Formik, Field } from "formik";
import { showToast } from "../utils/toast";

// eslint-disable-next-line react/prop-types
export default function Signup({ seller = false }) {
  var [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
  });
  var navigate = useNavigate();
  return (
    <div className="page-container">
      <div className="container-fluid">
        <div className="sign-up-login mx-auto">
          <h3 className="text-center">
            {seller ? "Sign up" : "Create A Free Account"}
          </h3>
          <Formik
            initialValues={data}
            onSubmit={async (values, { setSubmitting }) => {
              var item = {
                ...values,
                role: seller ? "Vendor" : "User",
              };
              let response = await fetch(`${apiLink}/api/user`, {
                method: "post",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify(item),
              });
              response = await response.json();
             if (response.result === "Done") {
                localStorage.setItem("signup-user", item.email);
                showToast.success("Account created successfully! Please verify your email.");
                navigate("/verify");
              }
              else showToast.error(response.message);
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("Enter valid name"),
              username: Yup.string().required("Enter valid username"),
              email: Yup.string().email().required("Enter valid email address"),
              phone: Yup.string()
                .required("Enter valid phone number")
                .matches(
                  /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){9}\d$/,
                  "Enter valid phone number"
                ),
              password: Yup.string()
                .required("Password is required")
                .min(8, "Password must be at least 6 characters")
                .matches(
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                  "Password should contain one upper case, lower case, speical character and number"
                ),
              cpassword: Yup.string()
                .required("Comfirm Password is required")
                .oneOf([Yup.ref("password")], "Passwords must match"),

              
            })}
            enableReinitialize
          >
            {(prop) => {
              const { touched, errors, isSubmitting, setFieldValue, values } =
                prop;
              return (
                <Form noValidate>
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
                  <button className="ui__form__button">Register</button>
                  <p className="form__info">
                    Already have an account? <Link to="/login">Login</Link>
                  </p>
                  <p className="form__desc">
                    By registering, I agree to industryguru{" "}
                    <Link to="/terms-of-use">Terms</Link> and{" "}
                    <Link to="/privacy-policy">Privacy policy</Link>.
                  </p>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}
