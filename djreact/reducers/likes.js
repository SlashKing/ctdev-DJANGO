import * as likeActions from "../actions/likeActions"

const initialState = {
  error: null,
  object: undefined,
  loading: false
}

export default function likeObject(state=initialState, action={}) {
//console.log(action.type,state)
  switch (action.type) {
	case likeActions.UPDATE_LOADING:
		return {...state, loading:true}
	case likeActions.LIKE_OBJECT:
		return {...state, loading: true}
	case likeActions.LIKE_OBJECT_SUCCESS:
		return {...state, loading: false, object: action.res}
	case likeActions.LIKE_OBJECT_ERROR400:
	case likeActions.LIKE_OBJECT_ERROR500:
	case likeActions.LIKE_OBJECT_FAILURE:
		return {...state, error: "Error", loading: false}
		
	case likeActions.REMOVE_LIKE:
		return {...state, loading: true}
	case likeActions.REMOVE_LIKE_SUCCESS:
		return {...state, loading: false, object: action.res}
	case likeActions.REMOVE_LIKE_ERROR400:
	case likeActions.REMOVE_LIKE_ERROR500:
	case likeActions.REMOVE_LIKE_FAILURE:
	default:
		return state
  }
}