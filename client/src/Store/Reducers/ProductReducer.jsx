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
      newState = state;
      index = newState.findIndex((x) => x._id === action.payload._id);
      newState[index].name = action.payload.name;
      newState[index].maincategory = action.payload.maincategory;
      newState[index].subcategory = action.payload.subcategory;
      newState[index].brand = action.payload.brand;
      newState[index].color = action.payload.color;
      newState[index].size = action.payload.size;
      newState[index].baseprice = action.payload.baseprice;
      newState[index].discount = action.payload.discount;
      newState[index].finalprice = action.payload.finalprice;
      newState[index].stock = action.payload.stock;
      newState[index].description = action.payload.description;
      newState[index].pic1 = action.payload.pic1;
      newState[index].pic2 = action.payload.pic2;
      newState[index].pic3 = action.payload.pic3;
      newState[index].pic4 = action.payload.pic4;
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
