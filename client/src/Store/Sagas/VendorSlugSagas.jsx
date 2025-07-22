import { takeEvery, put } from "redux-saga/effects";
import { ADD_VENDOR_SLUG, ADD_VENDOR_SLUG_RED, DELETE_VENDOR_SLUG, DELETE_VENDOR_SLUG_RED, GET_VENDOR_SLUG, GET_VENDOR_SLUG_RED, UPDATE_VENDOR_SLUG, UPDATE_VENDOR_SLUG_RED } from "../Constants";
import VendorService from "../Services/VendorService";

function* addVendorSlug(action) {
  try {
    let response = yield VendorService.addVendorSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: ADD_VENDOR_SLUG_RED, payload: response.data });
    } else {
      console.error("Error adding vendor slug:", response.message);
    }
  } catch (error) {
    console.error("API Error adding vendor slug:", error);
  }
}

function* getVendorSlug() {
  try {
    let response = yield VendorService.getVendorSlugs();
    if (response.result === "Done") {
      yield put({ type: GET_VENDOR_SLUG_RED, payload: response.data });
    } else {
      console.error("Error fetching vendor slugs:", response.message);
    }
  } catch (error) {
    console.error("API Error fetching vendor slugs:", error);
  }
}

function* updateVendorSlug(action) {
  try {
    let response = yield VendorService.updateVendorSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: UPDATE_VENDOR_SLUG_RED, payload: action.payload });
    } else {
      console.error("Error updating vendor slug:", response.message);
    }
  } catch (error) {
    console.error("API Error updating vendor slug:", error);
  }
}

function* deleteVendorSlug(action) {
  try {
    let response = yield VendorService.deleteVendorSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: DELETE_VENDOR_SLUG_RED, payload: action.payload });
    } else {
      console.error("Error deleting vendor slug:", response.message);
    }
  } catch (error) {
    console.error("API Error deleting vendor slug:", error);
  }
}

export function* vendorSlugSaga() {
  yield takeEvery(ADD_VENDOR_SLUG, addVendorSlug);
  yield takeEvery(GET_VENDOR_SLUG, getVendorSlug);
  yield takeEvery(UPDATE_VENDOR_SLUG, updateVendorSlug);
  yield takeEvery(DELETE_VENDOR_SLUG, deleteVendorSlug);
} 