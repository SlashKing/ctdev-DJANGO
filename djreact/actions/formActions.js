import { request } from "../utils"
import { setupApiEndpoint, setupEndpoint } from "../common/constants/endpoints/config"
import * as postEndpoints from "../common/constants/endpoints/posts"
import * as profileEndpoints from "../common/constants/endpoints/profile"
import * as cropEndpoints from "../common/constants/endpoints/cicu"

export const ADD_POST_FORM = "ADD_POST_FORM"
export const ADD_POST_FORM_SUCCESS = "ADD_POST_FORM_SUCCESS"
export const ADD_POST_FORM_ERROR400 = "ADD_POST_FORM_ERROR400"
export const ADD_POST_FORM_ERROR500 = "ADD_POST_FORM_ERROR500"
export const ADD_POST_FORM_FAILURE = "ADD_POST_FORM_FAILURE"
export const UPLOAD_IMAGE = "UPLOAD_IMAGE"
export const UPLOAD_IMAGE_SUCCESS = "UPLOAD_IMAGE_SUCCESS"
export const UPLOAD_IMAGE_ERROR400 = "UPLOAD_IMAGE_ERROR400"
export const UPLOAD_IMAGE_ERROR500 = "UPLOAD_IMAGE_ERROR500"
export const UPLOAD_IMAGE_FAILURE = "UPLOAD_IMAGE_FAILURE"
export const UPDATE_COVER = "UPDATE_COVER"
export const UPDATE_COVER_SUCCESS = "UPDATE_COVER_SUCCESS"
export const UPDATE_COVER_ERROR400 = "UPDATE_COVER_ERROR400"
export const UPDATE_COVER_ERROR500 = "UPDATE_COVER_ERROR500"
export const UPDATE_COVER_FAILURE = "UPDATE_COVER_FAILURE"
export const UPDATE_PROFILE_IMAGE = "UPDATE_PROFILE_IMAGE"
export const UPDATE_PROFILE_IMAGE_SUCCESS = "UPDATE_PROFILE_IMAGE_SUCCESS"
export const UPDATE_PROFILE_IMAGE_ERROR400 = "UPDATE_PROFILE_IMAGE_ERROR400"
export const UPDATE_PROFILE_IMAGE_ERROR500 = "UPDATE_PROFILE_IMAGE_ERROR500"
export const UPDATE_PROFILE_IMAGE_FAILURE = "UPDATE_PROFILE_IMAGE_FAILURE"
export const UPDATE_POST_FORM_TEXT = "UPDATE_POST_FORM_TEXT"
export const UPDATE_IMAGE_FOR_CROP = "UPDATE_IMAGE_FOR_CROP"
export const UPDATE_COVER_IMAGE_FOR_CROP = "UPDATE_COVER_IMAGE_FOR_CROP"
export const UPDATE_PROFILE_IMAGE_FOR_CROP = "UPDATE_PROFILE_IMAGE_FOR_CROP"
export const UPDATE_CROP = "UPDATE_CROP"
export const UPDATE_COVER_CROP = "UPDATE_COVER_CROP"
export const UPDATE_PROFILE_CROP = "UPDATE_PROFILE_CROP"
export const UPDATE_FILES = "UPDATE_FILES"
export const UPDATE_COVER_FILES = "UPDATE_COVER_FILES"
export const UPDATE_PROFILE_FILES = "UPDATE_PROFILE_FILES"
export const SET_CROP_MAX = "SET_CROP_MAX"
export const SET_COVER_CROP_MAX = "SET_COVER_CROP_MAX"

export function addPost(text,temps,pictures) {
  return function(dispatch){
    let url =  setupApiEndpoint(postEndpoints.POSTS_URL)
	let _pictures = []
    for(var i = 0;i<temps.length;i++){
    	const newBase64 = temps[i].split(',')[1]
    	_pictures.push({file: newBase64, filename: pictures[i]})
    	
    	console.log(_pictures[i])
    }
    var myData = {
		text: text,
		pictures: _pictures
	};
    dispatch({type: ADD_POST_FORM})
	
	console.log("data",JSON.stringify(myData))
    return request(
      url, { method: "POST", body:JSON.stringify(myData)},
      (json) => { dispatch({type: ADD_POST_FORM_SUCCESS, res: json}) },
      (json) => { dispatch({type: ADD_POST_FORM_ERROR400, res: json}) },
      (res) => { dispatch({type: ADD_POST_FORM_ERROR500, res: res}) },
      (ex) => { dispatch({type: ADD_POST_FORM_FAILURE, error: ex}) },
    )
  }
}
export function addPostNoImages(text) {
  return function(dispatch){
    let url =  setupApiEndpoint(postEndpoints.POSTS_URL)
	var myData = {
		text: text
	};
    dispatch({type: ADD_POST_FORM})
	
	console.log("data",JSON.stringify(myData))
    return request(
      url, { method: "POST", body:JSON.stringify(myData)},
      (json) => { dispatch({type: ADD_POST_FORM_SUCCESS, res: json}) },
      (json) => { dispatch({type: ADD_POST_FORM_ERROR400, res: json}) },
      (res) => { dispatch({type: ADD_POST_FORM_ERROR500, res: res}) },
      (ex) => { dispatch({type: ADD_POST_FORM_FAILURE, error: ex}) },
    )
	 
  }
}
export function uploadCoverImage(temp, picture){
	return function (dispatch){
		let url =  setupEndpoint(cropEndpoints.COVER_IMAGE_UPLOAD)
		const newBase64 = temp.split(',')[1]
		var myData = {file: newBase64, filename:picture}
		dispatch({type: UPLOAD_IMAGE})
		return request(
		url, { method: "POST", body:JSON.stringify(myData)},
		(json) => { 
			dispatch({type: UPLOAD_IMAGE_SUCCESS, res: json})
			let url2 = setupApiEndpoint(profileEndpoints.USER_PROFILES + localStorage.user_id + "\/")
			var myData = {
				cover_image: json.id
			};
			dispatch({type: UPDATE_COVER})
			return request(
			url2, { method: "PATCH", body:JSON.stringify(myData)},
				(json) => { dispatch({type: UPDATE_COVER_SUCCESS, res: json}) },
				(json) => { dispatch({type: UPDATE_COVER_ERROR400, res: json}) },
				(res) => { dispatch({type: UPDATE_COVER_ERROR500, res: res}) },
				(ex) => { dispatch({type: UPDATE_COVER_FAILURE, error: ex}) }
			)
		},
		(json) => { dispatch({type: UPLOAD_IMAGE_ERROR400, res: json}) },
		(res) => { dispatch({type: UPLOAD_IMAGE_ERROR500, res: res}) },
		(ex) => { dispatch({type: UPLOAD_IMAGE, error: ex}) }
		)
	}
}
export function uploadProfileImage(base64,picture) {
  return function (dispatch) {
    let url =  setupEndpoint(cropEndpoints.UPLOAD)
	if(base64 !== ''){
		const newBase64 = base64.split(',')[1]
		var myData = {file: newBase64, filename:picture,type:"userprofile"}
		dispatch({type: UPLOAD_IMAGE})
		return request(
		url, { method: "POST", body:JSON.stringify(myData)},
		(json) => { 
			dispatch({type: UPLOAD_IMAGE_SUCCESS, res: json})
			let url2 = setupApiEndpoint(profileEndpoints.USER_PROFILES + localStorage.user_id + "\/")
			myData = {
				profile_image: json.id
			};
			dispatch({type: UPDATE_PROFILE_IMAGE})
			return request(
			url2, { method: "PATCH", body:JSON.stringify(myData)},
				(json) => { dispatch({type: UPDATE_PROFILE_IMAGE_SUCCESS, res: json}) },
				(json) => { dispatch({type: UPDATE_PROFILE_IMAGE_ERROR400, res: json}) },
				(res) => { dispatch({type: UPDATE_PROFILE_IMAGE_ERROR500, res: res}) },
				(ex) => { dispatch({type: UPDATE_PROFILE_IMAGE_FAILURE, error: ex}) }
			)
		},
		(json) => { dispatch({type: UPLOAD_IMAGE_ERROR400, res: json}) },
		(res) => { dispatch({type: UPLOAD_IMAGE_ERROR500, res: res}) },
		(ex) => { dispatch({type: UPLOAD_IMAGE, error: ex}) },
		)
	}else{
		addPost(text, picture,dispatch)
	}
	
  }
}
export function updateTextArea(text) {
  return function (dispatch) {
    dispatch({type: UPDATE_POST_FORM_TEXT, res: text})
	
  }
}
export function updateCrop(crop){
	return function(dispatch){
		dispatch({type: UPDATE_CROP, res: crop})
	}
}
export function updateCoverCrop(crop){
	return function(dispatch){
		dispatch({type: UPDATE_COVER_CROP, res: crop})
	}
}
export function updateProfileCrop(crop){
	return function(dispatch){
		dispatch({type: UPDATE_COVER_CROP, res: crop})
	}
}
export function updateFiles(files){
	return function (dispatch){
		dispatch({type:UPDATE_FILES, res: files})
	}
}
export function updateCoverFiles(files){
	return function (dispatch){
		dispatch({type:UPDATE_COVER_FILES, res: files})
	}
}
export function updateProfileFiles(files){
	return function (dispatch){
		dispatch({type:UPDATE_PROFILE_FILES, res: files})
	}
}
export function updateImageForCrop(picture, temp) {
  return function (dispatch) {
    dispatch({type: UPDATE_IMAGE_FOR_CROP, res: { picture, temp }})
	
  }
}
export function updateCoverImageForCrop(picture, temp) {
  return function (dispatch) {
    dispatch({type: UPDATE_COVER_IMAGE_FOR_CROP, res: { picture, temp }})
	
  }
}
export function updateProfileImageForCrop(picture, temp) {
  return function (dispatch) {
    dispatch({type: UPDATE_PROFILE_IMAGE_FOR_CROP, res: { picture, temp }})
	
  }
}
export function setCropMax() {
  return function (dispatch) {
    dispatch({type: SET_CROP_MAX, crop: {x:0,y:0,height:100,width:100, aspect:undefined}})
	
  }
}
export function setCoverCropMax() {
  return function (dispatch) {
    dispatch({type: SET_COVER_CROP_MAX, covercrop: {x:0,y:0,height:100,width:100, aspect:317/127}})
	
  }
}