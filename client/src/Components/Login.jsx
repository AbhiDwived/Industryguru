import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Form, Formik, Field } from "formik";
import { apiLink } from "../utils/utils";
import useToast from "../hooks/useToast";
import { commonToasts } from "../utils/toastUtils";

export default function Login() {
  var [data, setData] = useState({
    username: "",
    password: "",
  });
  var navigate = useNavigate();
  const toast = useToast();
  return (
    <div className="page-container">
      <div className="container-fluid">
        <div className="sign-up-login mx-auto">
          <h3 className="text-center">Login To Your Account</h3>
          <h5>Login to your account to continue</h5>
          <Formik
            initialValues={data}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                var response = await fetch(`${apiLink}/api/user/login`, {
                  method: "post",
                  headers: {
                    "content-type": "application/json",
                  },
                  body: JSON.stringify(values),
                });
                response = await response.json();
                
                if (response.result === "Done") {
                  localStorage.setItem("login", true);
                  localStorage.setItem("username", response.data.username);
                  localStorage.setItem("name", response.data.name);
                  localStorage.setItem("userid", response.data._id);
                  localStorage.setItem("role", response.data.role);
                  localStorage.setItem("token", response.token);
                  
                  // Dispatch custom event to notify App component of localStorage changes
                  window.dispatchEvent(new Event('localStorageChange'));
                  
                  // Show success toast
                  commonToasts.loginSuccess();
                  
                  if (response.data.role === "Admin") navigate("/admin");
                  else if (response.data.role === "Vendor") navigate("/vendor");
                  else navigate("/profile");
                } else {
                  toast.error(response.message || "Login failed. Please check your credentials.", "Login Failed");
                }
              } catch (error) {
                toast.error("Network error. Please check your connection and try again.", "Connection Error");
              } finally {
                setSubmitting(false);
              }
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string().required("Enter valid username"),
              password: Yup.string()
                .required("Password is required")
                .min(8, "Password must be at least 6 characters")
                .matches(
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                  "Password should contain one upper case, lower case, special character and number"
                ),
            })}
            enableReinitialize
          >
            {(prop) => {
              const { touched, errors, isSubmitting, setFieldValue, values } =
                prop;
              return (
                <Form noValidate>
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
                  <button className="ui__form__button">Login</button>
                  <p className="form__info">
                    Don&apos;t you have an account?{" "}
                    <Link to="/signup">Register</Link>
                  </p>
                  <p className="form__desc">
                    Facing issue with login{" "}
                    <Link to="/forget-password-1">Reset</Link>
                  </p>

                  {/* 👇 Add this section for Vendor Login */}
                  <h3 className="form__desc text-center mt-4">
                    <strong>
                      <Link to="/vendor-login">Vendor Login</Link>
                    </strong>
                  </h3>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}
