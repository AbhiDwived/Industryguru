import {
  ADD_VENDOR_CHECKOUT,
  DELETE_VENDOR_CHECKOUT,
  GET_VENDOR_CHECKOUT,
  GET_VENDOR_CHECKOUT_RED,
  GET_VENDOR_CHECKOUT_USER,
  UPDATE_VENDOR_CHECKOUT,
} from "../Constants";

export default function VendorCheckoutReducer(state = [], action) {
  var newState, index;
  switch (action.type) {
    case ADD_VENDOR_CHECKOUT:
      newState = state;
      newState.push(action.payload);
      return newState;

    case GET_VENDOR_CHECKOUT:
    // case GET_VENDOR_CHECKOUT_USER:
    case GET_VENDOR_CHECKOUT_RED:
      // return action.payload;
      newState = state;

      newState.push(action.payload);
      return newState;

    case UPDATE_VENDOR_CHECKOUT:
      newState = state;
      index = newState.findIndex((x) => x._id === action.payload._id);
      newState[index].paymentstatus = action.payload.paymentstatus;
      newState[index].orderstatus = action.payload.orderstatus;
      newState[index].paymentmode = action.payload.paymentmode;
      return newState;

    case DELETE_VENDOR_CHECKOUT:
      newState = state.filter((item) => item._id !== action.payload._id);
      return newState;

    default:
      return state;
  }
}
