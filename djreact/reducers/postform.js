import * as formActions from "../actions/formActions"

const initialState = {
  crop: {
	  x: 0,
	  y: 0,
	  aspect: undefined,
	  width:100,
	  height: 100
	},
	covercrop: {
	  x: 0,
	  y: 0,
	  aspect: 3/1,
	  width:100,
	  height: 100
	},
  text: '',
  coverpicture:'',
  profilepicture:'',
  pictures: [],
  loading: false,
  error: null,
  temps: [],
  tempcover: '',
  tempprofile:'',
  coverfiles:[],
  profilefiles:[],
  files:[]
}

export default function postform(state=initialState, action={}) {
  switch (action.type) {
  case formActions.UPDATE_FILES:
    return {...state, files: action.res}
  case formActions.UPDATE_COVER_FILES:
    return {...state, coverfiles: action.res}
  case formActions.UPDATE_PROFILE_FILES:
    return {...state, profilefiles: action.res}
  case formActions.UPDATE_POST_FORM_TEXT:
    return {...state, text: action.res,}
  case formActions.SET_CROP_MAX:
    return {...state, crop: action.crop,}
  case formActions.SET_COVER_CROP_MAX:
  console.log(state.covercrop, action.covercrop)
    return {...state, covercrop: action.covercrop,}
  case formActions.UPDATE_IMAGE_FOR_CROP:
    return {...state, picture: action.res.picture,temp:action.res.temp}
  case formActions.UPDATE_COVER_IMAGE_FOR_CROP:

    return {...state, coverpicture: action.res.picture,tempcover:action.res.temp}
  case formActions.UPDATE_PROFILE_IMAGE_FOR_CROP:
    return {...state, profilepicture: action.res.picture,tempprofile:action.res.temp}
  case formActions.UPDATE_CROP:
    return {...state, crop: action.res}
  case formActions.UPDATE_COVER_CROP:
    return {...state, covercrop: action.res}
  case formActions.UPDATE_PROFILE_CROP:
    return {...state, profilecrop: action.res}
  case formActions.ADD_POST_FORM:
    return {...state, loading: true}
  case formActions.ADD_POST_FORM_SUCCESS:
    return {...state, error:'',loading: false, text: '', pictures:[], temps:[],post: action.res}
  case formActions.ADD_POST_FORM_ERROR400:
  case formActions.ADD_POST_FORM_ERROR500:
  case formActions.ADD_POST_FORM_FAILURE:
    return {...state, error: "Error", loading: false}
 
  case formActions.UPLOAD_IMAGE:
    return {...state, loading: true}
  case formActions.UPLOAD_IMAGE_SUCCESS:
    return {...state, loading: false, temp:'',picture:action.res.id}
  case formActions.UPLOAD_IMAGE_ERROR400:
  case formActions.UPLOAD_IMAGE_ERROR500:
  case formActions.UPLOAD_IMAGE_FAILURE:
    return {...state, error: "Error", loading: false}
 
  default:
    return state
  }
}