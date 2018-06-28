import { connect } from 'react-redux';
import { selectRoom, setRoomActive, setRoomInactiveInterval } from '../actions/chatActions';
import RoomList from '../components/RoomList';


const mapStateToProps = ( state ) => ( {
    rooms: state.chat.rooms,
    friends: state.friends.objects,
    activeRooms: state.chat.activeRooms,
    user: state.globalfeed.user.username,
} );

const mapDispatchToProps = ( dispatch ) => ( {
    onRoomClick: ( room, user, create = false ) => {
        dispatch( selectRoom( room, user ) );
        if ( !create ) {
            dispatch( setRoomActive( room, user ) );
            setTimeout(() => {
                dispatch( setRoomInactiveInterval( room, user,true,true ) )
            }, 5000 );
        }
    },
} );

const ActiveRoomList = connect(
    mapStateToProps,
    mapDispatchToProps
)( RoomList );

export default ActiveRoomList;
