import {
  ADD_SUBCATEGORY,
  DELETE_SUBCATEGORY,
  GET_SUBCATEGORY,
  GET_SUBCATEGORY_BY_MAIN_ID,
  UPDATE_SUBCATEGORY,
} from "../Constants";
export function addSubcategory(data) {
  return {
    type: ADD_SUBCATEGORY,
    payload: data,
  };
}
export function getSubcategory() {
  return {
    type: GET_SUBCATEGORY,
  };
}
export function updateSubcategory(data) {
  return {
    type: UPDATE_SUBCATEGORY,
    payload: data,
  };
}
export function getSubcategoryByMainId(id) {
  return {
    type: GET_SUBCATEGORY_BY_MAIN_ID,
    payload: id,
  };
}
export function deleteSubcategory(data) {
  return {
    type: DELETE_SUBCATEGORY,
    payload: data,
  };
}
