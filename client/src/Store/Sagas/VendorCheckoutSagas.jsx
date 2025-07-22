// VendorCheckoutSagas.jsx
import { takeEvery, put } from "redux-saga/effects";
import {
  ADD_VENDOR_CHECKOUT,
  ADD_VENDOR_CHECKOUT_RED,
  DELETE_VENDOR_CHECKOUT,
  DELETE_VENDOR_CHECKOUT_RED,
  GET_VENDOR_CHECKOUT,
  GET_VENDOR_CHECKOUT_RED,
  GET_VENDOR_CHECKOUT_USER,
  GET_VENDOR_CHECKOUT_USER_RED,
  UPDATE_VENDOR_CHECKOUT,
  UPDATE_VENDOR_CHECKOUT_RED,
} from "../Constants";
import {
  addVendorCheckoutAPI,
  deleteVendorCheckoutAPI,
  getVendorCheckoutAPI,
  getVendorCheckoutUserAPI,
  updateVendorCheckoutAPI,
} from "../Services/VendorCheckoutService";

// Worker Sagas (executers)

function* addVendorCheckoutSaga(action) {
  try {
    const response = yield addVendorCheckoutAPI(action.payload);
    yield put({ type: ADD_VENDOR_CHECKOUT_RED, payload: response.data });
  } catch (error) {
    console.error("Add Vendor Checkout error:", error);
  }
}

function* getVendorCheckoutSaga(action) {
  try {
    const response = yield getVendorCheckoutAPI(action.payload);
    yield put({ type: GET_VENDOR_CHECKOUT_RED, payload: response.data });
  } catch (error) {
    console.error("Get Vendor Checkout error:", error);
  }
}

function* getVendorCheckoutUserSaga(action) {
  try {
    const response = yield getVendorCheckoutUserAPI();
    yield put({ type: GET_VENDOR_CHECKOUT_USER_RED, payload: response.data });
  } catch (error) {
    console.error("Get Vendor Checkout User error:", error);
  }
}

function* updateVendorCheckoutSaga(action) {
  try {
    yield updateVendorCheckoutAPI(action.payload);
    yield put({ type: UPDATE_VENDOR_CHECKOUT_RED, payload: action.payload });
  } catch (error) {
    console.error("Update Vendor Checkout error:", error);
  }
}

function* deleteVendorCheckoutSaga(action) {
  try {
    yield deleteVendorCheckoutAPI(action.payload);
    yield put({ type: DELETE_VENDOR_CHECKOUT_RED, payload: action.payload });
  } catch (error) {
    console.error("Delete Vendor Checkout error:", error);
  }
}

// Watcher Saga

export function* vendorCheckoutSaga() {
  yield takeEvery(ADD_VENDOR_CHECKOUT, addVendorCheckoutSaga);
  yield takeEvery(GET_VENDOR_CHECKOUT, getVendorCheckoutSaga);
  yield takeEvery(GET_VENDOR_CHECKOUT_USER, getVendorCheckoutUserSaga);
  yield takeEvery(UPDATE_VENDOR_CHECKOUT, updateVendorCheckoutSaga);
  yield takeEvery(DELETE_VENDOR_CHECKOUT, deleteVendorCheckoutSaga);
}
