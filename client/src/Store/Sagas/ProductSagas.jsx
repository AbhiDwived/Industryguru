import { takeEvery, put } from "redux-saga/effects";
import {
  ADD_PRODUCT,
  ADD_PRODUCT_RED,
  DELETE_PRODUCT,
  DELETE_PRODUCT_RED,
  DELETE_VENDOR_PRODUCT,
  DELETE_VENDOR_PRODUCT_RED,
  GET_PRODUCT,
  GET_PRODUCT_RED,
  GET_PRODUCT_BY_MAIN_ID_RED,
  GET_PRODUCT_BY_SUB_ID_RED,
  GET_PRODUCT_BY_BRAND_ID_RED,
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_RED,
  GET_PRODUCT_BY_MAIN_ID,
  GET_PRODUCT_BY_SUB_ID,
  GET_PRODUCT_BY_BRAND_ID,
} from "../Constants";
import {
  addProductAPI,
  deleteVendorProductAPI,
  deleteProductAPI,
  getProductAPI,
  getProductByMainCategoryAPI,
  getProductBySubCategoryAPI,
  getProductByBrandAPI,
  updateProductAPI,
} from "../Services/ProductService";

function* addProductSaga(action) {
  //executer
  var response = yield addProductAPI(action.payload);
  yield put({ type: ADD_PRODUCT_RED, payload: response.data });
}
function* getProductSaga(action) {
  //executer
  var response = yield getProductAPI();
  yield put({ type: GET_PRODUCT_RED, payload: response.data });
}
function* updateProductSaga(action) {
  //executer
  yield updateProductAPI(action.payload);
  yield put({ type: UPDATE_PRODUCT_RED, payload: action.payload });
}
function* getProductByMainCategorySaga(action) {
  //executer
  var response = yield getProductByMainCategoryAPI(action.payload);
  yield put({ type: GET_PRODUCT_BY_MAIN_ID_RED, payload: response.data });
}
function* getProductBySubCategorySaga(action) {
  //executer
  var response = yield getProductBySubCategoryAPI(action.payload);
  yield put({ type: GET_PRODUCT_BY_SUB_ID_RED, payload: response.data });
}
function* getProductByBrandSaga(action) {
  //executer
  var response = yield getProductByBrandAPI(action.payload);
  yield put({ type: GET_PRODUCT_BY_BRAND_ID_RED, payload: response.data });
}
function* deleteProductSaga(action) {
  //executer
  yield deleteProductAPI(action.payload);
  yield put({ type: DELETE_PRODUCT_RED, payload: action.payload });
}

function* deleteVendorProductSaga(action) {
  //executer
  yield deleteVendorProductAPI(action.payload);
  yield put({ type: DELETE_VENDOR_PRODUCT_RED, payload: action.payload });
}


export function* productSaga() {
  //watcher
  yield takeEvery(ADD_PRODUCT, addProductSaga);
  yield takeEvery(GET_PRODUCT, getProductSaga);
  yield takeEvery(GET_PRODUCT_BY_MAIN_ID, getProductByMainCategorySaga);
  yield takeEvery(GET_PRODUCT_BY_SUB_ID, getProductBySubCategorySaga);
  yield takeEvery(GET_PRODUCT_BY_BRAND_ID, getProductByBrandSaga);
  yield takeEvery(UPDATE_PRODUCT, updateProductSaga);
  yield takeEvery(DELETE_PRODUCT, deleteProductSaga);
  yield takeEvery(DELETE_VENDOR_PRODUCT, deleteVendorProductSaga);
}
