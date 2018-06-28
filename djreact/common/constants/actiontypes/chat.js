import keyMirror from 'keymirror';

const ChatActions = keyMirror({
  CHAT_LOGIN: null,
  CHAT_LOGIN_SUCCESS: null,
  SELECT_ROOM: null,
  SEND_MESSAGE: null,
  REQUEST_MESSAGES: null,
  RECEIVE_MESSAGES: null,
  RECEIVE_ROOMS: null,
  CLOSE_CHAT_ROOM: null,
  EXPAND_CHAT_ROOM: null,
  REDUCE_CHAT_ROOM: null,
  CREATE_CHAT_ROOM: null,
  CREATE_CHAT_ROOM_SUCCES:null,
  SET_ROOM_ACTIVE: null,
  SET_ROOM_INACTIVE: null,
  SET_ROOM_IS_TYPING:null,
  SET_ROOM_CONTENT:null,
  SET_USER_IN_ROOM_INACTIVE: null,
  SET_LOADING: null,
  END_OF_ROOM_RESULTS:null,
  SET_ACTIVE_ROOMS: null,
});

export default ChatActions;
