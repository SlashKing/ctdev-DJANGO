import * as friendActions from "../actions/friendActions"
import * as friendActionTypes from '../common/constants/actiontypes/friend'
import * as friendRequestActionTypes from '../common/constants/actiontypes/friendRequest'
import ChatActions from "../common/constants/actiontypes/chat"
const initialState = {
  loading: false,
  error: undefined,
  objects: []
}

export default function friends(state=initialState, action={}) {
	// console.log(action.type,state)
  switch (action.type) {
  case ChatActions.RECEIVE_ROOMS:
	  return {...state, objects: action.friends}
	case friendActions.REMOVE_FRIEND:
		return {...state, loading: true}
	case friendActions.REMOVE_FRIEND_SUCCESS:
		return {...state, loading: false}
	case friendActions.REMOVE_FRIEND_ERROR400:
	case friendActions.REMOVE_FRIEND_ERROR500:
	case friendActions.REMOVE_FRIEND_FAILURE:
		return {...state, error: "Error", loading: false}
	
	case friendActions.BLOCK_FRIEND:
		return {...state, loading: true}
	case friendActions.BLOCK_FRIEND_SUCCESS:
		return {...state, loading: false}
	case friendActions.BLOCK_FRIEND_ERROR400:
	case friendActions.BLOCK_FRIEND_ERROR500:
	case friendActions.BLOCK_FRIEND_FAILURE:
		return {...state, error: "Error", loading: false}
	
	case friendActions.SEND_FRIEND_REQUEST:
		return {...state, loading: true}
	case friendActions.SEND_FRIEND_REQUEST_SUCCESS:
		return {...state, loading: false}
	case friendActions.SEND_FRIEND_REQUEST_ERROR400:
	case friendActions.SEND_FRIEND_REQUEST_ERROR500:
	case friendActions.SEND_FRIEND_REQUEST_FAILURE:
		return {...state, error: "Error", loading: false}
	
	case friendActions.REJECT_FRIEND_REQUEST:
		return {...state, loading: true}
	case friendActions.REJECT_FRIEND_REQUEST_SUCCESS:
		return {...state, loading: false}
	case friendActions.REJECT_FRIEND_REQUEST_ERROR400:
	case friendActions.REJECT_FRIEND_REQUEST_ERROR500:
	case friendActions.REJECT_FRIEND_REQUEST_FAILURE:
		return {...state, error: "Error", loading: false}
	
	case friendActions.ACCEPT_FRIEND_REQUEST:
		return {...state, loading: true}
	case friendActions.ACCEPT_FRIEND_REQUEST_SUCCESS:
		return {...state, loading: false}
	case friendActions.ACCEPT_FRIEND_REQUEST_ERROR400:
	case friendActions.ACCEPT_FRIEND_REQUEST_ERROR500:
	case friendActions.ACCEPT_FRIEND_REQUEST_FAILURE:
		return {...state, error: "Error", loading: false}
	
	case friendActions.CANCEL_FRIEND_REQUEST:
		return {...state, loading: true}
	case friendActions.CANCEL_FRIEND_REQUEST_SUCCESS:
		return {...state, loading: false}
	case friendActions.CANCEL_FRIEND_REQUEST_ERROR400:
	case friendActions.CANCEL_FRIEND_REQUEST_ERROR500:
	case friendActions.CANCEL_FRIEND_REQUEST_FAILURE:
		return {...state, error: "Error", loading: false}
	
	case friendActions.GET_FRIEND_REQUEST:
		return {...state, loading: true}
	case friendActions.GET_FRIEND_REQUEST_SUCCESS:
		return {...state, loading: false, object: action.res}
	case friendActions.GET_FRIEND_REQUEST_ERROR400:
	case friendActions.GET_FRIEND_REQUEST_ERROR500:
	case friendActions.GET_FRIEND_REQUEST_FAILURE:
		return {...state, error: "Error", loading: false}
	
	case friendActions.BLOCK_FRIEND_REQUEST:
		return {...state, loading: true}
	case friendActions.BLOCK_FRIEND_REQUEST_SUCCESS:
		return {...state, loading: false, object: action.res}
	case friendActions.BLOCK_FRIEND_REQUEST_ERROR400:
	case friendActions.BLOCK_FRIEND_REQUEST_ERROR500:
	case friendActions.BLOCK_FRIEND_REQUEST_FAILURE:
		return {...state, error: "Error", loading: false}
  default:
	  return state
  }
}