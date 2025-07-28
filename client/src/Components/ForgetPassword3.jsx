import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiLink } from "../utils/utils";
import { showToast } from "../utils/toast";

export default function ForgetPassword3() {
  var [data, setData] = useState({
    password: "",
    cpassword: "",
  });
  var navigate = useNavigate();
  function getInputData(e) {
    var { name, value } = e.target;
    setData((old) => {
      return {
        ...old,
        [name]: value,
      };
    });
  }
  async function postData(e) {
    if (data.password === data.cpassword) {
      e.preventDefault();
      var response = await fetch(`${apiLink}/api/user/forget-password-3`, {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          password: data.password,
          username: localStorage.getItem("reset-password-user"),
        }),
      });
      response = await response.json();
      if (response.result === "Done") {
        localStorage.removeItem("reset-password-user");
        showToast.success("Password reset successfully!");
        navigate("/login");
      } else showToast.error(response.message);
    } else showToast.error("Password and Confirm Password Doesn't Matched!!!");
  }
  return (
    <div className="container-fluid my-3">
      <div className="w-50 m-auto">
        <h5 className="bg-primary text-center p-2">
          <span className="text-info">Reset</span> Password
        </h5>
        <form onSubmit={postData}>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              required
              onChange={getInputData}
              name="password"
              placeholder="Enter Password"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              required
              onChange={getInputData}
              name="cpassword"
              placeholder="Enter Password"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary w-100">
              Submit OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
