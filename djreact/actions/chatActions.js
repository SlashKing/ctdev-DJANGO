import ChatActions from '../common/constants/actiontypes/chat';
import { ChatAPI } from '../ChatAPI';
import { cacheByKey, setCache, removeAllTimeouts, clearTimeoutNotNeg} from '../common/cache_utils';
import _ from 'lodash';

export function setActiveRooms(activeRooms){
	return (dispatch) => {
		dispatch({
			type:ChatActions.SET_ACTIVE_ROOMS,
			activeRooms
		})
	}
}
export function loginUser(user) {
  return () => {
    ChatAPI.send({
      type: ChatActions.CHAT_LOGIN,
      user,
    });
  };
}
export function setEndOfRoomResults(roomId) {
	 return (dispatch) =>{
		 dispatch({
		    type: ChatActions.END_OF_ROOM_RESULTS,
		    roomId: roomId,
		    end: true
		  })
	 }
}
export function loadingMessages(loading) {
	 return function(dispatch){
		 dispatch({
		    type: ChatActions.SET_LOADING,
		    loading: loading
		  })
	 }
}
export function requestMessages(room) {
  // TODO Don't need to do this if room's messages exist in state.
  ChatAPI.send({
    type: ChatActions.REQUEST_MESSAGES,
    roomId: room.id,
  });
}

export function requestPriorMessages(user, room, messages) {
  return () => {
    const firstMessage = _.minBy(messages, (m) => m.id);
    ChatAPI.send({
      type: ChatActions.REQUEST_MESSAGES,
      firstMessageId: firstMessage.id,
      roomId: room.id,
      user: user.username,
    });
  };
}

export function selectRoom(room,name,user=undefined) {
  return (dispatch) => {
	  if(room !== undefined){
		  var activeRooms = cacheByKey("activeRooms");
		  activeRooms.push({id: room, expanded: true,name:name});
		  setCache("activeRooms", activeRooms);
		  dispatch(setActiveRooms(activeRooms))
		  dispatch({
			  type: ChatActions.SELECT_ROOM,
			  room,
		  });
	  }else{
		  dispatch(createRoom(name))
	  }
  };
}
/*
 * createRoom Description: When a chat room is opened, this is sent to the
 * server to determined whether the channel has already been created. Received
 * through Django Channels ws. Params: user (string)
 * 
 * 
 */
export function createRoom(user){
	return () =>{
		ChatAPI.send({
			type: ChatActions.CREATE_CHAT_ROOM,
			user: user
		})
	}
}
/**
 * expandChatRoom
 * 
 * description: Update local storage active room to expand it params: room
 * (number)
 * 
 */
export function expandChatRoom(room){
	return (dispatch) =>{
		var localRooms = cacheByKey("activeRooms");
		for (var i = 0; i < localRooms.length; i++) {
			   if(room === localRooms[i].id){  
			       localRooms[i].expanded = true;
			       break;
			   }
			}
		
		setCache("activeRooms", localRooms);
		// dispatch(setActiveRooms(localRooms))
		dispatch({
			type: ChatActions.EXPAND_CHAT_ROOM,
			activeRooms: localRooms,
		})
	}
}
/**
 * reduceChatRoom
 * 
 * description: Update local storage active room to shrink it params: room
 * (number)
 * 
 */
export function reduceChatRoom(room){
	return (dispatch) =>{
		var reducedRooms = cacheByKey("activeRooms");
		for (var i = 0; i < reducedRooms.length; i++) {
		   if(room === reducedRooms[i].id){  
		       reducedRooms[i].expanded = false;
		       break;
		   }
		}
	
		setCache("activeRooms", reducedRooms);
		// dispatch(setActiveRooms(reducedRooms))
		dispatch({
			type: ChatActions.REDUCE_CHAT_ROOM,
			activeRooms: reducedRooms,
		})
	}
}
/** Room Activity */
/**
 * setRoomActive Description: Sends to ws to tell the other user that the room
 * is active Params: room (object), user (string) TODO: remove user from this function
 * as the user is deduced by Django using JWT
 */
export function setRoomActive(room,user,intervalId=-1){
	return (dispatch)=>{
		ChatAPI.send({
			type: ChatActions.SET_ROOM_ACTIVE,
			roomId: room,
			user
		})
	}
}
/**
 * setRoomInactiveInterval Description: Send to ws and update current user state
 * to inactive. When a chat is opened, we use setTimeout to set the room to
 * inactive after a specified amount of time. Params: roomId (number), user
 * (string)
 * 
 * 
 */
export function setRoomInactiveInterval(roomId,user,WS=true,both=false) {
	return function(dispatch){
		// need to send to the websocket to update the other user's room
		// activity
		if(!WS) {
			 dispatch({
					type: ChatActions.SET_ROOM_INACTIVE,
					roomId,
					user
				})
		}else{
			if(both){
				 dispatch({
						type: ChatActions.SET_ROOM_INACTIVE,
						roomId,
						user
					})
				ChatAPI.send({
					type: ChatActions.SET_ROOM_INACTIVE,
					roomId,
					user
				});
			}else{
				ChatAPI.send({
					type: ChatActions.SET_ROOM_INACTIVE,
					roomId,
					user
				});
			}
		}
	}
}
/**
 * setRoomInactive Description: Closed a chat room, update the local cache,
 * reduxify the current user's state and notify the other user of the activity
 * change through ws Params: roomId (number), user (string)
 * 
 * 
 */
export function setRoomInactive(roomId,user){
	return (dispatch) => {
		var activeChats = cacheByKey("activeRooms")
		_.remove(activeChats,{id: roomId});
		console.log(activeChats);
		setCache("activeRooms",activeChats);
		dispatch(setActiveRooms(activeChats));
		// send the room id to update Redux state
		 dispatch({
				type: ChatActions.SET_ROOM_INACTIVE,
				roomId,
				user
			});
	};
}
/**
 * closeChatRoom Description: When a chat room is closed, the other user/s in
 * the room must be notified of the user's activity change. Received through
 * Django Channels ws. Params: roomId (number), user (string)
 * 
 * 
 */
export function closeChatRoom(roomId, user){
	return function(dispatch){
		ChatAPI.send({
			type: ChatActions.CLOSE_CHAT_ROOM,
			roomId,
			user,
		});
	}
}
export function putActiveRoomAtFront(room){
	return function(dispatch){
		var activeChats = cacheByKey("activeRooms")
		// remove current room from array
		_.remove(activeChats,{id: room.id});
		// place the other room up front
		activeChats.unshift(room)
		// set local storage information
		setCache("activeRooms",activeChats);
		dispatch(setActiveRooms(activeChats));
	}
}

export function setRoomIsTyping(isTyping,roomId){
	return function(dispatch) {
		console.log(roomId)
		ChatAPI.send({
			type: ChatActions.SET_ROOM_IS_TYPING,
			roomId,
			isTyping,
		});
	}
}
export function setRoomContent(roomId, content){
	return function(dispatch) {
		console.log(roomId)
		dispatch({
			type: ChatActions.SET_ROOM_CONTENT,
			content,
			roomId,
		});
	}
}
// thunk returns a function for evaluation by middleware
export function sendMessage(roomId, content, user="",intervalId=-1) {
	return (dispatch) => {
		clearTimeoutNotNeg(intervalId)
	    setTimeout(() => {
	        dispatch( setRoomInactiveInterval( roomId, user,true,true ) )
	    }, 5000 );
		ChatAPI.send({
			type: ChatActions.SEND_MESSAGE,
			roomId:roomId,
			content:content
		});
	};
}
