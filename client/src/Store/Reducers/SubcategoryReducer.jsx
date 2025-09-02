import {
  ADD_SUBCATEGORY_RED,
  DELETE_SUBCATEGORY_RED,
  GET_SUBCATEGORY_BY_MAIN_ID_RED,
  GET_SUBCATEGORY_RED,
  UPDATE_SUBCATEGORY_RED,
} from "../Constants";

export default function SubcategoryReducer(state = [], action) {
  var newState, index;
  switch (action.type) {
    case ADD_SUBCATEGORY_RED:
      newState = [...state];
      newState.push(action.payload);
      return newState;
    case GET_SUBCATEGORY_RED:
      return action.payload || [];
    case GET_SUBCATEGORY_BY_MAIN_ID_RED:
      return action.payload || [];
    case UPDATE_SUBCATEGORY_RED:
      newState = [...state];
      index = newState.findIndex((x) => x._id === action.payload._id);
      if (index !== -1) {
        newState[index] = action.payload;
      }
      return newState;
    case DELETE_SUBCATEGORY_RED:
      return state.filter((item) => item._id !== action.payload._id);
    default:
      return state;
  }
}
