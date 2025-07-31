import {
  ADD_PRODUCT_RED,
  DELETE_PRODUCT_RED,
  GET_PRODUCT_RED,
  GET_PRODUCT_BY_MAIN_ID_RED,
  GET_PRODUCT_BY_SUB_ID_RED,
  GET_PRODUCT_BY_BRAND_ID_RED,
  UPDATE_PRODUCT_RED,
  DELETE_VENDOR_PRODUCT_RED,
} from "../Constants";

export default function ProductReducer(state = [], action) {
  var newState, index;
  switch (action.type) {
    case ADD_PRODUCT_RED:
      newState = state;
      newState.push(action.payload);
      return newState;
    case GET_PRODUCT_RED:
      return action.payload;
    case GET_PRODUCT_BY_MAIN_ID_RED:
      return action.payload;
    case GET_PRODUCT_BY_SUB_ID_RED:
      return action.payload;
    case GET_PRODUCT_BY_BRAND_ID_RED:
      return action.payload;
    case UPDATE_PRODUCT_RED:
      if (!state || !Array.isArray(state)) return [];
      newState = [...state];
      index = newState.findIndex((x) => x._id === action.payload._id);
      if (index !== -1) {
        newState[index] = {
          ...newState[index],
          ...action.payload
        };
      }
      return newState;
    case DELETE_PRODUCT_RED:
      newState = state.filter((item) => item._id !== action.payload._id);
      return newState;
    case DELETE_VENDOR_PRODUCT_RED:
      newState = state.filter((item) => item._id !== action.payload._id);
      return newState;
    default:
      return state;
  }
}
