import { ADD_VENDOR_SUBSLUG_RED, DELETE_VENDOR_SUBSLUG_RED, GET_VENDOR_SUBSLUG_RED, GET_VENDOR_SUBSLUG_BY_PARENT_RED, UPDATE_VENDOR_SUBSLUG_RED } from "../Constants";

export default function VendorSubSlugReducer(state = [], action) {
  switch (action.type) {
    case ADD_VENDOR_SUBSLUG_RED:
      return [...state, action.payload];

    case GET_VENDOR_SUBSLUG_RED:
    case GET_VENDOR_SUBSLUG_BY_PARENT_RED:
      return action.payload;

    case UPDATE_VENDOR_SUBSLUG_RED:
      return state.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );

    case DELETE_VENDOR_SUBSLUG_RED:
      return state.filter((item) => item._id !== action.payload._id);

    default:
      return state;
  }
} 