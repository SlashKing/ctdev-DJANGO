import {
	FETCH_NOTIFICATIONS_ALL,
	FETCH_NOTIFICATIONS_ALL_SUCCESS,
	FETCH_NOTIFICATIONS_ALL_ERROR400,
	FETCH_NOTIFICATIONS_ALL_ERROR500,
	FETCH_NOTIFICATIONS_ALL_FAILURE,
	FETCH_NOTIFICATIONS_UNREAD,
	FETCH_NOTIFICATIONS_UNREAD_SUCCESS,
	FETCH_NOTIFICATIONS_UNREAD_ERROR400,
	FETCH_NOTIFICATIONS_UNREAD_ERROR500,
	FETCH_NOTIFICATIONS_UNREAD_FAILURE,
	MARK_NOTIFICATIONS_UNREAD,
	MARK_NOTIFICATIONS_UNREAD_SUCCESS,
	MARK_NOTIFICATIONS_UNREAD_ERROR400,
	MARK_NOTIFICATIONS_UNREAD_ERROR500,
	MARK_NOTIFICATIONS_UNREAD_FAILURE,
	MARK_NOTIFICATIONS_READ,
	MARK_NOTIFICATIONS_READ_SUCCESS,
	MARK_NOTIFICATIONS_READ_ERROR400,
	MARK_NOTIFICATIONS_READ_ERROR500,
	MARK_NOTIFICATIONS_READ_FAILURE,
	MARK_NOTIFICATION_READ,
	MARK_NOTIFICATION_READ_SUCCESS,
	MARK_NOTIFICATION_READ_ERROR400,
	MARK_NOTIFICATION_READ_ERROR500,
	MARK_NOTIFICATION_READ_FAILURE,
	MARK_NOTIFICATION_UNREAD,
	MARK_NOTIFICATION_UNREAD_SUCCESS,
	MARK_NOTIFICATION_UNREAD_ERROR400,
	MARK_NOTIFICATION_UNREAD_ERROR500,
	MARK_NOTIFICATION_UNREAD_FAILURE,
	MARK_NOTIFICATION_DELETED,
	MARK_NOTIFICATION_DELETED_SUCCESS,
	MARK_NOTIFICATION_DELETED_ERROR400,
	MARK_NOTIFICATION_DELETED_ERROR500,
	MARK_NOTIFICATION_DELETED_FAILURE,
	MARK_NOTIFICATION_UNDELETED,
	MARK_NOTIFICATION_UNDELETED_SUCCESS,
	MARK_NOTIFICATION_UNDELETED_ERROR400,
	MARK_NOTIFICATION_UNDELETED_ERROR500,
	MARK_NOTIFICATION_UNDELETED_FAILURE,
	RESET_NEXT_PREVIOUS
} from "../actions/notificationActions"
import update from 'react-addons-update';
const initialState = {
	loading: false,
	error: undefined,
	objects: undefined,
	next: null,
	previous: null
}

export default function notifications(state=initialState, action={}) {
	// console.log(action.type,action.res,state)
	switch (action.type) {
		case RESET_NEXT_PREVIOUS:
			return {...state, next:action.res, previous:action.res }
		
		case FETCH_NOTIFICATIONS_ALL:
			return {...state, loading:true}
		case FETCH_NOTIFICATIONS_ALL_SUCCESS:
			if(state.next !== null){
				return {...state,
					objects: state.objects.concat(action.res.results),
					next:action.res.next,
					previous:action.res.previous,
					loading: false
				}
			}else{
				if(state.previous === null){
					return{...state, loading:false, objects:action.res.results, next:action.res.next, previous: action.res.previous}
				}else{
					return{...state}
				}
			}
		
		case FETCH_NOTIFICATIONS_ALL_ERROR400:
		case FETCH_NOTIFICATIONS_ALL_ERROR500:
		case FETCH_NOTIFICATIONS_ALL_FAILURE:
			return {...state, loading: false, error:"Error"}
		case FETCH_NOTIFICATIONS_UNREAD:
			return {...state, loading:true}
		case FETCH_NOTIFICATIONS_UNREAD_SUCCESS:
			if(state.next !== null){
				return {...state,
					objects: state.objects.concat(action.res.results),
					next:action.res.next,
					previous:action.res.previous,
					loading: false
				}
			}else{
				if(state.previous === null){
					return{...state, loading:false,objects:action.res.results, next:action.res.next, previous: action.res.previous}
				}else{
					return{...state,objects:[]}
				}
			}
		
		case FETCH_NOTIFICATIONS_UNREAD_ERROR400:
		case FETCH_NOTIFICATIONS_UNREAD_ERROR500:
		case FETCH_NOTIFICATIONS_UNREAD_FAILURE:
			return {...state, loading:false, error:"Error"}
		
		case MARK_NOTIFICATIONS_READ:
			return {...state,loading:true}
		case MARK_NOTIFICATIONS_READ_SUCCESS:
			return {...state, objects:state.objects.map(obj => ({...obj, unread:false})),loading:false}
		case MARK_NOTIFICATIONS_READ_ERROR400:
		case MARK_NOTIFICATIONS_READ_ERROR500:
		case MARK_NOTIFICATIONS_READ_FAILURE:
			return {...state, error:"Error", loading:false}

		
		case MARK_NOTIFICATION_READ:
			return {...state}
		case MARK_NOTIFICATION_READ_SUCCESS:
			return {...state, objects: state.objects.map( 
					obj => obj.id === action.res.id ? {...obj, unread: false} : obj)}
		case MARK_NOTIFICATION_READ_ERROR400:
		case MARK_NOTIFICATION_READ_ERROR500:
		case MARK_NOTIFICATION_READ_FAILURE:
			return {...state, error:"Error", loading:false}

		case MARK_NOTIFICATION_UNREAD:
			return {...state}
			
		case MARK_NOTIFICATION_UNREAD_SUCCESS:
			return {...state, objects: state.objects.map( 
					obj => obj.id === action.res.id ? {...obj, unread: true} : obj)}
			
		case MARK_NOTIFICATION_UNREAD_ERROR400:
		case MARK_NOTIFICATION_UNREAD_ERROR500:
		case MARK_NOTIFICATION_UNREAD_FAILURE:
			return {...state, error:"Error", loading:false}
			
		case MARK_NOTIFICATION_DELETED:
			return {...state}
		case MARK_NOTIFICATION_DELETED_SUCCESS:
			return {...state, objects: state.objects.map( 
					obj => obj.id === action.res.id ? {...obj, deleted: true} : obj)}
		case MARK_NOTIFICATION_DELETED_ERROR400:
		case MARK_NOTIFICATION_DELETED_ERROR500:
		case MARK_NOTIFICATION_DELETED_FAILURE:
			return {...state, error:"Error", loading:false}

		case MARK_NOTIFICATION_UNDELETED:
			return {...state}
		case MARK_NOTIFICATION_UNDELETED_SUCCESS:
			return {...state, objects: state.objects.map( 
					obj => obj.id === action.res.id ? {...obj, deleted: false} : obj)}
		case MARK_NOTIFICATION_UNDELETED_ERROR400:
		case MARK_NOTIFICATION_UNDELETED_ERROR500:
		case MARK_NOTIFICATION_UNDELETED_FAILURE:
			return {...state, error:"Error", loading:false}
	default:
		return state
	}
}