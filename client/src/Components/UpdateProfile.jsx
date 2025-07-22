import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiLink } from "../utils/utils";
import SideNavbar from "./Admin/SideNavbar";

export default function UpdateProfile() {
  var [data, setData] = useState({
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
    role: "",
    _id: "",
    username: ""
  });
  const [imagePreview, setImagePreview] = useState(null);
  var navigate = useNavigate();

  function getInputData(e) {
    var { name, value } = e.target;
    setData((old) => {
      return {
        ...old,
        [name]: value || "",
      };
    });
  }

  function getInputFile(e) {
    var { name, files } = e.target;
    if (!files[0]) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(files[0]);

    setData((old) => {
      return {
        ...old,
        [name]: files[0],
      };
    });
  }

  async function postData(e) {
    e.preventDefault();
    var formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("email", data.email || "");
    formData.append("phone", data.phone || "");
    formData.append("addressline1", data.addressline1 || "");
    formData.append("addressline2", data.addressline2 || "");
    formData.append("addressline3", data.addressline3 || "");
    formData.append("pin", data.pin || "");
    formData.append("city", data.city || "");
    formData.append("state", data.state || "");
    formData.append("username", data.username || "");
    formData.append("role", data.role || "");
    
    // Only append pic if there's a new file
    if (data.pic && typeof data.pic === 'object') {
      formData.append("pic", data.pic);
    }
    
    try {
      var response = await fetch(`${apiLink}/api/user/` + data._id, {
        method: "put",
        headers: {
          authorization: localStorage.getItem("token"),
        },
        body: formData,
      });
      response = await response.json();
      if (response.result === "Done") {
        // Update local data with the response data to ensure we have the latest state
        if (response.data) {
          setData(response.data);
        } else {
          // If response doesn't include data, fetch fresh data
          await getAPIData();
        }
        // Clear the preview since we now have the actual image
        setImagePreview(null);
        
        if (data.role === "Admin") navigate("/admin");
        else if (data.role === "Vendor") {
          navigate("/vendor");
        } else navigate("/profile", { state: { refresh: true } });
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  }

  async function getAPIData() {
    try {
      var response = await fetch(
        `${apiLink}/api/user/` + localStorage.getItem("userid"),
        {
          method: "get",
          headers: {
            "content-type": "application/json",
            authorization: localStorage.getItem("token"),
          },
        }
      );
      response = await response.json();
      if (response.result === "Done") {
        // Ensure we're setting the complete data including the pic field
        setData(response.data);
        // Reset image preview when getting new data
        setImagePreview(null);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      navigate("/login");
    }
  }

  // Add an effect to refresh data when pic changes
  useEffect(() => {
    if (data.pic && typeof data.pic === 'string' && !imagePreview) {
      // If we have a pic URL but no preview, verify the image exists
      const img = new Image();
      img.src = `${apiLink}/public/users/${data.pic}`;
      img.onerror = () => {
        // If image fails to load, clear the pic field
        setData(old => ({ ...old, pic: "" }));
      };
    }
  }, [data.pic, imagePreview]);

  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="page_section">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-12">
            {data.role === "Admin" && <SideNavbar />}
          </div>
          <div className={`col-md-${data.role === "Admin" ? "9" : "12"} col-12`}>
            <div className="box__layout">
              <div className="header__layout">
                <h3>Update Profile</h3>
              </div>
              <form onSubmit={postData}>
                <div className="row">
                  <div className="col-md-3">
                    <div className="profile__photo">
                      <div className="profile__photo__inner" style={{ borderRadius: "50%", overflow: "hidden", position: "relative", cursor: "pointer" }}>
                        <input
                          type="file"
                          name="pic"
                          accept="image/*"
                          onChange={getInputFile}
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
                        />
                        {imagePreview || data.pic ? (
                          <div
                            style={{
                              backgroundImage: `url(${imagePreview || (data.pic ? `${apiLink}/public/users/${data.pic}` : '')})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              width: "100%",
                              height: "180px",
                              borderRadius: "50%"
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              background: "#f0f0f0",
                              width: "100%",
                              height: "180px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#bbb",
                              fontSize: "2rem",
                              border: "1px solid #eee",
                              borderRadius: "50%"
                            }}
                          >
                            <i className="fa fa-image" style={{ fontSize: "2.5rem" }}></i>
                          </div>
                        )}
                        <div 
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(0,0,0,0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.3s",
                            zIndex: 1,
                            ":hover": {
                              opacity: 1
                            }
                          }}
                        >
                          <p style={{ color: "white", margin: 0, textAlign: "center" }}>
                            <i className="fa fa-camera"></i><br />
                            Change Photo
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="ui__form">
                          <label className="ui__form__label">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={data.name || ""}
                            onChange={getInputData}
                            className="ui__form__field"
                            placeholder="Enter Full Name"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="ui__form">
                          <label className="ui__form__label">Username</label>
                          <input
                            type="text"
                            name="username"
                            value={data.username || ""}
                            onChange={getInputData}
                            className="ui__form__field"
                            placeholder="Enter Username"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="ui__form">
                          <label className="ui__form__label">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={data.email || ""}
                            onChange={getInputData}
                            className="ui__form__field"
                            placeholder="Enter Email Address"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="ui__form">
                          <label className="ui__form__label">Phone</label>
                          <input
                            type="text"
                            name="phone"
                            value={data.phone || ""}
                            onChange={getInputData}
                            className="ui__form__field"
                            placeholder="Enter Phone Number"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="ui__form">
                          <label className="ui__form__label">Address Line 1</label>
                          <input
                            type="text"
                            name="addressline1"
                            value={data.addressline1 || ""}
                            onChange={getInputData}
                            className="ui__form__field"
                            placeholder="Enter House Number or Building Number"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="ui__form">
                          <label className="ui__form__label">Address Line 2</label>
                          <input
                            type="text"
                            name="addressline2"
                            value={data.addressline2 || ""}
                            onChange={getInputData}
                            className="ui__form__field"
                            placeholder="Enter Village or Near By"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="ui__form">
                          <label className="ui__form__label">Address Line 3</label>
                          <input
                            type="text"
                            name="addressline3"
                            value={data.addressline3 || ""}
                            onChange={getInputData}
                            className="ui__form__field"
                            placeholder="Enter Street Number or Near By"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="ui__form">
                          <label className="ui__form__label">Pin Code</label>
                          <input
                            type="number"
                            name="pin"
                            value={data.pin || ""}
                            onChange={getInputData}
                            className="ui__form__field"
                            placeholder="Enter PIN Code"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="ui__form">
                          <label className="ui__form__label">City</label>
                          <input
                            type="text"
                            name="city"
                            value={data.city || ""}
                            onChange={getInputData}
                            className="ui__form__field"
                            placeholder="Enter City"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="ui__form">
                          <label className="ui__form__label">State</label>
                          <input
                            type="text"
                            name="state"
                            value={data.state || ""}
                            onChange={getInputData}
                            className="ui__form__field"
                            placeholder="Enter State"
                          />
                        </div>
                      </div>
                      <div className="col-md-12 mt-4" style={{ padding: "20px 0" }}>
                        <button type="submit" className="ui__form__button">
                          Update Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
