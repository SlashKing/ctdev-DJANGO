import React from "react"
import { connect } from "react-redux"
import { is_this_user } from "../utils"
import LikesButton from "../components/LikesButton"
import PlusMinusButton from "../components/PlusMinusButton"
import NewCommentForm from "../components/NewCommentForm"
import RemoveComment from "../components/RemoveComment"
import * as commentActions from "../actions/commentActions"
import { Tooltip, OverlayTrigger } from "react-bootstrap"
//import * from "../common/constants/endpoints/config"
export class SingleComment extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            edit_comment: false,
            comment_text: props.item.comment
        }
    }
    removeComment = ( e ) => {
        e.preventDefault()
        const _this = this
        _this.setState( { loading: true } )
        setTimeout( function() {
            _this.setState( { loading: false } )
        }, 1500 )
        this.props.dispatch( commentActions.removeComment( this.props.item.id, this.props.post_index, this.props.index, this.props.search ) )
    }
    edit = ( e ) => {
        e.preventDefault()
        this.setState( { edit_comment: true } )
    }
    saveChanges = ( e ) => {
        this.setState( { edit_comment: false } )
        this.props.dispatch( commentActions.updateComment( this.props.item.id, this.props.post_index, this.props.index, this.state.comment_text, this.props.search ) )
    }
    cancelEdit = ( e ) => {
        e.preventDefault()
        this.setState( { edit_comment: false } )
        this.setState( { comment_text: this.props.item.comment } )
    }
    updateTextArea = ( e ) => {
        e.preventDefault()
        this.setState( { comment_text: e.target.value } )
    }

    componentDidMount() {
    }
    componentWillUnmount() {

    }
    render() {
        const { item, index, post_index, search, currentProfileActivator } = this.props
        const currentuser = localStorage.user_id
        const p_tooltip = ( <Tooltip id={'comment-user-tip'}>Visit Profile</Tooltip> )
        var mRight = { marginRight: "3px" }
        var idx = index
        let commentNodes = []
        if ( item.user !== undefined ) {
            const is_currentuser_comment = is_this_user( currentuser, item.user.id )
            const editComment = !this.state.edit_comment ? ( e ) => this.edit( e ) : ( e ) => this.saveChanges( e )

            var node = (
                <div key={item.id} className={'comments-post-' + item.id}>
                    <div id={'c' + item.id}
                        className={'comment-item'}>
                        {is_currentuser_comment && (
                            <div className={'dropdown'}>
                                <i data-toggle="dropdown"
                                    id={'dropdownMenu' + item.id}
                                    aria-haspopup={'true'}
                                    aria-expanded={'true'}
                                    className={'option-dropdown-post dropdown-toggle glyphicon glyphicon-option-vertical border-sm lo-red low-opac'}>
                                </i>
                                <ul className={'dropdown-menu'} aria-labelledby={'dropdownMenu' + item.id} role={'menu'}>
                                    <li>
                                        <a onClick={( e ) => this.removeComment( e )}>Remove Comment</a>
                                    </li>
                                    <li>
                                        <a onClick={editComment}>
                                            {!this.state.edit_comment ? "Edit Comment" : "Save Changes"}
                                        </a>
                                    </li>
                                    {this.state.edit_comment && ( <li><a onClick={this.cancelEdit}>Cancel Edit</a></li> )}

                                </ul>
                            </div>
                        )}
                        <OverlayTrigger placement="top" overlay={p_tooltip}>
                            <span onClick={( e ) => this.props.currentProfileActivator( item.user, e )}>
                                <img className={'u_img_round low-opac'}
                                    src={item.user.profile.profile_image}
                                    style={mRight} />
                            </span>
                        </OverlayTrigger>
                        <span className={'comment-date'}>
                            <span className={'comment-item-username lobster lo-white border-sm'}>{item.user.username}</span>
                            <span>
                                <i className={'glyphicon glyphicon-time status-time-icon'}></i>{item.timesince_threshold}
                            </span>
                        </span>
                        {item.is_public &&
                            <span className="comment-moderated-flag">Moderated</span>
                        }
                        <div className={'comment-text-wrapper'}>
                            <div className={'input-group comment-like'}>
                                <span className={'input-group-btn'}>
                                    <LikesButton index={post_index} item_index={idx} search={search} object={item} />
                                </span>
                                <div className="comment-bg" style={{ fontSize: '12px' }}>
                                    {this.state.edit_comment ?
                                        <textarea
                                            value={this.state.comment_text}
                                            onChange={this.updateTextArea}
                                            className={'form-control'}
                                            style={{ float: 'none' }} /> :
                                        item.comment
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        commentNodes.push( node )

        return (
            <div>{commentNodes}</div>
        )
    }
}
const mapStateToProps = function( store, ownProps ) {
    return {
        //user : ownProps.user,
        item: ownProps.item,
        //comment_index: ownProps.comment_index,
        //index: ownProps.index,
    };
}
export default connect( mapStateToProps, null )( SingleComment)