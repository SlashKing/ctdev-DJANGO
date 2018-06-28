import React from "react"
import { connect } from "react-redux"
import * as screens from "../common/constants/screens"
import { Link } from 'react-router-dom'
import * as appActions from "../actions/appActions"

export class NavBar extends React.Component {
    constructor( props ) {
        super( props )
        this.state = {
            show_tooltip: false,
            which_tooltip: ''
        }
    }
    componentDidMount() {
    }

    render() {
        return (
            <nav className="nav navbar navbar-fixed-top">
                <div className="text-center container-fluid">
                    <ul className="nav nav-pills main">
                        <li className="dropdown text-left">
                            <a onClick={
                                this.props.screen !== screens.SEARCH_SCREEN ?
                                    () => this.props.openSearchPage( this.props.screen ) : null
                            }
                                className="dropdown-toggle" data-toggle="dropdown">
                                <i className="glyphicon glyphicon-search border-md lo-white"></i>
                            </a>
                            <ul className="dropdown-menu drop-shadow" role="menu">
                                <li>
                                    <a onClick={this.props.handleFollowersClick}>
                                        <span className="badge badge-menu alert-success-dark drop-shadow">
                                            <i className="glyphicon glyphicon-user border-sm lo-white" data-toggle="dropdown"></i>
                                        </span>&nbsp;&nbsp;&nbsp;&nbsp;Followers
								</a>
                                </li>
                                <li>
                                    <a onClick={this.props.handleFollowingClick}>
                                        <span className="badge badge-menu alert-success-dark drop-shadow">
                                            <i className="glyphicon glyphicon-user border-sm lo-white" data-toggle="dropdown"></i>
                                        </span>&nbsp;&nbsp;&nbsp;&nbsp;Following
								</a>
                                </li>
                                <li>
                                    <a onClick={this.props.handleFriendsClick}>
                                        <span className="badge badge-menu alert-success-dark drop-shadow">
                                            <i className="glyphicon glyphicon-user border-sm lo-white" data-toggle="dropdown"></i>
                                        </span>&nbsp;&nbsp;&nbsp;&nbsp;Friends
								</a>
                                </li>
                                <li>
                                    <a onClick={this.props.handleUsersClick}>
                                        <span className="badge badge-menu alert-success-dark drop-shadow">
                                            <i className="glyphicon glyphicon-user border-sm lo-white" data-toggle="dropdown"></i>
                                        </span>&nbsp;&nbsp;&nbsp;&nbsp;Users
								</a>
                                </li>
                                <li>
                                    <a onClick={this.props.handleHashTagsClick}>
                                        <span className="badge badge-menu alert-success-dark drop-shadow">
                                            <span className="border-sm lo-white" style={{ fontSize: '29px', padding: '0 2px' }}>#</span>

                                        </span>&nbsp;&nbsp;Hashtags
								</a>
                                </li>
                                <li>
                                    <a onClick={this.props.handlePostsClick}>
                                        <span className="badge badge-menu alert-success-dark drop-shadow">
                                            <i className="glyphicon glyphicon-leaf border-sm lo-white" data-toggle="dropdown"></i>
                                        </span>&nbsp;&nbsp;Posts
								</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a data-toggle={'tooltip'} data-placement={'bottom'} title={'Open Feed'}
                                onClick={
                                    ( this.props.screen !== screens.FEED_SCREEN ) || ( (
                                        this.props.currentProfile ) &&
                                        ( this.props.screen !== screens.FEED_SCREEN || this.props.screen === screens.FEED_SCREEN ) ) ?
                                        ( e ) => this.props.handleFeedClick( e ) : null}>
                                <i className="glyphicon glyphicon-leaf border-md lo-white"></i>
                            </a>
                        </li>
                        <li>
                            <a>
                                <i className="glyphicon glyphicon-user border-md lo-white"></i>
                            </a>
                        </li>
                        <li>
                            <a data-toggle={'tooltip'} data-placement={'bottom'} title={'Edit Your Profile'}
                                onClick={() => this.props.currentProfileActivator( this.props.user )}>
                                <i className="glyphicon glyphicon-pencil border-md lo-white"></i>
                            </a>
                        </li>

                        <li className="dropdown">
                            <img className="dropdown-toggle n_img_round low-opac" data-toggle="dropdown" src={this.props.user.profile.profile_image}></img>
                            <ul className="dropdown-menu" role="menu" style={{ left: '-110px' }}>
                                <li>
                                    <a onClick={( e ) => this.props.handleNotificationsClick( e )}><i className="glyphicon glyphicon-globe border-sm lo-white"></i>
                                        <span className="badge alert-danger" style={{ position: 'absolute', left: '-5px' }}>
                                            {this.props.user.notifications_count}
                                        </span>&nbsp;Notifications</a>
                                </li>
                                <li>
                                    <a>
                                        <i className="glyphicon glyphicon-user border-sm lo-white">
                                        </i>&nbsp;&nbsp;&nbsp;&nbsp;Friends
								</a>
                                </li>
                                <li>
                                    <a onClick={( e ) => this.props.handleSettingsClick( e )}>
                                        <i className="glyphicon glyphicon-wrench border-sm lo-white"></i>&nbsp;&nbsp;&nbsp;&nbsp;Settings
								</a>
                                </li>
                                <li>
                                    <a>
                                        <i className="glyphicon glyphicon-lock border-sm lo-white"></i>&nbsp;&nbsp;&nbsp;&nbsp;Password
								</a>
                                </li>
                                <li>
                                    <a href="/accounts/logout/">
                                        <span>
                                            <i className="glyphicon glyphicon-remove-sign border-sm lo-red"></i>
                                        </span>&nbsp;&nbsp;&nbsp;&nbsp;Logout
								</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}
const mapStateToProps = function( state, ownProps ) {
    return {
        user: state.globalfeed.user,
    }

}
const mapDispatchToProps = ( dispatch, props ) => {
    return {


    }
}
export default connect( mapStateToProps, mapDispatchToProps )( NavBar)