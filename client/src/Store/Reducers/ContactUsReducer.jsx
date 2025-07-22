import { ADD_CONTACT_US_RED, DELETE_CONTACT_US_RED, GET_CONTACT_US_RED, UPDATE_CONTACT_US_RED } from "../Constants";

export default function ContactUsReducer(state = [], action) {
   var newState,index
   switch (action.type) {
      case ADD_CONTACT_US_RED:
         newState = state
         newState.push(action.payload)
         return newState
      case GET_CONTACT_US_RED:
         return action.payload
      case UPDATE_CONTACT_US_RED:
         newState = state
         index = newState.findIndex((x) => x._id === action.payload._id)
         newState[index] = action.payload
         return newState
      case DELETE_CONTACT_US_RED:
         newState = state.filter((item) => item._id !== action.payload._id)
         return newState
      default:
         return state
   }
}