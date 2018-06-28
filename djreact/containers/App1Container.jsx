import React from "react"

import { connect } from "react-redux"

// Pages
import GetGlobalFeed from "../views/GetGlobalFeed"
import SearchPage from "../views/SearchPage"
import NotificationPage from "../views/NotificationPage"
import SettingsPage from "../views/SettingsPage"

// Nav
import NavBar from "../components/NavBar"

// Left Sidebar
import LeftSidebarContainer from "./LeftSidebarContainer"

// actions
import * as postActions from "../actions/postActions"
import * as appActions from "../actions/appActions"
import * as screens from "../common/constants/screens"
import * as searchActions from "../actions/searchActions"
import * as notificationActions from "../actions/notificationActions"
import { fetchPosts, setCurrentProfile } from "../actions/postActions"
import { loginUser } from '../actions/chatActions'


// Chat Root
import Root from './Root'

import * as _ from 'lodash'
import * as routes from '../common/constants/routes'
import { browserHistory } from 'react-router'
import { push } from 'react-router-redux'

var auth = require( '../auth' )
export const REFRESH = 15000
export class App1Container extends React.Component {
    constructor( props ) {
        super( props );
        console.log( props )
        
        // TODO: move current screen, search_screen, and currentScroll to the state instead of managing with redux
        // GOAL: move actions to more relevant locations and remove connect() from this component, use as HOC
        this.state = {
            scrollListener: true
        }
        // debounce to improve performance
        // the function it is calling is rather expensive (lots of math, occasional redux state update)
        this.listenScrollEvent = _.debounce( this.listenScrollEvent.bind( this ), 200 )
    }
    componentWillUnmount() {
        //console.log( "componentWillUnmount" )
        window.removeEventListener( "scroll", ( e ) => this.listenScrollEvent( e ) );
        //clearInterval(this.interval)
    }

    componentWillReceiveProps( nextProps, nextState ) {
    }
    componentDidMount() {
        let { request_user, screen, user, search, search_screen, globalfeed, notifications } = this.props
        console.log(screen,globalfeed.screen)
        if ( screen !== undefined ) {
            //this.props.switchAppScreen( globalfeed.screen, screen )
        }
        if ( this.props.search_screen !== undefined ) {
            //this.props.switchSearchScreen( search.screen, search_screen )
        }
        window.addEventListener( "scroll", ( e ) => this.listenScrollEvent( e ) );

        // fetch posts on an interval, use the global const "REFRESH" in this file to set
        //if(this.props.globalfeed.screen === screens.FEED_SCREEN){
        //this.interval = setInterval(() => this.props.fetchPosts(),REFRESH)
        //}
    }
    componentDidUpdate( prevProps, prevState ) {
        
        //console.log('App1Container__componentDidUpdate')
        //window.scrollTo( 0, this.props.globalfeed.currentScroll )

        //clearInterval(this.interval);
        //// not sure if this is React style but I am going to switch through screens
        //// and run a fetch on whichever data is required based on the screen.
        //// another switch is required when in the search screen 
        //switch(this.props.globalfeed.screen){
        //	case screens.FEED_SCREEN:
        //		this.interval = setInterval(() => this.props.fetchPosts(),REFRESH)
        //		break;
        //	case screens.SEARCH_SCREEN:
        //		switch(this.props.search.screen){
        //			case screens.POSTS_SCREEN:
        //			break;
        //			case screens.FOLLOWERS_SCREEN:
        //			break;
        //			case screens.FOLLOWING_SCREEN:
        //			break;
        //			case screens.FRIEND_SCREEN:
        //			break;
        //			case screens.HASHTAG_SCREEN:
        //			break;
        //			case screens.FOLLOWERS_SCREEN:
        //			break;
        //			default:
        //			break;
        //		}
        //		break;
        //	case screens.NOTIFICATIONS_SCREEN:
        //		//this.interval = setInterval(() => this.props.fetchNotifications(),REFRESH)
        //		break;
        //	case screens.FRIENDS_SCREEN:
        //		//this.interval = setInterval(() => this.props.fetchFriends(),REFRESH)
        //		break;
        //	default:
        //		clearInterval(this.interval)
        //		break;
        //}

    }
    /**
     * 
     * Notifications Clicks
     * 
     * 
     * */
    handleNotificationsClick = ( e ) => {
        this.props.globalfeed.currentProfile !== undefined && this.props.setCurrentProfile( "" )
        const html = document.documentElement
        const top = ( window.pageYOffset || html.scrollTop ) - ( html.clientTop !== undefined && html.clientTop || 0 )
        this.props.switchAppScreen( this.props.globalfeed.screen, screens.NOTIFICATIONS_SCREEN, undefined,top )

    }
    /**
     * 
     * Search Clicks
     * 
     * 
     * */
    handleSearchClick = ( e ) => {
        const html = document.documentElement
        const top = ( window.pageYOffset || html.scrollTop ) - ( html.clientTop !== undefined && html.clientTop || 0 )
        this.props.switchAppScreen( this.props.globalfeed.screen, screens.SEARCH_SCREEN, top )
    }
    handleFriendsClick = ( e ) => {
        this.props.switchSearchScreen( this.props.search.screen, screens.FRIEND_SCREEN )
    }
    handleFollowersClick = ( e ) => {
        this.props.switchSearchScreen( this.props.search.screen, screens.FOLLOWERS_SCREEN )
    }
    handleFollowingClick = ( e ) => {
        this.props.switchSearchScreen( this.props.search.screen, screens.FOLLOWING_SCREEN )
    }
    handleUsersClick = ( e ) => {
        this.props.switchSearchScreen( this.props.search.screen, screens.USERS_SCREEN )
    }
    handleHashTagsClick = ( e ) => {
        this.props.switchSearchScreen( this.props.search.screen, screens.HASHTAG_SCREEN )
    }
    handlePostsClick = ( e ) => {
        this.props.switchSearchScreen( this.props.search.screen, screens.POSTS_SCREEN )
    }
    /**
     * 
     * Settings Clicks
     * 
     * 
     * */
    handleSettingsClick = ( e ) => {
        this.props.switchAppScreen( this.props.globalfeed.screen, screens.SETTINGS, routes.PROFILE_SETTINGS(this.props.globalfeed.user.username) )
    }
    handleCPasswordClick = (e) =>{
        this.props.switchAppScreen( this.props.globalfeed.screen, screens.SETTINGS, routes.PROFILE_SETTINGS_CPASSWORD(this.props.globalfeed.user.username) )
    }
    handleLPasswordClick = (e) =>{
        this.props.switchAppScreen( this.props.globalfeed.screen, screens.SETTINGS, routes.PROFILE_SETTINGS_LPASSWORD(this.props.globalfeed.user.username) )
    }
    handlePrivacyClick = (e) =>{
        this.props.switchAppScreen( this.props.globalfeed.screen, screens.SETTINGS, routes.PROFILE_SETTINGS_PRIVACY(this.props.globalfeed.user.username) )
    }
    handleGenderClick = (e) =>{
        this.props.switchAppScreen( this.props.globalfeed.screen, screens.SETTINGS, routes.PROFILE_SETTINGS_GENDER(this.props.globalfeed.user.username) )
    }
    handleInterestedClick = (e) =>{
        this.props.switchAppScreen( this.props.globalfeed.screen, screens.SETTINGS, routes.PROFILE_SETTINGS_INTERESTED_IN(this.props.globalfeed.user.username) )
    }
    handleBirthdayClick = (e) =>{
        this.props.switchAppScreen( this.props.globalfeed.screen, screens.SETTINGS, routes.PROFILE_SETTINGS_BDAY(this.props.globalfeed.user.username) )
    }
    handleStatusClick = (e) =>{
        this.props.switchAppScreen( this.props.globalfeed.screen, screens.SETTINGS, routes.PROFILE_SETTINGS_REL_STATUS(this.props.globalfeed.user.username) )
    }
    handleUsernameClick = (e) =>{
        this.props.switchAppScreen( this.props.globalfeed.screen, screens.SETTINGS, routes.PROFILE_SETTINGS_UNAME(this.props.globalfeed.user.username) )
    }
    handleAboutMeClick = (e) =>{
        this.props.switchAppScreen( this.props.globalfeed.screen, screens.SETTINGS, routes.PROFILE_SETTINGS_ABOUT(this.props.globalfeed.user.username) )
    }
    handleGeneralClick = (e) =>{
        this.props.switchAppScreen( this.props.globalfeed.screen, screens.SETTINGS, routes.PROFILE_SETTINGS_GENERAL(this.props.globalfeed.user.username) )
    }
    handleEmailClick = (e) =>{
        this.props.switchAppScreen( this.props.globalfeed.screen, screens.SETTINGS, routes.PROFILE_SETTINGS_EMAIL(this.props.globalfeed.user.username))
    }
    /**
    * 
    * GlobalFeed and Profile Clicks
    * 
    * 
    * */
    handleFeedClick = ( e ) => {
        this.props.openFeed(
            this.props.globalfeed.screen,
            this.props.globalfeed.currentProfile !== undefined ? true : false,
            this.props.local
        )
    }
    singlePostActivator = ( post, index, e ) => {
        this.props.switchAppScreen( this.props.globalfeed.screen, screens.FEED_SCREEN )
        this.props.globalfeed.isSinglePost ? (
            this.props.setCurrentIndex( 0 ),
            this.props.setActivePost( "" ),
            this.props.setSinglePost( false )
            //this.props.currentProfile !== undefined ? (
            //  this.props.fetchPostsForUser(this.props.currentProfile.username)):(
            //  this.props.fetchPosts()
            //)
        ) : (
                this.props.setCurrentIndex( index ),
                this.props.setActivePost( post ),
                this.props.setSinglePost( true )
            )
    }
    currentProfileActivator = ( user, e ) => {
        this.props.setScroll( 0 )
        // no need to switch app screen if we are already on the same screen

        // clean up single post if it is active
        this.props.globalfeed.isSinglePost && (
            this.props.setSinglePost( false ),
            this.props.setActivePost( "" )
        )
        // check if the profile is defined, if not, then we have to set it and fetch posts
        // Next, case is when a profile is being viewed but it is not the logged in users
        // in the latter case, the user must have hit a button to go to their profile while they were viewing
        // another profile.
        this.props.globalfeed.currentProfile === undefined ? (
            this.props.resetNextPrevious(),
            this.props.setCurrentProfile( user ),
            this.props.fetchPostsForUser( user.username )
        ) : user.id !== this.props.globalfeed.currentProfile.id && (
            this.props.resetNextPrevious(),
            this.props.setCurrentProfile( user ),
            this.props.fetchPostsForUser( user.username )
        )
        this.props.switchAppScreen( this.props.globalfeed.screen, screens.FEED_SCREEN,user.username )
        this.props.history.push(routes.PROFILE_USER(user.username))
    }
    handleLocal = ( e ) => {
        this.props.setScroll( 0 )
        this.props.history.push( routes.LOCAL )

    }
    scrollListener = () => {
        const _this = this
        this.state.scrollListener = false
        this.forceUpdate()
        setTimeout( function() {
            _this.state.scrollListener = true
            _this.forceUpdate()
        }, 2000 )
    }
    listenScrollEvent = ( e ) => {
        //e.preventDefault()
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
        const windowBottom = windowHeight + window.pageYOffset;
        const top = ( window.pageYOffset || html.scrollTop ) - ( html.clientTop || 0 );
        if ( windowBottom >= docHeight && top !== 0 ) {
            window.removeEventListener( "scroll", ( ex ) => this.listenScrollEvent( e ) );
            ( top >= 200 ) && this.props.setScroll( window.scrollY )
            switch ( this.props.globalfeed.screen ) {
                case screens.FEED_SCREEN:
                    if ( this.props.globalfeed.next !== null ) {
                        if ( !this.props.globalfeed.loading && top !== 0 ) {
                            if ( this.props.globalfeed.currentProfile === undefined ) {

                                if ( this.props.local !== undefined ) {
                                    this.props.fetchLocalPosts( this.props.globalfeed.next )
                                } else {
                                    this.props.fetchPosts( this.props.globalfeed.next )
                                }
                            } else {
                                this.props.fetchPostsForUser( this.props.globalfeed.currentProfile.username, this.props.globalfeed.next )
                            }
                        }

                    }
                    break;
                case screens.SEARCH_SCREEN:

                    break;
                case screens.NOTIFICATIONS_SCREEN:
                    if ( this.props.notifications.next !== null ) {
                        this.props.all ? this.props.fetchNotifications( this.props.notifications.next ) :
                            this.props.fetchNotificationsUnread( this.props.notifications.next )
                    }

                    break;
                case screens.FRIENDS_SCREEN:

                    break;
            }
            console.log( "bottom" )
        }


    }
    logoutHandler() {
        auth.logout()
    }

    renderLoading() {
        return (
            <div>
                <nav style={{ fontSize: '45px' }} className="border-md lo-white text-center nav navbar navbar-fixed-top">
                    Loading...
					</nav>
                <div className="col-sm-12">
                    <img style={{ height: '250px' }} className="loading" src="/static/img/420-logo-wm.png" />

                </div>
            </div>
        )
    }

    render() {
        let { user, single, globalfeed, local, search, friends, notifications, all, deleted, history, routing, current_profile } = this.props

        var chatComponent
        var mainComponent
        switch ( this.props.screen ) {
            case screens.FEED_SCREEN:
                mainComponent = <GetGlobalFeed
                    local={local}
                    single={single !== undefined ? single : false}
                    currentProfile={current_profile !== null ? current_profile : globalfeed.currentProfile}
                    setScroll={this.props.setScroll}
                    scrollListener={this.scrollListener}
                    fetchPosts={this.props.fetchPosts}
                    fetchLocalPosts={this.props.fetchLocalPosts}
                    setCurrentProfile={this.props.setCurrentProfile}
                    currentProfileActivator={this.currentProfileActivator}
                    singlePostActivator={this.singlePostActivator}
                    fetchPostsForUser={this.props.fetchPostsForUser} />
                break;
            case screens.SEARCH_SCREEN:
                mainComponent = <SearchPage
                    fetchPosts={this.props.fetchPosts}
                    currentProfileActivator={this.currentProfileActivator}
                    fetchPostsForUser={this.props.fetchPostsForUser}
                    search_screen={this.props.search_screen}
                />
                break;
            case screens.NOTIFICATIONS_SCREEN:
                mainComponent = <NotificationPage
                    all={all}
                    deleted={deleted}
                    history={history}
                    routing={routing}
                    singlePostActivator={this.singlePostActivator}
                    currentProfileActivator={this.currentProfileActivator}
                    fetchNotifications={this.props.fetchNotifications}
                    fetchNotificationsUnread={this.props.fetchNotificationsUnread}

                />
                break;
            case screens.FRIENDS_SCREEN:
                if ( !friends.loading && friends.objects !== undefined ) {
                    //mainComponent = <FriendPage />
                }
                break;
            case screens.SETTINGS:
                mainComponent = <SettingsPage type={this.props.type} user={globalfeed.user} />
        }
        //}
        console.log( this.props.screen )
        return (
            <div className="content-flex">
                <NavBar key={"navbar"}
                    currentProfile={this.props.globalfeed.currentProfile !== undefined ? true : false}
                    user={this.props.globalfeed.user}
                    screen={this.props.screen}
                    search_screen={this.props.search.screen}
                    currentProfileActivator={this.currentProfileActivator}
                    handleHashTagsClick={this.handleHashTagsClick}
                    handlePostsClick={this.handlePostsClick}
                    handleSettingsClick={this.handleSettingsClick}
                    handleNotificationsClick={this.handleNotificationsClick}
                    handleUsersClick={this.handleUsersClick}
                    handleFriendsClick={this.handleFriendsClick}
                    handleFollowingClick={this.handleFollowingClick}
                    handleFollowersClick={this.handleFollowersClick}
                    openSearchPage={this.handleSearchClick}
                    handleFeedClick={this.handleFeedClick} />
                {this.props.chat.rooms !== undefined && globalfeed.user !== undefined && <Root key="chat_" />}
                <div className="main-component">
                    {mainComponent}
                </div>
                <LeftSidebarContainer 
                    onAboutMeClick={this.handleAboutMeClick} 
                    onUsernameClick={this.handleUsernameClick}
                    onBirthdayClick={this.handleBirthdayClick}
                    onEmailClick={this.handleEmailClick}
                    onGenderClick={this.handleGenderClick} 
                    onGeneralClick={this.handleGeneralClick} 
                    onCPasswordClick={this.handleCPasswordClick} 
                    onLPasswordClick={this.handleLPasswordClick} 
                    onPrivacyClick={this.handlePrivacyClick} 
                    onStatusClick={this.handleStatusClick}
                    onInterestedClick={this.handleInterestedClick}/>
            </div>
        )
    }
}

const mapStateToProps = function( state, ownProps ) {
    return {
        globalfeed: state.globalfeed,
        friends: state.friends,
        notifications: state.notifications,
        search: state.search,
        chat: state.chat,
        routing: state.routing
    };
}
const mapDispatchToProps = ( dispatch, props ) => {
    return {
        push: ( url ) => { console.log( props ), props.history.push( url ) },
        resetSearchNextPrevious: () => { dispatch( searchActions.resetNextPrevious() ) },
        resetNextPrevious: () => { dispatch( postActions.resetNextPrevious() ) },
        setCurrentIndex: ( index ) => { dispatch( postActions.setCurrentIndex( index ) ) },
        setSinglePost: ( value ) => {
            dispatch( postActions.setSinglePost( value ) )
        },
        setActivePost: ( value ) => {
            //dispatch(postActions.resetNextPrevious()),
            dispatch( postActions.setActivePost( value ) )
        },
        fetchCurrentUser: () => dispatch( postActions.fetchCurrentUser( localStorage.token ) ),
        setCurrentUser: ( user ) => dispatch( postActions.setCurrentUser( user ) ),
        fetchPosts: ( next = null ) => { dispatch( postActions.fetchPosts( next ) ) },
        fetchLocalPosts: ( next = null ) => { dispatch( postActions.fetchLocalPosts( next ) ) },
        setCurrentProfile: ( value ) => { dispatch( postActions.setCurrentProfile( value ) ) },
        fetchPostsForUser: ( token, next = null ) => { dispatch( postActions.fetchPostsForUser( token, next ) ) },
        switchAppScreen: ( globalscreen, screen, route=undefined, top = 0 ) => {
            console.log(globalscreen,screen)
            if ( globalscreen !== screen ) {
                ( top !== 0 ) && dispatch( postActions.setScroll( top ) )
                dispatch( appActions.switchAppScreen( screen ) )
                switch ( screen ) {
                    case screens.NOTIFICATIONS_SCREEN: {
                        props.history.push( routes.NOTIFICATIONS )
                        break;
                    }
                    case screens.FEED_SCREEN: {

                        props.history.push( routes.ROUTE_ROOT )
                        break;
                    }
                    case screens.SEARCH_SCREEN: {
                        props.history.push( routes.SEARCH )
                        break;
                    }
                    case screens.SETTINGS: {
                        props.history.push( route )
                        break;
                    }
                    default:
                        break;

                }
            }else{
                if(screen === screens.SETTINGS){
                    dispatch( appActions.switchAppScreen( screen ) )
                    props.history.push( route )
                }
            }
        },
        switchSearchScreen: ( screen, desired_screen ) => {

            if ( screen !== desired_screen ) {
                dispatch( searchActions.resetNextPrevious() )
                dispatch( searchActions.updateSearchScreen( desired_screen ) )

            } switch ( desired_screen ) {
                case screens.POSTS_SCREEN: {
                    props.history.push( routes.SEARCH_POSTS )
                    break;
                }
                case screens.FOLLOWING_SCREEN: {
                    props.history.push( routes.SEARCH_FOLLOWING )
                    break;
                }
                case screens.FRIEND_SCREEN: {
                    props.history.push( routes.SEARCH_FRIENDS )
                    break;
                }
                case screens.FOLLOWERS_SCREEN: {
                    props.history.push( routes.SEARCH_FOLLOWERS )
                    break;
                }
                case screens.USERS_SCREEN: {
                    props.history.push( routes.SEARCH_USERS )
                    break;
                }
                case screens.HASHTAG_SCREEN: {
                    props.history.push( routes.SEARCH_HASHTAGS )
                    break;
                }
                default: {
                    break;
                }
            }
        },
        fetchNotifications: ( next = null ) => {
            dispatch( notificationActions.fetchNotificationsAll( next ) )
        },
        fetchNotificationsUnread: ( next = null ) => {
            dispatch( notificationActions.fetchNotificationsUnread( next ) )
        },
        openFeed: ( screen, currentProfile, local = false ) => {
            // only need to fetch posts if the user was on a profile page
            // otherwise keep old posts from history
            if ( currentProfile | local ) {
                dispatch( setCurrentProfile( "" ) )
                dispatch( postActions.setScroll( 0 ) )
                dispatch( postActions.resetNextPrevious() )
                dispatch( postActions.fetchPosts() )
            }
            dispatch( appActions.switchAppScreen( screens.FEED_SCREEN ) )
            props.history.push( routes.ROUTE_ROOT )

        },
        openSearchPage: ( screen ) => {
            screen !== screens.SEARCH_SCREEN &&
                dispatch( appActions.switchAppScreen( screen, screens.SEARCH_SCREEN ) )
        },
        setScroll: ( scroll ) => {
            dispatch( postActions.setScroll( scroll ) )
        },
        loginChatUser: ( user ) => { dispatch( loginUser( user ) ) }

    }
}

export default connect( mapStateToProps, mapDispatchToProps )( App1Container)