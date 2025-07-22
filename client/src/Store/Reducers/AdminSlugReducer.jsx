import { ADMIN_ADD_SLUG_RED, ADMIN_DELETE_SLUG_RED, ADMIN_GET_SLUG_RED, ADMIN_UPDATE_SLUG_RED } from "../Constants";

export default function AdminSlugReducer(state = [], action) {
  let newState;
  switch (action.type) {
    case ADMIN_ADD_SLUG_RED:
      newState = [...state];
      newState.push(action.payload);
      return newState;

    case ADMIN_GET_SLUG_RED:
      return action.payload;

    case ADMIN_UPDATE_SLUG_RED:
      newState = [...state];
      let index = newState.findIndex((item) => item._id === action.payload._id);
      newState[index] = action.payload;
      return newState;

    case ADMIN_DELETE_SLUG_RED:
      newState = [...state];
      newState = newState.filter((item) => item._id !== action.payload._id);
      return newState;

    default:
      return state;
  }
} 