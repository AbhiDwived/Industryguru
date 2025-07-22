import { ADD_VENDOR_SLUG_RED, DELETE_VENDOR_SLUG_RED, GET_VENDOR_SLUG_RED, UPDATE_VENDOR_SLUG_RED } from "../Constants";

export default function VendorSlugReducer(state = [], action) {
  switch (action.type) {
    case ADD_VENDOR_SLUG_RED:
      return [...state, action.payload];

    case GET_VENDOR_SLUG_RED:
      return action.payload;

    case UPDATE_VENDOR_SLUG_RED:
      return state.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );

    case DELETE_VENDOR_SLUG_RED:
      return state.filter((item) => item._id !== action.payload._id);

    default:
      return state;
  }
} 