import { takeEvery, put } from "redux-saga/effects"
import { ADD_WISHLIST, ADD_WISHLIST_RED, DELETE_WISHLIST, DELETE_WISHLIST_RED, GET_WISHLIST, GET_WISHLIST_RED } from "../Constants"
import { addWishlistAPI, deleteWishlistAPI, getWishlistAPI } from "../Services/WishlistService"

function* addWishlistSaga(action) {    //executer
    var response = yield addWishlistAPI(action.payload)
    yield put({ type: ADD_WISHLIST_RED, payload: response.data })
}
function* getWishlistSaga(action) {    //executer
    var response = yield getWishlistAPI()
    yield put({ type: GET_WISHLIST_RED, payload: response.data})
}
function* deleteWishlistSaga(action) {    //executer
    yield deleteWishlistAPI(action.payload)
    yield put({ type: DELETE_WISHLIST_RED, payload: action.payload })
}
export function* wishlistSaga() {       //watcher
    yield takeEvery(ADD_WISHLIST, addWishlistSaga)
    yield takeEvery(GET_WISHLIST, getWishlistSaga)
    yield takeEvery(DELETE_WISHLIST, deleteWishlistSaga)
}