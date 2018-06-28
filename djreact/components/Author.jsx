import React from 'react';
import PropTypes from 'prop-types'

export class Author extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            intervalId: -1,
            lastTyped: new Date() - 2000,
            content: props.content,
        }
    }
    componentDidMount() {
        //this.props.setRoomContent(this.props.room, this.input.value)
    }
    handleTextChange = ( e ) => {
        // clear any timeout that may exist, ie. the one that is set when the user opens the window
        // consider keeping a param (typing) for each room and use to display to the other user when typing 
        //let id = setTimeout(() => { }, 0 );
        //while ( id ) {
        //    clearTimeout( id );
        //    id--;
        //}
        var input = this.input
        console.log( input.value )
        const time = new Date() - this.state.lastTyped;
        //const delay = new Date() - this.state.lastTyped > 200;
        //delay ? this.props.setRoomContent(this.props.room, this.input.value): null;
        //this.props.setRoomContent(this.props.room,input.value)
        //console.log(time, delay, this.state.intervalId)
        time > 2000 && this.props.isTyping( true, this.props.room )
        this.setState( { content: input.value } )
        this.state.intervalId !== -1 && clearTimeout( this.state.intervalId )
        this.setState( {
            intervalId:
            setTimeout(() => {

                // sets the room to inactive after the timeout expires
                this.props.handleTextChange( this.props.room, this.props.user );
                // set the typing param to false for the other user
                this.props.isTyping( false, this.props.room );
                clearTimeout( this.state.intervalId )
            }
                , 1800 )
        } );
        this.setState( { lastTyped: new Date() } )
    }
    componentWillReceiveProps( nextProps, nextState ) {
    }
    componentWillUnmount() {
        //this.props.setRoomContent(this.state.content, this.props.room)
    }
    handleSendMessage( e ) {
        e.preventDefault();
        if ( !this.input.value.trim() ) {
            return;
        }
        this.props.setRoomContent( "", this.props.room )
        this.props.onSendMessage( this.input.value );

        // clear out the text box
        this.input.value = '';
    }
    moveCaretAtEnd( e ) {
        var temp_value = e.target.value
        e.target.value = ''
        e.target.value = temp_value
    }
    render() {
        return (
            <form onSubmit={( e ) => this.handleSendMessage( e )}>
                <div className="input-group" >
                    <input key={'author_input_' + this.props.room}
                        type="text"
                        onFocus={this.moveCaretAtEnd}
                        autoFocus="autofocus"
                        value={this.state.content} onChange={this.handleTextChange}
                        required="true" className="chat-room-text-input" ref={c => this.input = c} />
                    <input
                        id={'author_input_' + this.props.room} type="hidden" value={this.state.content} />
                    <span className="input-group-btn">
                        <button type='submit' className="chat-room-submit-btn btn btn-sm btn-primary">send</button>
                    </span>
                </div>
            </form>
        );
    }
}
Author.propTypes = {
    content: PropTypes.string,
    room: PropTypes.number.isRequired,
    user: PropTypes.string.isRequired,
    isTyping: PropTypes.func.isRequired,
    handleTextChange: PropTypes.func.isRequired,
    onSendMessage: PropTypes.func.isRequired,
    setRoomContent: PropTypes.func.isRequired,
};

export default Author;
