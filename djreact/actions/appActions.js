import { request } from "../utils"
import { setupApiEndpoint } from "../common/constants/endpoints/config"
export const SWITCH_APP_SCREEN = "SWITCH_APP_SCREEN"
export function switchAppScreen(screen){
	return function (dispatch){
		dispatch({type: SWITCH_APP_SCREEN, res: screen})
	}
}