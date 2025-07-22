import { takeEvery, put } from "redux-saga/effects";
import { ADD_SUBSLUG, ADD_SUBSLUG_RED, DELETE_SUBSLUG, DELETE_SUBSLUG_RED, GET_SUBSLUG, GET_SUBSLUG_RED, GET_SUBSLUG_BY_PARENT, GET_SUBSLUG_BY_PARENT_RED, UPDATE_SUBSLUG, UPDATE_SUBSLUG_RED } from "../Constants";
import SubSlugService from "../Services/SubSlugService";

function* addSubSlug(action) {
  try {
    let response = yield SubSlugService.addSubSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: ADD_SUBSLUG_RED, payload: response.data });
    } else {
      console.error("Error adding sub-slug:", response.message);
    }
  } catch (error) {
    console.error("API Error adding sub-slug:", error);
  }
}

function* getSubSlug() {
  try {
    let response = yield SubSlugService.getSubSlug();
    if (response.result === "Done") {
      yield put({ type: GET_SUBSLUG_RED, payload: response.data });
    } else {
      console.error("Error fetching sub-slugs:", response.message);
    }
  } catch (error) {
    console.error("API Error fetching sub-slugs:", error);
  }
}

function* getSubSlugByParent(action) {
  try {
    let response = yield SubSlugService.getSubSlugByParent(action.payload);
    if (response.result === "Done") {
      yield put({ type: GET_SUBSLUG_BY_PARENT_RED, payload: response.data });
    } else {
      console.error("Error fetching sub-slugs by parent:", response.message);
    }
  } catch (error) {
    console.error("API Error fetching sub-slugs by parent:", error);
  }
}

function* updateSubSlug(action) {
  try {
    let response = yield SubSlugService.updateSubSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: UPDATE_SUBSLUG_RED, payload: action.payload });
    } else {
      console.error("Error updating sub-slug:", response.message);
    }
  } catch (error) {
    console.error("API Error updating sub-slug:", error);
  }
}

function* deleteSubSlug(action) {
  try {
    let response = yield SubSlugService.deleteSubSlug(action.payload);
    if (response.result === "Done") {
      yield put({ type: DELETE_SUBSLUG_RED, payload: action.payload });
    } else {
      console.error("Error deleting sub-slug:", response.message);
    }
  } catch (error) {
    console.error("API Error deleting sub-slug:", error);
  }
}

export function* subSlugSaga() {
  yield takeEvery(ADD_SUBSLUG, addSubSlug);
  yield takeEvery(GET_SUBSLUG, getSubSlug);
  yield takeEvery(GET_SUBSLUG_BY_PARENT, getSubSlugByParent);
  yield takeEvery(UPDATE_SUBSLUG, updateSubSlug);
  yield takeEvery(DELETE_SUBSLUG, deleteSubSlug);
} 