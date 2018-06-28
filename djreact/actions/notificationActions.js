import { request } from "../utils"
import { setupApiEndpoint } from "../common/constants/endpoints/config"
import { 
	NOTIFICATIONS_URL, 
	NOTIFICATIONS_LIMIT, 
	NOTIFICATIONS_UNREAD, 
	NOTIFICATIONS_MARK_ALL_READ,
	NOTIFICATIONS_MARK_AS_READ,
	NOTIFICATIONS_MARK_AS_UNREAD,
	NOTIFICATIONS_MARK_AS_DELETED,
	NOTIFICATIONS_MARK_AS_UNDELETED
} from "../common/constants/endpoints/notifications"
export const RESET_NEXT_PREVIOUS = "RESET_NEXT_PREVIOUS"

export const FETCH_NOTIFICATIONS_ALL = "FETCH_NOTIFICATIONS_ALL"
export const FETCH_NOTIFICATIONS_ALL_SUCCESS = "FETCH_NOTIFICATIONS_ALL_SUCCESS"
export const FETCH_NOTIFICATIONS_ALL_ERROR400 = "FETCH_NOTIFICATIONS_ALL_ERROR400"
export const FETCH_NOTIFICATIONS_ALL_ERROR500 = "FETCH_NOTIFICATIONS_ALL_ERROR500"
export const FETCH_NOTIFICATIONS_ALL_FAILURE = "FETCH_NOTIFICATIONS_ALL_FAILURE"

export const FETCH_NOTIFICATIONS_UNREAD = "FETCH_NOTIFICATIONS_UNREAD"
export const FETCH_NOTIFICATIONS_UNREAD_SUCCESS = "FETCH_NOTIFICATIONS_UNREAD_SUCCESS"
export const FETCH_NOTIFICATIONS_UNREAD_ERROR400 = "FETCH_NOTIFICATIONS_UNREAD_ERROR400"
export const FETCH_NOTIFICATIONS_UNREAD_ERROR500 = "FETCH_NOTIFICATIONS_UNREAD_ERROR500"
export const FETCH_NOTIFICATIONS_UNREAD_FAILURE = "FETCH_NOTIFICATIONS_UNREAD_FAILURE"

export const MARK_NOTIFICATIONS_UNREAD = "MARK_NOTIFICATIONS_UNREAD"
export const MARK_NOTIFICATIONS_UNREAD_SUCCESS = "MARK_NOTIFICATIONS_UNREAD_SUCCESS"
export const MARK_NOTIFICATIONS_UNREAD_ERROR400 = "MARK_NOTIFICATIONS_UNREAD_ERROR400"
export const MARK_NOTIFICATIONS_UNREAD_ERROR500 = "MARK_NOTIFICATIONS_UNREAD_ERROR500"
export const MARK_NOTIFICATIONS_UNREAD_FAILURE = "MARK_NOTIFICATIONS_UNREAD_FAILURE"

export const MARK_NOTIFICATIONS_READ = "MARK_NOTIFICATIONS_READ"
export const MARK_NOTIFICATIONS_READ_SUCCESS = "MARK_NOTIFICATIONS_READ_SUCCESS"
export const MARK_NOTIFICATIONS_READ_ERROR400 = "MARK_NOTIFICATIONS_READ_ERROR400"
export const MARK_NOTIFICATIONS_READ_ERROR500 = "MARK_NOTIFICATIONS_READ_ERROR500"
export const MARK_NOTIFICATIONS_READ_FAILURE = "MARK_NOTIFICATIONS_READ_FAILURE"

export const MARK_NOTIFICATION_UNREAD = "MARK_NOTIFICATION_UNREAD"
export const MARK_NOTIFICATION_UNREAD_SUCCESS = "MARK_NOTIFICATION_UNREAD_SUCCESS"
export const MARK_NOTIFICATION_UNREAD_ERROR400 = "MARK_NOTIFICATION_UNREAD_ERROR400"
export const MARK_NOTIFICATION_UNREAD_ERROR500 = "MARK_NOTIFICATION_UNREAD_ERROR500"
export const MARK_NOTIFICATION_UNREAD_FAILURE = "MARK_NOTIFICATION_UNREAD_FAILURE"
	
export const MARK_NOTIFICATION_READ = "MARK_NOTIFICATION_READ"
export const MARK_NOTIFICATION_READ_SUCCESS = "MARK_NOTIFICATION_READ_SUCCESS"
export const MARK_NOTIFICATION_READ_ERROR400 = "MARK_NOTIFICATION_READ_ERROR400"
export const MARK_NOTIFICATION_READ_ERROR500 = "MARK_NOTIFICATION_READ_ERROR500"
export const MARK_NOTIFICATION_READ_FAILURE = "MARK_NOTIFICATION_READ_FAILURE"

export const MARK_NOTIFICATION_DELETED = "MARK_NOTIFICATION_DELETED"
export const MARK_NOTIFICATION_DELETED_SUCCESS = "MARK_NOTIFICATION_DELETED_SUCCESS"
export const MARK_NOTIFICATION_DELETED_ERROR400 = "MARK_NOTIFICATION_DELETED_ERROR400"
export const MARK_NOTIFICATION_DELETED_ERROR500 = "MARK_NOTIFICATION_DELETED_ERROR500"
export const MARK_NOTIFICATION_DELETED_FAILURE = "MARK_NOTIFICATION_DELETED_FAILURE"

export const MARK_NOTIFICATION_UNDELETED = "MARK_NOTIFICATION_UNDELETED"
export const MARK_NOTIFICATION_UNDELETED_SUCCESS = "MARK_NOTIFICATION_UNDELETED_SUCCESS"
export const MARK_NOTIFICATION_UNDELETED_ERROR400 = "MARK_NOTIFICATION_UNDELETED_ERROR400"
export const MARK_NOTIFICATION_UNDELETED_ERROR500 = "MARK_NOTIFICATION_UNDELETED_ERROR500"
export const MARK_NOTIFICATION_UNDELETED_FAILURE = "MARK_NOTIFICATION_UNDELETED_FAILURE"
	
export function fetchNotificationsAll(next=null) {
  return function (dispatch) {
	var url = null
	if(next===null){
		url =  setupApiEndpoint(NOTIFICATIONS_URL) + NOTIFICATIONS_LIMIT
	}else{
		url = next
	}
	console.log(url)
    dispatch({type: FETCH_NOTIFICATIONS_ALL})
    return request(
      url, {},
      (json) => { dispatch({type: FETCH_NOTIFICATIONS_ALL_SUCCESS, res: json}) },
      (json) => { dispatch({type: FETCH_NOTIFICATIONS_ALL_ERROR400, res: json}) },
      (res) => { dispatch({type: FETCH_NOTIFICATIONS_ALL_ERROR500, res: res}) },
      (ex) => { dispatch({type: FETCH_NOTIFICATIONS_ALL_FAILURE, error: ex}) },
    )
  }
}
export function resetNextPrevious(){
	return function (dispatch){
		dispatch({type: RESET_NEXT_PREVIOUS, res: null})
	}
}

export function fetchNotificationsUnread(next=null) {
  return function (dispatch) {
	var url = null
	if(next===null){
		url =  setupApiEndpoint(NOTIFICATIONS_UNREAD) + NOTIFICATIONS_LIMIT
	}else{
		url = next
	}
	console.log(url)
    dispatch({type: FETCH_NOTIFICATIONS_UNREAD})
    return request(
      url, {},
      (json) => { dispatch({type: FETCH_NOTIFICATIONS_UNREAD_SUCCESS, res: json}) },
      (json) => { dispatch({type: FETCH_NOTIFICATIONS_UNREAD_ERROR400, res: json}) },
      (res) => { dispatch({type: FETCH_NOTIFICATIONS_UNREAD_ERROR500, res: res}) },
      (ex) => { dispatch({type: FETCH_NOTIFICATIONS_UNREAD_FAILURE, error: ex}) },
    )
  }
}
export function markAllRead() {
  return function (dispatch) {
    let url =  setupApiEndpoint(NOTIFICATIONS_MARK_ALL_READ)
    dispatch({type: MARK_NOTIFICATIONS_READ})
    return request(
      url, {method:'POST'},
      (json) => { dispatch({type: MARK_NOTIFICATIONS_READ_SUCCESS, res: json}) },
      (json) => { dispatch({type: MARK_NOTIFICATIONS_READ_ERROR400, res: json}) },
      (res) => { dispatch({type: MARK_NOTIFICATIONS_READ_ERROR500, res: res}) },
      (ex) => { dispatch({type: MARK_NOTIFICATIONS_READ_FAILURE, error: ex}) },
    )
  }
}
export function markAsRead(id,index) {
  return function (dispatch) {	  
	let url =  setupApiEndpoint(NOTIFICATIONS_MARK_AS_READ(id))
		dispatch({type: MARK_NOTIFICATION_READ})
			return request(
		      url, {method:'POST'},
		      (json) => { dispatch({type: MARK_NOTIFICATION_READ_SUCCESS, res: {id:id}}) },
		      (json) => { dispatch({type: MARK_NOTIFICATION_READ_ERROR400, res: json}) },
		      (res) => { dispatch({type: MARK_NOTIFICATION_READ_ERROR500, res: res}) },
		      (ex) => { dispatch({type: MARK_NOTIFICATION_READ_FAILURE, error: ex}) },
		    )
  }
}
export function markAsUnread(id,index) {
	  return function (dispatch) {	  
		let url =  setupApiEndpoint(NOTIFICATIONS_MARK_AS_UNREAD(id))
			dispatch({type: MARK_NOTIFICATION_UNREAD})
				return request(
			      url, {method:'POST'},
			      (json) => { dispatch({type: MARK_NOTIFICATION_UNREAD_SUCCESS, res: {id:id}}) },
			      (json) => { dispatch({type: MARK_NOTIFICATION_UNREAD_ERROR400, res: json}) },
			      (res) => { dispatch({type: MARK_NOTIFICATION_UNREAD_ERROR500, res: res}) },
			      (ex) => { dispatch({type: MARK_NOTIFICATION_UNREAD_FAILURE, error: ex}) },
			    )
	  }
	}
export function markAsDeleted(id,index) {
	  return function (dispatch) {	  
		let url =  setupApiEndpoint(NOTIFICATIONS_MARK_AS_DELETED(id))
			dispatch({type: MARK_NOTIFICATION_DELETED})
				return request(
			      url, {method:'POST'},
			      (json) => { dispatch({type: MARK_NOTIFICATION_DELETED_SUCCESS, res: {id:id}}) },
			      (json) => { dispatch({type: MARK_NOTIFICATION_DELETED_ERROR400, res: json}) },
			      (res) => { dispatch({type: MARK_NOTIFICATION_DELETED_ERROR500, res: res}) },
			      (ex) => { dispatch({type: MARK_NOTIFICATION_DELETED_FAILURE, error: ex}) },
			    )
	}
}
export function markAsUndeleted(id,index) {
	  return function (dispatch) {	  
		let url =  setupApiEndpoint(NOTIFICATIONS_MARK_AS_UNDELETED(id))
			dispatch({type: MARK_NOTIFICATION_UNDELETED})
				return request(
			      url, {method:'POST'},
			      (json) => { dispatch({type: MARK_NOTIFICATION_UNDELETED_SUCCESS, res: {id:id}}) },
			      (json) => { dispatch({type: MARK_NOTIFICATION_UNDELETED_ERROR400, res: json}) },
			      (res) => { dispatch({type: MARK_NOTIFICATION_UNDELETED_ERROR500, res: res}) },
			      (ex) => { dispatch({type: MARK_NOTIFICATION_UNDELETED_FAILURE, error: ex}) },
			    )
	 }
}
