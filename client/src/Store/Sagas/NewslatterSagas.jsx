import { takeEvery, put } from "redux-saga/effects"
import { ADD_NEWSLATTER, ADD_NEWSLATTER_RED, DELETE_NEWSLATTER, DELETE_NEWSLATTER_RED, GET_NEWSLATTER, GET_NEWSLATTER_RED, } from "../Constants"
import { addNewslatterAPI, deleteNewslatterAPI, getNewslatterAPI } from "../Services/NewslatterService"

function* addNewslatterSaga(action) {    //executer
    var response = yield addNewslatterAPI(action.payload)
    yield put({ type: ADD_NEWSLATTER_RED, payload: response.data })
}
function* getNewslatterSaga(action) {    //executer
    var response = yield getNewslatterAPI()
    yield put({ type: GET_NEWSLATTER_RED, payload: response.data })
}
function* deleteNewslatterSaga(action) {    //executer
    yield deleteNewslatterAPI(action.payload)
    yield put({ type: DELETE_NEWSLATTER_RED, payload: action.payload })
}
export function* newslatterSaga() {       //watcher
    yield takeEvery(ADD_NEWSLATTER, addNewslatterSaga)
    yield takeEvery(GET_NEWSLATTER, getNewslatterSaga)
    yield takeEvery(DELETE_NEWSLATTER, deleteNewslatterSaga)
}