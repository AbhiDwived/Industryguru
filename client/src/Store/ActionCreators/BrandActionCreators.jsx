import {
  ADD_BRAND,
  DELETE_BRAND,
  GET_BRAND,
  GET_BRAND_BY_SUB_CATEGORY_ID,
  UPDATE_BRAND,
} from "../Constants";
export function addBrand(data) {
  return {
    type: ADD_BRAND,
    payload: data,
  };
}
export function getBrand() {
  return {
    type: GET_BRAND,
  };
}
export function getBrandBySubCategoryId(id) {
  return {
    type: GET_BRAND_BY_SUB_CATEGORY_ID,
    payload: id,
  };
}
export function updateBrand(data) {
  return {
    type: UPDATE_BRAND,
    payload: data,
  };
}
export function deleteBrand(data) {
  return {
    type: DELETE_BRAND,
    payload: data,
  };
}
