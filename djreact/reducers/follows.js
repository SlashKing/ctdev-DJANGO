import * as followActions from "../actions/followActions"

const initialState = {
  error: null,
  object: undefined,
  loading: false
}

export default function follows(state=initialState, action={}) {
  switch (action.type) {
	case followActions.UPDATE_LOADING_FOLLOW:
		return {...state, loading:true}
	case followActions.FOLLOW:
		return {...state, loading: true}
	case followActions.FOLLOW_SUCCESS:
		return {...state, loading: false, object: action.res}
	case followActions.FOLLOW_ERROR400:
	case followActions.FOLLOW_ERROR500:
	case followActions.FOLLOW_FAILURE:
		return {...state, error: "Error", loading: false}
		
	case followActions.REMOVE_FOLLOW:
		return {...state, loading: true}
	case followActions.REMOVE_FOLLOW_SUCCESS:
		return {...state, loading: false, object: action.res}
	case followActions.REMOVE_FOLLOW_ERROR400:
	case followActions.REMOVE_FOLLOW_ERROR500:
	case followActions.REMOVE_FOLLOW_FAILURE:
	default:
		return state
  }
}