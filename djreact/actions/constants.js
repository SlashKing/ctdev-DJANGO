import keyMirror from 'keymirror';

const ChatActions = keyMirror({
  CHAT_LOGIN: null,
  CHAT_LOGIN_SUCCESS: null,
  CLOSE_CHAT_ROOM: null,
  SELECT_ROOM: null,
  SEND_MESSAGE: null,
  REQUEST_MESSAGES: null,
  RECEIVE_MESSAGES: null,
  RECEIVE_ROOMS: null,
});

export default ChatActions;
