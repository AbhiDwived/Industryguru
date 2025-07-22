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
      newState = state;
      newState.push(action.payload);
      return newState;
    case GET_BRAND_RED:
      return action.payload;
    case GET_BRAND_BY_SUB_CATEGORY_ID_RED:
      return action.payload;
    case UPDATE_BRAND_RED:
      newState = state;
      index = newState.findIndex((x) => x._id === action.payload._id);
      newState[index] = action.payload;
      return newState;
    case DELETE_BRAND_RED:
      newState = state.filter((item) => item._id !== action.payload._id);
      return newState;
    default:
      return state;
  }
}
