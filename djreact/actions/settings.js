import { request } from "../utils"
import { setupApiEndpoint } from "../common/constants/endpoints/config"
import * as profileActionTypes from "../common/constants/actiontypes/profile"

export const UPDATE_CURRENT_USER = "UPDATE_CURRENT_USER"
export const UPDATE_CURRENT_USER_SUCCESS = "UPDATE_CURRENT_USER_SUCCESS"
export const UPDATE_CURRENT_USER_ERROR400 = "UPDATE_CURRENT_USER_ERROR400"
export const UPDATE_CURRENT_USER_ERROR500 = "UPDATE_CURRENT_USER_ERROR500"
export const UPDATE_CURRENT_USER_FAILURE = "UPDATE_CURRENT_USER_FAILURE"
	
export function updateCurrentUser(updated_values){
	return dispatch =>{
		dispatch({
				type:UPDATE_CURRENT_USER,
				res: updated_values
		})
	}
}