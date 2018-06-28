import React from "react"
import { connect } from "react-redux"
import { is_this_user } from "../utils"
import SinglePost from "../components/SinglePost"
import SinglePostModal from "../components/SinglePostModal"
import CurrentProfile from "../components/CurrentProfile"
import Modal from 'react-modal';
//import * from "../common/constants/endpoints/config"
export class GetGlobalFeed extends React.Component {
    constructor( props ) {
        super( props );
    }
    componentWillMount() {
        console.log( 'componentWillMount__GetGlobalFeed' )
    }
    componentDidMount() {
        let { posts, user, loading, scroll, currentProfile,local} = this.props
        if ( !loading ) {
            if ( currentProfile !== undefined ) {
                this.props.setCurrentProfile(currentProfile)
                this.props.fetchPostsForUser( currentProfile.username )
            } else {
                //this.props.setCurrentProfile(currentProfile)
                local !== undefined ? this.props.fetchLocalPosts() : this.props.fetchPosts()
            }
        }
        window.scrollTo( 0, scroll )
        console.log( 'componentMount__GetGlobalFeed' )
    }
    componentDidUpdate( nextProps, nextState ) {
        console.log("GetGlobalFeed: componentDidUpdate" ,nextProps, nextState)
        
        //window.scrollTo( 0, this.props.scroll )
    }
    componentWillUnmount() {
        console.log( "componentWillUnmount__GetGlobalFeed" )
    }

    render() {
        const customStyles = {
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                minWidth: '50%',
                maxWidth: '942px',
                maxHeight: '85%',
                overflowY: 'auto',
                borderRadius: '20px',
                transform: 'translate(-50%, -50%)'
            },
            overlay: {
                backgroundColor: 'rgba(0,0,0,0.55)'
            }
        };
        const currentuser = localStorage.user_id
        let { posts, user, currentIndex, currentProfile, isSinglePost, activePost, loading } = this.props

        let postNodes = []
        let header = []
        // Profile currently being viewed
        if ( currentProfile !== undefined && !loading) {
            let header_node = ( <CurrentProfile key={'header-current-profile'} setScroll={this.props.setScroll} user={currentProfile}/> )
            header.push( header_node )
        }
        if ( posts !== undefined  ) {
            let length = posts.length
            if ( isSinglePost ) {
                header.push(
                    <Modal style={customStyles} key={'modal-single-post'} isOpen={isSinglePost} onRequestClose={( e ) => this.props.singlePostActivator( '', e )}>
                        <SinglePostModal
                            setScroll={this.props.setScroll}
                            scrollListener={this.props.scrollListener}
                            index={currentIndex}
                            post={activePost}
                            currentProfile={currentProfile}
                            singlePostActivator={this.props.singlePostActivator}
                            currentProfileActivator={this.props.currentProfileActivator}
                            fetchPostsForUser={this.props.fetchPostsForUser}
                            fetchPosts={this.props.fetchPosts}
                            isSinglePost={isSinglePost} />
                    </Modal> )
            }
            for ( var index = 0; index < length; index++ ) {
                let post = posts[index]
                let node = (
                    <SinglePost
                        setScroll={this.props.setScroll}
                        scrollListener={this.props.scrollListener}
                        index={index}
                        key={currentProfile !== undefined ? 'profile_post_'+post.id: 'post_' + post.id}
                        post={post}
                        currentProfile={currentProfile}
                        singlePostActivator={this.props.singlePostActivator}
                        currentProfileActivator={this.props.currentProfileActivator}
                        fetchPostsForUser={this.props.fetchPostsForUser}
                        fetchPosts={this.props.fetchPosts}
                        isSinglePost={this.props.isSinglePost} /> )
                postNodes.push( node )
            }
        }
        return (
            <div className="inner-wrapper">
                <div key={'header'} id="feed_header">{header}</div>
                <div key={'posts'} id="posts">{!loading ? postNodes : 'loading...'}</div>
                <div key={'clearfix'} className={'visible-xs-block clearfix'}></div>
            </div>
        )
    }
}
const mapStateToProps = function( store, ownProps ) {
    return {
        currentIndex: store.globalfeed.currentIndex,
        posts: store.globalfeed.posts,
        user: store.globalfeed.user,
        scroll: store.globalfeed.currentScroll,
        activePost: store.globalfeed.activePost,
        isSinglePost: store.globalfeed.isSinglePost,
        loading: store.globalfeed.loading
    };
}
const mapDispatchToProps = ( dispatch, props ) => {
    return {
    }
}
export default connect( mapStateToProps, mapDispatchToProps )(GetGlobalFeed)