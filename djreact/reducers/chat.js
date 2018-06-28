import ChatActions from '../common/constants/actiontypes/chat';
import _ from 'lodash';
import {findDOMNode} from 'react-dom'
import update from 'react-addons-update';
import {setCache, cacheByKey} from '../common/cache_utils';

const initialState = {
  currentUser: null,
  currentRoomId: null,
  rooms: [
  ],
  activeRooms: cacheByKey("activeRooms")
}

function chat(state = initialState, action) {

  switch (action.type) {
  // setting local storage array, responds to the UI
  case ChatActions.SET_ACTIVE_ROOMS:
	  return {...state, activeRooms:action.activeRooms}
  case ChatActions.EXPAND_CHAT_ROOM:
	  return {...state, activeRooms:action.activeRooms}
  case ChatActions.REDUCE_CHAT_ROOM:
	  return {...state, activeRooms:action.activeRooms}
  // set the 'end' parameter in the corresponding room
  case ChatActions.END_OF_RESULTS:
	  var this_room
	  var index
	  for (var i = 0, len = rooms.length; i < len; i++) {
  		if(rooms[i].id === action.roomId){ this_room =rooms[i] }
		if(this_room !== undefined){
			this_room.end = true
			index = i
		    return update(state, {
		    	rooms:{
		    		[index]:{
		    			end: {$set:true}
		    		}
		    	}
		    })
		}  
	  }
	  
    case ChatActions.SET_LOADING:
	    return {...state, loading:action.loading}

    case ChatActions.SELECT_ROOM:
      
    	 // selected a room
    	 
         return {...state, 
             rooms: state.rooms.map(room => room.id === action.room ? { ...room, active:true } : room)
           };

	
	// measures the user activity for UI purposes
	// when the user closes the chat, or are afk for a specified time, the room
	// will become inactive
    case ChatActions.SET_ROOM_INACTIVE:
    	
	  return {...state, rooms:state.rooms.map(room => room.id === action.roomId ?
              // transform the one with a matching id
              { ...room, active:false } : 
              // otherwise return original room
              room )
	  }
	
	// same concept as above
	// when the chat window is opened, the user is notified of their online
	// status
	// could be a useful premium feature
    case ChatActions.SET_ROOM_ACTIVE:
    	return {...state, rooms: state.rooms.map(room => room.id === action.roomId ?
                // transform the one with a matching id
                { ...room, active:true } : 
                // otherwise return original room
                room )
                }
    
    // this is only received by the other user to update room activity status
    case ChatActions.CLOSE_CHAT_ROOM:  	
    	return {...state, rooms: state.rooms.map(room => room.id === action.roomId ?
                // transform the one with a matching id
                { ...room, active:false } : 
                // otherwise return original room
                room)
        }
   case ChatActions.CREATE_CHAT_ROOM:
        return {...state, 
    		activeRooms: state.activeRooms.concat({id: action.room.id, expanded: true, name:action.room.name}), 
    		rooms: state.rooms.concat(action.room)
        }
    case ChatActions.CREATE_CHAT_ROOM_SUCCESS:
    	return {...state
    	}
    case ChatActions.RECEIVE_CREATE_CHAT_ROOM_SUCCESS:
        return {...state, 
        		rooms: state.rooms.concat(action.room),
        		loading:false,
        }
    
    case ChatActions.SET_ROOM_IS_TYPING:
    	return {...state, rooms: state.rooms.map(room => room.id === action.roomId ? 
    				{...room, isTyping: action.isTyping } : room )
    			}
    case ChatActions.SET_ROOM_CONTENT:
    	
    	return {...state, rooms: state.rooms.map(room => room.id === action.roomId ? 
    			{...room, content: action.content !== "" ? action.content : undefined} : room)}
    	
    case ChatActions.RECEIVE_MESSAGES:
    	var messages
    	var rooms =  state.rooms
		var this_room 
    	var index
    	if(action.rooms !== undefined){
    	for (var i = 0, len = rooms.length; i < len; i++) {
    		if(rooms[i].id === action.roomId){ this_room =rooms[i] }
    	    if(this_room !== undefined && this_room.id === action.roomId){
    	    	this_room.active = true;
    	    	// messages are sorted on server and displayed in reverse order
    	    	// so we can just push the new message into the messages array
				// for the room
    	    	 action.rooms[0].messages.map(function(current){
    	    		 this_room.messages.push(action.message)
    	    	 })
    	    	 messages = this_room.messages
    	         index = i
    	    	}
    		}
    		return update(state,{
    			rooms:{
    				[index]:{
    					messages: {$set : messages}
    				}
    			},
    			loading:{$set:false}
    		})
    	}else if(action.messages !== undefined){
			var a_room 
    		for (var i = 0, len = rooms.length; i < len; i++) {
        		if(rooms[i].id === action.roomId){ 
        			a_room =rooms[i] 
        			index= i
        		}
    			
    		}
    		if(action.messages.length >0){
    			
    			// action.messages.map(function(current){
       	    		//a_room.messages.concat(action.messages)
       	    	 // })
      	    	var newmessages = a_room.messages.concat(action.messages)
    			console.log( a_room.messages,newmessages)
        		return update(state,{
        			rooms:{
        				[index]:{
        					messages: {$set : newmessages}
        				}
        			},
        			loading:{$set:false}
        		})
    		}else{
    			return update(state,{rooms:{
    				[index]:{
    					end: {$set : true}
    				}
    			},
    		})
    			
    		}
    		
    	}else if(action.message !==undefined){
    		for (var i = 0, len = rooms.length; i < len; i++) {
        	    if(rooms[i].id === action.message[0].roomId){
        	    	index = i
        	    }
    		}
        	return update(state,{
    			rooms:{
    				[index]:{
    					messages: {$splice : [[0,0,action.message[0]]]}
    				}
    			},
    			loading:{$set:false}
    		})
    	}return {...state, loading:false}

    case ChatActions.RECEIVE_ROOMS:
      return Object.assign({}, state, {
        rooms: action.rooms,
      });
    case ChatActions.CHAT_LOGIN_SUCCESS:
      return Object.assign({}, state, {
        currentUser: action.user,
      });
    default:
      return state;
  }
}

export default chat;
