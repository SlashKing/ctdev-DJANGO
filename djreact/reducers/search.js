import {POSTS_SCREEN} from "../common/constants/screens"
import * as searchActions from "../actions/searchActions"
import {
	UPDATE_COMMENT_SUCCESS,
	UPDATE_COMMENT_ERROR400,
	UPDATE_COMMENT_ERROR500,
	UPDATE_COMMENT_FAILURE,
	REMOVE_COMMENT_SUCCESS,
	REMOVE_COMMENT_ERROR400,
	REMOVE_COMMENT_ERROR500,
	REMOVE_COMMENT_FAILURE,
	ADD_NEW_COMMENT_SUCCESS,
	ADD_NEW_COMMENT_ERROR400,
	ADD_NEW_COMMENT_ERROR500,
	ADD_NEW_COMMENT_FAILURE
} from "../actions/commentActions"
import {
	UPDATE_CAN_VOTE, 
	UPDATE_POST_SUCCESS, 
	UPDATE_POST_ERROR400, 
	UPDATE_POST_ERROR500, 
	UPDATE_POST_FAILURE,
	DELETE_POST,
	DELETE_POST_SUCCESS,
	DELETE_POST_ERROR400,
	DELETE_POST_ERROR500,
	DELETE_POST_FAILURE,

} from "../actions/postActions"
import update from 'react-addons-update';

const initialState = {
  loading: false,
  error: undefined,
  is_typing: false,
  screen: POSTS_SCREEN,
  text:"",
  objects: undefined,
  followers: undefined,
  following: undefined,
  users: undefined,
  hashtags: undefined,
  friends: undefined,
  search_posts: undefined,
  next:null,
  previous:null
}
export function updateObjects(state,action){
	if(state.next !== null){
		return update(state,{
			objects:{$push: [action.res.results][0]},
			next:{$set:[action.res.next][0]},
			previous:{$set:[action.res.previous][0]},
			loading: {$set:[false][0]}
		})
	}else{
		if(state.previous === null){
			return{...state, loading:false, objects:action.res.results, next:action.res.next, previous: action.res.previous}
		}else{
			return{...state}
		}
	}
}
export default function search(state=initialState, action={}) {
	//console.log(action.type,state)
	switch (action.type) {
		case searchActions.RESET_NEXT_PREVIOUS:
			return {...state, next:action.res, previous:action.res}
		case searchActions.UPDATE_IS_TYPING:
			return update(state, {
				is_typing:{
					$set: [action.res][0]
				}
			})
		case searchActions.UPDATE_SEARCH_CAN_VOTE:
			const posts = state.objects
			if(action.res.item_index !== undefined){
				posts[action.res.index].comments_set[action.res.item_index].can_vote = action.res.can_vote ? false : true
			}else{
				posts[action.res.index].can_vote = action.res.can_vote ? false : true
			}
		
			return {...state, objects: posts}
			
		case searchActions.UPDATE_SEARCH_VOTE_TOTAL:
			if(action.res.item_index!==undefined){
				return update(state,{
					objects: {
						[action.res.index]:{
							comments_set:{
								[action.res.item_index]:{
									vote_total:{$set:[action.res.vote_total][0]}
								}
							}
						}
					}
				})
			}else{
				return update(state,{
					objects: {
						[action.res.index]:{
							vote_total:{$set:[action.res.vote_total][0]}
						}
					}
				})
			}
			
		case searchActions.UPDATE_SEARCH_IS_FOLLOWING:
			//state.currentProfile.is_following = state.currentProfile.is_following ? false : true
			const posts_if = state.objects
			posts_if.forEach(function(current_value) {
				if(current_value.user.username !== localStorage.username){
					current_value.user.is_following = action.res.is_following ? false : true
				}
			});
			return {...state, objects: posts_if}
		
		case searchActions.UPDATE_SEARCH_TEXT:
			return {...state, text : action.res}
		
		case searchActions.UPDATE_SEARCH_SCREEN:
			return {...state, screen:action.res,objects:undefined,text:""}
		
		case searchActions.FETCH_SEARCH_FOLLOWING:
			return {...state, loading: true}
		
		case searchActions.FETCH_SEARCH_FOLLOWING_SUCCESS:
			
			return updateObjects(state,action)
			//return {...state, loading: false, objects:action.res.results, next:action.res.next, previous:action.res.previous, following: action.res}
		
		case searchActions.FETCH_SEARCH_FOLLOWING_ERROR400:
		case searchActions.FETCH_SEARCH_FOLLOWING_ERROR500:
		case searchActions.FETCH_SEARCH_FOLLOWING_FAILURE:
			return {...state, error: "Error", loading: false}
			
		case searchActions.FETCH_SEARCH_FOLLOWERS:
			return {...state, loading: true}
		
		case searchActions.FETCH_SEARCH_FOLLOWERS_SUCCESS:
			return updateObjects(state,action)
			
		case searchActions.FETCH_SEARCH_FOLLOWERS_ERROR400:
		case searchActions.FETCH_SEARCH_FOLLOWERS_ERROR500:
		case searchActions.FETCH_SEARCH_FOLLOWERS_FAILURE:
			return {...state, error: "Error", loading: false}
			
		case searchActions.FETCH_SEARCH_HASHTAGS:
			return {...state, loading: true}
			
		case searchActions.FETCH_SEARCH_HASHTAGS_SUCCESS:
			return updateObjects(state,action)
			
		case searchActions.FETCH_SEARCH_HASHTAGS_ERROR400:
		case searchActions.FETCH_SEARCH_HASHTAGS_ERROR500:
		case searchActions.FETCH_SEARCH_HASHTAGS_FAILURE:
			return {...state, error: "Error", loading: false}
			
		case searchActions.FETCH_SEARCH_USERS:
			return {...state, loading: true}
			
		case searchActions.FETCH_SEARCH_USERS_SUCCESS:
			return updateObjects(state,action)
			
		case searchActions.FETCH_SEARCH_USERS_ERROR400:
		case searchActions.FETCH_SEARCH_USERS_ERROR500:
		case searchActions.FETCH_SEARCH_USERS_FAILURE:
			return {...state, error: "Error", loading: false}
			
		case searchActions.FETCH_SEARCH_FRIENDS:
			return {...state, loading: true}
		case searchActions.FETCH_SEARCH_FRIENDS_SUCCESS:
			return updateObjects(state,action)
			
		case searchActions.FETCH_SEARCH_FRIENDS_ERROR400:
		case searchActions.FETCH_SEARCH_FRIENDS_ERROR500:
		case searchActions.FETCH_SEARCH_FRIENDS_FAILURE:
			return {...state, error: "Error", loading: false}
			
		case searchActions.FETCH_SEARCH_POSTS:
			return {...state, loading: true}
			
		case searchActions.FETCH_SEARCH_POSTS_SUCCESS:
			return updateObjects(state,action)
			
		case searchActions.FETCH_SEARCH_POSTS_ERROR400:
		case searchActions.FETCH_SEARCH_POSTS_ERROR500:
		case searchActions.FETCH_SEARCH_POSTS_FAILURE:
			return {...state, error: "Error", loading: false}

		case UPDATE_POST_SUCCESS:
			if(action.search_index !== undefined) {
				return update(state,{
					objects:{
						[action.index]:{$set: [action.res][0]}
					}
				})
			}
		case UPDATE_POST_ERROR400:
		case UPDATE_POST_ERROR500:
		case UPDATE_POST_FAILURE:
			return {...state, error: "Error"}
			
		case DELETE_POST:	
			return {...state, loading: false}
			
		case DELETE_POST_SUCCESS:
			if(action.search !== undefined){
				return {...state, objects: state.objects.filter(({ id }) => id !== action.res)}
			}
		case DELETE_POST_ERROR400:
		case DELETE_POST_ERROR500:
		case DELETE_POST_FAILURE:
		
			return {...state,error: "Error", loading: false}
			
		case UPDATE_COMMENT_SUCCESS:
			if(action.search !== undefined){
				return update(state,{
					objects:{
						[action.post_index]:{
							comments_set:{
								[action.index]:{$set: [action.res][0]}
							}
						}
					}
				})
			}
		case UPDATE_COMMENT_ERROR400:
		case UPDATE_COMMENT_ERROR500:
		case UPDATE_COMMENT_FAILURE:
			return {...state, error: "Error"}
	case REMOVE_COMMENT_SUCCESS:
//console.log(action.index,action.res)
		if(action.search !== undefined){
			return update(state,{
				objects:{
					[action.index]:{
						comments_set: {$splice : [[action.comment_index,1]]}
					}
				}
			})
		}
		case REMOVE_COMMENT_ERROR400:
		case REMOVE_COMMENT_ERROR500:
		case REMOVE_COMMENT_FAILURE:
	
	
		case ADD_NEW_COMMENT_SUCCESS:
			if(action.search !== undefined){
				action.res.vote_total = 0
				return update(state,{
					objects:{
						[action.index]:{
								comments_set:{$splice: [[0,0,action.res]]}
						}
					}
				})
			}
		
		case ADD_NEW_COMMENT_ERROR400:
		case ADD_NEW_COMMENT_ERROR500:
		case ADD_NEW_COMMENT_FAILURE:
			return {...state, error: "Error"}
		
			return {...state,error: "Error", loading: false}
			default:
				return state
  }
}