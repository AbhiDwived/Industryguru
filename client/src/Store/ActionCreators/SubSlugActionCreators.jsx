import { ADD_SUBSLUG, DELETE_SUBSLUG, GET_SUBSLUG, GET_SUBSLUG_BY_PARENT, UPDATE_SUBSLUG } from "../Constants";

export function addSubSlug(data) {
  return {
    type: ADD_SUBSLUG,
    payload: data,
  };
}

export function getSubSlug() {
  return {
    type: GET_SUBSLUG,
  };
}

export function getSubSlugByParent(data) {
  return {
    type: GET_SUBSLUG_BY_PARENT,
    payload: data,
  };
}

export function updateSubSlug(data) {
  return {
    type: UPDATE_SUBSLUG,
    payload: data,
  };
}

export function deleteSubSlug(data) {
  return {
    type: DELETE_SUBSLUG,
    payload: data,
  };
} 