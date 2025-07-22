import { takeEvery, put } from "redux-saga/effects";
import { ADD_SLUG, ADD_SLUG_RED, DELETE_SLUG, DELETE_SLUG_RED, GET_SLUG, GET_SLUG_RED, UPDATE_SLUG, UPDATE_SLUG_RED } from "../Constants";
import SlugService from "../Services/SlugService";

function* addSlug(action) {
  try {
    let response = yield SlugService.addSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: ADD_SLUG_RED, payload: response.data });
    } else {
      console.error("Error adding slug:", response.message);
    }
  } catch (error) {
    console.error("API Error adding slug:", error);
  }
}

function* getSlug() {
  try {
    let response = yield SlugService.getSlug();
    if (response.result === "Done") {
      yield put({ type: GET_SLUG_RED, payload: response.data });
    } else {
      console.error("Error fetching slugs:", response.message);
    }
  } catch (error) {
    console.error("API Error fetching slugs:", error);
  }
}

function* updateSlug(action) {
  try {
    let response = yield SlugService.updateSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: UPDATE_SLUG_RED, payload: action.payload });
    } else {
      console.error("Error updating slug:", response.message);
    }
  } catch (error) {
    console.error("API Error updating slug:", error);
  }
}

function* deleteSlug(action) {
  try {
    let response = yield SlugService.deleteSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: DELETE_SLUG_RED, payload: action.payload });
    } else {
      console.error("Error deleting slug:", response.message);
    }
  } catch (error) {
    console.error("API Error deleting slug:", error);
  }
}

export function* slugSaga() {
  yield takeEvery(ADD_SLUG, addSlug);
  yield takeEvery(GET_SLUG, getSlug);
  yield takeEvery(UPDATE_SLUG, updateSlug);
  yield takeEvery(DELETE_SLUG, deleteSlug);
} 