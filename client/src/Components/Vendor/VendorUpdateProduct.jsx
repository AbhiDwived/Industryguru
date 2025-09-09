import React, { useEffect, useState } from "react";
import Wrapper from "./Wrapper";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import formValidation from "../CustomValidation/formValidation";
import {
  getProduct,
} from "../../Store/ActionCreators/ProductActionCreators";
import { updateVendorProductAPI } from "../../Store/Services/ProductService";
import { apiLink } from "../../utils/utils";
import { getMaincategory } from "../../Store/ActionCreators/MaincategoryActionCreators";
import { getSubcategory, getSubcategoryByMainId } from "../../Store/ActionCreators/SubcategoryActionCreators";
import { getBrand } from "../../Store/ActionCreators/BrandActionCreators";
import { getSlug } from "../../Store/ActionCreators/SlugActionCreators";
import { getSubSlugByParent, getSubSlug } from "../../Store/ActionCreators/SubSlugActionCreators";
import { showToast } from "../../utils/toast";

export default function VendorUpdateProduct() {

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
    innerSlug: "",
    innerSubSlug: "",
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
  let allSlugs = useSelector((state) => state.SlugStateData);
  let allSubSlugs = useSelector((state) => state.SubSlugStateData);

  const [specsData, setSpecsData] = useState([{ key: "", value: "" }]);
  const [variants, setVariants] = useState([]);
  const [innerSlugs, setInnerSlugs] = useState([]);
  const [innerSubSlugs, setInnerSubSlugs] = useState([]);
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

  // Handle slug change
  const handleSlugChange = (e) => {
    getInputData(e);
    const selectedSlugId = e.target.value;
    setInnerSlugs([]);
    setInnerSubSlugs([]);
    if (selectedSlugId) {
      dispatch(getSubSlugByParent({ parentSlugId: selectedSlugId }));
      // Get inner slugs from selected slug
      const selectedSlug = allSlugs.find(s => s._id === selectedSlugId);
      if (selectedSlug && selectedSlug.innerSlugs) {
        setInnerSlugs(selectedSlug.innerSlugs);
      }
    }
  };

  // Handle sub slug change
  const handleSubSlugChange = (e) => {
    getInputData(e);
    const selectedSubSlugId = e.target.value;
    setInnerSubSlugs([]);
    if (selectedSubSlugId) {
      // Get inner sub slugs from selected sub slug
      const selectedSubSlug = allSubSlugs.find(ss => ss._id === selectedSubSlugId);
      if (selectedSubSlug && selectedSubSlug.innerSubSlugs) {
        setInnerSubSlugs(selectedSubSlug.innerSubSlugs);
      }
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
    console.log("=== UPDATE PRODUCT DEBUG ===");
    console.log("Main Data:", data);
    console.log("Variants Data:", variants);
    console.log("Variants Length:", variants.length);
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
      item.append("innerSlug", data.innerSlug || "");
      item.append("innerSubSlug", data.innerSubSlug || "");
      item.append("color", data.color || "");
      item.append("size", data.size || "");
      item.append("baseprice", parseInt(data.baseprice || 0));
      item.append("discount", parseInt(data.discount || 0));
      item.append("finalprice", fp);
      item.append("stock", data.stock || "");
      item.append("description", data.description || "");
      item.append("defaultDescription", data.defaultDescription || "");
      item.append("variantDescription", data.variantDescription || "");
      item.append("specification", JSON.stringify(specsData));
      if (variants.length > 0) {
        // Ensure variant specifications are properly formatted
        const formattedVariants = variants.map((variant, idx) => {
          console.log(`Variant ${idx}:`, {
            color: variant.color,
            size: variant.size,
            baseprice: variant.baseprice,
            discount: variant.discount,
            finalprice: variant.finalprice,
            stock: variant.stock,
            innerSlug: variant.innerSlug,
            innerSubSlug: variant.innerSubSlug
          });
          return {
            ...variant,
            specification: variant.specifications || variant.specification || []
          };
        });
        console.log("Formatted Variants:", formattedVariants);
        item.append("variants", JSON.stringify(formattedVariants));
      }
      if (data.pic1) item.append("pic1", data.pic1);
      if (data.pic2) item.append("pic2", data.pic2);
      if (data.pic3) item.append("pic3", data.pic3);
      if (data.pic4) item.append("pic4", data.pic4);
      console.log("Sending update request...");
      const result = await updateVendorProductAPI(_id, item);
      console.log("API Response Data:", result);
      
      if (result.result === 'Done') {
        showToast.success('Product updated successfully!');
        // Refresh the current page data instead of navigating away
        window.location.reload();
      } else {
        console.error('Update failed:', result.message);
        showToast.error('Update failed: ' + (result.message || 'Unknown error'));
      }
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
      dispatch(getSlug());
    }
    if (!allSubSlugs.length) {
      dispatch(getSubSlug());
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
          subSlug: item?.subSlug?._id || item?.subSlug,
          innerSlug: item?.innerSlug?._id || item?.innerSlug || "",
          innerSubSlug: item?.innerSubSlug?._id || item?.innerSubSlug || "",
          defaultDescription: item.defaultDescription || "",
          variantDescription: item.variantDescription || ""
        });
        setSpecsData(item.specification && item.specification.length > 0 ? item.specification : [{ key: "", value: "" }]);
        const updatedVariants = (item.variants || []).map(variant => ({
          ...variant,
          innerSlug: variant.innerSlug || "",
          innerSubSlug: variant.innerSubSlug || "",
          defaultDescription: variant.description || variant.defaultDescription || "",
          variantDescription: variant.variantDescription || variant.additionalDescription || "",
          specifications: variant.specification && variant.specification.length > 0 ? variant.specification : [{ key: "", value: "" }]
        }));
        setVariants(updatedVariants);
        
        // Load related data for the current product
        if (item?.maincategory?._id || item?.maincategory) {
          dispatch(getSubcategoryByMainId(item?.maincategory?._id || item?.maincategory));
        }
        if (item?.slug?._id || item?.slug) {
          dispatch(getSubSlugByParent({ parentSlugId: item?.slug?._id || item?.slug }));
          // Load inner slugs
          const selectedSlug = allSlugs.find(s => s._id === (item?.slug?._id || item?.slug));
          if (selectedSlug && selectedSlug.innerSlugs) {
            setInnerSlugs(selectedSlug.innerSlugs);
          }
        }
        // Load inner sub slugs after a delay to ensure allSubSlugs is populated
        setTimeout(() => {
          if (item?.subSlug?._id || item?.subSlug) {
            const selectedSubSlug = allSubSlugs.find(ss => ss._id === (item?.subSlug?._id || item?.subSlug));
            if (selectedSubSlug && selectedSubSlug.innerSubSlugs) {
              setInnerSubSlugs(selectedSubSlug.innerSubSlugs);
            }
          }
        }, 100);
      }
    }
    // eslint-disable-next-line
  }, [allproducts.length, allmaincategories.length, allsubcategories.length, allbrands.length, allSlugs.length, allSubSlugs.length]);
  return (
    <div className="page_section">
      <div className="container-fluid my-3">
        <div className="row">
          <div className="col-md-3">
            <Wrapper />
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
                              onChange={getInputData} 
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
                                <option key={index} value={item._id}>{item.name || item.slug}</option>
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
                              onChange={handleSubSlugChange}
                              className="ui__form__field"
                              disabled={!data.slug}
                            >
                              <option value="">Select Sub Slug</option>
                              {allSubSlugs.map((item, index) => (
                                <option key={index} value={item._id}>{item.name || item.slug}</option>
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
                              {data.pic1 ? (
                                <img 
                                  src={typeof data.pic1 === 'string' ? `${apiLink}/public/products/${data.pic1}` : URL.createObjectURL(data.pic1)} 
                                  alt="Preview" 
                                  style={{width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0}} 
                                />
                              ) : (
                                <div className="overlay text-center profile__photo__rouned">
                                  <p>
                                    <i className="fa fa-image"></i>
                                    <br />
                                    Upload Image 1
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="profile__photo profile__photo__rouned">
                            <div className="profile__photo__inner profile__photo__rouned">
                              <input type="file" name="pic2" onChange={getInputFile} className="form-control" />
                              {data.pic2 ? (
                                <img 
                                  src={typeof data.pic2 === 'string' ? `${apiLink}/public/products/${data.pic2}` : URL.createObjectURL(data.pic2)} 
                                  alt="Preview" 
                                  style={{width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0}} 
                                />
                              ) : (
                                <div className="overlay text-center profile__photo__rouned">
                                  <p>
                                    <i className="fa fa-image"></i>
                                    <br />
                                    Upload Image 2
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="profile__photo profile__photo__rouned">
                            <div className="profile__photo__inner profile__photo__rouned">
                              <input type="file" name="pic3" onChange={getInputFile} className="form-control" />
                              {data.pic3 ? (
                                <img 
                                  src={typeof data.pic3 === 'string' ? `${apiLink}/public/products/${data.pic3}` : URL.createObjectURL(data.pic3)} 
                                  alt="Preview" 
                                  style={{width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0}} 
                                />
                              ) : (
                                <div className="overlay text-center profile__photo__rouned">
                                  <p>
                                    <i className="fa fa-image"></i>
                                    <br />
                                    Upload Image 3
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="profile__photo profile__photo__rouned">
                            <div className="profile__photo__inner profile__photo__rouned">
                              <input type="file" name="pic4" onChange={getInputFile} className="form-control" />
                              {data.pic4 ? (
                                <img 
                                  src={typeof data.pic4 === 'string' ? `${apiLink}/public/products/${data.pic4}` : URL.createObjectURL(data.pic4)} 
                                  alt="Preview" 
                                  style={{width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0}} 
                                />
                              ) : (
                                <div className="overlay text-center profile__photo__rouned">
                                  <p>
                                    <i className="fa fa-image"></i>
                                    <br />
                                    Upload Image 4
                                  </p>
                                </div>
                              )}
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
                                  <label className="ui__form__label">Inner Slug</label>
                                  <select
                                    value={variant.innerSlug || ""}
                                    onChange={(e) => {
                                      const newVariants = [...variants];
                                      newVariants[idx].innerSlug = e.target.value;
                                      setVariants(newVariants);
                                    }}
                                    className="ui__form__field"
                                  >
                                    <option value="">Select Inner Slug</option>
                                    {innerSlugs.map((slug, index) => (
                                      <option key={index} value={slug}>{slug}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="ui__form">
                                  <label className="ui__form__label">Inner Sub Slug</label>
                                  <select
                                    value={variant.innerSubSlug || ""}
                                    onChange={(e) => {
                                      const newVariants = [...variants];
                                      newVariants[idx].innerSubSlug = e.target.value;
                                      setVariants(newVariants);
                                    }}
                                    className="ui__form__field"
                                  >
                                    <option value="">Select Inner Sub Slug</option>
                                    {innerSubSlugs.map((subSlug, index) => (
                                      <option key={index} value={subSlug}>{subSlug}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
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
                                    value={variant.baseprice || ""}
                                    onChange={(e) => {
                                      const newVariants = [...variants];
                                      const basepriceValue = e.target.value === "" ? 0 : Number(e.target.value);
                                      console.log(`Updating variant ${idx} baseprice from ${newVariants[idx].baseprice} to ${basepriceValue}`);
                                      newVariants[idx].baseprice = basepriceValue;
                                      newVariants[idx].finalprice = Math.round((basepriceValue || 0) - ((basepriceValue || 0) * (newVariants[idx].discount || 0)) / 100);
                                      console.log(`New final price for variant ${idx}:`, newVariants[idx].finalprice);
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
                                    value={variant.discount || 0}
                                    onFocus={() => console.log(`Focused on discount field for variant ${idx}`)}
                                    onBlur={() => console.log(`Blurred discount field for variant ${idx}`)}
                                    onChange={(e) => {
                                      console.log(`=== DISCOUNT CHANGE EVENT ===`);
                                      console.log(`Variant ${idx} - Input value:`, e.target.value);
                                      console.log(`Variant ${idx} - Current discount:`, variant.discount);
                                      console.log(`Variant ${idx} - Current variant:`, variant);
                                      
                                      const newVariants = [...variants];
                                      const discountValue = parseFloat(e.target.value) || 0;
                                      
                                      console.log(`Updating variant ${idx} discount to:`, discountValue);
                                      
                                      newVariants[idx] = {
                                        ...newVariants[idx],
                                        discount: discountValue
                                      };
                                      
                                      const baseprice = parseFloat(newVariants[idx].baseprice) || 0;
                                      newVariants[idx].finalprice = Math.round(baseprice - (baseprice * discountValue) / 100);
                                      
                                      console.log(`Updated variant ${idx}:`, newVariants[idx]);
                                      console.log(`All variants after update:`, newVariants);
                                      
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
                                    value={variant.stock || ""}
                                    onChange={(e) => {
                                      const newVariants = [...variants];
                                      newVariants[idx].stock = e.target.value === "" ? "" : Number(e.target.value);
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
                                    value={Math.round((variant.baseprice || 0) - ((variant.baseprice || 0) * (variant.discount || 0)) / 100) || 0}
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
                                value={Math.round((data.baseprice || 0) - ((data.baseprice || 0) * (data.discount || 0)) / 100) || 0}
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