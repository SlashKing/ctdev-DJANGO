import { request } from "../utils"
import { setupApiEndpoint } from "../common/constants/endpoints/config"
import { LIKES_URL } from "../common/constants/endpoints/likes"
import { updateVoteTotal as voteTotal, updateCanVote as canVote } from "../actions/postActions"
import { updateVoteTotal, updateCanVote } from "../actions/searchActions"

export const UPDATE_LOADING = "UPDATE_LOADING"
export const LIKE_OBJECT = "LIKE_OBJECT"
export const LIKE_OBJECT_SUCCESS = "LIKE_OBJECT_SUCCESS"
export const LIKE_OBJECT_ERROR400 = "LIKE_OBJECT_ERROR400"
export const LIKE_OBJECT_ERROR500 = "LIKE_OBJECT_ERROR500"
export const LIKE_OBJECT_FAILURE = "LIKE_OBJECT_FAILURE"

export const REMOVE_LIKE = "REMOVE_LIKE"
export const REMOVE_LIKE_SUCCESS = "REMOVE_LIKE_SUCCESS"
export const REMOVE_LIKE_ERROR400 = "REMOVE_LIKE_ERROR400"
export const REMOVE_LIKE_ERROR500 = "REMOVE_LIKE_ERROR500"
export const REMOVE_LIKE_FAILURE = "REMOVE_LIKE_FAILURE"

export const GET_THIS_LIKE = "GET_THIS_LIKE"
export const GET_THIS_LIKE_SUCCESS = "GET_THIS_LIKE_SUCCESS"
export const GET_THIS_LIKE_ERROR400 = "GET_THIS_LIKE_ERROR400"
export const GET_THIS_LIKE_ERROR500 = "GET_THIS_LIKE_ERROR500"
export const GET_THIS_LIKE_FAILURE = "GET_THIS_LIKE_FAILURE"

//TODO: Create api function that retrieves whether the user likes an object to make independent from the post reducer

export function likeObject(token,object, index=undefined, item_index=undefined, search=false) {
  return function (dispatch) {
    let url =  setupApiEndpoint(LIKES_URL)
	var myData = {
		object_id: object.id,
		vote : 1,
		content_type:object.this_content_type.id,
		token: token
	};
    dispatch({type: LIKE_OBJECT})
	
	console.log(JSON.stringify(myData))
    return request(
      url, { method: "post", body:JSON.stringify(myData)},
      (json) => { 
		if(search){
            dispatch( updateVoteTotal( object.vote_total + 1, index, item_index ) )
            dispatch( updateCanVote( object.can_vote, index, item_index ) )
		}else{
            dispatch( voteTotal( object.vote_total + 1, index, item_index ) )
            dispatch( canVote( object.can_vote, index, item_index ) )
		}
		dispatch({type: LIKE_OBJECT_SUCCESS, res: json})
		
		},
      (json) => { dispatch({type: LIKE_OBJECT_ERROR400, res: json}) },
      (res) => { dispatch({type: LIKE_OBJECT_ERROR500, res: res}) },
      (ex) => { dispatch({type: LIKE_OBJECT_FAILURE, error: ex}) },
    )
  }
}
export function removeLike(token, object, index=undefined, item_index=undefined, search=false) {
  return function (dispatch) {
	// request inside a request --> requestception
	// get the like with username content_object and content_type as params
	// Then a second request to the like object detail with DELETE as method parameter
	// TODO: - Create API function that handles this with one request and returns errors based on the result
    let url =  setupApiEndpoint(LIKES_URL) + "?user=" + token + "&content_object=" + object.id +"&content_type=" + object.this_content_type.id 
	dispatch({type: GET_THIS_LIKE})
		request(
		url, {},
		(json) => { dispatch({type: GET_THIS_LIKE_SUCCESS, res: json})
				console.log(json)
					url = setupApiEndpoint(LIKES_URL) + json[0].id + '\/'
					dispatch({type: REMOVE_LIKE})
					return request(
					url, { method: "DELETE"},
						(json) => { 
						
						if(search){
							dispatch( updateVoteTotal( object.vote_total - 1, index, item_index ) )
							dispatch( updateCanVote( object.can_vote, index, item_index ) )
						}else{
							dispatch( voteTotal( object.vote_total - 1, index, item_index ) )
							dispatch( canVote( object.can_vote, index, item_index ) )
						}
						dispatch({type: REMOVE_LIKE_SUCCESS, res: object.id})
					},
					(json) => { dispatch({type: REMOVE_LIKE_ERROR400, res: object.id})
						console.log(json)
					},
					(res) => { dispatch({type: REMOVE_LIKE_ERROR500, res: object.id}) 
						console.log(res)
					},
					(ex) => { dispatch({type: REMOVE_LIKE_FAILURE, error: ex}) 
						console.log(ex)
					},
					)
		 },
		(json) => { dispatch({type: GET_THIS_LIKE_ERROR400, res: json})
					console.log(json)},
		(res) => { dispatch({type: GET_THIS_LIKE_ERROR500, res: res}) },
		(ex) => { dispatch({type: GET_THIS_LIKE_FAILURE, error: ex}) },
		)
		}
	return 0
}