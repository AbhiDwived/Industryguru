/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Form, Formik, Field } from "formik";
import { getMaincategory } from "../../Store/ActionCreators/MaincategoryActionCreators";
import { getSubcategory } from "../../Store/ActionCreators/SubcategoryActionCreators";
import { getBrand } from "../../Store/ActionCreators/BrandActionCreators";
import { getVendorSlug } from "../../Store/ActionCreators/VendorSlugActionCreators";
import { getVendorSubSlug, getVendorSubSlugByParent } from "../../Store/ActionCreators/VendorSubSlugActionCreators";
import Wrapper from "./Wrapper";
import { apiLink } from "../../utils/utils";
import {
  addVendorProductAPI,
  getProductAPIById,
  updateVendorProductAPI,
} from "../../Store/Services/ProductService";

const getImage = (img) => {
  if (img && img.startsWith("data:image")) {
    return img
  }
  return `${apiLink}/public/products/${img}`
}

export default function VendorUpdateProduct({ isAdd = false }) {
  let [data, setData] = useState({
    name: "",
    addedBy: "",
    maincategory: "",
    subcategory: "",
    brand: "",
    color: "",
    size: "",
    baseprice: "",
    discount: "",
    finalprice: "",
    stock: "In Stock",
    specification: [],
    description: "",
    pic1: "",
    pic2: "",
    pic3: "",
    pic4: "",
    slug: "",
    innerSlug: "",
    subSlug: "",
    innerSubSlug: ""
  });
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let params = useParams();
  let productId = params._id;
  
  let [maincategory, setMaincategory] = useState([]);
  let [subcategory, setSubcategory] = useState([]);
  let [brand, setBrand] = useState([]);
  let [slugs, setSlugs] = useState([]);
  let [innerSlugs, setInnerSlugs] = useState([]);
  let [subSlugs, setSubSlugs] = useState([]);
  let [innerSubSlugs, setInnerSubSlugs] = useState([]);
  let [dataFetched, setDataFetched] = useState(false);
  let [productFetched, setProductFetched] = useState(false);

  let allmaincategories = useSelector((state) => state.MaincategoryStateData);
  let allsubcategories = useSelector((state) => state.SubcategoryStateData);
  let allbrands = useSelector((state) => state.BrandStateData);
  let allSlugs = useSelector((state) => state.VendorSlugStateData);
  let allSubSlugs = useSelector((state) => state.VendorSubSlugStateData);

  // Fetch all required data only once when component mounts
  useEffect(() => {
    if (!dataFetched) {
      dispatch(getMaincategory());
      dispatch(getSubcategory());
      dispatch(getBrand());
      dispatch(getVendorSlug());
      dispatch(getVendorSubSlug());
      setDataFetched(true);
    }
  }, [dispatch, dataFetched]);

  // Update local state when Redux store updates
  useEffect(() => {
    if (allmaincategories.length) setMaincategory(allmaincategories);
    if (allsubcategories.length) setSubcategory(allsubcategories);
    if (allbrands.length) setBrand(allbrands);
    if (allSlugs.length) setSlugs(allSlugs);
    if (allSubSlugs.length) setSubSlugs(allSubSlugs);
  }, [allmaincategories, allsubcategories, allbrands, allSlugs, allSubSlugs]);

  const handleSlugChange = (e, setFieldValue) => {
    const selectedSlugId = e.target.value;
    setFieldValue("slug", selectedSlugId);
    setFieldValue("innerSlug", "");
    setFieldValue("subSlug", "");
    setFieldValue("innerSubSlug", "");
    setInnerSlugs([]);
    setSubSlugs([]);
    setInnerSubSlugs([]);
    
    if (selectedSlugId) {
      const selectedSlugObj = allSlugs.find(s => s._id === selectedSlugId);
      if (selectedSlugObj && selectedSlugObj.innerSlugs && selectedSlugObj.innerSlugs.length > 0) {
        setInnerSlugs(selectedSlugObj.innerSlugs);
      }
      
      // Load sub-slugs separately
      dispatch(getVendorSubSlugByParent({ parentSlugId: selectedSlugId }));
    }
  };

  const handleSubSlugChange = (e, setFieldValue) => {
    const selectedSubSlugId = e.target.value;
    setFieldValue("subSlug", selectedSubSlugId);
    setFieldValue("innerSubSlug", "");
    setInnerSubSlugs([]);
    
    if (selectedSubSlugId) {
      const selectedSubSlugObj = allSubSlugs.find(ss => ss._id === selectedSubSlugId);
      if (selectedSubSlugObj && selectedSubSlugObj.innerSubSlugs && selectedSubSlugObj.innerSubSlugs.length > 0) {
        setInnerSubSlugs(selectedSubSlugObj.innerSubSlugs);
      }
    }
  };

  // Fetch product data only once when component mounts and required data is loaded
  useEffect(() => {
    if (isAdd || !productId || productFetched || !allSlugs.length || !allSubSlugs.length) return;
    
    getProductAPIById(productId)
      .then((res) => res.json())
      .then((res) => {
        if (res.result === "Done") {
          // Process brand data
          let brandId = res.data.brand;
          if (typeof brandId === 'object' && brandId !== null) {
            brandId = brandId._id;
          } else if (typeof brandId === 'string' && brandId.startsWith('{')) {
            try {
              const parsedBrand = JSON.parse(brandId);
              brandId = parsedBrand._id ? parsedBrand._id.replace(/"/g, '') : brandId;
            } catch (e) {
              console.error("Error parsing brand JSON:", e);
            }
          }
          
          const processedData = {
            ...res.data,
            maincategory: res.data.maincategory && typeof res.data.maincategory === 'object' ? res.data.maincategory._id : res.data.maincategory,
            subcategory: res.data.subcategory && typeof res.data.subcategory === 'object' ? res.data.subcategory._id : res.data.subcategory,
            brand: brandId,
            slug: res.data.slug && typeof res.data.slug === 'object' ? res.data.slug._id : res.data.slug,
            subSlug: res.data.subSlug && typeof res.data.subSlug === 'object' ? res.data.subSlug._id : res.data.subSlug,
          };
          
          setData(processedData);
          
          // If the product has a slug, load the related inner slugs
          if (processedData.slug) {
            const selectedSlugObj = allSlugs.find(s => s._id === processedData.slug);
            if (selectedSlugObj && selectedSlugObj.innerSlugs && selectedSlugObj.innerSlugs.length > 0) {
              setInnerSlugs(selectedSlugObj.innerSlugs);
            }
            
            // Load sub-slugs for this slug
            dispatch(getVendorSubSlugByParent({ parentSlugId: processedData.slug }));
            
            // After loading sub-slugs, we need to set inner sub slugs if available
            setTimeout(() => {
              if (processedData.subSlug) {
                const updatedSubSlugs = allSubSlugs.filter(ss => ss.parentSlug === processedData.slug);
                setSubSlugs(updatedSubSlugs);
                
                const selectedSubSlugObj = updatedSubSlugs.find(ss => ss._id === processedData.subSlug);
                if (selectedSubSlugObj && selectedSubSlugObj.innerSubSlugs && selectedSubSlugObj.innerSubSlugs.length > 0) {
                  setInnerSubSlugs(selectedSubSlugObj.innerSubSlugs);
                }
              }
            }, 500);
          }
          
          setProductFetched(true);
        } else {
          alert("Unable to fetch product details");
          navigate("/vendor/products");
        }
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        alert("Unable to fetch product details");
        navigate("/vendor/products");
      });
  }, [productId, allSlugs, allSubSlugs, isAdd, productFetched, dispatch, navigate]);

  return (
    <>
      <Wrapper>
        <div className="box__layout">
          <div className="header__layout">
            <div className="row">
              <h3 className="flex-1">Edit Product</h3>
              <div className="col-md-3 text-right">
                <Link to="/vendor/products" className="add__item">
                  Go Back
                </Link>
              </div>
            </div>
          </div>
          <div>
            <Formik
              initialValues={{
                ...data,
                pic_1: data.pic1,
                pic_2: data.pic2,
                pic_3: data.pic3,
                pic_4: data.pic4,
              }}
              onSubmit={async (values, { setSubmitting }) => {
                let fp = Math.round(
                  values.baseprice - (values.baseprice * values.discount) / 100
                );
                var item = new FormData();
                if (!isAdd) item.append("_id", productId);
                item.append("name", values.name);
                
                // Ensure we're sending simple string IDs, not objects
                const maincategoryId = typeof values.maincategory === 'object' ? values.maincategory._id : values.maincategory;
                const subcategoryId = typeof values.subcategory === 'object' ? values.subcategory._id : values.subcategory;
                const brandId = typeof values.brand === 'object' ? values.brand._id : values.brand;
                
                item.append("maincategory", maincategoryId || (maincategory[0] && maincategory[0]._id));
                item.append("subcategory", subcategoryId || (subcategory[0] && subcategory[0]._id));
                item.append("brand", brandId || (brand[0] && brand[0]._id));
                
                item.append("color", values.color);
                item.append("size", values.size);
                item.append("baseprice", parseInt(values.baseprice));
                item.append("discount", parseInt(values.discount));
                item.append("finalprice", fp);
                item.append("stock", values.stock);
                item.append("description", values.description);
                item.append(
                  "specification",
                  JSON.stringify(values.specification)
                );
                item.append("pic1", values.pic_1);
                item.append("pic2", values.pic_2);
                item.append("pic3", values.pic_3);
                item.append("pic4", values.pic_4);
                
                // Add slug, innerSlug, subSlug, innerSubSlug - ensure we're sending simple string IDs
                const slugId = typeof values.slug === 'object' ? values.slug._id : values.slug;
                const subSlugId = typeof values.subSlug === 'object' ? values.subSlug._id : values.subSlug;
                
                item.append("slug", slugId);
                if (values.innerSlug) {
                  item.append("innerSlug", values.innerSlug);
                }
                if (values.subSlug) {
                  item.append("subSlug", subSlugId);
                }
                if (values.innerSubSlug) {
                  item.append("innerSubSlug", values.innerSubSlug);
                }
                
                const METHOD = isAdd
                  ? addVendorProductAPI
                  : updateVendorProductAPI;
                
                METHOD(productId, item)
                  .then((res) => {
                    if (res.status != 200) {
                      alert("Unable to update product");
                    } else {
                      navigate("/vendor/products");
                    }
                  })
                  .catch(() => {
                    alert("Unable to update product");
                  });
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string().required("Product name is required"),
                color: Yup.string().required("Color is required"),
                size: Yup.string().required("Size is required"),
                baseprice: Yup.string().required("Base Price is required"),
                discount: Yup.string().required("Discount is required"),
                maincategory: Yup.mixed().required("Main Category is required"),
                subcategory: Yup.mixed().required("Sub Category is required"),
                brand: Yup.mixed().test(
                  'is-valid-brand',
                  'Brand is required',
                  (value) => {
                    // Accept string, object with _id, or any non-empty value
                    return value && (
                      typeof value === 'string' ||
                      (typeof value === 'object' && value._id) ||
                      value !== ''
                    );
                  }
                ),
                pic_1: Yup.mixed().required("Picture 1 is required"),
                slug: Yup.mixed().required("Slug is required"),
                subSlug: Yup.mixed().required("Sub Slug is required"),
              })}
              enableReinitialize
            >
              {(prop) => {
                const {
                  touched,
                  errors,
                  isValid,
                  isSubmitting,
                  setFieldValue,
                  values,
                } = prop;

                return (
                  <Form noValidate>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="ui__form">
                          <label htmlFor="name" className="ui__form__label">
                            Product name
                          </label>
                          <Field
                            id="name"
                            name="name"
                            placeholder=""
                            className={`ui__form__field ${errors.name ? "error" : ""
                              }`}
                          />
                          {errors.name && (
                            <div className="ui__form__error">{errors.name}</div>
                          )}
                        </div>

                        <div className="ui__form">
                          <label
                            htmlFor="description"
                            className="ui__form__label"
                          >
                            Product Description
                          </label>
                          <Field
                            id="description"
                            name="description"
                            component="textarea"
                            placeholder=""
                            className={`ui__form__field ${errors.description ? "error" : ""
                              }`}
                          />
                          {errors.description && (
                            <div className="ui__form__error">
                              {errors.description}
                            </div>
                          )}
                        </div>
                        
                        {/* Slug and SubSlug fields */}
                        <div className="row">
                          <div className="col-md-6">
                            <div className="ui__form">
                              <label htmlFor="slug" className="ui__form__label">
                                Slug
                              </label>
                              <Field
                                id="slug"
                                name="slug"
                                component="select"
                                className={`ui__form__field ${errors.slug ? "error" : ""}`}
                                onChange={(e) => handleSlugChange(e, setFieldValue)}
                              >
                                <option value="">--Select--</option>
                                {slugs.map((item, index) => (
                                  <option key={index} value={item._id}>
                                    {item.slug}
                                  </option>
                                ))}
                              </Field>
                              {errors.slug && (
                                <div className="ui__form__error">{errors.slug}</div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="ui__form">
                              <label htmlFor="innerSlug" className="ui__form__label">
                                Inner Slug
                              </label>
                              <Field
                                id="innerSlug"
                                name="innerSlug"
                                component="select"
                                className={`ui__form__field ${errors.innerSlug ? "error" : ""}`}
                                disabled={!values.slug || innerSlugs.length === 0}
                              >
                                <option value="">--Select--</option>
                                {innerSlugs.map((item, index) => (
                                  <option key={index} value={item}>
                                    {item}
                                  </option>
                                ))}
                              </Field>
                              {errors.innerSlug && (
                                <div className="ui__form__error">{errors.innerSlug}</div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="ui__form">
                              <label htmlFor="subSlug" className="ui__form__label">
                                Sub Slug
                              </label>
                              <Field
                                id="subSlug"
                                name="subSlug"
                                component="select"
                                className={`ui__form__field ${errors.subSlug ? "error" : ""}`}
                                onChange={(e) => handleSubSlugChange(e, setFieldValue)}
                                disabled={!values.slug}
                              >
                                <option value="">--Select--</option>
                                {subSlugs.map((item, index) => (
                                  <option key={index} value={item._id}>
                                    {item.slug}
                                  </option>
                                ))}
                              </Field>
                              {errors.subSlug && (
                                <div className="ui__form__error">{errors.subSlug}</div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="ui__form">
                              <label htmlFor="innerSubSlug" className="ui__form__label">
                                Inner Sub Slug
                              </label>
                              <Field
                                id="innerSubSlug"
                                name="innerSubSlug"
                                component="select"
                                className={`ui__form__field ${errors.innerSubSlug ? "error" : ""}`}
                                disabled={!values.subSlug || innerSubSlugs.length === 0}
                              >
                                <option value="">--Select--</option>
                                {innerSubSlugs.map((item, index) => (
                                  <option key={index} value={item}>
                                    {item}
                                  </option>
                                ))}
                              </Field>
                              {errors.innerSubSlug && (
                                <div className="ui__form__error">{errors.innerSubSlug}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="ui__form">
                              <label
                                htmlFor="maincategory"
                                className="ui__form__label"
                              >
                                Main Category
                              </label>
                              <Field
                                id="maincategory"
                                name="maincategory"
                                component="select"
                                placeholder=""
                                className={`ui__form__field ${errors.maincategory ? "error" : ""
                                  }`}
                              >
                                <option value={""}>--Select--</option>
                                {maincategory.map((item, index) => {
                                  return (
                                    <option key={index} value={item._id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Field>
                              {errors.maincategory && (
                                <div className="ui__form__error">
                                  {errors.maincategory}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="ui__form">
                              <label
                                htmlFor="subcategory"
                                className="ui__form__label"
                              >
                                Sub Category
                              </label>
                              <Field
                                id="subcategory"
                                name="subcategory"
                                component="select"
                                placeholder=""
                                className={`ui__form__field ${errors.subcategory ? "error" : ""
                                  }`}
                              >
                                <option value={""}>--Select--</option>
                                {subcategory.map((item, index) => {
                                  return (
                                    <option key={index} value={item._id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Field>
                              {errors.subcategory && (
                                <div className="ui__form__error">
                                  {errors.subcategory}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="ui__form">
                              <label
                                htmlFor="brand"
                                className="ui__form__label"
                              >
                                Brand
                              </label>
                              <Field
                                id="brand"
                                name="brand"
                                component="select"
                                placeholder=""
                                className={`ui__form__field ${errors.brand ? "error" : ""
                                  }`}
                                onChange={(e) => {
                                  // Ensure we're setting a simple string value
                                  setFieldValue("brand", e.target.value);
                                }}
                              >
                                <option value={""}>--Select--</option>
                                {brand.map((item, index) => {
                                  return (
                                    <option key={index} value={item._id}>
                                      {item.name}
                                    </option>
                                  );
                                })}
                              </Field>
                              {errors.brand && (
                                <div className="ui__form__error">
                                  {errors.brand}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="ui__form">
                              <label
                                htmlFor="stock"
                                className="ui__form__label"
                              >
                                Stock
                              </label>
                              <Field
                                id="stock"
                                name="stock"
                                component="select"
                                placeholder=""
                                className={`ui__form__field ${errors.stock ? "error" : ""
                                  }`}
                              >
                                <option value="In Stock">In Stock</option>
                                <option value="Out Of Stock">
                                  Out Of Stock
                                </option>
                              </Field>
                              {errors.stock && (
                                <div className="ui__form__error">
                                  {errors.stock}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="ui__form">
                              <label
                                htmlFor="color"
                                className="ui__form__label"
                              >
                                Color
                              </label>
                              <Field
                                id="color"
                                name="color"
                                placeholder=""
                                className={`ui__form__field ${errors.color ? "error" : ""
                                  }`}
                              />
                              {errors.color && (
                                <div className="ui__form__error">
                                  {errors.color}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="ui__form">
                              <label htmlFor="size" className="ui__form__label">
                                Size
                              </label>
                              <Field
                                id="size"
                                name="size"
                                placeholder=""
                                className={`ui__form__field ${errors.size ? "error" : ""
                                  }`}
                              />
                              {errors.size && (
                                <div className="ui__form__error">
                                  {errors.size}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="ui__form">
                              <label
                                htmlFor="baseprice"
                                className="ui__form__label"
                              >
                                Base Price
                              </label>
                              <Field
                                id="baseprice"
                                name="baseprice"
                                type="number"
                                placeholder=""
                                className={`ui__form__field ${errors.baseprice ? "error" : ""
                                  }`}
                              />
                              {errors.baseprice && (
                                <div className="ui__form__error">
                                  {errors.baseprice}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="ui__form">
                              <label
                                htmlFor="discount"
                                className="ui__form__label"
                              >
                                Discount
                              </label>
                              <Field
                                id="discount"
                                name="discount"
                                type="number"
                                placeholder=""
                                className={`ui__form__field ${errors.discount ? "error" : ""
                                  }`}
                              />
                              {errors.discount && (
                                <div className="ui__form__error">
                                  {errors.discount}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="profile__photo profile__photo__rouned">
                              <div
                                className="profile__photo__inner profile__photo__rouned"
                                style={{
                                  backgroundImage: `url(${getImage(values.pic1)})`,
                                }}
                              >
                                <input
                                  id="pic_1"
                                  name="pic_1"
                                  type="file"
                                  accept="image/*"
                                  onChange={(event) => {
                                    if (event.currentTarget.files) {
                                      const fileReader = new FileReader();
                                      fileReader.onload = (event) => {
                                        console.log(event.target.result)
                                        setFieldValue(
                                          "pic1",
                                          event.target.result
                                        );
                                      };
                                      fileReader.readAsDataURL(
                                        event.currentTarget.files[0]
                                      );
                                      setFieldValue(
                                        "pic_1",
                                        event.currentTarget.files[0]
                                      );
                                    }
                                  }}
                                />
                                <div className="overlay text-center profile__photo__rouned">
                                  <p>
                                    <i className="fa fa-image"></i>
                                    <br />
                                    Upload Image
                                  </p>
                                </div>
                              </div>
                            </div>
                            {errors.pic_1 && (
                              <div className="ui__form__error text-center">
                                {errors.pic_1}
                              </div>
                            )}
                          </div>
                          <div className="col-md-6">
                            <div className="profile__photo profile__photo__rouned">
                              <div
                                className="profile__photo__inner profile__photo__rouned"
                                style={{
                                  backgroundImage: `url(${getImage(values.pic2)})`,
                                }}
                              >
                                <input
                                  id="pic_2"
                                  name="pic_2"
                                  type="file"
                                  onChange={(event) => {
                                    if (event.currentTarget.files) {
                                      const fileReader = new FileReader();
                                      fileReader.onload = (event) => {
                                        console.log(event.target.result)
                                        setFieldValue(
                                          "pic2",
                                          event.target.result
                                        );
                                      };
                                      fileReader.readAsDataURL(
                                        event.currentTarget.files[0]
                                      );
                                      setFieldValue(
                                        "pic_2",
                                        event.currentTarget.files[0]
                                      );
                                    }
                                  }}
                                />
                                <div className="overlay text-center profile__photo__rouned">
                                  <p>
                                    <i className="fa fa-image"></i>
                                    <br />
                                    Upload Image
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="profile__photo profile__photo__rouned">
                              <div
                                className="profile__photo__inner profile__photo__rouned"
                                style={{
                                  backgroundImage: `url(${getImage(values.pic3)})`,
                                }}
                              >
                                <input
                                  id="pic_3"
                                  name="pic_3"
                                  type="file"
                                  onChange={(event) => {
                                    if (event.currentTarget.files) {
                                      const fileReader = new FileReader();
                                      fileReader.onload = (event) => {
                                        console.log(event.target.result)
                                        setFieldValue(
                                          "pic3",
                                          event.target.result
                                        );
                                      };
                                      fileReader.readAsDataURL(
                                        event.currentTarget.files[0]
                                      );
                                      setFieldValue(
                                        "pic_3",
                                        event.currentTarget.files[0]
                                      );
                                    }
                                  }}
                                />
                                <div className="overlay text-center profile__photo__rouned">
                                  <p>
                                    <i className="fa fa-image"></i>
                                    <br />
                                    Upload Image
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="profile__photo profile__photo__rouned">
                              <div
                                className="profile__photo__inner profile__photo__rouned"
                                style={{
                                  backgroundImage: `url(${getImage(values.pic4)})`,
                                }}
                              >
                                <input
                                  id="pic_4"
                                  name="pic_4"
                                  type="file"
                                  onChange={(event) => {
                                    if (event.currentTarget.files && event.currentTarget.files[0]) {
                                      const fileReader = new FileReader();
                                      
                                      fileReader.onload = (event) => {
                                        if (event.target && event.target.result) {
                                          setFieldValue("pic4", event.target.result);
                                        }
                                      };
                                      
                                      fileReader.onerror = (error) => {
                                        console.error("Error reading file:", error);
                                        alert("Error uploading image. Please try again with a different image.");
                                      };
                                      
                                      try {
                                        fileReader.readAsDataURL(event.currentTarget.files[0]);
                                        setFieldValue("pic_4", event.currentTarget.files[0]);
                                      } catch (error) {
                                        console.error("Error processing file:", error);
                                        alert("Error processing image. Please try again.");
                                      }
                                    }
                                  }}
                                />
                                <div className="overlay text-center profile__photo__rouned">
                                  <p>
                                    <i className="fa fa-image"></i>
                                    <br />
                                    Upload Image
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <h4 className="h41">
                      Specification{" "}
                      <button
                        className="hs-btn"
                        type="button"
                        onClick={() => {
                          values.specification.push({
                            key: "",
                            value: "",
                          });
                          setFieldValue("specification", values.specification);
                        }}
                      >
                        Add
                      </button>
                    </h4>
                    {values.specification?.map((pair, index) => (
                      <div className="row mb-2" key={index}>
                        <div className="col-md-4">
                          <div className="ui__form">
                            <label className="ui__form__label">
                              Enter Specification Key
                            </label>
                            <input
                              type="text"
                              name="skey"
                              className="ui__form__field"
                              value={values.specification[index].key}
                              onChange={(e) => {
                                values.specification[index].key =
                                  e.target.value;
                                setFieldValue(
                                  "specification",
                                  values.specification
                                );
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="ui__form">
                            <label className="ui__form__label">
                              Enter Specification Value
                            </label>
                            <input
                              type="text"
                              name="skey"
                              className="ui__form__field"
                              value={values.specification[index].value}
                              onChange={(e) => {
                                values.specification[index].value =
                                  e.target.value;
                                setFieldValue(
                                  "specification",
                                  values.specification
                                );
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <button
                            type="button"
                            className="hs-btn"
                            onClick={() => {
                              if (window.confirm("Are you sure want to remove ?")) {  // Use window.confirm explicitly
                                values.specification.splice(index, 1);
                                setFieldValue("specification", values.specification);
                              }
                            }}
                          >
                            Delete
                          </button>

                        </div>
                      </div>
                    ))}

                    {!isValid && (
                      <div className="alert alert-danger">
                        Please validate all field
                      </div>
                    )}
                    <button className="ui__form__button">Save Product</button>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </Wrapper>
    </>
  );
}
