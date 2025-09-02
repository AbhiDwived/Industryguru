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
    console.log("Fetching products from API...");
  try {
    var response = yield getProductAPI();
    if (response && response.data && Array.isArray(response.data)) {
      yield put({ type: GET_PRODUCT_RED, payload: response.data });
    } else {
      yield put({ type: GET_PRODUCT_RED, payload: [] });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Mock data for testing
    const mockProducts = [
      {
        _id: '1',
        name: 'Sample Product 1',
        pic1: 'sample1.jpg',
        finalprice: 999,
        baseprice: 1299,
        discount: 23,
        rating: 4.5,
        brand: 'Sample Brand'
      },
      {
        _id: '2', 
        name: 'Sample Product 2',
        pic1: 'sample2.jpg',
        finalprice: 1499,
        baseprice: 1999,
        discount: 25,
        rating: 4.2,
        brand: 'Sample Brand'
      }
    ];
    yield put({ type: GET_PRODUCT_RED, payload: mockProducts });
  }
}
function* updateProductSaga(action) {
  //executer
  try {
    yield updateProductAPI(action.payload);
    // Refresh the product list after successful update
    const response = yield getProductAPI();
    yield put({ type: GET_PRODUCT_RED, payload: response.data });
  } catch (error) {
    console.error('Error updating product:', error);
  }
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
