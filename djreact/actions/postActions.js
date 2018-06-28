import { request } from "../utils"
import { setupApiEndpoint } from "../common/constants/endpoints/config"
import { POSTS_URL, POSTS_LIMIT, CURRENT_USER_URL,SINGLE_USER_URL } from "../common/constants/endpoints/posts"
import * as friendActions from "../common/constants/actiontypes/friend"
import * as profileActionTypes from "../common/constants/actiontypes/profile"
import { UPDATE_LOADING } from "../actions/likeActions"
import { UPDATE_LOADING_FOLLOW, UPDATE_IS_FOLLOWING } from "../actions/followActions"

export const FETCH_CURRENT_USER = "FETCH_CURRENT_USER"
export const FETCH_CURRENT_USER_SUCCESS = "FETCH_CURRENT_USER_SUCCESS"
export const FETCH_CURRENT_USER_ERROR400 = "FETCH_CURRENT_USER_ERROR400"
export const FETCH_CURRENT_USER_ERROR500 = "FETCH_CURRENT_USER_ERROR500"
export const FETCH_CURRENT_USER_FAILURE = "FETCH_CURRENT_USER_FAILURE"

export const FETCH_USER_PROFILE = "FETCH_USER_PROFILE"
export const FETCH_USER_PROFILE_SUCCESS = "FETCH_USER_PROFILE_SUCCESS"
export const FETCH_USER_PROFILE_ERROR400 = "FETCH_USER_PROFILE_ERROR400"
export const FETCH_USER_PROFILE_ERROR500 = "FETCH_USER_PROFILE_ERROR500"
export const FETCH_USER_PROFILE_FAILURE = "FETCH_USER_PROFILE_FAILURE"

export const FETCH_POSTS = "FETCH_POSTS"
export const FETCH_POSTS_SUCCESS = "FETCH_POSTS_SUCCESS"
export const FETCH_POSTS_ERROR400 = "FETCH_POSTS_ERROR400"
export const FETCH_POSTS_ERROR500 = "FETCH_POSTS_ERROR500"
export const FETCH_POSTS_FAILURE = "FETCH_POSTS_FAILURE"
	
export const FETCH_LOCAL_POSTS = "FETCH_LOCAL_POSTS"
export const FETCH_LOCAL_POSTS_SUCCESS = "FETCH_LOCAL_POSTS_SUCCESS"
export const FETCH_LOCAL_POSTS_ERROR400 = "FETCH_LOCAL_POSTS_ERROR400"
export const FETCH_LOCAL_POSTS_ERROR500 = "FETCH_LOCAL_POSTS_ERROR500"
export const FETCH_LOCAL_POSTS_FAILURE = "FETCH_LOCAL_POSTS_FAILURE"

export const FETCH_POSTS_FOR_USER = "FETCH_POSTS_FOR_USER"
export const FETCH_POSTS_FOR_USER_SUCCESS = "FETCH_POSTS_FOR_USER_SUCCESS"
export const FETCH_POSTS_FOR_USER_ERROR400 = "FETCH_POSTS_FOR_USER_ERROR400"
export const FETCH_POSTS_FOR_USER_ERROR500 = "FETCH_POSTS_FOR_USER_ERROR500"
export const FETCH_POSTS_FOR_USER_FAILURE = "FETCH_POSTS_FOR_USER_FAILURE"

export const DELETE_POST = "DELETE_POST"
export const DELETE_POST_SUCCESS = "DELETE_POST_SUCCESS"
export const DELETE_POST_ERROR400 = "DELETE_POST_ERROR400"
export const DELETE_POST_ERROR500 = "DELETE_POST_ERROR500"
export const DELETE_POST_FAILURE = "DELETE_POST_FAILURE"

export const UPDATE_POST = "UPDATE_POST"
export const UPDATE_POST_SUCCESS = "UPDATE_POST_SUCCESS"
export const UPDATE_POST_ERROR400 = "UPDATE_POST_ERROR400"
export const UPDATE_POST_ERROR500 = "UPDATE_POST_ERROR500"
export const UPDATE_POST_FAILURE = "UPDATE_POST_FAILURE"

export const UPDATE_CAN_VOTE = "UPDATE_CAN_VOTE"
export const UPDATE_CAN_VOTE_SUCCESS = "UPDATE_CAN_VOTE_SUCCESS"
export const UPDATE_CAN_VOTE_ERROR400 = "UPDATE_CAN_VOTE_ERROR400"
export const UPDATE_CAN_VOTE_ERROR500 = "UPDATE_CAN_VOTE_ERROR500"
export const UPDATE_CAN_VOTE_FAILURE = "UPDATE_CAN_VOTE_FAILURE"

export const UPDATE_VOTE_TOTAL = "UPDATE_VOTE_TOTAL"
export const UPDATE_VOTE_TOTAL_SUCCESS = "UPDATE_VOTE_TOTAL_SUCCESS"
export const UPDATE_VOTE_TOTAL_ERROR400 = "UPDATE_VOTE_TOTAL_ERROR400"
export const UPDATE_VOTE_TOTAL_ERROR500 = "UPDATE_VOTE_TOTAL_ERROR500"
export const UPDATE_VOTE_TOTAL_FAILURE = "UPDATE_VOTE_TOTAL_FAILURE"

export const CREATE_POST = "CREATE_POST"
export const CREATE_POST_SUCCESS = "CREATE_POST_SUCCESS"
export const CREATE_POST_ERROR400 = "CREATE_POST_ERROR400"
export const CREATE_POST_ERROR500 = "CREATE_POST_ERROR500"
export const CREATE_POST_FAILURE = "CREATE_POST_FAILURE"

export const FETCH_POST = "FETCH_POST"
export const FETCH_POST_SUCCESS = "FETCH_POST_SUCCESS"
export const FETCH_POST_ERROR400 = "FETCH_POST_ERROR400"
export const FETCH_POST_ERROR500 = "FETCH_POST_ERROR500"
export const FETCH_POST_FAILURE = "FETCH_POST_FAILURE"

export const SET_SINGLE_POST_TF = "SET_SINGLE_POST_TF"
export const SET_CURRENT_USER = "SET_CURRENT_USER"
export const SET_ACTIVE_POST = "SET_ACTIVE_POST"
export const SET_CURRENT_INDEX = "SET_CURRENT_INDEX"
export const UPDATE_SCROLL = "UPDATE_SCROLL"
export const RESET_NEXT_PREVIOUS = "RESET_NEXT_PREVIOUS"
	
export function setSinglePost(tf){
	return function (dispatch){
		dispatch({type: SET_SINGLE_POST_TF, res: tf})
	}
}
export function setCurrentIndex(index){
	return function (dispatch){
		dispatch({type: SET_CURRENT_INDEX, index: index})
	}
}

export function setCurrentProfile(user){
	return function(dispatch){
		dispatch({type: profileActionTypes.SET_CURRENT_PROFILE, res: user})
	}
}
export function setActivePost(post){
	return function (dispatch){
		dispatch({type: SET_ACTIVE_POST, res: post === "" ? undefined : post})
	}
}
export function updateCanVote(can_vote, index, item_index){
	return function(dispatch){
		dispatch({type: UPDATE_LOADING,res:true})
		dispatch({type:UPDATE_CAN_VOTE, res: {can_vote:can_vote,index:index,item_index:item_index}})
	}
}
export function updateIsFollowing(following, index){
	return function(dispatch){
		dispatch({type: UPDATE_LOADING_FOLLOW,res:true})
		dispatch({type:UPDATE_IS_FOLLOWING, res: {is_following:following,index:index}})
	}
}
export function updateVoteTotal(vote_total, index, item_index){
	return function(dispatch){
		dispatch({type: UPDATE_LOADING,res:true})
		dispatch({type:UPDATE_VOTE_TOTAL, res: {vote_total:vote_total,index:index,item_index:item_index}})
	}
}
export function fetchUser(username){
	return function (dispatch) {
		
	    let url =  setupApiEndpoint(SINGLE_USER_URL(username))
	    dispatch({type: FETCH_USER_PROFILE})
	    return request(
	      url, {},
	      (json) => { dispatch({type: FETCH_USER_PROFILE_SUCCESS, res: json}) },
	      (json) => { dispatch({type: FETCH_USER_PROFILE_ERROR400, res: json}) },
	      (res) => { dispatch({type: FETCH_USER_PROFILE_ERROR500, res: res}) },
	      (ex) => { dispatch({type: FETCH_USER_PROFILE_FAILURE, error: ex}) },
	    )
	}
}
export function fetchCurrentUser(token){
	  return function (dispatch) {
	    let url =  setupApiEndpoint(CURRENT_USER_URL)
	    dispatch({type: FETCH_CURRENT_USER})
	    return request(
	      url, {},
	      (json) => { dispatch({type: FETCH_CURRENT_USER_SUCCESS, res: json}) },
	      (json) => { dispatch({type: FETCH_CURRENT_USER_ERROR400, res: json}) },
	      (res) => { dispatch({type: FETCH_CURRENT_USER_ERROR500, res: res}) },
	      (ex) => { dispatch({type: FETCH_CURRENT_USER_FAILURE, error: ex}) },
	    )
	}
}
export function setCurrentUser(user){
	  return function (dispatch) {
	    dispatch({type: SET_CURRENT_USER, res: user}) 
	  }
	}
export function setScroll(scroll){
	return function(dispatch){
		dispatch({type:UPDATE_SCROLL,res:scroll})
	}
}
export function resetNextPrevious(){
	  return function (dispatch) {
	    dispatch({type: RESET_NEXT_PREVIOUS, res: null}) 
	  }
	}
export function fetchLocalPosts(next=null) {
	  return function (dispatch) {
		  var url = null
			if(next===null){
				url =  setupApiEndpoint(POSTS_URL) + POSTS_LIMIT + '&local=True'
			}else{
				url = next
			}
	    
	    dispatch({type: FETCH_LOCAL_POSTS})
	    return request(
	      url, {},
	      (json) => { dispatch({type: FETCH_LOCAL_POSTS_SUCCESS, res: json}) },
	      (json) => { dispatch({type: FETCH_LOCAL_POSTS_ERROR400, res: json}) },
	      (res) => { dispatch({type: FETCH_LOCAL_POSTS_ERROR500, res: res}) },
	      (ex) => { dispatch({type: FETCH_LOCAL_POSTS_FAILURE, error: ex}) },
	    )
	  }
	}
export function fetchPosts(next=null) {
	  return function (dispatch) {
		  var url = null
			if(next===null){
				url =  setupApiEndpoint(POSTS_URL) + POSTS_LIMIT
			}else{
				url = next
			}
	    
	    dispatch({type: FETCH_POSTS})
	    return request(
	      url, {},
	      (json) => { dispatch({type: FETCH_POSTS_SUCCESS, res: json}) },
	      (json) => { dispatch({type: FETCH_POSTS_ERROR400, res: json}) },
	      (res) => { dispatch({type: FETCH_POSTS_ERROR500, res: res}) },
	      (ex) => { dispatch({type: FETCH_POSTS_FAILURE, error: ex}) },
	    )
	  }
	}

export function fetchPostsForUser(username,next=null) {
  return function (dispatch) {
	  var url = null
		if(next===null){
			url =  setupApiEndpoint(POSTS_URL) + POSTS_LIMIT + "&username=" + username
		}else{
			url = next
		}
    dispatch({type: FETCH_POSTS_FOR_USER})
    return request(
      url, {},
      (json) => { dispatch({type: FETCH_POSTS_FOR_USER_SUCCESS, res: json}) },
      (json) => { dispatch({type: FETCH_POSTS_FOR_USER_ERROR400, res: json}) },
      (res) => { dispatch({type: FETCH_POSTS_FOR_USER_ERROR500, res: res}) },
      (ex) => { dispatch({type: FETCH_POSTS_FOR_USER_FAILURE, error: ex}) },
    )
  }
}
export function fetchPost(token, id) {
  return function (dispatch) {
    let url =  setupApiEndpoint(POSTS_URL) + id + "\/"
    dispatch({type: FETCH_POST})
    return request(
      url, {},
      (json) => { dispatch({type: FETCH_POST_SUCCESS, res: json}) },
      (json) => { dispatch({type: FETCH_POST_ERROR400, res: json}) },
      (res) => { dispatch({type: FETCH_POST_ERROR500, res: res}) },
      (ex) => { dispatch({type: FETCH_POST_FAILURE, error: ex}) },
    )
  }
}
export function deletePost(token, id, search) {
  return function (dispatch) {
    let url =  setupApiEndpoint(POSTS_URL) + id + "\/"
    dispatch({type: DELETE_POST})
    return request(
      url, { method: 'DELETE'},
      (json) => { dispatch({type: DELETE_POST_SUCCESS, search: search, res: id}) },
      (json) => { dispatch({type: DELETE_POST_ERROR400, res: id}) },
      (res) => { dispatch({type: DELETE_POST_ERROR500, res: id}) },
      (ex) => { dispatch({type: DELETE_POST_FAILURE, res: id, error: ex}) },
    )
  }
}
export function updatePost(post_text, index, id,search_index) {
  return function (dispatch) {
    let url =  setupApiEndpoint(POSTS_URL) + id + "\/"
	const data = {
		text: post_text
	}
    dispatch({type: UPDATE_POST})
    return request(
      url, { method: 'PATCH', body: JSON.stringify(data)},
      (json) => { dispatch({type: UPDATE_POST_SUCCESS, search_index:search_index, index:index, res: json}) },
      (json) => { dispatch({type: UPDATE_POST_ERROR400, res: json}) },
      (res) => { dispatch({type: UPDATE_POST_ERROR500, res: res}) },
      (ex) => { dispatch({type: UPDATE_POST_FAILURE, error: ex}) },
    )
  }
}
export function createPost(token, data) {
  return function (dispatch) {
    let url =  setupApiEndpoint(POSTS_URL) + id + "\/"
	const formData = new FormData();
    formData.append('text', data['text']);
    formData.append('user', data['user']);
    dispatch({type: UPDATE_POST})
    return request(
      url, { method: 'POST', body: data},
      (json) => { dispatch({type: UPDATE_POST_SUCCESS, res: json}) },
      (json) => { dispatch({type: UPDATE_POST_ERROR400, res: json}) },
      (res) => { dispatch({type: UPDATE_POST_ERROR500, res: res}) },
      (ex) => { dispatch({type: UPDATE_POST_FAILURE, error: ex}) },
    )
  }
}