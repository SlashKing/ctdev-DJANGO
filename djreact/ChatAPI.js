import ReconnectingWebSocket from 'shopify-reconnecting-websocket';
import ChatActions from './common/constants/actiontypes/chat';
import _ from 'lodash';
import { loginUser, selectRoom, setRoomInactive } from './actions/chatActions';


const receiveSocketMessage = (store, action) => {
  /*
	 * We cheat by using the Redux-style Actions as our communication protocol
	 * with the server. This hack allows the server to directly act as a Action
	 * Creator, which we simply `dispatch()`. Consider separating communication
	 * format from client-side action API.
	 */
  switch (action.type) {
    // TODO Single Message Notification
    /*
	 * case ActionTypes.RECEIVE_MESSAGE: if ('Notification' in window) {
	 * Notification.requestPermission().then(function(permission) { if
	 * (permission === 'granted') { const n = new Notification(message.room, {
	 * body: message.content, }); n.onclick(function(event){ //
	 * event.preventDefault(); // open the room that contains this message });
	 * setTimeout(n.close.bind(n), 3000); } }); ... continue to dispatch()
	 */
  case ChatActions.SET_ROOM_CONTENT:
	  var content = document.getElementById("author_input_"+action.roomId).value
	  return store.dispatch({
		  type: ChatActions.SET_ROOM_CONTENT,
		  roomId: action.roomId,
		  content: content
	  })
    case ChatActions.RECEIVE_ROOMS:
      //return store.dispatch(action);
    case ChatActions.RECEIVE_MESSAGES:
    default:
      return store.dispatch(action);
  }
};

const reconnect = (state) => {
  // Re-login (need user on channel_session)
  loginUser(state.globalfeed.user.username)();

  // TODO Delay the REQUEST_MESSAGES until after the LOGIN returns
  // Ensure we did not miss any messages
  //const lastMessage = _.maxBy(state.chat.messages, (m) => m.id);
  //ChatAPI.send({
  //  type: ChatActions.REQUEST_MESSAGES,
  //  lastMessageId: state.chat.messages.length === 0 ? 0 : lastMessage.id,
  //  user: state.globalfeed.user.username,
  //});
};


// TODO Consider re-implementing ChatAPI as a class, instead of using a
// module-level global
// FIXME on error / reconnect
let _socket = null;

export const ChatAPI = {
  connect: (store) => {
    // Use wss:// if running on https://
    const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const url = `${scheme}://${window.location.host}/?token=${localStorage.token}`;
    _socket = new ReconnectingWebSocket(url, null, {debug: true, reconnectInterval: 1000});
   
  },

  listen: (store) => {
	  
	  _socket.onmessage = (event) => {
	    	console.log(event)
	        const action = JSON.parse(event.data);
	        receiveSocketMessage(store, action);
	      };
	      	
	      // reconnect(state)
	      _socket.onopen = () => {
	        // On Reconnect, need to re-login, so the channel_session['user']
	        // is populated
	    	  const state = store.getState()
		        console.log(state)
	        if (state.globalfeed.user !== null) {
	          reconnect(state);
	        }
	      };
	      _socket.onerror = () => {
	    	  reconnect(store.getState())
	      }
  },

  send: (action) => {
	  if(_socket.readyState ===1){
		  _socket.send(JSON.stringify(action));
	  }
  },
};

// const api = new ChatAPI();
// export default ChatAPI;
