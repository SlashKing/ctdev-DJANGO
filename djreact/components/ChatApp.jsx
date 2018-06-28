import React from 'react';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom'
import _ from 'lodash'
import {putActiveRoomAtFront} from '../actions/chatActions'
import ActiveRoomList from '../containers/ActiveRoomList.jsx';
import VisibleChatRoom from '../containers/VisibleChatRoom.jsx';
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap'
const ITEM_WIDTH = 303;
const SIDEBAR_WIDTH = 250;
const MAX_WINDOW_FOR_SIDEBAR = 995;
const SPACE_FOR_SIDEBAR = 55;
class ChatApp extends React.Component {
    constructor( props ) {
        super( props );
        this._handleWindowResize = _.debounce( this._handleWindowResize.bind( this ), 100 )
        this.state = {
            containerWidth: 0
        }
        this._isMounted = false;
    }
    componentDidMount() {
        this._isMounted = true;
        window.addEventListener( 'resize', this._handleWindowResize );
    }
    _handleWindowResize() {
        if ( this._isMounted ) {
            this.setState( {
                // check the window width and match it up with the css in styling.css for @media max-width 995 .container-fixed
                containerWidth: window.innerWidth < MAX_WINDOW_FOR_SIDEBAR ?
                    window.innerWidth - SPACE_FOR_SIDEBAR :
                    window.innerWidth - SIDEBAR_WIDTH - SPACE_FOR_SIDEBAR
            } );
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
        window.removeEventListener( 'resize', this._handleWindowResize );
    }
    _handleDropUpClick = (room) => {
        this.props.dispatch(putActiveRoomAtFront(room))
    }
    _truncateItems( items ) {
        var containerWidth = this.state.containerWidth;
        var maxItemsToShow = Math.floor( containerWidth / ITEM_WIDTH );
        // copy the array if the container has mounted
        var otherItems = containerWidth > 0 ? items.slice() : []
        if ( containerWidth > 0 ) {
            otherItems = otherItems.slice( maxItemsToShow, items.length )
        }
        if ( items.length <= maxItemsToShow || maxItemsToShow < 1 ) {
            // the screen is too small to show the full size chat
            if ( maxItemsToShow < 1 ) {
                return [[], otherItems];
            }
            return [items, otherItems];
        }

        // The item displaying the number of remaining items has to also count itself so its +1
        var numberOfCountingItems = 1;
        var numberOfRemainingItems = items.length - maxItemsToShow + numberOfCountingItems;
        var truncatedItems = items.slice( 0, maxItemsToShow );

        // var displayNumberHtml = (
        // <div className='-additionalItemsCounter' key='additionalItemsCounter'>
        //     <span>+{numberOfRemainingItems}</span>
        // </div>
        // );

        //truncatedItems.push( displayNumberHtml );
        return [truncatedItems, otherItems];

    }
    render() {
        let { activeRooms } = this.props;
        var items = this._truncateItems( activeRooms )
        return (
            <div className="row" >
                <div className="room-list-container-fixed drop-shadow-lt hidden-sm hidden-xs">
                    <ActiveRoomList />
                </div>
                <div className="container-fixed" ref={node => {
                    // this callback executes before componentDidMount
                    if ( node !== null ) {
                        this._containerTarget = node;
                        if ( !this._isMounted ) {
                            this._isMounted = true;
                            this._handleWindowResize();
                        }
                    }
                }}>
                    {items[0].map( room =>
                        <VisibleChatRoom key={'chat_flyout_' + Math.random()} id={room.id} expanded={room.expanded} />

                    )}
                    {items[1].length > 0 && <ButtonToolbar style={{ visibility: 'visible' }}>
                        <DropdownButton
                            dropup title={'Active Chats'} id={"chat_dropup"}>
                            {items[1].map(( room, index ) =>
                                <MenuItem
                                    eventKey={index + 1}
                                    key={'chat_no_fit_dropdown_' + index} 
                                    onClick={()=>this._handleDropUpClick(room)}>{room.name}</MenuItem>
                            )
                            }
                        </DropdownButton>
                    </ButtonToolbar>
                    }
                </div>
            </div>
        );
    }
}
ChatApp.propTypes = {
    activeRooms: PropTypes.array.isRequired,
    rooms: PropTypes.array.isRequired,
    friends: PropTypes.array.isRequired,
};


const mapStateToProps = ( state ) => ( {
    activeRooms: state.chat.activeRooms,
    rooms: state.chat.rooms,
    friends: state.friends.objects
} );
export default connect(
    null,
    null
)( ChatApp );
