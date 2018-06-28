import React from 'react';
import PropTypes from 'prop-types'
import Room from './Room';

const RoomList = ( { activeRooms, rooms, friends, user, onRoomClick } ) => (
    <div>
        {rooms.map( room =>
            <Room key={"room_" + room.id} {...room}
                open={activeRooms !== undefined && activeRooms.find( r => r.id === room.id ) !== undefined ? true : false}
                onClick={() => onRoomClick( room.id, room.users[0].username )} />
        )}
        <hr className="fancy" />
        {friends.map( friend => rooms.find( r => (r.users[0].username === friend.to_user.username )) === undefined &&
            <Room key={"no_room_" + friend.id} friend={friend} to_user={friend.to_user} name={friend.to_user.username}
                open={false} active={false}
                onClick={() => onRoomClick( undefined, friend.to_user.username, true )} />
        )}
    </div>
);

RoomList.propTypes = {
    activeRooms: PropTypes.array.isRequired,
    rooms: PropTypes.arrayOf( PropTypes.shape( {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        users: PropTypes.array.isRequired,
        active: PropTypes.bool.isRequired,
        messages: PropTypes.array,
        isTyping: PropTypes.bool,
    } ).isRequired ).isRequired,
    friends: PropTypes.array.isRequired,
    onRoomClick: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired,
};
export default RoomList;
