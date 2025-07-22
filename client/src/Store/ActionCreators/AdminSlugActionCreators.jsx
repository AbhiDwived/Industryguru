import { 
  ADMIN_ADD_SLUG, 
  ADMIN_DELETE_SLUG, 
  ADMIN_GET_SLUG, 
  ADMIN_UPDATE_SLUG,
  ADMIN_ADD_SUBSLUG,
  ADMIN_DELETE_SUBSLUG,
  ADMIN_GET_SUBSLUG,
  ADMIN_GET_SUBSLUG_BY_PARENT,
  ADMIN_UPDATE_SUBSLUG
} from "../Constants";

// Slug action creators
export function addAdminSlug(data) {
  return {
    type: ADMIN_ADD_SLUG,
    payload: data,
  };
}

export function getAdminSlug() {
  return {
    type: ADMIN_GET_SLUG,
  };
}

export function updateAdminSlug(data) {
  return {
    type: ADMIN_UPDATE_SLUG,
    payload: data,
  };
}

export function deleteAdminSlug(data) {
  return {
    type: ADMIN_DELETE_SLUG,
    payload: data,
  };
}

// Sub-slug action creators
export function addAdminSubSlug(data) {
  return {
    type: ADMIN_ADD_SUBSLUG,
    payload: data,
  };
}

export function getAdminSubSlug() {
  return {
    type: ADMIN_GET_SUBSLUG,
  };
}

export function getAdminSubSlugByParent(slugId) {
  return {
    type: ADMIN_GET_SUBSLUG_BY_PARENT,
    payload: slugId,
  };
}

export function updateAdminSubSlug(data) {
  return {
    type: ADMIN_UPDATE_SUBSLUG,
    payload: data,
  };
}

export function deleteAdminSubSlug(data) {
  return {
    type: ADMIN_DELETE_SUBSLUG,
    payload: data,
  };
} 