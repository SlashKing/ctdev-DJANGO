import React from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import MessageList from './MessageList'
import TypingIndicatorComponent from '../components/TypingIndicatorComponent'
import Author from './Author'

const TIME_TO_REFRESH_AFTER_OPEN = 5000 // 1 minute TODO: use config value
class ChatRoom extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            intervalId: -1,
            currentCount: 0,
            //removeTimeout: false,
        }
        this._handleSendMessage = this._handleSendMessage.bind( this );
    }
    componentWillUpdate() {
    }
    componentDidUpdate() {
        console.log( "updatedChatRoom" )
        //this.chatRoom !== undefined && console.log( findDOMNode( this.chatRoom ).getBoundingClientRect().left );
    }
    componentDidMount() {
        //setting as timeout to update the online status of room
        // when the user opens a chat window, the room becomes active
        // we make the room become inactive after 60 seconds
        //var intervalId = setTimeout( this.timer, TIME_TO_REFRESH_AFTER_OPEN );
        // store intervalId in the state so it can be accessed later:
        //this.setState( { intervalId } );
        //this.chatRoom !== undefined && console.log( findDOMNode( this.chatRoom ).getBoundingClientRect().left );
    }

    componentWillUnmount() {// use intervalId from the state to clear the interval
        //clearTimeout( this.state.intervalId );

        //let id = setTimeout(() => { }, 0 );
        //while ( id ) {
        //    //console.log( id );
        //   clearTimeout( id );
        //    id--;
        //
        //}
    }
    timer = () => {
        this.props.setRoomInactiveInterval( this.props.room.id, this.props.currentUser.username );

    }

    _handleTextChange( room, user ) {
        return this.props.handleTextChange( room, user );
    }
    _handleSendMessage( content ) {
        return this.props.handleSendMessage(
            this.props.room,
            content,
            this.props.currentUser.username);
    }
    _closeChatRoom = ( roomId ) => {
        console.log( "close room", roomId )
        return this.props.closeChatRoom( roomId, this.props.room.name );
    }

    render() {
        return (
            <div className='chat-room-container'>
                {typeof this.props.room !== 'undefined' && (
                    <div className="chat-room" ref={( div ) => { this.chatRoom = div }}>
                        <div className="top-chat-bar-container" >
                            <div className={this.props.room.active ? 'top-chat-bar-active' : 'top-chat-bar-inactive'}>
                            </div>
                            <span onClick={this.props.expanded ? () => this.props.reduceChatRoom( this.props.room.id ) :
                                () => this.props.expandChatRoom( this.props.room.id )}
                                className="top-chat-bar-room-name">
                                {this.props.room.name}
                            </span>
                            <div onClick={() => this._closeChatRoom( this.props.room.id )} className="btn btn-xs btn-info top-chat-bar-close">
                                <i className="glyphicon glyphicon-remove-sign drop-shadow-lt">
                                </i>
                            </div>
                        </div>

                        {this.props.expanded &&
                            <MessageList
                                isTyping={this.props.room.isTyping}
                                messages={this.props.room.messages}
                                currentUser={this.props.currentUser}
                                room={this.props.room}
                                handleMessageScroll={this.props.handleMessageScroll} />
                        }
                        {this.props.room.isTyping && <TypingIndicatorComponent />}
                        {this.props.expanded &&
                            <Author onSendMessage={this._handleSendMessage} 
                                content={this.props.room.content !== undefined ? this.props.room.content : ""}
                                isTyping={this.props.isTyping} 
                                handleTextChange={() => this.props.handleTextChange( this.props.room.id, this.props.room.name )} 
                                setRoomContent={this.props.setRoomContent}
                                user={this.props.currentUser.username} room={this.props.room.id} />
                        }
                    </div> )}
            </div>
        );
    }
}

ChatRoom.propTypes = {
    currentUser: PropTypes.object.isRequired,
    room: PropTypes.shape( {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        active: PropTypes.bool.isRequired,
        messages: PropTypes.array,
        users: PropTypes.array.isRequired,
        isTyping: PropTypes.bool,
        content:PropTypes.string
    } ),
    expanded: PropTypes.bool.isRequired,
    setRoomContent: PropTypes.func.isRequired,
    isTyping: PropTypes.func.isRequired,
    handleTextChange: PropTypes.func.isRequired,
    handleSendMessage: PropTypes.func.isRequired,
    handleMessageScroll: PropTypes.func.isRequired,
    closeChatRoom: PropTypes.func.isRequired,
    expandChatRoom: PropTypes.func.isRequired,
    reduceChatRoom: PropTypes.func.isRequired,
    setRoomInactiveInterval: PropTypes.func.isRequired,
};
export default ChatRoom;
