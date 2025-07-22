import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiLink } from "../utils/utils";

export default function ForgetPassword1() {
  var [data, setData] = useState({
    username: "",
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
    var response = await fetch(`${apiLink}/api/user/forget-password-1`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    response = await response.json();
    if (response.result === "Done") {
      localStorage.setItem("reset-password-user", data.username);
      navigate("/forget-password-2");
    } else alert(response.message);
  }
  return (
    <div className="container-fluid my-3">
      <div className="w-50 m-auto">
        <h5 className="bg-primary text-center p-2">
          <span className="text-info">Reset</span> Password
        </h5>
        <form onSubmit={postData}>
          <div className="mb-3">
            <label>User Name</label>
            <input
              type="text"
              required
              onChange={getInputData}
              name="username"
              placeholder="Enter User Name"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary w-100">
              Send OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
