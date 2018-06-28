import React from "react"
import { findDOMNode } from "react-dom"
import { is_this_user } from "../utils"
import * as friendActions from "../actions/friendActions"
import { connect } from "react-redux"
import { setScroll } from "../actions/postActions"
import { Popover, Tooltip, OverlayTrigger, Button, ButtonGroup, Glyphicon, Dropdown, MenuItem } from "react-bootstrap"
var topOfElement = function( element ) {
    if ( !element ) {
        return 0;
    }
    return element.offsetTop;
};
export class FriendButton extends React.Component {
    constructor( props ) {
        super( props );
        this.state = { top: -1 }

    }
    componentDidMount() {
        process.env.NODE_ENV === "development" && console.log( 'componentDidMount__FriendButton', this.state.top )
    }
    componentWillUnmount() {
        //console.log( 'componentWillUnmount__FriendButton' )
    }
    componentWillReceiveProps( nextProps, nextState ) {
    }
    componentDidUpdate() {
        //console.log( 'componentDidUpdate', this )


        //window.scrollTo(0,topOfElement(this.myDiv))
    }
    render() {

        const state = this.props
        if ( state.loading ) {
            return <h4>loading</h4>
        }
        /* Add Friend */

        // Tooltip
        const addFriendTooltip = (
            <Tooltip id="tooltip">
                Send Friend Request
                </Tooltip>
        );

        // Button
        const addFriendButton = (
            <OverlayTrigger placement="bottom" overlay={addFriendTooltip}>
                <Button className='drop-shadow-lt border-xs lo-white lobster'>
                    <Glyphicon glyph='user'></Glyphicon>
                    <Glyphicon glyph='plus-sign'> </Glyphicon></Button>
            </OverlayTrigger> )

        // Button With Click
        const addFriendButtonClick = (
            <OverlayTrigger placement="bottom" overlay={addFriendTooltip}>
                <Button
                    bsSize="xs"
                    bsStyle="default"
                    className='drop-shadow-lt border-xs lo-white lobster'
                    onClick={( e ) => state.addFriend( this.state.top )}>
                    <Glyphicon glyph='user'></Glyphicon>
                    <Glyphicon glyph='plus-sign'> </Glyphicon></Button>
            </OverlayTrigger> )

        const popOverAddFriend = (
            <Popover
                id="add-friend-popover"
                placement="bottom"
                title={'Are you sure you want to send this friend request?'}>{addFriendButtonClick}</Popover> )
        // Tooltip
        const cancelRequestTooltip = (
            <Tooltip id="tooltip">
                Cancel Friend Request
            </Tooltip>
        );
        const cancelRequest = (
            <OverlayTrigger placement="bottom" overlay={cancelRequestTooltip}>
                <Button
                    bsSize="xs"
                    bsStyle="danger" className="drop-shadow-lt border-xs lo-white lobster">
                    <Glyphicon glyph={'user'}></Glyphicon>
                    <Glyphicon glyph={'remove'}></Glyphicon></Button>
            </OverlayTrigger> )
        const cancelRequestClick = (
            <OverlayTrigger placement="bottom" overlay={cancelRequestTooltip}>
                <Button onClick={( e ) => state.cancelRequest( this.state.top )}
                    bsSize="xs"
                    bsStyle="danger"
                    className="drop-shadow-lt border-xs lo-white lobster"
                    data-placement='right'>
                    <Glyphicon glyph={'user'}></Glyphicon>
                    <Glyphicon glyph={'remove'}></Glyphicon>
                </Button>
            </OverlayTrigger > );
        const popOverCancelRequest = ( <Popover
            id="cancel-request-popover"
            placement="bottom"
            title={'Are you sure you want to cancel this friend request?'}>{cancelRequestClick}</Popover> );
        const rejectRequestTooltip = (
            <Tooltip id="tooltip"> Reject  Friend Request</Tooltip>
        );
        const rejectRequest = (
            <OverlayTrigger placement="bottom" overlay={rejectRequestTooltip}>
                <Button
                    bsSize="xs"
                    bsStyle="danger"
                    className="drop-shadow-lt border-xs lo-white lobster"
                >
                    <Glyphicon glyph="user"></Glyphicon>
                    <Glyphicon glyph='remove'></Glyphicon>
                </Button>
            </OverlayTrigger > );
        const rejectRequestClick = (
            <OverlayTrigger placement="bottom" overlay={rejectRequestTooltip}>
                <Button onClick={!state.request_rejected && ( ( e ) => state.rejectRequest( this.state.top ) )}
                    bsSize="xs"
                    bsStyle="danger"
                    className="drop-shadow-lt border-xs lo-white lobster"
                >
                    <Glyphicon glyph="user"></Glyphicon>
                    <Glyphicon glyph='remove'></Glyphicon>
                </Button>
            </OverlayTrigger > );
        const popOverReject = ( <Popover
            id="reject-request-popover"
            placement="bottom"
            title={'Are you sure you want to reject this friend request?'}>{rejectRequestClick}</Popover> );
        const acceptRequestTooltip = (
            <Tooltip id="tooltip"> Accept Request</Tooltip>
        );
        const acceptRequest = (
            <OverlayTrigger placement="bottom" overlay={acceptRequestTooltip}>
                <Button
                    bsStyle='success'
                    className="drop-shadow-lt border-xs lo-white lobster"
                >
                    <Glyphicon glyph="user"></Glyphicon>
                    <Glyphicon glyph="ok"></Glyphicon>
                </Button>
            </OverlayTrigger > )
        const acceptRequestClick = (
            <OverlayTrigger placement="bottom" overlay={acceptRequestTooltip}>
                <Button onClick={!state.request_rejected && ( ( e ) => state.acceptRequest( this.state.top ) )}
                    bsStyle='success'
                    className="drop-shadow-lt border-xs lo-white lobster"
                >
                    <Glyphicon glyph="user"></Glyphicon>
                    <Glyphicon glyph="ok"></Glyphicon>
                </Button>
            </OverlayTrigger > )

        /* Popovers*/
        const popOverAccept = ( <Popover
            id="accept-request-popover"
            placement="bottom"
            title={'Are you sure you want to accept this friend request?'}>{acceptRequestClick}</Popover> )
        const removeTooltip = (
            <Tooltip id="tooltip"> Remove Friend</Tooltip>
        );

        const remove = (
            <OverlayTrigger placement="bottom" overlay={removeTooltip}>
                <Button
                    bsSize="xs"
                    bsStyle="danger"
                    className="drop-shadow-lt border-xs lo-white lobster">
                    <Glyphicon glyph='user'></Glyphicon>
                    <Glyphicon glyph='remove'></Glyphicon>
                </Button>
            </OverlayTrigger > )
        const removeClick = (
            <OverlayTrigger placement="bottom" overlay={removeTooltip}>
                <Button onClick={( e ) => state.removeFriend( this.state.top )}
                    bsSize="xs"
                    bsStyle="danger"
                    className="drop-shadow-lt border-xs lo-white lobster">
                    <Glyphicon glyph='user'></Glyphicon>
                    <Glyphicon glyph='remove'></Glyphicon>
                </Button>
            </OverlayTrigger > )
        const popOverRemove = ( <Popover
            id="remove-request-popover"
            placement="bottom"
            title={'Are you sure you want to remove this friend?'}>{removeClick}</Popover> )

        return (
            <ButtonGroup bsSize='small'>
                {!state.are_friends && !state.request_sent && !state.request_received ? (
                    //if(not friends && no request sent && no request received)
                    <OverlayTrigger trigger="click" placement="bottom" overlay={popOverAddFriend}>
                        {addFriendButton}
                    </OverlayTrigger>

                ) : ( ( state.request_sent && !state.request_received ) && (
                    //if(request sent && no request received)
                    <OverlayTrigger trigger="click" placement="bottom" overlay={popOverCancelRequest}>
                        {cancelRequest}
                    </OverlayTrigger> ) )}
                {( !state.are_friends && state.request_received ) && (
                    // if(not friends && request received)
                    <OverlayTrigger trigger="click" placement="bottom" overlay={popOverAccept}>
                        {acceptRequest}
                    </OverlayTrigger>
                )}
                {( !state.are_friends && state.request_received && !state.request_rejected ) && (
                    //if (not friends && request received && request not rejected)
                    <OverlayTrigger trigger="click" placement="bottom" overlay={popOverReject}>
                        {rejectRequest}
                    </OverlayTrigger>
                )}
                {state.are_friends && (
                    // if ( are friends)
                    <OverlayTrigger trigger="click" placement="bottom" overlay={popOverRemove}>
                        {remove}
                    </OverlayTrigger>
                )}
                {this.props.post !== undefined &&
                    // only show when on a post
                    <Dropdown bsSize='small' id="bg-nested-dropdown">
                        <Dropdown.Toggle bsStyle='danger' noCaret>
                            <Glyphicon glyph='exclamation-sign' bsStyle='lo-white border-xs' style={{ fontSize: '13px' }} /></Dropdown.Toggle>
                        <Dropdown.Menu>
                            {/* TODO:
                          *   - Add report functionality
                          *   - extend api to use django feedback form to report post or user
                          *   - create Report Component 
                          */
                            }
                            <MenuItem eventKey="1">Report User</MenuItem>
                            <MenuItem eventKey="2">Report Post</MenuItem>
                        </Dropdown.Menu>
                    </Dropdown>
                }
            </ButtonGroup>

        )
    }

}
const mapStateToProps = function( state, ownProps ) {
    return {
        are_friends: ownProps.are_friends,
        request_sent: ownProps.request_sent,
        request_received: ownProps.request_received,
        request_rejected: ownProps.request_rejected,
        current_user: ownProps.current_user,
        loading: state.globalfeed.loading,
        error: state.error,
        object: ownProps.object,
        index: ownProps.index,
        scroll: state.globalfeed.currentScroll,

    }

}
const mapDispatchToProps = ( dispatch, props ) => {
    return {
        addFriend: ( top ) => {
            props.setScroll( top )
            let data = []
            data['user_id'] = props.current_user
            data['message'] = ''
            dispatch( friendActions.addFriend( data ) )
        },
        removeFriend: ( top ) => {
            props.setScroll( top )
            dispatch( friendActions.removeFriend( props.current_user ) )
        },
        acceptRequest: ( top ) => {
            props.setScroll( top )
            dispatch( friendActions.acceptRequest( props.current_user ) )
        },
        rejectRequest: ( top ) => {
            props.setScroll( top )
            dispatch( friendActions.rejectRequest( props.current_user ) )
        },
        cancelRequest: ( top ) => {
            props.setScroll( top )
            dispatch( friendActions.cancelRequest( props.current_user ) )
        },

    }
}
export default connect( mapStateToProps, mapDispatchToProps )( FriendButton)