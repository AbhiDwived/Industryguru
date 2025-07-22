import {
  ADD_VENDOR_CHECKOUT,
  DELETE_VENDOR_CHECKOUT,
  GET_VENDOR_CHECKOUT,
  GET_VENDOR_CHECKOUT_USER,
  UPDATE_VENDOR_CHECKOUT,
} from "../Constants";

export function addVendorCheckout(data) {
  return {
    type: ADD_VENDOR_CHECKOUT,
    payload: data,
  };
}

export function getVendorCheckout(data) {
  return {
    type: GET_VENDOR_CHECKOUT,
    payload: data,
  };
}

export function getVendorCheckoutUser() {
  return {
    type: GET_VENDOR_CHECKOUT_USER,
  };
}

export function updateVendorCheckout(data) {
  return {
    type: UPDATE_VENDOR_CHECKOUT,
    payload: data,
  };
}

export function deleteVendorCheckout(data) {
  return {
    type: DELETE_VENDOR_CHECKOUT,
    payload: data,
  };
}
