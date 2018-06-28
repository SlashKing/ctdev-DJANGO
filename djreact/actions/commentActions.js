import { request } from "../utils"
import { setupApiEndpoint } from "../common/constants/endpoints/config"

export const COMMENTS_URL = "comments/"
export const ADD_NEW_COMMENT = "ADD_NEW_COMMENT"
export const ADD_NEW_COMMENT_SUCCESS = "ADD_NEW_COMMENT_SUCCESS"
export const ADD_NEW_COMMENT_ERROR400 = "ADD_NEW_COMMENT_ERROR400"
export const ADD_NEW_COMMENT_ERROR500 = "ADD_NEW_COMMENT_ERROR500"
export const ADD_NEW_COMMENT_FAILURE = "ADD_NEW_COMMENT_FAILURE"

export const REMOVE_COMMENT = "REMOVE_COMMENT"
export const REMOVE_COMMENT_SUCCESS = "REMOVE_COMMENT_SUCCESS"
export const REMOVE_COMMENT_ERROR400 = "REMOVE_COMMENT_ERROR400"
export const REMOVE_COMMENT_ERROR500 = "REMOVE_COMMENT_ERROR500"
export const REMOVE_COMMENT_FAILURE = "REMOVE_COMMENT_FAILURE"

export const UPDATE_COMMENT = "UPDATE_COMMENT"
export const UPDATE_COMMENT_SUCCESS = "UPDATE_COMMENT_SUCCESS"
export const UPDATE_COMMENT_ERROR400 = "UPDATE_COMMENT_ERROR400"
export const UPDATE_COMMENT_ERROR500 = "UPDATE_COMMENT_ERROR500"
export const UPDATE_COMMENT_FAILURE = "UPDATE_COMMENT_FAILURE"

export function addComment(comment, object_id, content_type, content_type_id, hash, timestamp,index, search=undefined){
  return function (dispatch) {
    let url =  setupApiEndpoint(COMMENTS_URL)
	var data = {
		//user:localStorage.user_id+"",
		content_type_id:content_type_id,
		content_type:content_type,
		comment: comment,
		object_pk: object_id,
		security_hash:hash,
		timestamp: timestamp
	}
    dispatch({type: ADD_NEW_COMMENT})
    return request(
      url, {method:"POST", body: JSON.stringify(data)},
      (json) => { dispatch({type: ADD_NEW_COMMENT_SUCCESS, search:search,index: index, res: json}) },
      (json) => { dispatch({type: ADD_NEW_COMMENT_ERROR400, res: json}) },
      (res) => { dispatch({type: ADD_NEW_COMMENT_ERROR500, res: res}) },
      (ex) => { dispatch({type: ADD_NEW_COMMENT_FAILURE, error: ex}) },
    )
  }
}

export function removeComment(id,index, comment_index,search) {
  return function (dispatch) {
    let url =  setupApiEndpoint(COMMENTS_URL) + id + "\/"
    dispatch({type: REMOVE_COMMENT})
    return request(
      url, {method: "DELETE"},
      (json) => { dispatch({type: REMOVE_COMMENT_SUCCESS, search:search,comment_index: comment_index, index: index, res: id}) },
      (json) => { dispatch({type: REMOVE_COMMENT_ERROR400, res: id}) },
      (res) => { dispatch({type: REMOVE_COMMENT_ERROR500, res: id}) },
      (ex) => { dispatch({type: REMOVE_COMMENT_FAILURE, error: ex}) },
    )
  }
}

export function updateComment(id, post_index,index, text,search) {
  return function (dispatch) {
    let url =  setupApiEndpoint(COMMENTS_URL) + id + "\/"
	const data = {
		comment: text
	}
    dispatch({type: UPDATE_COMMENT})
    return request(
      url, { method: 'PATCH', body: JSON.stringify(data)},
      (json) => { dispatch({type: UPDATE_COMMENT_SUCCESS, post_index:post_index, search:search, index:index, res: json}) },
      (json) => { dispatch({type: UPDATE_COMMENT_ERROR400, res: json}) },
      (res) => { dispatch({type: UPDATE_COMMENT_ERROR500, res: res}) },
      (ex) => { dispatch({type: UPDATE_COMMENT_FAILURE, error: ex}) },
    )
  }
}