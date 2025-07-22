import { ADD_VENDOR_SLUG, DELETE_VENDOR_SLUG, GET_VENDOR_SLUG, UPDATE_VENDOR_SLUG } from "../Constants";

export function addVendorSlug(data) {
  return {
    type: ADD_VENDOR_SLUG,
    payload: data,
  };
}

export function getVendorSlug() {
  return {
    type: GET_VENDOR_SLUG,
  };
}

export function updateVendorSlug(data) {
  return {
    type: UPDATE_VENDOR_SLUG,
    payload: data,
  };
}

export function deleteVendorSlug(data) {
  return {
    type: DELETE_VENDOR_SLUG,
    payload: data,
  };
} 