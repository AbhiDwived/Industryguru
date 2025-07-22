import { ADD_SLUG, DELETE_SLUG, GET_SLUG, UPDATE_SLUG } from "../Constants";

export function addSlug(data) {
  return {
    type: ADD_SLUG,
    payload: data,
  };
}

export function getSlug() {
  return {
    type: GET_SLUG,
  };
}

export function updateSlug(data) {
  return {
    type: UPDATE_SLUG,
    payload: data,
  };
}

export function deleteSlug(data) {
  return {
    type: DELETE_SLUG,
    payload: data,
  };
} 