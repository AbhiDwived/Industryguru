import { takeEvery, put } from "redux-saga/effects";
import { ADD_VENDOR_SUBSLUG, ADD_VENDOR_SUBSLUG_RED, DELETE_VENDOR_SUBSLUG, DELETE_VENDOR_SUBSLUG_RED, GET_VENDOR_SUBSLUG, GET_VENDOR_SUBSLUG_RED, GET_VENDOR_SUBSLUG_BY_PARENT, GET_VENDOR_SUBSLUG_BY_PARENT_RED, UPDATE_VENDOR_SUBSLUG, UPDATE_VENDOR_SUBSLUG_RED } from "../Constants";
import VendorService from "../Services/VendorService";

function* addVendorSubSlug(action) {
  try {
    let response = yield VendorService.addVendorSubSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: ADD_VENDOR_SUBSLUG_RED, payload: response.data });
    } else {
      console.error("Error adding vendor sub-slug:", response.message);
    }
  } catch (error) {
    console.error("API Error adding vendor sub-slug:", error);
  }
}

function* getVendorSubSlug() {
  try {
    let response = yield VendorService.getVendorSubSlugs();
    if (response.result === "Done") {
      yield put({ type: GET_VENDOR_SUBSLUG_RED, payload: response.data });
    } else {
      console.error("Error fetching vendor sub-slugs:", response.message);
    }
  } catch (error) {
    console.error("API Error fetching vendor sub-slugs:", error);
  }
}

function* getVendorSubSlugByParent(action) {
  try {
    let response = yield VendorService.getVendorSubSlugsByParent(action.payload);
    if (response.result === "Done") {
      yield put({ type: GET_VENDOR_SUBSLUG_BY_PARENT_RED, payload: response.data });
    } else {
      console.error("Error fetching vendor sub-slugs by parent:", response.message);
    }
  } catch (error) {
    console.error("API Error fetching vendor sub-slugs by parent:", error);
  }
}

function* updateVendorSubSlug(action) {
  try {
    let response = yield VendorService.updateVendorSubSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: UPDATE_VENDOR_SUBSLUG_RED, payload: action.payload });
    } else {
      console.error("Error updating vendor sub-slug:", response.message);
    }
  } catch (error) {
    console.error("API Error updating vendor sub-slug:", error);
  }
}

function* deleteVendorSubSlug(action) {
  try {
    let response = yield VendorService.deleteVendorSubSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: DELETE_VENDOR_SUBSLUG_RED, payload: action.payload });
    } else {
      console.error("Error deleting vendor sub-slug:", response.message);
    }
  } catch (error) {
    console.error("API Error deleting vendor sub-slug:", error);
  }
}

export function* vendorSubSlugSaga() {
  yield takeEvery(ADD_VENDOR_SUBSLUG, addVendorSubSlug);
  yield takeEvery(GET_VENDOR_SUBSLUG, getVendorSubSlug);
  yield takeEvery(GET_VENDOR_SUBSLUG_BY_PARENT, getVendorSubSlugByParent);
  yield takeEvery(UPDATE_VENDOR_SUBSLUG, updateVendorSubSlug);
  yield takeEvery(DELETE_VENDOR_SUBSLUG, deleteVendorSubSlug);
} 