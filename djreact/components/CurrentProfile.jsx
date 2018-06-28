import React from 'react'
import { connect } from 'react-redux'
import CommentListPost from '../components/CommentListPost'
import FriendButton from '../components/FriendButton'
import FollowButton from '../components/FollowButton'
//import SinglePost from '../components/SinglePost'
//import NewPostForm from '../components/NewPostForm'
import * as postActions from '../actions/postActions'
import ImageCrop from '../components/ImageCrop'
import { is_this_user } from "../utils"
export class CurrentProfile extends React.Component {
    constructor( props ) {
        super( props );
    }
    componentDidMount() {
        console.log( "__CurrentProfile__componentDidMount" )
    }
    componentWillUnmount() {

    }
    updateCoverImageFile = ( e ) => {
        console.log( e )
    }
    render() {
        var hide_css = { display: 'none' }
        let { user, setScroll } = this.props
        let postNodes = []
        if ( user !== 'error' && user.profile !== undefined ) {
            const check_user = is_this_user( user.id, localStorage.user_id )
            const profile = user.profile
            let node = (
                !profile.is_private ? (
                    <div key={'profile_header' + user.id}>
                        <div className={'cover-image-container'}>
                            {check_user ? (
                                <ImageCrop
                                    type="cover"
                                    index="1"
                                    initial={profile.cover_image_url} /> ) : (

                                    <div className="p_cover">
                                        <img src={profile.cover_image_url} />
                                    </div> )}

                            {check_user ?
                                <ImageCrop
                                    type='profile'
                                    index='2'
                                    initial={profile.profile_image}
                                    check_user={check_user} /> :
                                <div className="profile-image-wrapper">
                                    <img className={'p_img_round img-thumbnail drop-shadow-lt'}
                                        style={{ zIndex: '0' }}
                                        src={profile.profile_image} />
                                </div>}
                        </div>


                        <span className={'user-actions pull-right text-right'}
                            style={{ width: '100%', marginRight: "-6px" }}>
                            <ul className={'nav nav-pills list-inline users profile'}>
                                <li className={'border-md lobster lo-white'}>{user.username}</li>
                                {!check_user ? (
                                    <li className="border-sm lo-white" style={{ right: '-12px' }}>
                                        <FriendButton
                                            setScroll={setScroll}
                                            from_user={localStorage.user_id}
                                            request_sent={user.request_sent}
                                            request_rejected={user.request_rejected}
                                            request_received={user.request_received}
                                            are_friends={user.are_friends}
                                            current_user={user.id}></FriendButton></li> ) : ( '' )}

                                {!check_user ? ( <li><FollowButton is_following={user.is_following} user={user}></FollowButton></li> ) : (
                                    null )}

                            </ul>

                        </span>
                        {check_user &&
                            <ImageCrop type="post" index="1" />
                        }
                    </div>
                ) : (
                        <div className={'alert alert-danger text-center border-md'}>This user's profile has been hidden</div>
                    )
            )
            postNodes.push( node )
        } else {
            postNodes.push( <h1 className='alert alert-danger lo-white border-md'>No users matching the requested username</h1> )
        }

        return (
            <div>{postNodes}</div>
        )
    }
}
const mapStateToProps = function( store, ownProps ) {
    return {
        user: store.globalfeed.currentProfile
    };
}

const mapDispatchToProps = ( dispatch ) => {
    return {

    }
}
export default connect( mapStateToProps, mapDispatchToProps )( CurrentProfile)