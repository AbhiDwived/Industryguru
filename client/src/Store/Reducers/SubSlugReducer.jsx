import { ADD_SUBSLUG_RED, DELETE_SUBSLUG_RED, GET_SUBSLUG_RED, GET_SUBSLUG_BY_PARENT_RED, UPDATE_SUBSLUG_RED } from "../Constants";

export function SubSlugReducer(state = [], action) {
  switch (action.type) {
    case ADD_SUBSLUG_RED:
      return [...state, action.payload];
    case GET_SUBSLUG_RED:
    case GET_SUBSLUG_BY_PARENT_RED:
      return action.payload;
    case UPDATE_SUBSLUG_RED:
      return state.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );
    case DELETE_SUBSLUG_RED:
      return state.filter((item) => item._id !== action.payload._id);
    default:
      return state;
  }
} 