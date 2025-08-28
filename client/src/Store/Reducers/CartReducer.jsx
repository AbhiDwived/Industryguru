import { ADD_CART_RED, DELETE_CART_RED, GET_CART_RED, UPDATE_CART_RED } from "../Constants";

export default function CartReducer(state = [], action) {
   var newState,index
   switch (action.type) {
      case ADD_CART_RED:
         newState = state
         newState.push(action.payload)
         return newState
      case GET_CART_RED:
         return action.payload || []
      case UPDATE_CART_RED:
        newState = state
         index = newState.findIndex((x)=>x._id===action.payload._id)
         newState[index]=action.payload
         return newState
      case DELETE_CART_RED:
         newState = state.filter((item)=>item._id!==action.payload._id)
         return newState
      default:
         return state
   }
}