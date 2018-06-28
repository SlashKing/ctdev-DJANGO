import React from "react"
import { connect } from "react-redux"
import * as searchActions from "../actions/searchActions"
import SinglePost from "../components/SinglePost"
import {
    FRIEND_SCREEN,
    HASHTAG_SCREEN,
    POSTS_SCREEN,
    USERS_SCREEN,
    FOLLOWERS_SCREEN,
    FOLLOWING_SCREEN
} from "../common/constants/screens"

export class SearchPage extends React.Component {
    constructor( props ) {
        super( props )
        this.timer = null
    }
    componentWillUnmount() {
        window.removeEventListener( "scroll", ( e ) => this.listenScrollEvent( e ) );
    }

    componentDidMount() {
        window.addEventListener( "scroll", ( e ) => this.listenScrollEvent( e ) );
    }
    listenScrollEvent = ( e ) => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
        const windowBottom = windowHeight + window.pageYOffset;
        console.log( windowHeight + window.pageYOffset )
        if ( windowBottom >= docHeight ) {
            switch ( this.props.search_screen ) {
                case FRIEND_SCREEN:
                    this.props.fetchFriends( this.props.search_text )
                    break;
                case HASHTAG_SCREEN:
                    this.props.fetchHashtags( this.props.search_text )
                    break;
                case POSTS_SCREEN:
                    this.props.fetchPosts( this.props.search_text )
                    break;
                case USERS_SCREEN:
                    this.props.fetchUsers( this.props.search_text )
                    break;
                case FOLLOWERS_SCREEN:
                    this.props.fetchFollowers( this.props.search_text )
                    break;
                case FOLLOWING_SCREEN:
                    this.props.fetchFollowing( this.props.search_text )
                    break;
                default:
                    break;
            }
        }
    }
    componentDidMount() {
        // switch screen to determine what to fetch
        // check if [search.[object_type] is undefined to determine 
        // whether we need to fetch information
        // *** this is not necessarily an important feature ***
        switch ( this.props.search_screen ) {
            case FRIEND_SCREEN:
                this.props.fetchFriends( this.props.search_text )
                break;
            case HASHTAG_SCREEN:
                this.props.fetchHashtags( this.props.search_text )
                break;
            case POSTS_SCREEN:
                this.props.fetchPosts( this.props.search_text )
                break;
            case USERS_SCREEN:
                this.props.fetchUsers( this.props.search_text )
                break;
            case FOLLOWERS_SCREEN:
                this.props.fetchFollowers( this.props.search_text )
                break;
            case FOLLOWING_SCREEN:
                this.props.fetchFollowing( this.props.search_text )
                break;
            default:
                break;
        }

    }
    toggleScreen = ( screen, e ) => {
        this.props.toggleScreen( screen )
    }
    keyDown = ( e ) => {

    }
    triggerChange = () => {
        this.props.updateSearchResults( this.props.search_screen, this.props.search_text )
    }
    updateResults = ( e ) => {
        clearTimeout( this.timer );
        this.props.updateSearchText( e.target.value )
        this.timer = setTimeout( this.triggerChange, 1000 );

    }
    renderTopButtons() {
        return (
            <div className="btn-group notice-btns">
                <span className="col-xs-4 btn glyphicon glyphicon-user btn-success border-sm lo-white"
                    onClick={( e ) => this.toggleScreen( FRIEND_SCREEN, e )}></span>
                <span className="col-xs-4 no-pad border-sm lobster lo-white btn btn-success"
                    onClick={( e ) => this.toggleScreen( HASHTAG_SCREEN, e )}>#</span>
                <span className="col-xs-4 glyphicon glyphicon-leaf btn-success border-sm lo-white btn btn-success"
                    onClick={( e ) => this.toggleScreen( POSTS_SCREEN, e )}></span>
            </div>
        )
    }
    header = ( text ) => {
        return <h1 key="search_header" className="lobster lo-white border-md text-center">{text}</h1>
    }
    renderSearchBar() {
        var nodes = []
        var header = ( text ) => { }
        switch ( this.props.search_screen ) {
            case FRIEND_SCREEN:
                header = this.header( 'Friends' )
                break;
            case HASHTAG_SCREEN:
                header = this.header( 'Hashtags' )
                break;
            case POSTS_SCREEN:
                header = this.header( 'Posts' )
                break;
            case USERS_SCREEN:
                header = this.header( 'Users' )
                break;
            case FOLLOWERS_SCREEN:
                header = this.header( 'Followers' )

                break;
            case FOLLOWING_SCREEN:
                header = this.header( 'Following' )
                break;
            default:
                break;
        }
        const node = (
            <div key="search_input" className="search-input input-group controls">
                <div className="input-group-addon">
                    <i className="glyphicon glyphicon-search border-sm lo-white"></i>
                </div>
                <input onChange={!this.props.loading ? ( e ) => this.updateResults( e ) : undefined} value={this.props.search_text} type="text" name="q"
                    className="auto form-control"
                    style={{ width: '100%', height: '40px', fontSize: '16px' }}
                />
            </div>
        )
        nodes.push( header )
        nodes.push( node )
        return nodes
    }
    renderSearchResults() {
        var nodes = []
        if ( this.props.objects !== undefined ) {
            switch ( this.props.search_screen ) {
                case FRIEND_SCREEN:
                    for ( var i = 0; i < this.props.objects.length; i++ ) {
                        const friend = this.props.objects[i]
                        const friend_node = (
                            <div key={'friend_item_' + friend.to_user.id}>
                                <div className="border-sm lo-white lobster">{friend.to_user.username}</div>
                                <hr className="fancy" />
                            </div> )
                        nodes.push( friend_node )
                    }
                    return nodes


                    break;
                case HASHTAG_SCREEN:
                    for ( var i = 0; i < this.props.objects.length; i++ ) {
                        const this_hash = this.props.objects[i]
                        const hash_node = (
                            <div key={'hashtag_item_' + i}>
                                <div className="border-sm lo-white lobster">#{this_hash.name}</div>
                                <hr className="fancy"></hr>
                            </div>
                        )
                        nodes.push( hash_node )
                    }
                    return nodes

                    break;
                case POSTS_SCREEN:
                    for ( var i = 0; i < this.props.objects.length; i++ ) {
                        const this_post = this.props.objects[i]
                        const post_node = (
                            <div key={'post_item_container' + this_post.id}>
                                <SinglePost
                                    index={i}
                                    key={'post_item_' + this_post.id}
                                    post={this_post}
                                    search={'true'}
                                    currentProfileActivator={this.props.currentProfileActivator}
                                    fetchPostsForUser={this.props.fetchPostsForUser}
                                    fetchPosts={this.props.fetchPosts}
                                    isSinglePost={this.props.isSinglePost}
                                />
                            </div> )
                        nodes.push( post_node )
                    }
                    return nodes

                    break;
                case USERS_SCREEN:
                    for ( var i = 0; i < this.props.objects.length; i++ ) {
                        let user = this.props.objects[i]
                        let user_node = (
                            <div key={'user_item_' + user.id} className="user-card border-sm lo-white lobster">
                                <img className="p_cover img-thumbnail img-rounded" src={user.profile.cover_image_url} />
                                <img onClick={(e)=>this.props.currentProfileActivator(user,e)} className="p_img_round user-card-img low-opac img-thumbnail drop-shadow" src={user.profile.profile_image} />
                                {user.username}

                                <hr className="fancy" />
                            </div>
                        )
                        nodes.push( user_node )
                    }
                    return nodes
                    break;
                case FOLLOWERS_SCREEN:
                    for ( var i = 0; i < this.props.objects.length; i++ ) {
                        const this_follower = this.props.objects[i].follower
                        const follow_node = (
                            <div key={'follower_item_' + this_follower.id} >
                                <div className="border-sm lo-white lobster">{this_follower.username}</div>
                                <hr className="fancy"></hr>
                            </div> )
                        nodes.push( follow_node )
                    }
                    return nodes

                    break;
                case FOLLOWING_SCREEN:

                    for ( var i = 0; i < this.props.objects.length; i++ ) {
                        const this_following = this.props.objects[i].followee
                        const following_node = (
                            <div key={'following_item_' + this_following.id} >
                                <div className="border-sm lo-white lobster">
                                    {this_following.username}
                                </div>
                                <hr className="fancy"></hr>
                            </div> )
                        nodes.push( following_node )
                    }
                    return nodes

                    break;
                default:
                    break;
            }
        }
    }
    render() {
        return (
            <div className="search-page">
                <div>{this.renderSearchBar()}</div>
                <hr className="fancy" />
                <div className="search-list" id={this.props.search_screen === POSTS_SCREEN ? 'posts' : null} >
                    <div>{this.renderSearchResults()}</div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = function( state, ownProps ) {
    return {
        loading: state.search.loading,
        is_typing: state.search.is_typing,
        global_screen: state.globalfeed.screen,
        search_text: state.search.text,
        friends: state.search.friends,
        hashtags: state.search.hashtags,
        followers: state.search.followers,
        following: state.search.following,
        objects: state.search.objects,
        users: state.search.users,
        posts: state.search.search_posts,
        isSinglePost: state.globalfeed.isSinglePost
    }
}
const mapDispatchToProps = function( dispatch, props ) {
    return {
        updateTyping: ( is_typing ) => { dispatch( searchActions.updateTyping( is_typing ) ) },
        fetchFriends: ( text, user ) => { dispatch( searchActions.fetchFriends( text ) ) },
        fetchHashtags: ( text ) => { dispatch( searchActions.fetchHashtags( text ) ) },
        fetchPosts: ( text ) => { dispatch( searchActions.fetchPosts( text ) ) },
        fetchUsers: ( text ) => { dispatch( searchActions.fetchUsers( text ) ) },
        fetchFollowers: ( text ) => { dispatch( searchActions.fetchFollowers( text ) ) },
        fetchFollowing: ( text ) => { dispatch( searchActions.fetchFollowing( text ) ) },
        toggleScreen: ( screen ) => { dispatch( searchActions.updateSearchScreen( screen ) ) },
        updateSearchText: ( text ) => { dispatch( searchActions.updateSearchText( text ) ) },
        updateSearchResults: ( screen, text ) => {
            switch ( screen ) {
                case USERS_SCREEN:
                    dispatch( searchActions.fetchUsers( text ) )
                    break;
                case HASHTAG_SCREEN:
                    dispatch( searchActions.fetchHashtags( text ) )
                    break;
                case FRIEND_SCREEN:
                    dispatch( searchActions.fetchFriends( text ) )
                    break;
                case FOLLOWERS_SCREEN:
                    dispatch( searchActions.fetchFollowers( text ) )
                    break;
                case FOLLOWING_SCREEN:
                    dispatch( searchActions.fetchFollowing( text ) )
                    break;
                case POSTS_SCREEN:
                    dispatch( searchActions.fetchPosts( text ) )
                    break;
                default:
                    break;
            }
        }
    }
}
export default connect( mapStateToProps, mapDispatchToProps )( SearchPage)