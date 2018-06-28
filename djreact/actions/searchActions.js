import { request } from "../utils"
import { setupApiEndpoint } from "../common/constants/endpoints/config"
import { POSTS_URL } from "../common/constants/endpoints/posts"
import { USERS_URL } from "../common/constants/endpoints/user"
import { FRIENDS_URL } from "../common/constants/endpoints/friend"
import { HASHTAGS_URL } from "../common/constants/endpoints/hashtag"
import { MY_FOLLOWERS,MY_FOLLOWING, getFollowersFor, getFollowingFor } from "../common/constants/endpoints/follow"
import { UPDATE_LOADING_FOLLOW} from "../actions/followActions"
import update from 'react-addons-update'
import { 
	FRIEND_SCREEN, 
	HASHTAG_SCREEN, 
	POSTS_SCREEN,
	USERS_SCREEN, 
	FOLLOWERS_SCREEN,
	FOLLOWING_SCREEN 
} from "../common/constants/screens"
export const UPDATE_SEARCH_TEXT = "UPDATE_SEARCH_TEXT"
export const UPDATE_SEARCH_SCREEN = "UPDATE_SEARCH_SCREEN"
export const UPDATE_IS_TYPING = "UPDATE_IS_TYPING"
export const RESET_NEXT_PREVIOUS = "RESET_NEXT_PREVIOUS"

export const FETCH_SEARCH_POSTS = "FETCH_SEARCH_POSTS"
export const FETCH_SEARCH_POSTS_SUCCESS = "FETCH_SEARCH_POSTS_SUCCESS"
export const FETCH_SEARCH_POSTS_ERROR400 = "FETCH_SEARCH_POSTS_ERROR400"
export const FETCH_SEARCH_POSTS_ERROR500 = "FETCH_SEARCH_POSTS_ERROR500"
export const FETCH_SEARCH_POSTS_FAILURE = "FETCH_SEARCH_POSTS_FAILURE"

export const FETCH_SEARCH_FOLLOWERS = "FETCH_SEARCH_FOLLOWERS"
export const FETCH_SEARCH_FOLLOWERS_SUCCESS = "FETCH_SEARCH_FOLLOWERS_SUCCESS"
export const FETCH_SEARCH_FOLLOWERS_ERROR400 = "FETCH_SEARCH_FOLLOWERS_ERROR400"
export const FETCH_SEARCH_FOLLOWERS_ERROR500 = "FETCH_SEARCH_FOLLOWERS_ERROR500"
export const FETCH_SEARCH_FOLLOWERS_FAILURE = "FETCH_SEARCH_FOLLOWERS_FAILURE"

export const FETCH_SEARCH_FOLLOWING = "FETCH_SEARCH_FOLLOWING"
export const FETCH_SEARCH_FOLLOWING_SUCCESS = "FETCH_SEARCH_FOLLOWING_SUCCESS"
export const FETCH_SEARCH_FOLLOWING_ERROR400 = "FETCH_SEARCH_FOLLOWING_ERROR400"
export const FETCH_SEARCH_FOLLOWING_ERROR500 = "FETCH_SEARCH_FOLLOWING_ERROR500"
export const FETCH_SEARCH_FOLLOWING_FAILURE = "FETCH_SEARCH_FOLLOWING_FAILURE"

export const FETCH_SEARCH_FOLLOWERS_FOR = "FETCH_SEARCH_FOLLOWERS_FOR"
export const FETCH_SEARCH_FOLLOWERS_FOR_SUCCESS = "FETCH_SEARCH_FOLLOWERS_FOR_SUCCESS"
export const FETCH_SEARCH_FOLLOWERS_FOR_ERROR400 = "FETCH_SEARCH_FOLLOWERS_FOR_ERROR400"
export const FETCH_SEARCH_FOLLOWERS_FOR_ERROR500 = "FETCH_SEARCH_FOLLOWERS_FOR_ERROR500"
export const FETCH_SEARCH_FOLLOWERS_FOR_FAILURE = "FETCH_SEARCH_FOLLOWERS_FOR_FAILURE"

export const FETCH_SEARCH_FOLLOWING_FOR = "FETCH_SEARCH_FOLLOWING_FOR"
export const FETCH_SEARCH_FOLLOWING_FOR_SUCCESS = "FETCH_SEARCH_FOLLOWING_FOR_SUCCESS"
export const FETCH_SEARCH_FOLLOWING_FOR_ERROR400 = "FETCH_SEARCH_FOLLOWING_FOR_ERROR400"
export const FETCH_SEARCH_FOLLOWING_FOR_ERROR500 = "FETCH_SEARCH_FOLLOWING_FOR_ERROR500"
export const FETCH_SEARCH_FOLLOWING_FOR_FAILURE = "FETCH_SEARCH_FOLLOWING_FOR_FAILURE"

export const FETCH_SEARCH_HASHTAGS = "FETCH_SEARCH_HASHTAGS"
export const FETCH_SEARCH_HASHTAGS_SUCCESS = "FETCH_SEARCH_HASHTAGS_SUCCESS"
export const FETCH_SEARCH_HASHTAGS_ERROR400 = "FETCH_SEARCH_HASHTAGS_ERROR400"
export const FETCH_SEARCH_HASHTAGS_ERROR500 = "FETCH_SEARCH_HASHTAGS_ERROR500"
export const FETCH_SEARCH_HASHTAGS_FAILURE = "FETCH_SEARCH_HASHTAGS_FAILURE"

export const FETCH_SEARCH_FRIENDS = "FETCH_SEARCH_FRIENDS"
export const FETCH_SEARCH_FRIENDS_SUCCESS = "FETCH_SEARCH_FRIENDS_SUCCESS"
export const FETCH_SEARCH_FRIENDS_ERROR400 = "FETCH_SEARCH_FRIENDS_ERROR400"
export const FETCH_SEARCH_FRIENDS_ERROR500 = "FETCH_SEARCH_FRIENDS_ERROR500"
export const FETCH_SEARCH_FRIENDS_FAILURE = "FETCH_SEARCH_FRIENDS_FAILURE"

export const FETCH_SEARCH_USERS = "FETCH_SEARCH_USERS"
export const FETCH_SEARCH_USERS_SUCCESS = "FETCH_SEARCH_USERS_SUCCESS"
export const FETCH_SEARCH_USERS_ERROR400 = "FETCH_SEARCH_USERS_ERROR400"
export const FETCH_SEARCH_USERS_ERROR500 = "FETCH_SEARCH_USERS_ERROR500"
export const FETCH_SEARCH_USERS_FAILURE = "FETCH_SEARCH_USERS_FAILURE"

export const UPDATE_SEARCH_IS_FOLLOWING = "UPDATE_SEARCH_IS_FOLLOWING"
export const UPDATE_SEARCH_VOTE_TOTAL = "UPDATE_SEARCH_VOTE_TOTAL"
export const UPDATE_SEARCH_CAN_VOTE = "UPDATE_SEARCH_CAN_VOTE"
export function updateIsFollowing(following, index){
	return function(dispatch){
		dispatch({type:UPDATE_SEARCH_IS_FOLLOWING, res: {is_following:following,index:index}})
	}
}
export function resetNextPrevious(){
	return function(dispatch){
		dispatch({type:RESET_NEXT_PREVIOUS,res:null})
	}
}
export function updateCanVote(can_vote, index, item_index){
	return function(dispatch){
		dispatch({type:UPDATE_SEARCH_CAN_VOTE, res: {can_vote:can_vote,index:index,item_index:item_index}})
	}
}
export function updateVoteTotal(vote_total, index, item_index){
	return function(dispatch){
		dispatch({type:UPDATE_SEARCH_VOTE_TOTAL, res: {vote_total:vote_total,index:index,item_index:item_index}})
	}
}
export function updateSearchText(text){
	return function (dispatch){
		dispatch({type: UPDATE_SEARCH_TEXT, res: text})
	}
}
export function updateSearchScreen(screen){
	return function(dispatch){
		dispatch({type: UPDATE_SEARCH_SCREEN, res: screen})
	}
}
export function updateTyping(is_typing){
	return function(dispatch){
		dispatch({
			type:UPDATE_IS_TYPING,
			res: is_typing
		})
	}
}
export function fetchCurrentUser(token){
  return function (dispatch) {
    let url =  setupApiEndpoint(CURRENT_USER_URL)
	console.log(url)
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
export function fetchPosts(filter_text) {
  return function (dispatch) {
    let url =  setupApiEndpoint(POSTS_URL) + "?limit=6&filter=" + filter_text
	console.log(url)
    dispatch({type: FETCH_SEARCH_POSTS})
    return request(
      url, {},
      (json) => { dispatch({type: FETCH_SEARCH_POSTS_SUCCESS, res: json}) },
      (json) => { dispatch({type: FETCH_SEARCH_POSTS_ERROR400, res: json}) },
      (res) => { dispatch({type: FETCH_SEARCH_POSTS_ERROR500, res: res}) },
      (ex) => { dispatch({type: FETCH_SEARCH_POSTS_FAILURE, error: ex}) },
    )
  }
}

export function fetchUsers(filter_text) {
  return function (dispatch) {
    let url =  setupApiEndpoint(USERS_URL) + "?limit=20&filter=" + filter_text
	console.log(url)
    dispatch({type: FETCH_SEARCH_USERS})
    return request(
      url, {},
      (json) => { dispatch({type: FETCH_SEARCH_USERS_SUCCESS, res: json}) },
      (json) => { dispatch({type: FETCH_SEARCH_USERS_ERROR400, res: json}) },
      (res) => { dispatch({type: FETCH_SEARCH_USERS_ERROR500, res: res}) },
      (ex) => { dispatch({type: FETCH_SEARCH_USERS_FAILURE, error: ex}) },
    )
  }
}
export function fetchFriends(filter_text) {
  return function (dispatch) {
    let url =  setupApiEndpoint(FRIENDS_URL) + "?limit=20&filter=" + filter_text
    dispatch({type: FETCH_SEARCH_FRIENDS})
    return request(
      url, {},
      (json) => { dispatch({type: FETCH_SEARCH_FRIENDS_SUCCESS, res: json}) },
      (json) => { dispatch({type: FETCH_SEARCH_FRIENDS_ERROR400, res: json}) },
      (res) => { dispatch({type: FETCH_SEARCH_FRIENDS_ERROR500, res: res}) },
      (ex) => { dispatch({type: FETCH_SEARCH_FRIENDS_FAILURE, error: ex}) },
    )
  }
}
export function fetchHashtags(filter_text) {
  return function (dispatch) {
    let url =  setupApiEndpoint(HASHTAGS_URL) + "?limit=20&filter=" + filter_text
	console.log(url)
    dispatch({type: FETCH_SEARCH_HASHTAGS})
    return request(
      url, {},
      (json) => { dispatch({type: FETCH_SEARCH_HASHTAGS_SUCCESS, res: json}) },
      (json) => { dispatch({type: FETCH_SEARCH_HASHTAGS_ERROR400, res: json}) },
      (res) => { dispatch({type: FETCH_SEARCH_HASHTAGS_ERROR500, res: res}) },
      (ex) => { dispatch({type: FETCH_SEARCH_HASHTAGS_FAILURE, error: ex}) },
    )
  }
}
export function fetchFollowing(filter_text) {
  return function (dispatch) {
    let url =  setupApiEndpoint(MY_FOLLOWING) + '?limit=20&filter_text=' + filter_text
	console.log(url)
    dispatch({type: FETCH_SEARCH_FOLLOWING})
    return request(
      url, {},
      (json) => { dispatch({type: FETCH_SEARCH_FOLLOWING_SUCCESS, res: json}) },
      (json) => { dispatch({type: FETCH_SEARCH_FOLLOWING_ERROR400, res: json}) },
      (res) => { dispatch({type: FETCH_SEARCH_FOLLOWING_ERROR500, res: res}) },
      (ex) => { dispatch({type: FETCH_SEARCH_FOLLOWING_FAILURE, error: ex}) },
    )
  }
}
export function fetchFollowers(filter_text) {
  return function (dispatch) {
    let url =  setupApiEndpoint(MY_FOLLOWERS) + "?limit=20&filter_text=" + filter_text
	console.log(url)
    dispatch({type: FETCH_SEARCH_FOLLOWERS})
    return request(
      url, {},
      (json) => { dispatch({type: FETCH_SEARCH_FOLLOWERS_SUCCESS, res: json}) },
      (json) => { dispatch({type: FETCH_SEARCH_FOLLOWERS_ERROR400, res: json}) },
      (res) => { dispatch({type: FETCH_SEARCH_FOLLOWERS_ERROR500, res: res}) },
      (ex) => { dispatch({type: FETCH_SEARCH_FOLLOWERS_FAILURE, error: ex}) },
    )
  }
}
export function fetchFollowingFor(user_id,filter_text) {
  return function (dispatch) {
    let url =  getFollowingFor(user_id) + '?filter_text=' + filter_text
	console.log(url)
    dispatch({type: FETCH_SEARCH_FOLLOWING_FOR_FOR})
    return request(
      url, {},
      (json) => { dispatch({type: FETCH_SEARCH_FOLLOWING_FOR_SUCCESS, res: json}) },
      (json) => { dispatch({type: FETCH_SEARCH_FOLLOWING_FOR_ERROR400, res: json}) },
      (res) => { dispatch({type: FETCH_SEARCH_FOLLOWING_FOR_ERROR500, res: res}) },
      (ex) => { dispatch({type: FETCH_SEARCH_FOLLOWING_FOR_FAILURE, error: ex}) },
    )
  }
}
export function fetchFollowersFor(user_id,filter_text) {
  return function (dispatch) {
    let url =  getFollowersFor(user_id) + "?filter=" + filter_text
	console.log(url)
    dispatch({type: FETCH_SEARCH_FOLLOWERS_FOR})
    return request(
      url, {},
      (json) => { dispatch({type: FETCH_SEARCH_FOLLOWERS_FOR_SUCCESS, res: json}) },
      (json) => { dispatch({type: FETCH_SEARCH_FOLLOWERS_FOR_ERROR400, res: json}) },
      (res) => { dispatch({type: FETCH_SEARCH_FOLLOWERS_FOR_ERROR500, res: res}) },
      (ex) => { dispatch({type: FETCH_SEARCH_FOLLOWERS_FOR_FAILURE, error: ex}) },
    )
  }
}
