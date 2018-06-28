import React from 'react';
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom';
import Message from './Message';
import RoomList from "./RoomList";

class MessageList extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {
        this.scroller.scrollTo( 0, this.scroller.scrollHeight );
    }

    componentWillUpdate() {
        // Before we re-render, see if the user manually scrolled back, we do not
        // want to force them back down to the bottom because they were probably reading something
        this.shouldScrollBottom = (
            ( this.scroller.scrollTop + this.scroller.offsetHeight ) === this.scroller.scrollHeight
        );
    }

    componentDidUpdate() {
        console.log('__MessageList__componentDidUpdate')
        if ( this.shouldScrollBottom ) {
            // Stay scrolled at the bottom since new messages will be appended
            this.scroller.scrollTo( 0, this.scroller.scrollHeight );
        }
    }
    _handleScroll = ( e ) => {

        if ( this.scroller.scrollTop === 0 && !this.props.loading && !this.props.room.end ) {
            // console.log(node.scrollHeight, node.scrollTop, node.offsetHeight);
            this.props.handleMessageScroll( this.props.currentUser, this.props.room, this.props.room.messages );
        }
    }
    render() {
        var messages = []
        const len = this.props.messages.length
        for ( var i = 0; i < len; i++ ) {
            // this will need to be updated when group chats is implemented
            // WARNING: Uses the first person in the users array for the room.
            // 		  Currently, this will always be the other user in the chat
            var this_message = this.props.messages[len - i - 1]
            messages.push( <Message key={'message_list_' +this_message.id}
                currentUser={this.props.currentUser}
                {...this_message} /> )
        }
        return (
            <div ref={d => this.scroller = d} onScroll={( e ) => this._handleScroll( e )} className="message-list" >
                {messages}
                
            </div>
        );
    }
}

MessageList.propTypes = {
    currentUser: PropTypes.object.isRequired,
    messages: PropTypes.arrayOf(
        PropTypes.shape( {
            id: PropTypes.number.isRequired,
            roomId: PropTypes.number.isRequired,
            user: PropTypes.object.isRequired,
            content: PropTypes.string.isRequired,
            timestamp: PropTypes.number.isRequired,
        } ).isRequired
    ).isRequired,
    room: PropTypes.shape( {
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        users: PropTypes.array.isRequired,
        isTyping: PropTypes.bool,
        active: PropTypes.bool.isRequired
    } )
};
export default MessageList;
