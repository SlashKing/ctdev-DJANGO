import { request } from "../utils"
import { setupApiEndpoint } from "../common/constants/endpoints/config"
import * as followEndpoints from "../common/constants/endpoints/follow"

export const UPDATE_LOADING_FOLLOW = "UPDATE_LOADING_FOLLOW"
export const UPDATE_IS_FOLLOWING = "UPDATE_IS_FOLLOWING"
export const FOLLOW = "FOLLOW"
export const FOLLOW_SUCCESS = "FOLLOW_SUCCESS"
export const FOLLOW_ERROR400 = "FOLLOW_ERROR400"
export const FOLLOW_ERROR500 = "FOLLOW_ERROR500"
export const FOLLOW_FAILURE = "FOLLOW_FAILURE"

export const REMOVE_FOLLOW = "REMOVE_FOLLOW"
export const REMOVE_FOLLOW_SUCCESS = "REMOVE_FOLLOW_SUCCESS"
export const REMOVE_FOLLOW_ERROR400 = "REMOVE_FOLLOW_ERROR400"
export const REMOVE_FOLLOW_ERROR500 = "REMOVE_FOLLOW_ERROR500"
export const REMOVE_FOLLOW_FAILURE = "REMOVE_FOLLOW_FAILURE"

export const GET_THIS_FOLLOW = "GET_THIS_FOLLOW"
export const GET_THIS_FOLLOW_SUCCESS = "GET_THIS_FOLLOW_SUCCESS"
export const GET_THIS_FOLLOW_ERROR400 = "GET_THIS_FOLLOW_ERROR400"
export const GET_THIS_FOLLOW_ERROR500 = "GET_THIS_FOLLOW_ERROR500"
export const GET_THIS_FOLLOW_FAILURE = "GET_THIS_FOLLOW_FAILURE"

//TODO: Create api function that retrieves whether the user likes an object to make independent from the post reducer

export function follow(followee,follower) {
  return function (dispatch) {
    let url =  setupApiEndpoint(followEndpoints.addFollow(followee))
	var myData = {
		followee: followee,
		follower: follower
	};
    dispatch({type: FOLLOW})
    return request(
      url, { method: "post", body:JSON.stringify(myData)},
      (json) => { dispatch({type: FOLLOW_SUCCESS, res: json}) },
      (json) => { dispatch({type: FOLLOW_ERROR400, res: json}) },
      (res) => { dispatch({type: FOLLOW_ERROR500, res: res}) },
      (ex) => { dispatch({type: FOLLOW_FAILURE, error: ex}) },
    )
  }
}
export function removeFollow(followee, follower) {
  return function (dispatch) {
	// request inside a request --> requestception
	// get the like with username content_object and content_type as params
	// Then a second request to the like object detail with DELETE as method parameter
    let url =  setupApiEndpoint(followEndpoints.removeFollow(followee))
	dispatch({type: REMOVE_FOLLOW})
		request(
		url, {method: "POST"},
		(json) => { dispatch({type: REMOVE_FOLLOW_SUCCESS, res: json})},
		(json) => { dispatch({type: REMOVE_FOLLOW_ERROR400, res: json})},
		(res) => { dispatch({type: REMOVE_FOLLOW_ERROR500, res: res}) },
		(ex) => { dispatch({type: REMOVE_FOLLOW_FAILURE, error: ex}) },
		)
	}
	return 0
}