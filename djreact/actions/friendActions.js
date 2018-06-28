import * as friendActionTypes from '../common/constants/actiontypes/friend'
import * as friendRequestActionTypes from '../common/constants/actiontypes/friendRequest'
import * as friendEndpoints from '../common/constants/endpoints/friend'
import * as friendRequestEndpoints from '../common/constants/endpoints/friendRequest'
import { request } from "../utils"
import { setupApiEndpoint } from "../common/constants/endpoints/config"

// function to create friend request
export function addFriend(data){
	return function (dispatch) {
    let url =  setupApiEndpoint(friendEndpoints.ADD_FRIEND)
	const formData = new FormData();
    formData.append('user_id', data['user_id']);
    formData.append('message', data['message']);
    dispatch({type: friendActionTypes.ADD_FRIEND})
	let bodyStr = {user_id : data['user_id'],message : ""}
    return request(
      url, {method:'POST',body:JSON.stringify(bodyStr)},
      (json) => { dispatch({type: friendActionTypes.ADD_FRIEND_SUCCESS, res: json}) },
      (json) => { dispatch({type: friendActionTypes.ADD_FRIEND_ERROR400, res: json}) },
      (res) => { dispatch({type: friendActionTypes.ADD_FRIEND_ERROR500, res: res}) },
      (ex) => { dispatch({type: friendActionTypes.ADD_FRIEND_FAILURE, error: ex}) },
    )
  }
}
// removeFriend(id_of_friend_to_remove)
// *** the request object takes care of the current user so we only need to 
// *** pass the id of the user that we wish to remove
export function removeFriend(id){
	return function (dispatch) {
    let url =  setupApiEndpoint(friendEndpoints.removeFriend(id))
    dispatch({type: friendActionTypes.REMOVE_FRIEND})
    return request(
      url, {method:'POST'},
      (json) => { dispatch({type: friendActionTypes.REMOVE_FRIEND_SUCCESS, res: {'to_user':id}}) },
      (json) => { dispatch({type: friendActionTypes.REMOVE_FRIEND_ERROR400, res: json}) },
      (res) => { dispatch({type: friendActionTypes.REMOVE_FRIEND_ERROR500, res: res}) },
      (ex) => { dispatch({type: friendActionTypes.REMOVE_FRIEND_FAILURE, error: ex}) },
    )
  }
	
}
// accept a friend request
export function acceptRequest(id){
	return function (dispatch) {
    let url =  setupApiEndpoint(friendRequestEndpoints.getReceivedRequest(id))
    dispatch({type: friendRequestActionTypes.GET_FRIEND_REQUEST})
    return request(url,{},
	  (json) => { dispatch({type:friendRequestActionTypes.GET_FRIEND_REQUEST_SUCCESS, res: json}) 
				  url =  setupApiEndpoint(friendRequestEndpoints.acceptRequest(json.id))
				  dispatch({type:friendRequestActionTypes.ACCEPT_FRIEND_REQUEST})
				  return request(
					url, {method:'POST'},
					(json) => { dispatch({type: friendRequestActionTypes.ACCEPT_FRIEND_REQUEST_SUCCESS, res: {'to_user':id}}) },
					(json) => { dispatch({type: friendRequestActionTypes.ACCEPT_FRIEND_REQUEST_ERROR400, res: json}) },
					(res) => { dispatch({type: friendRequestActionTypes.ACCEPT_FRIEND_REQUEST_ERROR500, res: res}) },
					(ex) => { dispatch({type: friendRequestActionTypes.ACCEPT_FRIEND_REQUEST_FAILURE, error: ex}) },
    )},
      (json) => { dispatch({type: friendRequestActionTypes.GET_FRIEND_REQUEST_ERROR400, res: json}) },
      (res) => { dispatch({type: friendRequestActionTypes.GET_FRIEND_REQUEST_ERROR500, res: res}) },
      (ex) => { dispatch({type: friendRequestActionTypes.GET_FRIEND_REQUEST_FAILURE, error: ex}) },
    )
  }
}
export function rejectRequest(id){
	return function (dispatch) {
    let url =  setupApiEndpoint(friendRequestEndpoints.getReceivedRequest(id))
    dispatch({type: friendRequestActionTypes.GET_FRIEND_REQUEST})
    return request(url,{},
	  (json) => { dispatch({type:friendRequestActionTypes.GET_FRIEND_REQUEST_SUCCESS, res: json}) 
				  url =  setupApiEndpoint(friendRequestEndpoints.rejectRequest(json.id))
				  dispatch({type:friendRequestActionTypes.REJECT_FRIEND_REQUEST})
				  return request(
					url, {method:'POST'},
					(json) => { dispatch({type: friendRequestActionTypes.REJECT_FRIEND_REQUEST_SUCCESS, res: {'to_user':id}}) },
					(json) => { dispatch({type: friendRequestActionTypes.REJECT_FRIEND_REQUEST_ERROR400, res: json}) },
					(res) => { dispatch({type: friendRequestActionTypes.REJECT_FRIEND_REQUEST_ERROR500, res: res}) },
					(ex) => { dispatch({type: friendRequestActionTypes.REJECT_FRIEND_REQUEST_FAILURE, error: ex}) },
    )},
      (json) => { dispatch({type: friendRequestActionTypes.GET_FRIEND_REQUEST_ERROR400, res: json}) },
      (res) => { dispatch({type: friendRequestActionTypes.GET_FRIEND_REQUEST_ERROR500, res: res}) },
      (ex) => { dispatch({type: friendRequestActionTypes.GET_FRIEND_REQUEST_FAILURE, error: ex}) },
    )
  }
}
export function cancelRequest(id){
	return function (dispatch) {
    let url =  setupApiEndpoint(friendRequestEndpoints.getSentRequest(id))
    dispatch({type: friendRequestActionTypes.GET_FRIEND_REQUEST})
    return request(url,{},
	  (json) => { dispatch({type:friendRequestActionTypes.GET_FRIEND_REQUEST_SUCCESS, res: json})
				  url =  setupApiEndpoint(friendRequestEndpoints.cancelRequest(json.id))
				  dispatch({type:friendRequestActionTypes.CANCEL_FRIEND_REQUEST})
				  return request(
					url, {method:'POST'},
					(json) => { dispatch({type: friendRequestActionTypes.CANCEL_FRIEND_REQUEST_SUCCESS, res: {'to_user':id}}) },
					(json) => { dispatch({type: friendRequestActionTypes.CANCEL_FRIEND_REQUEST_ERROR400, res: json}) },
					(res) => { dispatch({type: friendRequestActionTypes.CANCEL_FRIEND_REQUEST_ERROR500, res: res}) },
					(ex) => { dispatch({type: friendRequestActionTypes.CANCEL_FRIEND_REQUEST_FAILURE, error: ex}) },
    )},
      (json) => { dispatch({type: friendRequestActionTypes.GET_FRIEND_REQUEST_ERROR400, res: json}) },
      (res) => { dispatch({type: friendRequestActionTypes.GET_FRIEND_REQUEST_ERROR500, res: res}) },
      (ex) => { dispatch({type: friendRequestActionTypes.GET_FRIEND_REQUEST_FAILURE, error: ex}) },
    )
  }
}