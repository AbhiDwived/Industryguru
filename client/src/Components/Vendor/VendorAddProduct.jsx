/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getMaincategory,
} from "../../Store/ActionCreators/MaincategoryActionCreators";
import {
  getSubcategory,
  getSubcategoryByMainId,
} from "../../Store/ActionCreators/SubcategoryActionCreators";
import {
  getBrand,
  getBrandBySubCategoryId,
} from "../../Store/ActionCreators/BrandActionCreators";
import { addProduct } from "../../Store/ActionCreators/ProductActionCreators";
import { getSlug } from "../../Store/ActionCreators/SlugActionCreators";
import {
  getSubSlugByParent,
  getSubSlug,
} from "../../Store/ActionCreators/SubSlugActionCreators";
import Wrapper from "./Wrapper";
import { showToast } from "../../utils/toast";

const initialVariant = {
  color: '',
  size: '',
  innerSlug: '',
  innerSubSlug: '',
  stock: 0,
  finalprice: 0,
  baseprice: 0,
  discount: 0,
  description: 'This is a sample variant description',
  specification: [{ key: '', value: '' }]
};

export default function VendorAddProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    maincategory: '',
    subcategory: '',
    brand: '',
    slug: '',
    subSlug: '',
    description: 'This is a sample Product',
    pic1: '',
    pic2: '',
    pic3: '',
    pic4: '',
  });
  const [variantList, setVariantList] = useState([]);
  const [variant, setVariant] = useState({ ...initialVariant });
  const [innerSlugs, setInnerSlugs] = useState([]);
  const [innerSubSlugs, setInnerSubSlugs] = useState([]);
  const [error, setError] = useState("");

  const allmaincategories = useSelector((state) => state.MaincategoryStateData);
  const allsubcategories = useSelector((state) => state.SubcategoryStateData);
  const allbrands = useSelector((state) => state.BrandStateData);
  const allSlugs = useSelector((state) => state.SlugStateData);
  const allSubSlugs = useSelector((state) => state.SubSlugStateData);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file uploads
  const getInputFile = (e) => {
    const { name, files } = e.target;
    setForm((old) => ({ ...old, [name]: files[0] }));
  };

  // Handle variant field changes
  const handleVariantChange = (e) => {
    setVariant({ ...variant, [e.target.name]: e.target.value });
  };

  // Handle specification change
  const handleSpecChange = (idx, field, value) => {
    const newSpecs = [...variant.specification];
    newSpecs[idx][field] = value;
    setVariant({ ...variant, specification: newSpecs });
  };

  // Add new specification row
  const addSpecRow = () => {
    setVariant({ ...variant, specification: [...variant.specification, { key: '', value: '' }] });
  };

  // Add variant to list
  const addVariant = () => {
    if (!variant.innerSlug || !variant.innerSubSlug) {
      return showToast.error('Please select both Inner Slug and Inner Sub Slug');
    }
    if (!variant.color || !variant.size) {
      return showToast.error('Please enter both Color and Size');
    }
    if (!variant.baseprice || !variant.stock) {
      return showToast.error('Please enter both Base Price and Stock');
    }
    if (!variant.description.trim()) {
      return showToast.error('Please enter a description for this variant');
    }
    // Validate specifications - ensure at least one spec has both key and value
    const validSpecs = variant.specification.filter(spec => spec.key.trim() && spec.value.trim());
    if (validSpecs.length === 0) {
      return showToast.error('Please add at least one specification with both key and value');
    }
    // Calculate final price
    const finalPrice = Math.round(variant.baseprice - (variant.baseprice * variant.discount) / 100);
    const variantWithFinalPrice = {
      ...variant,
      finalprice: finalPrice,
      specification: validSpecs
    };
    setVariantList([...variantList, variantWithFinalPrice]);
    setVariant({ ...initialVariant });
    showToast.success('Variant added successfully');
  };

  // Remove variant from list
  const removeVariant = (index) => {
    setVariantList(variantList.filter((_, i) => i !== index));
  };

  // Handle maincategory change
  const handleMainCategoryChange = (e) => {
    handleChange(e);
    dispatch(getSubcategoryByMainId(e.target.value));
  };

  // Handle subcategory change
  const handleSubCategoryChange = (e) => {
    handleChange(e);
    dispatch(getBrandBySubCategoryId(e.target.value));
  };

  // Handle slug change
  const handleSlugChange = (e) => {
    handleChange(e);
    const selectedSlugId = e.target.value;
    setForm(prev => ({
      ...prev,
      slug: selectedSlugId,
      subSlug: '',
    }));
    setInnerSlugs([]);
    setInnerSubSlugs([]);
    setVariant(prev => ({ ...prev, innerSlug: '', innerSubSlug: '' }));
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
    handleChange(e);
    const selectedSubSlugId = e.target.value;
    setInnerSubSlugs([]);
    setVariant(prev => ({ ...prev, innerSubSlug: '' }));
    if (selectedSubSlugId) {
      // Get inner sub slugs from selected sub slug
      const selectedSubSlug = allSubSlugs.find(ss => ss._id === selectedSubSlugId);
      if (selectedSubSlug && selectedSubSlug.innerSubSlugs) {
        setInnerSubSlugs(selectedSubSlug.innerSubSlugs);
      }
    }
  };

  // On submit, create products
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pic1) {
      return showToast.error('Please upload at least one product image');
    }
    if (variantList.length === 0) {
      return showToast.error('Please add at least one variant');
    }
    try {
      // Create single product with variants array
      const productItem = new FormData();
      // Add base product data
      Object.keys(form).forEach((key) => {
        if (key === "pic1" || key === "pic2" || key === "pic3" || key === "pic4") {
          if (form[key]) productItem.append(key, form[key]);
        } else if (form[key] !== undefined && form[key] !== "") {
          productItem.append(key, form[key]);
        }
      });
      // Add variants array
      productItem.append("variants", JSON.stringify(variantList));
      // Set default values for the main product (will be overridden by selected variant)
      const avgFinalPrice = Math.round(
        variantList.reduce((sum, v) => sum + v.finalprice, 0) / variantList.length
      );
      productItem.append("finalprice", avgFinalPrice);
      productItem.append("baseprice", avgFinalPrice);
      productItem.append("discount", 0);
      productItem.append("stock", variantList.reduce((sum, v) => sum + v.stock, 0));
      productItem.append("color", "Multiple");
      productItem.append("size", "Multiple");
      productItem.append("specification", JSON.stringify([{ key: "Variants", value: variantList.length }]));
      const loadingToast = showToast.loading('Uploading product...');
      await dispatch(addProduct(productItem));
      showToast.success('Product uploaded successfully!');
      navigate("/vendor-products");
      // Reset form
      setForm({
        name: '',
        maincategory: '',
        subcategory: '',
        brand: '',
        slug: '',
        subSlug: '',
        description: 'This is a sample Product',
        pic1: '',
        pic2: '',
        pic3: '',
        pic4: '',
      });
      setVariantList([]);
      setVariant({ ...initialVariant });
      setInnerSlugs([]);
      setInnerSubSlugs([]);
    } catch (error) {
      console.error("Error creating product:", error);
      showToast.error('Error uploading product. Please try again.');
    }
  };

  // Load initial data
  useEffect(() => {
    dispatch(getMaincategory());
    dispatch(getSubcategory());
    dispatch(getBrand());
    dispatch(getSlug());
    dispatch(getSubSlug());
  }, [dispatch]);

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
                  <h3 className="flex-1">Add Product</h3>
                </div>
              </div>
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="ui__form">
                        <label className="ui__form__label">Product Name</label>
                        <input 
                          name="name" 
                          value={form.name} 
                          onChange={handleChange} 
                          placeholder="Product Name" 
                          required 
                          className="ui__form__field"
                        />
                      </div>
                      <div className="ui__form">
                        <label className="ui__form__label">Description</label>
                        <textarea 
                          name="description" 
                          value={form.description} 
                          onChange={handleChange} 
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
                              value={form.maincategory} 
                              onChange={handleMainCategoryChange} 
                              className="ui__form__field"
                              required
                            >
                              <option value="">Select Category</option>
                              {allmaincategories.map((item, index) => (
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
                              value={form.subcategory} 
                              onChange={handleSubCategoryChange} 
                              className="ui__form__field"
                              required
                            >
                              <option value="">Select Sub Category</option>
                              {allsubcategories.map((item, index) => (
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
                              value={form.brand} 
                              onChange={handleChange} 
                              className="ui__form__field"
                              required
                            >
                              <option value="">Select Brand</option>
                              {allbrands.map((item, index) => (
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
                              value={form.slug} 
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
                              value={form.subSlug}
                              onChange={handleSubSlugChange}
                              className="ui__form__field"
                              disabled={!form.slug}
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
                              <input type="file" name="pic1" onChange={getInputFile} className="form-control" required />
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
                  {/* VARIANT SECTION START */}
                  <div className="card mt-4 mb-4">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">Add Variants</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="ui__form">
                            <label className="ui__form__label">Inner Slug</label>
                            <select
                              name="innerSlug"
                              value={variant.innerSlug}
                              onChange={handleVariantChange}
                              className="ui__form__field"
                              disabled={!form.slug}
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
                              name="innerSubSlug"
                              value={variant.innerSubSlug}
                              onChange={handleVariantChange}
                              className="ui__form__field"
                              disabled={!form.subSlug}
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
                              name="color"
                              value={variant.color}
                              onChange={handleVariantChange}
                              placeholder="Color"
                              className="ui__form__field"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="ui__form">
                            <label className="ui__form__label">Size</label>
                            <input
                              name="size"
                              value={variant.size}
                              onChange={handleVariantChange}
                              placeholder="Size"
                              className="ui__form__field"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="ui__form">
                            <label className="ui__form__label">Base Price</label>
                            <input
                              name="baseprice"
                              value={variant.baseprice}
                              onChange={handleVariantChange}
                              placeholder="Base Price"
                              type="number"
                              className="ui__form__field"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="ui__form">
                            <label className="ui__form__label">Discount (%)</label>
                            <input
                              name="discount"
                              value={variant.discount}
                              onChange={handleVariantChange}
                              placeholder="Discount (%)"
                              type="number"
                              className="ui__form__field"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="ui__form">
                            <label className="ui__form__label">Stock</label>
                            <input
                              name="stock"
                              value={variant.stock}
                              onChange={handleVariantChange}
                              placeholder="Stock"
                              type="number"
                              className="ui__form__field"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="ui__form">
                        <label className="ui__form__label">Variant Description</label>
                        <textarea
                          name="description"
                          value={variant.description}
                          onChange={handleVariantChange}
                          placeholder="Variant specific description"
                          rows="3"
                          className="ui__form__field"
                        />
                      </div>
                      <div className="ui__form">
                        <label className="ui__form__label">Final Price (Auto-calculated)</label>
                        <input
                          value={Math.round(variant.baseprice - (variant.baseprice * variant.discount) / 100)}
                          readOnly
                          className="ui__form__field"
                          style={{ backgroundColor: '#f8f9fa' }}
                        />
                      </div>
                      <div className="ui__form">
                        <label className="ui__form__label">Specifications</label>
                        {variant.specification.map((spec, idx) => (
                          <div key={idx} className="d-flex mb-2">
                            <input
                              value={spec.key}
                              onChange={e => handleSpecChange(idx, 'key', e.target.value)}
                              placeholder="Key"
                              className="ui__form__field me-2"
                            />
                            <input
                              value={spec.value}
                              onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                              placeholder="Value"
                              className="ui__form__field me-2"
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addSpecRow}
                          className="btn btn-outline-primary btn-sm"
                        >
                          + Add Spec
                        </button>
                      </div>
                      <div className="ui__form">
                        <button
                          type="button"
                          onClick={addVariant}
                          className="btn btn-primary"
                        >
                          Add Variant
                        </button>
                      </div>
                      <div className="ui__form">
                        <label className="ui__form__label">Variants Added:</label>
                        {variantList.length === 0 ? (
                          <p className="text-muted">No variants added yet</p>
                        ) : (
                          <div className="list-group">
                            {variantList.map((v, i) => (
                              <div key={i} className="list-group-item">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="flex-grow-1">
                                    <strong>{v.innerSlug} - {v.innerSubSlug}</strong><br/>
                                    <small>Color: {v.color} | Size: {v.size} | Price: ₹{v.finalprice} | Stock: {v.stock}</small><br/>
                                    <small className="text-muted">Description: {v.description}</small>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeVariant(i)}
                                    className="btn btn-danger btn-sm ms-2"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* VARIANT SECTION END */}
                  {/* Only one submit button at the end of the form */}
                  <div className="ui__form mt-4">
                    <button
                      type="submit"
                      className="ui__form__button w-100"
                      disabled={variantList.length === 0}
                    >
                      Upload Product
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