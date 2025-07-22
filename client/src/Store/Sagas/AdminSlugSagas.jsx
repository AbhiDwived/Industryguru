import { takeEvery, put } from "redux-saga/effects";
import { 
  ADMIN_ADD_SLUG, 
  ADMIN_ADD_SLUG_RED, 
  ADMIN_DELETE_SLUG, 
  ADMIN_DELETE_SLUG_RED, 
  ADMIN_GET_SLUG, 
  ADMIN_GET_SLUG_RED, 
  ADMIN_UPDATE_SLUG, 
  ADMIN_UPDATE_SLUG_RED,
  ADMIN_ADD_SUBSLUG,
  ADMIN_ADD_SUBSLUG_RED,
  ADMIN_DELETE_SUBSLUG,
  ADMIN_DELETE_SUBSLUG_RED,
  ADMIN_GET_SUBSLUG,
  ADMIN_GET_SUBSLUG_RED,
  ADMIN_GET_SUBSLUG_BY_PARENT,
  ADMIN_GET_SUBSLUG_BY_PARENT_RED,
  ADMIN_UPDATE_SUBSLUG,
  ADMIN_UPDATE_SUBSLUG_RED
} from "../Constants";
import AdminSlugService from "../Services/AdminSlugService";

// Slug saga functions
function* addAdminSlug(action) {
  try {
    let response = yield AdminSlugService.addSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: ADMIN_ADD_SLUG_RED, payload: response.data });
    } else {
      console.error("Error adding admin slug:", response.message);
    }
  } catch (error) {
    console.error("API Error adding admin slug:", error);
  }
}

function* getAdminSlug() {
  try {
    let response = yield AdminSlugService.getSlug();
    if (response.result === "Done") {
      yield put({ type: ADMIN_GET_SLUG_RED, payload: response.data });
    } else {
      console.error("Error fetching admin slugs:", response.message);
    }
  } catch (error) {
    console.error("API Error fetching admin slugs:", error);
  }
}

function* updateAdminSlug(action) {
  try {
    let response = yield AdminSlugService.updateSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: ADMIN_UPDATE_SLUG_RED, payload: action.payload });
    } else {
      console.error("Error updating admin slug:", response.message);
    }
  } catch (error) {
    console.error("API Error updating admin slug:", error);
  }
}

function* deleteAdminSlug(action) {
  try {
    let response = yield AdminSlugService.deleteSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: ADMIN_DELETE_SLUG_RED, payload: action.payload });
    } else {
      console.error("Error deleting admin slug:", response.message);
    }
  } catch (error) {
    console.error("API Error deleting admin slug:", error);
  }
}

// Sub-slug saga functions
function* addAdminSubSlug(action) {
  try {
    let response = yield AdminSlugService.addSubSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: ADMIN_ADD_SUBSLUG_RED, payload: response.data });
    } else {
      console.error("Error adding admin sub-slug:", response.message);
    }
  } catch (error) {
    console.error("API Error adding admin sub-slug:", error);
  }
}

function* getAdminSubSlug() {
  try {
    let response = yield AdminSlugService.getSubSlug();
    if (response.result === "Done") {
      yield put({ type: ADMIN_GET_SUBSLUG_RED, payload: response.data });
    } else {
      console.error("Error fetching admin sub-slugs:", response.message);
    }
  } catch (error) {
    console.error("API Error fetching admin sub-slugs:", error);
  }
}

function* getAdminSubSlugByParent(action) {
  try {
    let response = yield AdminSlugService.getSubSlugByParent(action.payload);
    if (response.result === "Done") {
      yield put({ type: ADMIN_GET_SUBSLUG_BY_PARENT_RED, payload: response.data });
    } else {
      console.error("Error fetching admin sub-slugs by parent:", response.message);
    }
  } catch (error) {
    console.error("API Error fetching admin sub-slugs by parent:", error);
  }
}

function* updateAdminSubSlug(action) {
  try {
    let response = yield AdminSlugService.updateSubSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: ADMIN_UPDATE_SUBSLUG_RED, payload: action.payload });
    } else {
      console.error("Error updating admin sub-slug:", response.message);
    }
  } catch (error) {
    console.error("API Error updating admin sub-slug:", error);
  }
}

function* deleteAdminSubSlug(action) {
  try {
    let response = yield AdminSlugService.deleteSubSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: ADMIN_DELETE_SUBSLUG_RED, payload: action.payload });
    } else {
      console.error("Error deleting admin sub-slug:", response.message);
    }
  } catch (error) {
    console.error("API Error deleting admin sub-slug:", error);
  }
}

export function* adminSlugSaga() {
  // Slug sagas
  yield takeEvery(ADMIN_ADD_SLUG, addAdminSlug);
  yield takeEvery(ADMIN_GET_SLUG, getAdminSlug);
  yield takeEvery(ADMIN_UPDATE_SLUG, updateAdminSlug);
  yield takeEvery(ADMIN_DELETE_SLUG, deleteAdminSlug);
  
  // Sub-slug sagas
  yield takeEvery(ADMIN_ADD_SUBSLUG, addAdminSubSlug);
  yield takeEvery(ADMIN_GET_SUBSLUG, getAdminSubSlug);
  yield takeEvery(ADMIN_GET_SUBSLUG_BY_PARENT, getAdminSubSlugByParent);
  yield takeEvery(ADMIN_UPDATE_SUBSLUG, updateAdminSubSlug);
  yield takeEvery(ADMIN_DELETE_SUBSLUG, deleteAdminSubSlug);
} 