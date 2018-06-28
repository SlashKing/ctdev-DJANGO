import * as postActions from "../actions/postActions"

const initialState = {
  loading: false,
  error: null,
  post: undefined,
  user: undefined
}

export default function singlepost(state=initialState, action={}) {
  switch (action.type) {

  case postActions.FETCH_CURRENT_USER:
    return {...state, loading: true}
  case postActions.FETCH_CURRENT_USER_SUCCESS:
    return {...state, loading: false, user: action.res}
  case postActions.FETCH_CURRENT_USER_ERROR400:
  case postActions.FETCH_CURRENT_USER_ERROR500:
  case postActions.FETCH_CURRENT_USER_FAILURE:
    return {...state, error: "Error", loading: false}
  case postActions.FETCH_POST:
    return {...state, loading: true}
  case postActions.FETCH_POST_SUCCESS:
    return {...state, loading: false, post: action.res}
  case postActions.FETCH_POST_ERROR400:
  case postActions.FETCH_POST_ERROR500:
  case postActions.FETCH_POST_FAILURE:
    return {...state, error: "Error", loading: false}
  default:
    return state
  }
}