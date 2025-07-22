import React, { useEffect, useState } from "react";
import SideNavbar from "./SideNavbar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import formValidation from "../CustomValidation/formValidation";
import {
  updateProduct,
  getProduct,
} from "../../Store/ActionCreators/ProductActionCreators";
import { getMaincategory } from "../../Store/ActionCreators/MaincategoryActionCreators";
import { getSubcategory } from "../../Store/ActionCreators/SubcategoryActionCreators";
import { getBrand } from "../../Store/ActionCreators/BrandActionCreators";

export default function UpdateProduct() {

  let [errorMessage, setErrorMessage] = useState({
    name: "",
    color: "",
    size: "",
    baseprice: "",
    discount: "",
    pic1: "",
  });
  let [show, setShow] = useState(false);
  let [data, setData] = useState({});
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let { _id } = useParams();
  let [maincategory, setMaincategory] = useState([]);
  let [subcategory, setSubcategory] = useState([]);
  let [brand, setBrand] = useState([]);

  let allmaincategories = useSelector((state) => state.MaincategoryStateData);
  let allsubcategories = useSelector((state) => state.SubcategoryStateData);
  let allbrands = useSelector((state) => state.BrandStateData);
  let allproducts = useSelector((state) => state.ProductStateData);

  const [specsData, setSpecsData] = useState([{ key: "", value: "" }]);
  const handleInputChange = (index, keyOrValue, newValue) => {
    const updatedFormData = [...specsData];
    updatedFormData[index][keyOrValue] = newValue;
    setSpecsData(updatedFormData);
  };

  const handleAddPair = () => {
    setSpecsData([...specsData, { key: "", value: "" }]);
  };

  const handleRemovePair = (index) => {
    const updatedFormData = [...specsData];
    updatedFormData.splice(index, 1);
    setSpecsData(updatedFormData);
  };

  function getInputData(e) {
    let { name, value } = e.target;
    setErrorMessage((old) => {
      return {
        ...old,
        [name]: formValidation(e),
      };
    });
    setData((old) => {
      return {
        ...old,
        [name]: value,
      };
    });
  }
  function getInputFile(e) {
    let { name, files } = e.target;
    setData((old) => {
      return {
        ...old,
        [name]: files[0],
      };
    });
  }
  async function postData(e) {
    e.preventDefault();
    console.log("Data:", data);
    let error = Object.keys(errorMessage).find(
      (x) => errorMessage[x] && errorMessage[x].length !== 0
    );
    if (!error) {
      let fp = Math.round(
        data.baseprice - (data.baseprice * data.discount) / 100
      );
      var item = new FormData();
      item.append("_id", _id);
      item.append("name", data.name);
      item.append("maincategory", data.maincategory || maincategory[0].name);
      item.append("subcategory", data.subcategory || subcategory[0].name);
      item.append("brand", data.brand || brand[0].name);
      item.append("color", data.color);
      item.append("size", data.size);
      item.append("baseprice", parseInt(data.baseprice));
      item.append("discount", parseInt(data.discount));
      item.append("finalprice", fp);
      item.append("stock", data.stock);
      item.append("description", data.description);
      item.append("specification", JSON.stringify(specsData));
      item.append("pic0", data.pic1);
      item.append("pic1", data.pic2);
      item.append("pic2", data.pic3);
      item.append("pic3", data.pic4);
      dispatch(updateProduct(item));
      navigate("/admin-products");
    } else setShow(true);
  }

  function getAPIData() {
    dispatch(getMaincategory());
    dispatch(getSubcategory());
    dispatch(getBrand());
    if (allmaincategories.length) setMaincategory(allmaincategories);
    if (allsubcategories.length) setSubcategory(allsubcategories);
    if (allbrands.length) setBrand(allbrands);

    dispatch(getProduct());

    if (allproducts.length) {
      let item = allproducts.find((x) => x._id === _id);
      if (item) {
        setData({ ...item, brand: item?.brand?._id });
        setSpecsData(item.specification);
      }
    }
  }
  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, [allproducts.length]);
  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, [allmaincategories.length]);
  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, [allsubcategories.length]);
  useEffect(() => {
    getAPIData();
    // eslint-disable-next-line
  }, [allbrands.length]);
  return (
    <div className="page_section">
      <div className="container-fluid my-3">
        <div className="row">
          <div className="col-md-3">
            <SideNavbar />
          </div>
          <div className="col-md-9">
            <h5 className="header-color text-light p-2 text-center">Product</h5>
            <form onSubmit={postData} encType="multipart/form-data">
              <div className="mb-3">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={getInputData}
                  className="form-control"
                  placeholder="Name"
                />
                {show ? <p className="text-danger">{errorMessage.name}</p> : ""}
              </div>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label>Maincategory</label>
                  <select
                    name="maincategory"
                    value={data.maincategory}
                    onChange={getInputData}
                    className="form-control"
                  >
                    {maincategory.map((item, index) => {
                      return (
                        <option key={index} value={item._id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label>Subcategory</label>
                  <select
                    name="subcategory"
                    value={data.subcategory}
                    onChange={getInputData}
                    className="form-control"
                  >
                    {subcategory.map((item, index) => {
                      return (
                        <option key={index} value={item._id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label>Brand</label>
                  <select
                    name="brand"
                    value={data.brand}
                    onChange={getInputData}
                    className="form-control"
                  >
                    {brand.map((item, index) => {
                      return (
                        <option key={index} value={item._id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label>Stock</label>
                  <select
                    name="stock"
                    value={data.stock}
                    onChange={getInputData}
                    className="form-control"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out Of Stock">Out Of Stock</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Color</label>
                  <input
                    type="text"
                    name="color"
                    value={data.color}
                    placeholder="color"
                    onChange={getInputData}
                    className="form-control"
                  />
                  {show ? (
                    <p className="text-danger">{errorMessage.color}</p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label>Size</label>
                  <input
                    type="text"
                    name="size"
                    value={data.size}
                    placeholder="size"
                    onChange={getInputData}
                    className="form-control"
                  />
                  {show ? (
                    <p className="text-danger">{errorMessage.size}</p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Base Price</label>
                  <input
                    type="number"
                    name="baseprice"
                    value={data.baseprice}
                    placeholder="Base Price"
                    onChange={getInputData}
                    className="form-control"
                  />
                  {show ? (
                    <p className="text-danger">{errorMessage.baseprice}</p>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label>Discount</label>
                  <input
                    type="number"
                    name="discount"
                    value={data.discount}
                    placeholder="Discount"
                    min={0}
                    onChange={getInputData}
                    className="form-control"
                  />
                  {show ? (
                    <p className="text-danger">{errorMessage.discount}</p>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="inputField">
                <label>Specification</label>
                <div>
                  {specsData?.map((pair, index) => (
                    <div className="row mb-2" key={index}>
                      <div className="col-md-4">
                        <input
                          type="text"
                          name="skey"
                          onChange={(e) =>
                            handleInputChange(index, "key", e.target.value)
                          }
                          value={pair?.key}
                          className="form-control"
                          placeholder="Enter Specification Key :"
                        />
                        {show ? (
                          <p className="text-danger">
                            {errorMessage.specification}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          name="sval"
                          onChange={(e) =>
                            handleInputChange(index, "value", e.target.value)
                          }
                          value={pair?.value}
                          className="form-control"
                          placeholder="Enter Specification Value :"
                        />
                      </div>
                      <div className="col-md-3">
                        <button
                          type="button"
                          className="btn main-color w-100"
                          onClick={() => handleRemovePair(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="row">
                    <div className="col-md-3">
                      <button
                        type="button"
                        className="btn bg-success text-white w-100"
                        onClick={handleAddPair}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label>Description</label>
                <textarea
                  name="description"
                  rows="5"
                  value={data.description}
                  className="form-control"
                  placeholder="Description..."
                  onChange={getInputData}
                ></textarea>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Pic1</label>
                  <input
                    type="file"
                    name="pic1"
                    onChange={getInputFile}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Pic2</label>
                  <input
                    type="file"
                    name="pic2"
                    onChange={getInputFile}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Pic3</label>
                  <input
                    type="file"
                    name="pic3"
                    onChange={getInputFile}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Pic4</label>
                  <input
                    type="file"
                    name="pic4"
                    onChange={getInputFile}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-success w-50"
                  onClick={() => window.history.back()}
                >
                  Back
                </button>
                <button type="submit" className="btn header-color w-50">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
