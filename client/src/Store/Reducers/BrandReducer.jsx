import {
  ADD_BRAND_RED,
  DELETE_BRAND_RED,
  GET_BRAND_BY_SUB_CATEGORY_ID_RED,
  GET_BRAND_RED,
  UPDATE_BRAND_RED,
} from "../Constants";

export default function BrandReducer(state = [], action) {
  var newState, index;
  switch (action.type) {
    case ADD_BRAND_RED:
      return [...state, action.payload];
    case GET_BRAND_RED:
      return Array.isArray(action.payload) ? action.payload : [];
    case GET_BRAND_BY_SUB_CATEGORY_ID_RED:
      return Array.isArray(action.payload) ? action.payload : [];
    case UPDATE_BRAND_RED:
      index = state.findIndex((x) => x._id === action.payload._id);
      return state.map((item, i) => i === index ? action.payload : item);
    case DELETE_BRAND_RED:
      newState = state.filter((item) => item._id !== action.payload._id);
      return newState;
    default:
      return state;
  }
}
