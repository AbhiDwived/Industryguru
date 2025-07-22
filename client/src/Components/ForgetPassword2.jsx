import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiLink } from "../utils/utils";

export default function ForgetPassword2() {
  var [data, setData] = useState({
    otp: "",
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
    e.preventDefault();
    var response = await fetch(`${apiLink}/api/user/forget-password-2`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        otp: data.otp,
        username: localStorage.getItem("reset-password-user"),
      }),
    });
    response = await response.json();
    if (response.result === "Done") navigate("/forget-password-3");
    else alert(response.message);
  }
  return (
    <div className="container-fluid my-3">
      <div className="w-50 m-auto">
        <h5 className="bg-primary text-center p-2">
          <span className="text-info">Reset</span> Password
        </h5>
        <form onSubmit={postData}>
          <div className="mb-3">
            <label>OTP</label>
            <input
              type="number"
              required
              onChange={getInputData}
              name="otp"
              placeholder="Submit OTP Which is Sent On Your Registered Email ID"
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
