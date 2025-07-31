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
import { getSubcategory, getSubcategoryByMainId } from "../../Store/ActionCreators/SubcategoryActionCreators";
import { getBrand, getBrandBySubCategoryId } from "../../Store/ActionCreators/BrandActionCreators";
import { getAdminSlug } from "../../Store/ActionCreators/AdminSlugActionCreators";
import { getAdminSubSlugByParent, getAdminSubSlug } from "../../Store/ActionCreators/AdminSlugActionCreators";
import { showToast } from "../../utils/toast";

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
  let [data, setData] = useState({
    name: "",
    maincategory: "",
    subcategory: "",
    brand: "",
    slug: "",
    subSlug: "",
    color: "",
    size: "",
    baseprice: "",
    discount: "",
    stock: "",
    description: ""
  });
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
  let allSlugs = useSelector((state) => state.AdminSlugStateData);
  let allSubSlugs = useSelector((state) => state.AdminSubSlugStateData);

  const [specsData, setSpecsData] = useState([{ key: "", value: "" }]);
  const [variants, setVariants] = useState([]);
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

  // Handle maincategory change
  const handleMainCategoryChange = (e) => {
    const { name, value } = e.target;
    setData((old) => ({
      ...old,
      [name]: value,
      subcategory: "", // Reset subcategory when maincategory changes
      brand: "" // Reset brand when maincategory changes
    }));
    if (value) {
      dispatch(getSubcategoryByMainId(value));
    }
  };

  // Handle subcategory change
  const handleSubCategoryChange = (e) => {
    const { name, value } = e.target;
    setData((old) => ({
      ...old,
      [name]: value,
      brand: "" // Reset brand when subcategory changes
    }));
    if (value) {
      dispatch(getBrandBySubCategoryId(value));
    }
  };

  // Handle slug change
  const handleSlugChange = (e) => {
    getInputData(e);
    const selectedSlugId = e.target.value;
    if (selectedSlugId) {
      dispatch(getAdminSubSlugByParent(selectedSlugId));
    }
  };
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
      item.append("name", data.name || "");
      item.append("maincategory", data.maincategory || "");
      item.append("subcategory", data.subcategory || "");
      item.append("brand", data.brand || "");
      item.append("slug", data.slug || "");
      item.append("subSlug", data.subSlug || "");
      item.append("color", data.color || "");
      item.append("size", data.size || "");
      item.append("baseprice", parseInt(data.baseprice || 0));
      item.append("discount", parseInt(data.discount || 0));
      item.append("finalprice", fp);
      item.append("stock", data.stock || "");
      item.append("description", data.description || "");
      item.append("specification", JSON.stringify(specsData));
      if (variants.length > 0) {
        item.append("variants", JSON.stringify(variants));
      }
      if (data.pic1) item.append("pic1", data.pic1);
      if (data.pic2) item.append("pic2", data.pic2);
      if (data.pic3) item.append("pic3", data.pic3);
      if (data.pic4) item.append("pic4", data.pic4);
      const loadingToast = showToast.loading('Updating product...');
      dispatch(updateProduct(item));
      showToast.success('Product updated successfully!');
      navigate("/admin-products");
    } else {
      setShow(true);
      showToast.error('Please fix the validation errors');
    }
  }


  useEffect(() => {
    if (!allproducts.length || !allmaincategories.length) {
      dispatch(getMaincategory());
      dispatch(getProduct());
    }
    if (!allSlugs.length) {
      dispatch(getAdminSlug());
    }
    if (!allSubSlugs.length) {
      dispatch(getAdminSubSlug());
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (allmaincategories.length) setMaincategory(allmaincategories);
    if (allsubcategories.length) setSubcategory(allsubcategories);
    if (allbrands.length) setBrand(allbrands);

    if (allproducts.length && _id) {
      let item = allproducts.find((x) => x._id === _id);
      if (item && !data.name) {
        setData({ 
          ...item, 
          brand: item?.brand?._id || item?.brand,
          maincategory: item?.maincategory?._id || item?.maincategory,
          subcategory: item?.subcategory?._id || item?.subcategory,
          slug: item?.slug?._id || item?.slug,
          subSlug: item?.subSlug?._id || item?.subSlug
        });
        setSpecsData(item.specification || [{ key: "", value: "" }]);
        setVariants(item.variants || []);
        
        // Load related data for the current product
        if (item?.maincategory?._id || item?.maincategory) {
          dispatch(getSubcategoryByMainId(item?.maincategory?._id || item?.maincategory));
        }
        if (item?.subcategory?._id || item?.subcategory) {
          dispatch(getBrandBySubCategoryId(item?.subcategory?._id || item?.subcategory));
        }
        if (item?.slug?._id || item?.slug) {
          dispatch(getAdminSubSlugByParent(item?.slug?._id || item?.slug));
        }
      }
    }
    // eslint-disable-next-line
  }, [allproducts.length, allmaincategories.length, allsubcategories.length, allbrands.length, allSlugs.length, allSubSlugs.length]);
  return (
    <div className="page_section">
      <div className="container-fluid my-3">
        <div className="row">
          <div className="col-md-3">
            <SideNavbar />
          </div>
          <div className="col-md-9">
            <div className="box__layout">
              <div className="header__layout">
                <div className="row">
                  <h3 className="flex-1">Update Product</h3>
                </div>
              </div>
              <div>
                <form onSubmit={postData}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="ui__form">
                        <label className="ui__form__label">Product Name</label>
                        <input 
                          name="name" 
                          value={data.name || ""} 
                          onChange={getInputData} 
                          placeholder="Product Name" 
                          required 
                          className="ui__form__field"
                        />
                        {show ? <p className="text-danger">{errorMessage.name}</p> : ""}
                      </div>
                      <div className="ui__form">
                        <label className="ui__form__label">Description</label>
                        <textarea 
                          name="description" 
                          value={data.description || ""} 
                          onChange={getInputData} 
                          placeholder="Product description" 
                          rows="4"
                          className="ui__form__field"
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="ui__form">
                            <label className="ui__form__label">Main Category</label>
                            <select 
                              name="maincategory" 
                              value={data.maincategory || ""} 
                              onChange={handleMainCategoryChange} 
                              className="ui__form__field"
                              required
                            >
                              <option value="">Select Category</option>
                              {maincategory.map((item, index) => (
                                <option key={index} value={item._id}>{item.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="ui__form">
                            <label className="ui__form__label">Sub Category</label>
                            <select 
                              name="subcategory" 
                              value={data.subcategory || ""} 
                              onChange={handleSubCategoryChange} 
                              className="ui__form__field"
                              required
                            >
                              <option value="">Select Sub Category</option>
                              {subcategory.map((item, index) => (
                                <option key={index} value={item._id}>{item.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="ui__form">
                            <label className="ui__form__label">Brand</label>
                            <select 
                              name="brand" 
                              value={data.brand || ""} 
                              onChange={getInputData} 
                              className="ui__form__field"
                              required
                            >
                              <option value="">Select Brand</option>
                              {brand.map((item, index) => (
                                <option key={index} value={item._id}>{item.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="ui__form">
                            <label className="ui__form__label">Slug</label>
                            <select
                              name="slug" 
                              value={data.slug || ""} 
                              onChange={handleSlugChange} 
                              className="ui__form__field"
                            >
                              <option value="">Select Slug</option>
                              {allSlugs.map((item, index) => (
                                <option key={index} value={item._id}>{item.slug}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="ui__form">
                            <label className="ui__form__label">Sub Slug</label>
                            <select
                              name="subSlug"
                              value={data.subSlug || ""}
                              onChange={getInputData}
                              className="ui__form__field"
                              disabled={!data.slug}
                            >
                              <option value="">Select Sub Slug</option>
                              {allSubSlugs.map((item, index) => (
                                <option key={index} value={item._id}>{item.slug}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h5>Product Images</h5>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="profile__photo profile__photo__rouned">
                            <div className="profile__photo__inner profile__photo__rouned">
                              <input type="file" name="pic1" onChange={getInputFile} className="form-control" />
                              <div className="overlay text-center profile__photo__rouned">
                                <p>
                                  <i className="fa fa-image"></i>
                                  <br />
                                  Upload Image 1
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="profile__photo profile__photo__rouned">
                            <div className="profile__photo__inner profile__photo__rouned">
                              <input type="file" name="pic2" onChange={getInputFile} className="form-control" />
                              <div className="overlay text-center profile__photo__rouned">
                                <p>
                                  <i className="fa fa-image"></i>
                                  <br />
                                  Upload Image 2
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="profile__photo profile__photo__rouned">
                            <div className="profile__photo__inner profile__photo__rouned">
                              <input type="file" name="pic3" onChange={getInputFile} className="form-control" />
                              <div className="overlay text-center profile__photo__rouned">
                                <p>
                                  <i className="fa fa-image"></i>
                                  <br />
                                  Upload Image 3
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="profile__photo profile__photo__rouned">
                            <div className="profile__photo__inner profile__photo__rouned">
                              <input type="file" name="pic4" onChange={getInputFile} className="form-control" />
                              <div className="overlay text-center profile__photo__rouned">
                                <p>
                                  <i className="fa fa-image"></i>
                                  <br />
                                  Upload Image 4
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* VARIANTS SECTION */}
                  {variants && variants.length > 0 ? (
                    <div className="card mt-4 mb-4">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Product Variants ({variants.length})</h5>
                      </div>
                      <div className="card-body">
                        {variants.map((variant, idx) => (
                          <div key={idx} className="border p-3 mb-3 rounded">
                            <h6>Variant {idx + 1}</h6>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="ui__form">
                                  <label className="ui__form__label">Color</label>
                                  <input
                                    value={variant.color}
                                    onChange={(e) => {
                                      const newVariants = [...variants];
                                      newVariants[idx].color = e.target.value;
                                      setVariants(newVariants);
                                    }}
                                    className="ui__form__field"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="ui__form">
                                  <label className="ui__form__label">Size</label>
                                  <input
                                    value={variant.size}
                                    onChange={(e) => {
                                      const newVariants = [...variants];
                                      newVariants[idx].size = e.target.value;
                                      setVariants(newVariants);
                                    }}
                                    className="ui__form__field"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="ui__form">
                                  <label className="ui__form__label">Base Price</label>
                                  <input
                                    type="number"
                                    value={variant.baseprice}
                                    onChange={(e) => {
                                      const newVariants = [...variants];
                                      newVariants[idx].baseprice = Number(e.target.value);
                                      newVariants[idx].finalprice = Math.round(newVariants[idx].baseprice - (newVariants[idx].baseprice * newVariants[idx].discount) / 100);
                                      setVariants(newVariants);
                                    }}
                                    className="ui__form__field"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="ui__form">
                                  <label className="ui__form__label">Discount (%)</label>
                                  <input
                                    type="number"
                                    value={variant.discount}
                                    onChange={(e) => {
                                      const newVariants = [...variants];
                                      newVariants[idx].discount = Number(e.target.value);
                                      newVariants[idx].finalprice = Math.round(newVariants[idx].baseprice - (newVariants[idx].baseprice * newVariants[idx].discount) / 100);
                                      setVariants(newVariants);
                                    }}
                                    className="ui__form__field"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="ui__form">
                                  <label className="ui__form__label">Stock</label>
                                  <input
                                    type="number"
                                    value={variant.stock}
                                    onChange={(e) => {
                                      const newVariants = [...variants];
                                      newVariants[idx].stock = Number(e.target.value);
                                      setVariants(newVariants);
                                    }}
                                    className="ui__form__field"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="ui__form">
                                  <label className="ui__form__label">Final Price (Auto-calculated)</label>
                                  <input
                                    value={variant.finalprice}
                                    readOnly
                                    className="ui__form__field"
                                    style={{ backgroundColor: '#f8f9fa' }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="card mt-4 mb-4">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Product Details</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="ui__form">
                              <label className="ui__form__label">Color</label>
                              <input
                                name="color"
                                value={data.color || ""}
                                onChange={getInputData}
                                placeholder="Color"
                                className="ui__form__field"
                              />
                              {show ? <p className="text-danger">{errorMessage.color}</p> : ""}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="ui__form">
                              <label className="ui__form__label">Size</label>
                              <input
                                name="size"
                                value={data.size || ""}
                                onChange={getInputData}
                                placeholder="Size"
                                className="ui__form__field"
                              />
                              {show ? <p className="text-danger">{errorMessage.size}</p> : ""}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="ui__form">
                              <label className="ui__form__label">Base Price</label>
                              <input
                                name="baseprice"
                                value={data.baseprice || ""}
                                onChange={getInputData}
                                placeholder="Base Price"
                                type="number"
                                className="ui__form__field"
                              />
                              {show ? <p className="text-danger">{errorMessage.baseprice}</p> : ""}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="ui__form">
                              <label className="ui__form__label">Discount (%)</label>
                              <input
                                name="discount"
                                value={data.discount || ""}
                                onChange={getInputData}
                                placeholder="Discount (%)"
                                type="number"
                                className="ui__form__field"
                              />
                              {show ? <p className="text-danger">{errorMessage.discount}</p> : ""}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="ui__form">
                              <label className="ui__form__label">Stock</label>
                              <input
                                name="stock"
                                value={data.stock || ""}
                                onChange={getInputData}
                                placeholder="Stock"
                                type="number"
                                className="ui__form__field"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="ui__form">
                          <label className="ui__form__label">Specifications</label>
                          {specsData?.map((spec, idx) => (
                            <div key={idx} className="d-flex mb-2">
                              <input
                                value={spec.key}
                                onChange={e => handleInputChange(idx, 'key', e.target.value)}
                                placeholder="Key"
                                className="ui__form__field me-2"
                              />
                              <input
                                value={spec.value}
                                onChange={e => handleInputChange(idx, 'value', e.target.value)}
                                placeholder="Value"
                                className="ui__form__field me-2"
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={handleAddPair}
                            className="btn btn-outline-primary btn-sm"
                          >
                            + Add Spec
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Only one submit button at the end of the form */}
                  <div className="ui__form mt-4">
                    <button
                      type="submit"
                      className="ui__form__button w-100"
                    >
                      Update Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
