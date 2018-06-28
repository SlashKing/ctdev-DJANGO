import * as postActions from "../actions/postActions"
import * as friendActions from "../common/constants/actiontypes/friend"
import * as profileActions from "../common/constants/actiontypes/profile"
import * as formActions from "../actions/formActions"
import * as appActions from "../actions/appActions"
import * as commentActions from "../actions/commentActions"
import {FEED_SCREEN} from "../common/constants/screens"
import {UPDATE_IS_FOLLOWING} from "../actions/followActions"
import update from 'react-addons-update';

export const SWITCH_APP_SCREEN = "SWITCH_APP_SCREEN"

const initialState = {
  loading: false,
  error: null,
  screen: FEED_SCREEN,
  next:null,
  previous:null,
  currentScroll:null,
  posts: undefined,
  user: undefined,
  activePost: undefined,
  isSinglePost: false,
  currentIndex:0,
  currentProfile: undefined
}
export default function globalfeed(state=initialState, action={}) {
	switch (action.type) {
	case postActions.SET_CURRENT_INDEX:
		return {...state, currentIndex: action.index}
	case appActions.SWITCH_APP_SCREEN:
		return {...state, isSinglePost: false, screen: action.res}
		
	case commentActions.REMOVE_COMMENT_SUCCESS:
		if(action.search === undefined){
			if(state.activePost !== undefined){
				if(action.index === -1){
					return update(state,{
						activePost:{
							comments_set: {$splice : [[action.comment_index,1]]}
						}
					})
				}else{
					return update(state,{
						activePost:{
							comments_set: {$splice : [[action.comment_index,1]]}
						},
						posts:{
							[action.index]:{
								comments_set: {$splice : [[action.comment_index,1]]}
							}
						}
					})
				}
			}else{
				return update(state,{
					posts:{
						[action.index]:{
							comments_set: {$splice : [[action.comment_index,1]]}
						}
					}
				})
			}
		}
		
	case commentActions.REMOVE_COMMENT_ERROR400:
	case commentActions.REMOVE_COMMENT_ERROR500:
	case commentActions.REMOVE_COMMENT_FAILURE:
		return {...state,error: "Error", loading: false}

	case commentActions.ADD_NEW_COMMENT_SUCCESS:
		if(action.search === undefined){
			action.res.vote_total = 0
			if(state.activePost !== undefined){

				if(action.index === -1){
					return  update(state,{
						activePost:{
							comments_set:{$splice: [[0,0,action.res]]}
						}
					})
				}else{
					return update(state,{
						activePost:{
							comments_set:{$splice: [[0,0,action.res]]}
						},
						posts:{
							[action.index]:{
									comments_set:{$splice: [[0,0,action.res]]}
							}
						}
					})
				}
			}else{
				
				return update(state,{
					posts:{
						[action.index]:{
								comments_set:{$splice: [[0,0,action.res]]}
						}
					}
				})

			}
		}
	
	case commentActions.ADD_NEW_COMMENT_ERROR400:
	case commentActions.ADD_NEW_COMMENT_ERROR500:
	case commentActions.ADD_NEW_COMMENT_FAILURE:
		return {...state, error: "Error"}
	
	case commentActions.UPDATE_COMMENT_SUCCESS:
		if(action.search === undefined){
			if(state.activePost !== undefined){
				if(action.post_index === -1){
					return update(state,{
						activePost:{
							comments_set:{
								[action.index]:{$set: [action.res][0]}
							}
						}
					})
				}else{
					return update(state,{
						activePost:{
							comments_set:{
								[action.index]:{$set: [action.res][0]}
							}
						},
						posts:{
							[action.post_index]:{
								comments_set:{
									[action.index]:{$set: [action.res][0]}
								}
							}
						}
					})
				}
				
			}else{
				return update(state,{
					posts:{
						[action.post_index]:{
							comments_set:{
								[action.index]:{$set: [action.res][0]}
							}
						}
					}
				})
			}
		}
		
	case commentActions.UPDATE_COMMENT_ERROR400:
	case commentActions.UPDATE_COMMENT_ERROR500:
	case commentActions.UPDATE_COMMENT_FAILURE:
		return {...state, error: "Error"}
	case postActions.UPDATE_SCROLL:
		return update(state,{ 
			currentScroll:{$set:[action.res][0]}
		})
		
	case postActions.UPDATE_POST_SUCCESS:
	if(action.search_index === undefined){
		if(state.activePost !== undefined){
			if(action.index === -1){
				return update(state,{
					activePost:{$set:[action.res][0]}
				})
				
			}else{
				return update(state,{
					activePost:{$set:[action.res][0]},
					posts:{
						[action.index]:{$set: [action.res][0]}
						}
					})
				
			}
			
		}else{
			return update(state,{
				posts:{
					[action.index]:{$set: [action.res][0]}
					}
				})
		}
	}
	case postActions.UPDATE_POST_ERROR400:
	case postActions.UPDATE_POST_ERROR500:
	case postActions.UPDATE_POST_FAILURE:
		return {...state, error: "Error"}

	case profileActions.SET_CURRENT_PROFILE:
		return {...state, isSinglePost: false, currentProfile: action.res === "" || action.res === undefined ? undefined : action.res}
		
	case friendActions.ADD_FRIEND:
		return {...state,loading:true}
		
	case friendActions.ADD_FRIEND_SUCCESS:
		var currentProfile = undefined
		if(state.currentProfile !== undefined){
			currentProfile = state.currentProfile
			currentProfile.request_sent = true
		}
		var posts_af = state.posts
		posts_af.forEach(function(current_value) {
			if(current_value.user.username !== state.user.username && current_value.user.id === action.res.to_user){
				console.log('add friend')
				current_value.user.request_sent = true
			}                 
		}); 
		return {...state, posts: posts_af,currentProfile:currentProfile,loading:false }
	case friendActions.ADD_FRIEND_ERROR400:
	case friendActions.ADD_FRIEND_ERROR500:
	case friendActions.ADD_FRIEND_FAILURE:
		return {...state, error: "Error",loading:false}
	
	case friendActions.REMOVE_FRIEND:
		return {...state, loading:true}
	case friendActions.REMOVE_FRIEND_SUCCESS:
		var currentProfile = undefined
		if(state.currentProfile !== undefined){
			currentProfile = state.currentProfile
			currentProfile.request_sent = false
			currentProfile.request_received = false
			currentProfile.are_friends = false
		}
		var posts_rf = state.posts
		
		posts_rf.forEach(function(current_value) {
			if(current_value.user.username !== state.user.username && current_value.user.id === action.res.to_user){
				console.log('remove friend')
				current_value.user.request_sent = false
				current_value.user.request_received = false
				current_value.user.request_rejected = false
				current_value.user.are_friends = false
			}
		});

		return {...state, 
			loading:false,
			currentProfile: currentProfile,
			posts: posts_rf
		}
	case friendActions.REMOVE_FRIEND_ERROR400:
	case friendActions.REMOVE_FRIEND_ERROR500:
	case friendActions.REMOVE_FRIEND_FAILURE:
		return {...state, error: "Error"}
	
	case friendActions.ACCEPT_FRIEND_REQUEST:
		return {...state,loading:true}
	case friendActions.ACCEPT_FRIEND_REQUEST_SUCCESS:
		var currentProfile = undefined
		if(state.currentProfile !== undefined){
			currentProfile = state.currentProfile
			currentProfile.request_sent = false
			currentProfile.request_received = false
			currentProfile.are_friends = true
			
		}
		var posts_afr = state.posts
		posts_afr.forEach(function(current_value) {
			if(current_value.user.username !== state.user.username && current_value.user.id === action.res.to_user){
				console.log('accept friend request')
				current_value.user.request_sent = false
				current_value.user.request_received = false
				current_value.user.are_friends = true
			}
		});

		return {...state, 
			currentProfile: currentProfile,
			posts: posts_afr,
			loading:false,
		}
	case friendActions.ACCEPT_FRIEND_REQUEST_ERROR400:
	case friendActions.ACCEPT_FRIEND_REQUEST_ERROR500:
	case friendActions.ACCEPT_FRIEND_REQUEST_FAILURE:
		return {...state, error: "Error"}
	
	case friendActions.REJECT_FRIEND_REQUEST:
		return {...state,loading:true}
	case friendActions.REJECT_FRIEND_REQUEST_SUCCESS:
		var currentProfile = undefined
		if(state.currentProfile !== undefined){
			currentProfile = state.currentProfile
			currentProfile.request_rejected = true
			currentProfile.are_friends = false
		}
		var posts_rfr = state.posts
		posts_rfr.forEach(function(current_value) {
			console.log(current_value, action.res)
			if(current_value.user.username !== state.user.username && current_value.user.id === action.res.to_user){
				console.log('reject friend request')
					current_value.user.request_rejected = true
					current_value.user.are_friends = false
			}                 
		});
		return {...state, 
			loading:false,
			currentProfile: currentProfile,
			posts: posts_rfr
		}

	case friendActions.REJECT_FRIEND_REQUEST_ERROR400:
	case friendActions.REJECT_FRIEND_REQUEST_ERROR500:
	case friendActions.REJECT_FRIEND_REQUEST_FAILURE:
		return {...state, error: "Error", loading:false}
	
	case friendActions.CANCEL_FRIEND_REQUEST:
		return {...state,loading:true}
	case friendActions.CANCEL_FRIEND_REQUEST_SUCCESS:
		var currentProfile = undefined
		if(state.currentProfile !== undefined){
			currentProfile = state.currentProfile
			currentProfile.request_sent = false
			currentProfile.are_friends = false
		}
		var posts_cfr = state.posts
		posts_cfr.forEach(function(current_value) {
			if(current_value.user.username !== state.user.username && current_value.user.id === action.res.to_user){
				console.log('got heere')
				current_value.user.request_sent = false
				current_value.user.are_friends = false
			}                 
		});
		return {...state, 
			loading:false,
			currentProfile:currentProfile,
			posts:posts_cfr
		}
	case friendActions.CANCEL_FRIEND_REQUEST_ERROR400:
	case friendActions.CANCEL_FRIEND_REQUEST_ERROR500:
	case friendActions.CANCEL_FRIEND_REQUEST_FAILURE:
		return {...state, error: "Error"}
	
	case postActions.UPDATE_CAN_VOTE:
		var posts = state.posts
		var post = null
		if(action.res.index !== -1){
			post = posts[action.res.index]
		}else{
			post = state.activePost
		}
		if(action.res.item_index !== undefined){
			post.comments_set[action.res.item_index].can_vote = action.res.can_vote ? false : true
		}else{
			post.can_vote = action.res.can_vote ? false : true
		}

		if(action.res.index === -1){
			return {...state,activePost:post,currentScroll: window.scrollY}
		}else{
			return {...state,posts:posts,currentScroll: window.scrollY}
		}
	case postActions.UPDATE_VOTE_TOTAL:
		var posts_vt = state.posts
		var post = null
			if(action.res.index !== -1){
				post = posts_vt[action.res.index]
			}else{
				post = state.activePost
			}
		if(action.res.item_index!==undefined){
			post.comments_set[action.res.item_index].vote_total = action.res.vote_total
		}else{
			post.vote_total = action.res.vote_total
		}
	
		if(action.res.index === -1){
			return {...state,activePost:post}
		}else{
			return {...state,posts:posts_vt}
		}
	case UPDATE_IS_FOLLOWING:
	// state.currentProfile.is_following = state.currentProfile.is_following ?
	// false : true
	var posts_if = state.posts
	let username=localStorage.username
	if(action.res.index !== undefined ){ 
		username = posts_if[action.res.index].user.username
		posts_if[action.res.index].is_following = action.res.is_following ?false :true}
		for(var z =0;z<posts_if.length;z++){
			console.log(username)
			let this_post = posts_if[z]
			if(posts_if[z].user.username === username){
				console.log(username)
				posts_if[z].user.is_following = action.res.is_following ? false : true
			}
		}
	
	var currentProfile = state.currentProfile
	if(state.currentProfile !== undefined){
		currentProfile.is_following = action.res.is_following ? false : true
	}
	const top = window.scrollY
	return {...state, currentScroll: top,currentProfile:currentProfile, posts: posts_if}

	case postActions.SET_ACTIVE_POST:
		return {...state, activePost: action.res }
		
	case postActions.SET_SINGLE_POST_TF:
	var posts_ssp = state.posts
	
	// if(!action.res){
	// postActions.resetNextPrevious()
	// postActions.fetchPosts()
	// return {...state, isSinglePost:action.res }
	// }else{
	// const posts_clear = []
	// state.posts = posts_clear
	// posts_clear.push(state.activePost)
	// return {...state, isSinglePost: action.res, posts:posts_clear}
	// }
		return {...state, isSinglePost:action.res}

	case formActions.ADD_POST_FORM_SUCCESS:
	// new post doesn't pass vote_total so we'll add it to the new post
	action.res.vote_total = 0
		return update(state,{
			posts: {
				$splice: [[0,0,action.res]]
			}
		})
	case formActions.UPDATE_COVER:
		return {...state,loading:true}
	case formActions.UPDATE_COVER_SUCCESS:
		console.log(action.res)
		return update(state,{
			currentProfile: {
				profile:{$set: [action.res][0]}
			},
			user:{
				profile:{$set:[action.res][0]}
			},
			loading: {$set:[false][0]}
		})
	case formActions.UPDATE_COVER_ERROR400:
	case formActions.UPDATE_COVER_ERROR500:
	case formActions.UPDATE_COVER_FAILURE:
		return {...state, error: "Error", loading: false}
	
	case formActions.UPDATE_PROFILE_IMAGE:
		return {...state,loading:true}
	case formActions.UPDATE_PROFILE_IMAGE_SUCCESS:
		console.log(action.res)
		return update(state,{
			currentProfile: {
				profile:{$set: [action.res][0]}
			},
			user:{
				profile:{$set:[action.res][0]}
			},
			loading: {$set:[false][0]}
		})
	case formActions.UPDATE_PROFILE_IMAGE_ERROR400:
	case formActions.UPDATE_PROFILE_IMAGE_ERROR500:
	case formActions.UPDATE_PROFILE_IMAGE_FAILURE:
		return {...state, error: "Error", loading: false}
			
	case postActions.SET_CURRENT_USER:
		localStorage.username = action.res.username
		localStorage.user_id = action.res.id
		return {...state, user: action.res}

	case postActions.FETCH_CURRENT_USER:
		return {...state, loading: true}
		
	case postActions.FETCH_CURRENT_USER_SUCCESS:
	localStorage.username = action.res.username
	localStorage.user_id = action.res.id
		return {...state, loading: false, user: action.res}
	
	case postActions.FETCH_CURRENT_USER_ERROR400:
	case postActions.FETCH_CURRENT_USER_ERROR500:
	case postActions.FETCH_CURRENT_USER_FAILURE:
		return {...state, error: "Error", loading: false}

	case postActions.FETCH_USER_PROFILE:
		return {...state, loading: true}
		
	case postActions.FETCH_USER_PROFILE_SUCCESS:
		return {...state, loading: false, currentProfile: action.res}
	
	case postActions.FETCH_USER_PROFILE_ERROR400:
	case postActions.FETCH_USER_PROFILE_ERROR500:
	case postActions.FETCH_USER_PROFILE_FAILURE:
		return {...state, error: "Error", loading: false}
		
	case postActions.FETCH_POSTS :
		if(state.next === null && state.previous ===null){
			window.scrollTo(0,0)
		}
		return {...state,loading:true}
		
	case postActions.FETCH_POSTS_SUCCESS:
		if(state.next !== null){
			return {...state,
				posts:state.posts.concat(action.res.results),
				next:action.res.next,
				previous:action.res.previous,
				loading: false
			}
		}else{
			if(state.previous === null){
				return{...state, loading:false, posts:action.res.results, next:action.res.next, previous: action.res.previous}
			}else{
				return{...state}
			}
		}
		
	case postActions.FETCH_POSTS_ERROR400:
	case postActions.FETCH_POSTS_ERROR500:
	case postActions.FETCH_POSTS_FAILURE:
		return {...state, error: "Error", loading: false}
		
	case postActions.FETCH_LOCAL_POSTS :
		if(state.next === null && state.previous ===null){
			window.scrollTo(0,0)
		}
		return {...state,loading:true}
		
	case postActions.FETCH_LOCAL_POSTS_SUCCESS:
		if(state.next !== null){
			return {...state,
				posts:state.posts.concat(action.res.results),
				next:action.res.next,
				previous:action.res.previous,
				loading: false
			}
		}else{
			if(state.previous === null){
				return{...state, loading:false, posts:action.res.results, next:action.res.next, previous: action.res.previous}
			}else{
				return{...state}
			}
		}
		
	case postActions.FETCH_LOCAL_POSTS_ERROR400:
	case postActions.FETCH_LOCAL_POSTS_ERROR500:
	case postActions.FETCH_LOCAL_POSTS_FAILURE:
		return {...state, error: "Error", loading: false}
	case postActions.FETCH_POSTS_FOR_USER:
		if(state.next === null && state.previous ===null){
			window.scrollTo(0,0)
		}
		return {...state,loading:true}
		
	case postActions.FETCH_POSTS_FOR_USER_SUCCESS:
		if(state.next !== null){
			return {...state,
				posts:state.posts.concat(action.res.results),
				next:action.res.next,
				previous:action.res.previous,
				loading: false
			}
		}else{
			if(state.previous === null){
				return{...state, loading:false, posts:action.res.results, next:action.res.next, previous: action.res.previous}
			}else{
				return{...state}
			}
		}
		return {...state, loading: false, posts: action.res}
		
	case postActions.FETCH_POSTS_FOR_USER_ERROR400:
	case postActions.FETCH_POSTS_FOR_USER_ERROR500:
	case postActions.FETCH_POSTS_FOR_USER_FAILURE:
		return {...state, error: "Error", loading: false}
	
	case postActions.RESET_NEXT_PREVIOUS:
		return {...state, next: action.res, previous:action.res}
	case postActions.DELETE_POST:
		return {...state}
		
	case postActions.DELETE_POST_SUCCESS:
		if(action.search === undefined){
			return {...state, posts: state.posts.filter(({ id }) => id !== action.res)}
		}
	case postActions.DELETE_POST_ERROR400:
	case postActions.DELETE_POST_ERROR500:
	case postActions.DELETE_POST_FAILURE:
	
		return {...state,error: "Error"}
	default:
		return state
	}
}