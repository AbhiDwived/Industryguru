import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios"; // Import Axios
import { getProduct } from "../Store/ActionCreators/ProductActionCreators";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { apiLink } from "../utils/utils";


const Rating = ({ totalRating, ratingCount, onRatingSubmit }) => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null); // State to store the selected image
  const dispatch = useDispatch();
  var allProducts = useSelector((state) => state.ProductStateData);
  var { _id: id } = useParams();
  const navigate = useNavigate()


  function getAPIData() {
    dispatch(getProduct());
  }
  if (allProducts.length) {
    var item = allProducts.find((x) => x._id === id);
  }
  console.log(item);
  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const productId = item._id;
    try {
      // Prepare rating data
      const ratingData = { productId, rating, comment, title, image };

      // Make HTTP POST request to backend API using Axios
      const response = await axios.post(`${apiLink}/api/ratings/${productId}` + localStorage.getItem("userid"), ratingData, {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      // Check if request was successful
      if (response.status === 201) {
        // Log response data for debugging
        alert("Rating submitted successfully!");
        // Reset form fields after submission
        setRating(null);
        setHover(null);
        setComment("");
        setTitle("");
        setImage(null);
        // Call parent component's callback function if needed
        navigate(`/single-product/${id}`)

      } else {
        console.error("Failed to submit rating");
      }
    } catch (error) {
      console.log("Error submitting rating:", error.message);
    }
  };




  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className="row px-5">
        <div className="col-sm-12 col-md-6 justify-content-start">
          <h5 className="mb-3">Ratings & Reviews</h5>
        </div>
        <div className="col-sm-12 col-md-6 justify-content-end text-right">
          <div className="">
            <h5>{item?.name}</h5>
            <h5>{item?.finalprice}</h5>
            <img
              src={item?.pic1}
              alt=""
              srcset=""
              style={{ width: "50px", height: "auto" }}
            />
          </div>
          <div>
            <FaStar
              color={totalRating >= 1 ? "#ffc107" : "#878eab"}
              size={22}
              style={{
                marginRight: "5px",
                stroke: "#000",
                strokeWidth: 1,
                strokeLinejoin: "round",
              }}
            />
            <span>({ratingCount})</span>
          </div>
        </div>
      </div>
      <hr />

      <div className="container">
        <div>
          <h5 className="mb-3">Rate this product</h5>
        </div>
        <div className="mb-3 d-flex ">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;

            return (
              <label key={index} className="star-label">
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => handleRatingClick(ratingValue)}
                  style={{ display: "none" }}
                />

                <FaStar
                  className="star-icon"
                  color={
                    ratingValue <= (hover || rating) ? "#ffc107" : "#878eab"
                  }
                  size={22}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    marginRight: "5px",
                    stroke: "#000",
                    strokeWidth: 1,
                    strokeLinejoin: "round",
                  }}
                />
              </label>
            );
          })}
        </div>
        <hr />

        <div className="mb-3">
          <label htmlFor="comment" className="form-label">
            <h5>Review this product:</h5>
          </label>

          <input
            type="text"
            id="title"
            className="form-control"
            placeholder="Reviews title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            id="comment"
            className="form-control"
            placeholder="Description..."
            rows="4"
            style={{ resize: "none" }}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>

          {/* Input for image upload */}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn main-color" onClick={handleSubmit}>
            Submit Ratings & Reviews
          </button>
        </div>
      </div>
    </>
  );
};

export default Rating;
