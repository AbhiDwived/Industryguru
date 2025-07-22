import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideNavbar from "./SideNavbar";
import { apiLink } from "../../utils/utils";

export default function AdminHome() {
  var [user, setUser] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  var navigate = useNavigate();

  async function getAPIData() {
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
    if (response.result === "Done") setUser(response.data);
    else navigate("/login");
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("pic", file);
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("phone", user.phone);
    formData.append("role", user.role);
    formData.append("username", user.username);
    if (user.addressline1) formData.append("addressline1", user.addressline1);
    if (user.addressline2) formData.append("addressline2", user.addressline2);
    if (user.addressline3) formData.append("addressline3", user.addressline3);
    if (user.pin) formData.append("pin", user.pin);
    if (user.city) formData.append("city", user.city);
    if (user.state) formData.append("state", user.state);

    try {
      const response = await fetch(`${apiLink}/api/user/${user._id}`, {
        method: "put",
        headers: {
          authorization: localStorage.getItem("token"),
        },
        body: formData,
      });

      const result = await response.json();
      if (result.result === "Done") {
        getAPIData(); // Refresh user data to show new image
      } else {
        console.error("Failed to update profile:", result.message);
        setImagePreview(null); // Reset preview if upload fails
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setImagePreview(null); // Reset preview if upload fails
    }
  };

  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="page_section">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-12">
            <SideNavbar />
          </div>
          <div className="col-md-9 col-12">
            <div className="box__layout">
              <div className="header__layout">
                <h3>Profile Settings</h3>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <div className="profile__photo">
                    <div className="profile__photo__inner" style={{ borderRadius: "50%", overflow: "hidden", position: "relative", cursor: "pointer" }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
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
                      {imagePreview || user.pic ? (
                        <div
                          style={{
                            backgroundImage: `url(${imagePreview || `${apiLink}/public/users/${user.pic}`})`,
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
                        <div className="ui__form__field">{user.name}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="ui__form">
                        <label className="ui__form__label">User Name</label>
                        <div className="ui__form__field">{user.username}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="ui__form">
                        <label className="ui__form__label">Role</label>
                        <div className="ui__form__field">{user.role}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="ui__form">
                        <label className="ui__form__label">Email</label>
                        <div className="ui__form__field">{user.email}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="ui__form">
                        <label className="ui__form__label">Phone</label>
                        <div className="ui__form__field">{user.phone}</div>
                      </div>
                    </div>
                    <div className="col-md-12 mt-4" style={{ padding: "20px 0" }}>
                      <Link to="/update-profile" className="ui__form__button">
                        Update Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
