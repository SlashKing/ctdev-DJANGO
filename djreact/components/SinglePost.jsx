import React from 'react'

// Components
import CommentListPost from '../components/CommentListPost'
import RemovePost from '../components/RemovePost'
import LikesButton from '../components/LikesButton'
import FollowButton from '../components/FollowButton'
import FriendButton from '../components/FriendButton'
import PlusMinusButton from '../components/PlusMinusButton'
import NewCommentForm from '../components/NewCommentForm'
import FocusableImage from '../components/FocusableImage'

// Actions
import * as postActions from '../actions/postActions'

// Bootstrap
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

// Redux and Utils
import { connect } from 'react-redux'
import { is_this_user } from '../utils'

export class SinglePost extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            hide_form: true,
            collapsed: false,
            edit_post: false,
            post_text: props.post.text
        }
    }
    toggle() {
        this.setState( { collapsed: !this.state.collapsed } )
    }
    showForm = ( e ) => {
        this.setState( { hide_form: false } )
    }
    hideForm = ( e ) => {
        this.setState( { hide_form: true } )
    }
    edit = ( e ) => {
        e.preventDefault()
        this.setState( { edit_post: true } )
    }
    saveChanges = ( text, index, id, search_index = undefined, e ) => {
        this.setState( { edit_post: false } )
        this.props.updatePost( text, index, id, search_index )
    }
    cancelEdit = ( e ) => {
        e.preventDefault()
        this.setState( { edit_post: false } )
        this.setState( { post_text: this.props.post.text } )
    }
    updateTextArea = ( e ) => {
        e.preventDefault()
        this.setState( { post_text: e.target.value } )
    }
    componentDidMount() {
    }
    componentWillUnmount() {

    }
    componentDidUpdate() {
    }
    removePost = ( idx, id, search, e ) => {
        e.preventDefault()
        this.props.removePost( id )
    }

    render() {
        // Tooltips
        const tooltip = ( <Tooltip id={'comments-collapse'}>{!this.state.collapsed ? 'Expand Comments' : 'Shrink Comments'}</Tooltip> )
        const p_tooltip = ( <Tooltip id={'comment-user-tip'}>Visit Profile</Tooltip> )

        const state = this.props;
        let { post, user, index } = this.props
		console.log(post)
        const currentuser = user.id
        let postNodes = []
        let comments_set = post.comments_set

        const is_currentuser_post = is_this_user( currentuser, post.user.id )

        const editPost = !this.state.edit_post ?
            this.edit : ( e ) => this.saveChanges(
                this.state.post_text, index, post.id, state.search )

        // Comments Toggle Form
        var hideShow = this.state.hide_form ?
            this.showForm : this.hideForm

        // Comments Security Data from Server
        var sec_data = post.security_data.split( '|' )

        // Post images
        var pictures = []

        post.pictures.map( picture =>
            pictures.push(
                <FocusableImage key={picture.id + '_focusable_post'}
                    col_style={''} styles={'img-thumbnail'} src={picture.file} /> )
        )
        let node = (
            <div key={"single_post_" + post.id}>
                <ul className={'col-xs-12 list-inline text-left'}>
                    {state.currentProfile === undefined && (
                        // show round profile thumbnail on each post when not on profile page

                        <a className={'border-sm lo-white lobster'}>
                            <OverlayTrigger placement="bottom" overlay={p_tooltip}>
                                <img onClick={() => this.props.currentProfileActivator( post.user )}
                                    className={'u_img_round drop-shadow low-opac'}
                                    src={post.user.profile.profile_image} />
                            </OverlayTrigger>
                            {post.user.username}
                        </a>
                    )}

                    {is_currentuser_post ? (
                      /***  if (logged in users post && on profile page && is your profile
                       **   result: show dropdown to remove, edit, and focus post
                       ***/
                        <li className={'dropdown'}>
                            <i data-toggle="dropdown"
                                id={'dropdownMenu' + post.id}
                                aria-haspopup={'true'}
                                aria-expanded={'true'}
                                className={'option-dropdown-post dropdown-toggle glyphicon glyphicon-option-vertical border-sm lo-red low-opac'}>
                            </i>
                            <ul className={'dropdown-menu'}
                                aria-labelledby={'dropdownMenu' + post.id}
                                role={'menu'}>
                                <li>
                                    <RemovePost
                                        onClick={( e ) => this.removePost( index, post.id, state.search, e )}
                                        value={post.id}
                                        index={index} />
                                </li>
                                <li>
                                    <a onClick={editPost}>
                                        {!this.state.edit_post ? "Edit Post" : "Save Changes"}
                                    </a>
                                </li>
                                {this.state.edit_post && (
                                    // add cancel edit list item
                                    <li><a onClick={this.cancelEdit}>Cancel Edit</a></li>
                                )}
                                <li>
                                    <a onClick={
                                        ( e ) => this.props.singlePostActivator( post, index, e )}>
                                        {state.isSinglePost ? "Show Feed" : "Focus Post"}</a>
                                </li>

                            </ul>
                        </li>

                    ) : ( state.currentProfile === ( undefined ) && (
                        /*** if not on a profile page
                         **  result: show FriendButton
                         ***/
                        <li key={'friends_' + index} ><FriendButton
                            scrollListener={this.props.scrollListener}
                            setScroll={this.props.setScroll}
                            key={'friends_' + index} index={index}
                            post={'true'}
                            object={post}
                            from_user={currentuser}
                            request_sent={post.user.request_sent}
                            request_rejected={post.user.request_rejected}
                            request_received={post.user.request_received}
                            are_friends={post.user.are_friends}
                            current_user={post.user.id}
                        /></li> ) )}
                </ul>
                <hr className={'fancy'} />
                <div className="the-post">
                    <div className="pad-lr-3 post-date text-center">
                        <div className="timesince-post">
                            {post.timesince_post}
                        </div>
                    </div>
                    <p className={'post-text border-md lo-white lobster mine'}>
                        {this.state.edit_post ?
                            <textarea
                                value={this.state.post_text}
                                onChange={this.updateTextArea}
                                className={'form-control'} /> :
                            post.text
                        }
                    </p>
                </div>
                {
                    /** PICTURES ***
                     * switch class when there is only one image
                     *  use CSS to produce masonry columns otherwise
                     */
                }
                <div key={'pictures_' + post.id} className={pictures.length > 0 && pictures.length > 1 ?
                    'post-images-container' :
                    'post-image-container'}>
                    {pictures}
                </div>
                <hr key={'hr2' + post.id} className={'fancy'} />
                {
                    /* Button Group 
                     *
                     * LikesButton FollowButton 
                     */               }
                <div key={'post_buttons_' + post.id} className={'text-center'}>
                    <div className={'btn-group text-center'}>
                        <LikesButton index={index} object={post} search={this.props.search} />
                        {!is_currentuser_post &&
                            this.props.currentProfile === undefined && (
                                <FollowButton
                                    index={index}
                                    is_following={post.user.is_following}
                                    search={this.props.search}
                                    object={post}
                                    user={post.user} />
                            )
                        }

                        <OverlayTrigger placement="bottom" overlay={tooltip}>
                            <span style={{ fontSize: '16px' }}
                                onClick={() => this.toggle()}
                                className={'drop-shadow-lt btn-xs btn btn-default lobster comment-toggle'}
                                data-toggle={'collapse'}
                                aria-expanded={'false'}
                                data-target={'#comments-' + post.id}>
                                Comments <span id={'comment-count-' + post.id}>
                                    <sup>{comments_set.length}</sup></span>
                            </span>
                        </OverlayTrigger>
                        <PlusMinusButton
                            onClick={hideShow}
                            show_hide={this.state.hide_form} />
                    </div>{!this.state.hide_form &&
                        ( <NewCommentForm
                            target_object={post.id}
                            content_type_id={post.this_content_type.id}
                            content_type={post.this_content_type.app_label + "." + post.this_content_type.model}
                            security_hash={sec_data[0]}
                            timestamp={sec_data[1]}
                            index={index}
                            search={this.props.search} /> )}

                </div>
            </div>
        )

        postNodes.push( node )
        if ( comments_set != null ) {
            let node_comment_list = (
                <CommentListPost
                    key={'comments-' + post.id}
                    user={user} profile_activator={this.props.currentProfileActivator}
                    search={this.props.search}
                    post={post.id}
                    comments_set={post.comments_set}
                    security_data={post.security_data}
                    content_type={post.this_content_type.app_label + "." + post.this_content_type.model}
                    content_type_id={post.this_content_type.id} index={index}
                />
            )
            postNodes.push( node_comment_list )
            postNodes.push( <hr key={'hr' + post.id} className="fancy" /> )
        }


        return ( <div className={'single-post-' + post.id}> {postNodes} </div> )
    }
}
const mapStateToProps = function( store, ownProps ) {
    return {
        loading: store.globalfeed.loading,
        post: ownProps.search === 'true' ? store.search.objects[ownProps.index] : store.globalfeed.posts[ownProps.index],
        currentProfile: ownProps.currentProfile,
        isSinglePost: ownProps.isSinglePost,
        user: store.globalfeed.user
    };
}

const mapDispatchToProps = ( dispatch ) => {
    return {
        updatePost: ( text, index, id, search_index ) => {
            console.log( search_index, "search_index" )
            dispatch( postActions.updatePost( text, index, id, search_index ) )
        },
        removePost: ( id ) => { dispatch( postActions.deletePost( localStorage.token, id ) ) },
        setSinglePost: ( value ) => {
            dispatch( postActions.setSinglePost( value ) )
        },
        setActivePost: ( value ) => { dispatch( postActions.setActivePost( value ) ) },
        //fetchPosts: (token) => {dispatch(postActions.fetchPosts(token))}
    }
}
export default connect( mapStateToProps, mapDispatchToProps )( SinglePost)