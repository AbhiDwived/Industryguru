import { takeEvery, put } from "redux-saga/effects";
import {
  ADD_CHECKOUT,
  ADD_CHECKOUT_RED,
  DELETE_CHECKOUT,
  DELETE_CHECKOUT_RED,
  GET_CHECKOUT,
  GET_CHECKOUT_RED,
  GET_CHECKOUT_USER,
  GET_CHECKOUT_USER_RED,
  UPDATE_CHECKOUT,
  UPDATE_CHECKOUT_RED,
} from "../Constants";
import {
  addCheckoutAPI,
  deleteCheckoutAPI,
  getCheckoutAPI,
  getCheckoutUserAPI,
  updateCheckoutAPI,
} from "../Services/CheckoutService";

function* addCheckoutSaga(action) {
  //executer
  var response = yield addCheckoutAPI(action.payload);
  yield put({ type: ADD_CHECKOUT_RED, payload: response.data });
}
function* getCheckoutSaga(action) {
  //executer
  var response = yield getCheckoutAPI();
  yield put({ type: GET_CHECKOUT_RED, payload: response.data });
}
function* getCheckoutUserSaga(action) {
  //executer
  var response = yield getCheckoutUserAPI();
  yield put({ type: GET_CHECKOUT_USER_RED, payload: response.data });
}
function* updateCheckoutSaga(action) {
  //executer
  yield updateCheckoutAPI(action.payload);
  yield put({ type: UPDATE_CHECKOUT_RED, payload: action.payload });
}
function* deleteCheckoutSaga(action) {
  //executer
  yield deleteCheckoutAPI(action.payload);
  yield put({ type: DELETE_CHECKOUT_RED, payload: action.payload });
}
export function* checkoutSaga() {
  //watcher
  yield takeEvery(ADD_CHECKOUT, addCheckoutSaga);
  yield takeEvery(GET_CHECKOUT, getCheckoutSaga);
  yield takeEvery(GET_CHECKOUT_USER, getCheckoutUserSaga);
  yield takeEvery(UPDATE_CHECKOUT, updateCheckoutSaga);
  yield takeEvery(DELETE_CHECKOUT, deleteCheckoutSaga);
}
