import {
  ADD_PRODUCT,
  DELETE_PRODUCT,
  DELETE_VENDOR_PRODUCT,
  GET_PRODUCT,
  UPDATE_PRODUCT,
  GET_PRODUCT_BY_MAIN_ID,
  GET_PRODUCT_BY_SUB_ID,
  GET_PRODUCT_BY_BRAND_ID,
} from "../Constants";
export function addProduct(data) {
  return {
    type: ADD_PRODUCT,
    payload: data,
  };
}
export function getProduct() {
  return {
    type: GET_PRODUCT,
  };
}
export function updateProduct(data) {
  return {
    type: UPDATE_PRODUCT,
    payload: data,
  };
}
export function getProductByMaincategory(_id) {
  return {
    type: GET_PRODUCT_BY_MAIN_ID,
    payload: _id,
  };
}
export function getProductBySubCategory(_id) {
  return {
    type: GET_PRODUCT_BY_SUB_ID,
    payload: _id,
  };
}
export function getProductByBrand(_id) {
  return {
    type: GET_PRODUCT_BY_BRAND_ID,
    payload: _id,
  };
}
export function deleteProduct(data) {
  return {
    type: DELETE_PRODUCT,
    payload: data,
  };
}

export function deleteVendorProduct(data) {
  return {
    type: DELETE_VENDOR_PRODUCT,
    payload: data,
  };
}
