import { connect } from 'react-redux';
import { 
    requestPriorMessages, 
    sendMessage, 
    setRoomActive, 
    setRoomInactive, 
    setRoomInactiveInterval,
    setRoomIsTyping,
    setRoomContent,
    expandChatRoom,
    reduceChatRoom,
    loadingMessages, 
    closeChatRoom, } from '../actions/chatActions';
import ChatRoom from '../components/ChatRoom';

const getVisibleMessages = ( messages, roomId ) => (
    messages.filter(
        m => m.roomId === roomId
    )
);

const getRoom = ( rooms, roomId ) => (
    rooms.find( r => r.id === roomId )
);

const mapStateToProps = ( state, props ) => ( {
    currentUser: state.globalfeed.user,
    room: getRoom( state.chat.rooms, props.id ),
    loading: state.chat.loading,
    expanded: props.expanded
} );

const mapDispatchToProps = ( dispatch, props ) => ( {
    setRoomActive:(room, user) => {
        dispatch( setRoomActive(room, user))
    },
    setRoomInactiveInterval:(room,user)=>{
        dispatch( setRoomInactiveInterval(room, user))
    },
    handleTextChange: ( room, user ) => {
        dispatch( setRoomInactiveInterval(room, user))
    },
    handleSendMessage: ( room, content, user,intervalId=-1 ) => {
        dispatch( setRoomActive(room.id, user))
        dispatch( sendMessage( room.id, content, user,intervalId ) );
    },
    handleMessageScroll: ( user, room, messages ) => {
        console.log( props )
        dispatch( loadingMessages( true ) )
        dispatch( requestPriorMessages( user, room, messages ) );
    },
    reduceChatRoom: (room) => {
        dispatch(reduceChatRoom(room))
    },
    expandChatRoom: (room) => {
        dispatch(expandChatRoom(room))
    },
    closeChatRoom: ( room, user ) => {
        dispatch( setRoomInactive( room, user ) );
        dispatch( closeChatRoom( room, user ) );
    },
    isTyping: ( isTyping,room) => {
        dispatch( setRoomIsTyping( isTyping,room) );
    },
    setRoomContent: ( room, content ) => {
        dispatch( setRoomContent( room, content ) );
},

} );

const VisibleChatRoom = connect(
    mapStateToProps,
    mapDispatchToProps
)( ChatRoom );

export default VisibleChatRoom;
