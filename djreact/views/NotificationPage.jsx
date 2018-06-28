import React from "react"
import { connect } from "react-redux"
import * as notificationActions from "../actions/notificationActions"
//import Notification from "../components/Notification"
import FriendButton from "../components/FriendButton"
import LikesButton from "../components/LikesButton"
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import { NOTIFICATIONS, NOTIFICATIONS_UNREAD } from '../common/constants/routes'
import {
    FRIEND_SCREEN,
    HASHTAG_SCREEN,
    POSTS_SCREEN,
    USERS_SCREEN,
    FOLLOWERS_SCREEN,
    FOLLOWING_SCREEN
} from "../common/constants/screens"

export class NotificationPage extends React.Component {
    constructor( props ) {
        super( props )
        this.state = {
            all: props.all,
            deleted: props.deleted
        }
    }
    componentDidMount() {
        console.log( this.props )
        if ( this.props.notifications === undefined && !this.props.loading ) {
            if ( this.state.all ) {
                this.props.fetchNotifications()
            } else {
                this.props.fetchNotificationsUnread()
            }
        }
    }
    showAll( e ) {
        if ( !this.state.all ) {
            this.state.all = true
            this.forceUpdate()
            this.props.resetNextPrevious()
            this.props.fetchNotifications()
            this.props.history.push( NOTIFICATIONS )
        }
    }
    hideRead( e ) {
        if ( this.state.all ) {
            this.state.all = false
            this.forceUpdate()
            this.props.resetNextPrevious()
            this.props.fetchNotificationsUnread()
            this.props.history.push( NOTIFICATIONS_UNREAD )
        }
    }
    hideShowDeleted( e ) {
        if ( !this.state.deleted ) {
            this.state.deleted = true
            this.forceUpdate()
            if ( this.state.all ) {
                this.props.history.push( NOTIFICATIONS + 'deleted/' )
            } else {
                this.state.all = false
                this.forceUpdate()
                this.props.history.push( NOTIFICATIONS_UNREAD + 'deleted/' )
            }
        } else {
            this.state.deleted = false
            this.forceUpdate()
            if ( this.state.all ) {
                this.props.history.push( NOTIFICATIONS )
            } else {
                this.state.all = false
                this.forceUpdate()
                this.props.history.push( NOTIFICATIONS_UNREAD )
            }
        }
    }
    loadMore( e ) {
        if ( this.state.all ) {
            this.props.fetchNotifications( this.props.next )
        } else {
            this.props.fetchNotificationsUnread( this.props.next )
        }
    }
    renderTopButtons() {
        return (
            <div className="text-center" style={{ marginBottom: '2px' }}>
                <div className="btn-group notice-btns">
                    <a style={{ fontSize: '21px' }} className={'col-xs-4 btn btn-sm btn-success lobster ' + ( this.state.all && 'active' )} onClick={( e ) => this.showAll( e )}>All</a>
                    <a style={{ fontSize: '21px' }} className={'col-xs-4 btn btn-sm btn-success lobster ' + ( !this.state.all && 'active' )} onClick={( e ) => this.hideRead( e )}>Unread</a>
                    <a style={{ fontSize: '21px' }} className="col-xs-4 btn btn-sm btn-danger lobster" onClick={( e ) => this.props.markAllAsRead( e )}>Mark Read</a>
                </div>
                <input className="btn btn-sm btn-info lobster"
                    style={{ fontSize: '15px' }}
                    type={'button'}
                    onClick={( e ) => this.hideShowDeleted( e )}
                    value={!this.state.deleted ? 'Show Deleted' : 'Hide Deleted'} />

            </div>
        )

    }
    generateNode( notice, index ) {
        const node = (
            <div key={'notification_' + notice.id} className={!notice.unread ? 'drop-shadow-lt notice alert-default' : 'drop-shadow-lt notice alert-info'}
                style={{ padding: '12px 3px', marginBottom: '5px' }}>

                <a className="close" onClick={!notice.deleted ? (
                    () => this.props.deleteNotification( notice.id, index ) ) :
                    ( () => this.props.undeleteNotification( notice.id, index ) )}>
                    <i className={'glyphicon ' + ( notice.deleted ? 'glyphicon-tree-deciduous lo-green' : 'glyphicon-trash lo-red' ) + ' border-sm'}></i>
                </a>
                <a className="close" onClick={!notice.unread ?
                    ( () => this.props.markAsUnread( notice.id, index ) ) :
                    ( () => this.props.markAsRead( notice.id, index ) )}>
                    <i className={'glyphicon ' + ( notice.unread ? 'glyphicon-remove-sign lo-red' : 'glyphicon-ok lo-green' ) + ' border-sm'}></i>
                </a>


                <img className="drop-shadow-lt n_img_round low-opac" data-toggle="tooltip"
                    data-original-title={"Visit" + notice.actor.username + "'s profile"}
                    onClick={( e ) => this.props.currentProfileActivator( notice.actor, e )}
                    src={notice.actor.profile.profile_image}
                    style={{ marginRight: '3px' }}></img>
                {notice.actor.username} {notice.verb}
                {( notice.content_object !== null || notice.action_object !== null ) &&

                    <span onClick={notice.action_object.text !== undefined ?
                        ( e ) => this.props.singlePostActivator( notice.action_object, -1, e ) :
                        ( e ) => this.props.singlePostActivator( notice.content_object, -1, e )}></span>}

                <div className="pull-right">
                    <img onClick={notice.action_object !== null && notice.action_object.text !== undefined ? (
                        // notification is for a post
                        ( e ) => this.props.singlePostActivator( notice.action_object, -1, e )
                    ) : notice.content_object !== null ? (
                        // notification is for comment of a post
                        ( e ) => this.props.singlePostActivator( notice.content_object, -1, e )
                    ) : (
                                // friend request, link to profile page
                                ( e ) => this.props.currentProfileActivator( notice.actor, e )
                            )
                    }
                        className="n_img_round low-opac pull-right drop-shadow"
                        src={( notice.content_object !== null ) ?
                            notice.content_object.thumbnail_url !== '' ?
                                notice.content_object.thumbnail_url : notice.actor.profile.profile_image
                            : ( notice.action_object !== null && notice.action_object.thumbnail_url !== "" ?
                                ( notice.action_object.thumbnail_url )
                                : notice.action_object !== null ? ( notice.actor.profile.profile_image ) :
                                    notice.target.profile.profile_image )}
                        style={{ marginRight: '3px' }}></img>

                </div>
                <p>{notice.timesince} ago</p>
            </div>
        )
        return node
    }
    renderNotificationList() {
        var notificationNodes = []
        this.props.notifications.map(( notice, index ) => {
            const node = this.generateNode( notice, index )
            if ( this.state.all ) {
                if ( this.state.deleted ) {
                    notificationNodes.push( node )
                } else {
                    if ( !notice.deleted ) {
                        notificationNodes.push( node )
                    }
                }
            } else {
                if ( this.state.deleted ) {
                    if ( notice.unread ) {
                        notificationNodes.push( node )
                    }
                } else {
                    if ( !notice.deleted && notice.unread ) {
                        notificationNodes.push( node )
                    }
                }
            }
        } )
        return notificationNodes
    }
    render() {
        return (
            <div className="notifications">
                {this.renderTopButtons()}
                {this.props.notifications !== undefined && !this.props.loading && ( this.renderNotificationList() )}
                {this.props.next !== null &&
                    <div className={'text-center'}>
                        <button style={{ fontSize: '18px', marginTop: '6px' }}
                            className="btn btn-sm btn-default lobster"
                            onClick={( e ) => this.loadMore( e )}>Load More
        			    </button>
                    </div>}
            </div>
        )
    }
}
//notice.action_object.rejected !== undefined &&
//							(
//								{notice.verb}
//									<ul className="nav nav-pills users" style="display:inline-block">
//										<li className="friends drop-shadow">{notice.action_object.to_user.username}</li>
//										<li className="follows drop-shadow">{notice.action_object.from_user.username}</li>
//									</ul>
//							)
const mapStateToProps = function( state, ownProps ) {
    return {
        loading: state.notifications.loading,
        global_screen: state.globalfeed.screen,
        notifications: state.notifications.objects,
        next: state.notifications.next,
        previous: state.notifications.previous
    }
}
const mapDispatchToProps = function( dispatch, props ) {
    return {
        resetNextPrevious: () => { dispatch( notificationActions.resetNextPrevious() ) },
        markAllAsRead: () => { dispatch( notificationActions.markAllRead() ) },
        deleteNotification: ( id, index ) => { dispatch( notificationActions.markAsDeleted( id, index ) ) },
        undeleteNotification: ( id, index ) => { dispatch( notificationActions.markAsUndeleted( id, index ) ) },
        markAsRead: ( id, index ) => { dispatch( notificationActions.markAsRead( id, index ) ) },
        markAsUnread: ( id, index ) => { dispatch( notificationActions.markAsUnread( id, index ) ) }
    }
}
export default connect( mapStateToProps, mapDispatchToProps )( NotificationPage)