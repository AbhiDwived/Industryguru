import { ADD_SLUG_RED, DELETE_SLUG_RED, GET_SLUG_RED, UPDATE_SLUG_RED } from "../Constants";

export function SlugReducer(state = [], action) {
  switch (action.type) {
    case ADD_SLUG_RED:
      return [...state, action.payload];
    case GET_SLUG_RED:
      return action.payload;
    case UPDATE_SLUG_RED:
      return state.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );
    case DELETE_SLUG_RED:
      return state.filter((item) => item._id !== action.payload._id);
    default:
      return state;
  }
} 