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
import { updateProductAPI } from "../../Store/Services/ProductService";
import { apiLink } from "../../utils/utils";

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
    description: "",
    defaultDescription: "",
    variantDescription: ""
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
  
  const [isUpdating, setIsUpdating] = useState(false);

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
    
    // Check for validation errors
    let error = Object.keys(errorMessage).find(
      (x) => errorMessage[x] && errorMessage[x].length !== 0
    );
    
    // Check for required fields
    if (!data.name || !data.maincategory || !data.subcategory || !data.brand) {
      setShow(true);
      showToast.error('Please fill all required fields');
      return;
    }
    
    if (!error) {
      console.log('Form data before submission:', data);
      console.log('Specs data:', specsData);
      console.log('Variants data:', variants);
      
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
      item.append("defaultDescription", data.defaultDescription || "");
      item.append("variantDescription", data.variantDescription || "");

      item.append("specification", JSON.stringify(specsData.filter(spec => spec.key && spec.value)));
      if (variants.length > 0) {
        // Clean up variants data before sending
        const cleanVariants = variants.map(variant => ({
          ...variant,
          specifications: (variant.specifications || variant.specification || []).filter(spec => spec.key && spec.value)
        }));
        item.append("variants", JSON.stringify(cleanVariants));
      }
      if (data.pic1) item.append("pic1", data.pic1);
      if (data.pic2) item.append("pic2", data.pic2);
      if (data.pic3) item.append("pic3", data.pic3);
      if (data.pic4) item.append("pic4", data.pic4);
      
      setIsUpdating(true);
      try {
        const response = await updateProductAPI(item);
        console.log('Update response:', response);
        if (response.result === 'Done') {
          showToast.success('Product updated successfully!');
          navigate("/admin-products");
        } else {
          showToast.error(response.message || 'Failed to update product');
        }
      } catch (error) {
        console.error('Update error:', error);
        showToast.error('Failed to update product: ' + (error.message || 'Unknown error'));
      } finally {
        setIsUpdating(false);
      }
    } else {
      setShow(true);
      showToast.error('Please fix the validation errors');
    }
  }


  useEffect(() => {
    dispatch(getMaincategory());
    dispatch(getBrand());
    dispatch(getAdminSlug());
    dispatch(getAdminSubSlug());
    
    // Fetch specific product by ID
    if (_id) {
      fetchProductData();
    }
    // eslint-disable-next-line
  }, [_id]);

  const fetchProductData = async () => {
    try {
      console.log("Fetching admin product data for ID:", _id);
      const response = await fetch(`${apiLink}/api/product/${_id}`, {
        method: "get",
        headers: {
          authorization: localStorage.getItem("token"),
          "content-type": "application/json",
        },
      });
      const result = await response.json();
      console.log("Admin product fetch result:", result);
      
      if (result.result === "Done" && result.data) {
        const item = result.data;
        console.log("Setting admin product data:", item);
        
        setData({ 
          ...item, 
          brand: item?.brand?._id || item?.brand,
          maincategory: item?.maincategory?._id || item?.maincategory,
          subcategory: item?.subcategory?._id || item?.subcategory,
          slug: item?.slug?._id || item?.slug,
          subSlug: item?.subSlug?._id || item?.subSlug,
          defaultDescription: item.defaultDescription || "",
          variantDescription: item.variantDescription || ""
        });
        
        setSpecsData(item.specification && item.specification.length > 0 ? item.specification : [{ key: "", value: "" }]);
        
        const updatedVariants = (item.variants || []).map(variant => ({
          ...variant,
          defaultDescription: variant.description || variant.defaultDescription || "",
          variantDescription: variant.variantDescription || variant.additionalDescription || "",
          specifications: variant.specification && variant.specification.length > 0 ? variant.specification : [{ key: "", value: "" }]
        }));
        setVariants(updatedVariants);
        
        console.log("Admin data set successfully");
        
        // Load related data
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
    } catch (error) {
      console.error("Error fetching admin product:", error);
    }
  };

  useEffect(() => {
    if (allmaincategories.length) setMaincategory(allmaincategories);
    if (allsubcategories.length) setSubcategory(allsubcategories);
    if (allbrands.length) setBrand(allbrands);

    if (allproducts.length && _id) {
      let item = allproducts.find((x) => x._id === _id);
      if (item && !data.name) {
        console.log('Loading product data:', item);
        setData({ 
          ...item, 
          brand: item?.brand?._id || item?.brand,
          maincategory: item?.maincategory?._id || item?.maincategory,
          subcategory: item?.subcategory?._id || item?.subcategory,
          slug: item?.slug?._id || item?.slug,
          subSlug: item?.subSlug?._id || item?.subSlug,

          defaultDescription: item.defaultDescription || "",
          variantDescription: item.variantDescription || "",
          baseprice: item.baseprice || 0,
          discount: item.discount || 0,
          stock: item.stock || 0
        });
        setSpecsData(item.specification && item.specification.length > 0 ? item.specification : [{ key: "", value: "" }]);
        const updatedVariants = (item.variants || []).map(variant => ({
          ...variant,
          defaultDescription: variant.description || "",
          variantDescription: variant.variantDescription || "",
          specifications: variant.specification && variant.specification.length > 0 ? variant.specification : [{ key: "", value: "" }]
        }));
        setVariants(updatedVariants);
        
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
                        {[1, 2, 3, 4].map((num) => {
                          const picKey = `pic${num}`;
                          const currentProduct = allproducts.find(p => p._id === _id);
                          const existingImage = currentProduct?.[picKey];
                          const newImage = data[picKey];
                          const imageUrl = (newImage && newImage instanceof File) ? URL.createObjectURL(newImage) : (existingImage ? `${apiLink}/products/${existingImage}` : null);
                          
                          return (
                            <div key={num} className="col-md-6 mb-3">
                              <div className="profile__photo profile__photo__rouned" style={{ position: 'relative', height: '150px', border: '2px dashed #ddd' }}>
                                {imageUrl ? (
                                  <img src={imageUrl} alt={`Product ${num}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                ) : (
                                  <div className="d-flex align-items-center justify-content-center h-100">
                                    <div className="text-center">
                                      <i className="fa fa-image fa-2x text-muted"></i>
                                      <p className="mt-2 text-muted">Upload Image {num}</p>
                                    </div>
                                  </div>
                                )}
                                <input 
                                  type="file" 
                                  name={picKey} 
                                  onChange={getInputFile} 
                                  className="form-control" 
                                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                  accept="image/*"
                                />
                              </div>
                            </div>
                          );
                        })}
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
                              <div className="col-md-4">
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
                              <div className="col-md-4">
                                <div className="ui__form">
                                  <label className="ui__form__label">Final Price (Auto-calculated)</label>
                                  <input
                                    value={Math.round(variant.baseprice - (variant.baseprice * variant.discount) / 100) || 0}
                                    readOnly
                                    className="ui__form__field"
                                    style={{ backgroundColor: '#f8f9fa' }}
                                  />
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="ui__form">
                                  <label className="ui__form__label">Default Description (Will appear as first bullet point)</label>
                                  <textarea
                                    value={variant.defaultDescription || variant.description || ""}
                                    onChange={(e) => {
                                      const newVariants = [...variants];
                                      newVariants[idx].defaultDescription = e.target.value;
                                      newVariants[idx].description = e.target.value;
                                      setVariants(newVariants);
                                    }}
                                    placeholder="• This is a sample Product"
                                    rows="3"
                                    className="ui__form__field"
                                  />
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="ui__form">
                                  <label className="ui__form__label">Additional Variant Description</label>
                                  <textarea
                                    value={variant.variantDescription || ""}
                                    onChange={(e) => {
                                      const newVariants = [...variants];
                                      newVariants[idx].variantDescription = e.target.value;
                                      setVariants(newVariants);
                                    }}
                                    placeholder="variant specific description"
                                    rows="3"
                                    className="ui__form__field"
                                  />
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="ui__form">
                                  <label className="ui__form__label">Specifications</label>
                                  {(variant.specifications || variant.specification || [{ key: "", value: "" }]).map((spec, specIdx) => (
                                    <div key={specIdx} className="d-flex mb-2">
                                      <input
                                        value={spec.key}
                                        onChange={(e) => {
                                          const newVariants = [...variants];
                                          if (!newVariants[idx].specifications) newVariants[idx].specifications = [];
                                          newVariants[idx].specifications[specIdx] = { ...spec, key: e.target.value };
                                          setVariants(newVariants);
                                        }}
                                        placeholder="Key"
                                        className="ui__form__field me-2"
                                      />
                                      <input
                                        value={spec.value}
                                        onChange={(e) => {
                                          const newVariants = [...variants];
                                          if (!newVariants[idx].specifications) newVariants[idx].specifications = [];
                                          newVariants[idx].specifications[specIdx] = { ...spec, value: e.target.value };
                                          setVariants(newVariants);
                                        }}
                                        placeholder="Value"
                                        className="ui__form__field me-2"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newVariants = [...variants];
                                          if (newVariants[idx].specifications && newVariants[idx].specifications.length > 1) {
                                            newVariants[idx].specifications.splice(specIdx, 1);
                                            setVariants(newVariants);
                                          }
                                        }}
                                        className="btn btn-outline-danger btn-sm"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newVariants = [...variants];
                                      if (!newVariants[idx].specifications) newVariants[idx].specifications = [];
                                      newVariants[idx].specifications.push({ key: "", value: "" });
                                      setVariants(newVariants);
                                    }}
                                    className="btn btn-outline-primary btn-sm"
                                  >
                                    + Add Spec
                                  </button>
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
                          <div className="col-md-6">
                            <div className="ui__form">
                              <label className="ui__form__label">Final Price (Auto-calculated)</label>
                              <input
                                value={Math.round(data.baseprice - (data.baseprice * data.discount) / 100) || 0}
                                readOnly
                                className="ui__form__field"
                                style={{ backgroundColor: '#f8f9fa' }}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="ui__form">
                              <label className="ui__form__label">Default Description (Will appear as first bullet point)</label>
                              <textarea
                                name="defaultDescription"
                                value={data.defaultDescription || ""}
                                onChange={getInputData}
                                placeholder="• This is a sample Product"
                                rows="3"
                                className="ui__form__field"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="ui__form">
                              <label className="ui__form__label">Additional Variant Description</label>
                              <textarea
                                name="variantDescription"
                                value={data.variantDescription || ""}
                                onChange={getInputData}
                                placeholder="variant specific description"
                                rows="3"
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
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Update Product'}
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
