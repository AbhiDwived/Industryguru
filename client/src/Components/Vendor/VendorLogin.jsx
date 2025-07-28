import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { apiLink } from "../../utils/utils";
import { showToast } from "../../utils/toast";

export default function VendorLogin() {
  const [data] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const isLoggedIn = localStorage.getItem("login") === "true";
    const role = localStorage.getItem("role");
    
    if (isLoggedIn && role === "Vendor") {
      const isApproved = localStorage.getItem("isApproved") === "true";
      
      if (isApproved) {
        navigate("/vendor");
      } else {
        navigate("/vendor-approval-pending");
      }
    }
  }, [navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`${apiLink}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.result === "Done") {
        if (result.data.role !== "Vendor") {
          showToast.error("Only vendors are allowed to access this page.");
          setSubmitting(false);
          return;
        }

        // Store all necessary data in localStorage
        localStorage.setItem("login", "true");
        localStorage.setItem("username", result.data.username);
        localStorage.setItem("name", result.data.name);
        localStorage.setItem("userid", result.data._id);
        localStorage.setItem("role", result.data.role);
        localStorage.setItem("token", result.token);
        localStorage.setItem("email", result.data.email);
        localStorage.setItem("phone", result.data.phone);
        localStorage.setItem("isApproved", result.data.isApproved);

        // Dispatch custom event to notify App component of localStorage changes
        window.dispatchEvent(new Event('localStorageChange'));

        // Redirect based on approval status
        if (!result.data.isApproved) {
          showToast.warning("Your vendor account is pending approval.");
          navigate("/vendor-approval-pending");
        } else {
          showToast.success(`Welcome back, ${result.data.name}!`);
          navigate("/vendor");
        }
      } else {
        showToast.error(result.message || "Login failed");
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast.error("An error occurred during login. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100"
      style={{ background: "linear-gradient(135deg, #f0f4f8, #d9e2ec)", padding: "20px" }}>
      <div className="shadow p-5 bg-white rounded-4" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold">Vendor Login</h3>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>

        <Formik
          initialValues={data}
          onSubmit={handleSubmit}
          validationSchema={Yup.object({
            username: Yup.string().required("Username is required"),
            password: Yup.string().required("Password is required"),
          })}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="form-label">Username</label>
                <Field
                  name="username"
                  type="text"
                  className={`form-control ${touched.username && errors.username ? "is-invalid" : ""}`}
                  placeholder="Enter username"
                />
                {touched.username && errors.username && (
                  <div className="invalid-feedback">{errors.username}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>
                <Field
                  name="password"
                  type="password"
                  className={`form-control ${touched.password && errors.password ? "is-invalid" : ""}`}
                  placeholder="Enter password"
                />
                {touched.password && errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn w-100 text-white fw-semibold"
                style={{
                  background: "linear-gradient(to right, #00c6ff, #bc00dd)",
                  border: "none",
                  borderRadius: "25px",
                  padding: "10px 0",
                }}
              >
                {isSubmitting ? "Logging in..." : "LOGIN"}
              </button>

              <div className="text-center mt-4">
                <small>
                  Don't have an account?{" "}
                  <Link to="/vendor_registation" className="text-decoration-none">
                    Register
                  </Link>
                </small>
                <br />
                <small>
                  Forgot password?{" "}
                  <Link to="/forget-password-1" className="text-decoration-none">
                    Reset
                  </Link>
                </small>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}