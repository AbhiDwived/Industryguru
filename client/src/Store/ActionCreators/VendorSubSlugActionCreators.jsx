import { ADD_VENDOR_SUBSLUG, DELETE_VENDOR_SUBSLUG, GET_VENDOR_SUBSLUG, GET_VENDOR_SUBSLUG_BY_PARENT, UPDATE_VENDOR_SUBSLUG } from "../Constants";

export function addVendorSubSlug(data) {
  return {
    type: ADD_VENDOR_SUBSLUG,
    payload: data,
  };
}

export function getVendorSubSlug() {
  return {
    type: GET_VENDOR_SUBSLUG,
  };
}

export function getVendorSubSlugByParent(data) {
  return {
    type: GET_VENDOR_SUBSLUG_BY_PARENT,
    payload: data,
  };
}

export function updateVendorSubSlug(data) {
  return {
    type: UPDATE_VENDOR_SUBSLUG,
    payload: data,
  };
}

export function deleteVendorSubSlug(data) {
  return {
    type: DELETE_VENDOR_SUBSLUG,
    payload: data,
  };
} 