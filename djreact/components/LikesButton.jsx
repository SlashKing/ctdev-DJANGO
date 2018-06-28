import React from "react"
import { is_this_user } from "../utils"
import * as likeActions from "../actions/likeActions"
import * as postActions from "../actions/postActions"
import * as searchActions from "../actions/searchActions"
import { connect } from "react-redux"
import { OverlayTrigger, Tooltip, Glyphicon } from 'react-bootstrap'
export class LikesButton extends React.Component {
    constructor( props ) {
        super( props );
    }
    componentWillMount() {

    }
    componentDidMount() {
    }
    addLike = ( e ) => {
        e.preventDefault();
        if ( this.props.loading ) {
            console.log( "isLoading" )
            return
        } else {
            this.props.addLike( e )
        }
    }
    removeLike = ( e ) => {
        e.preventDefault();
        if ( this.props.loading ) {
            console.log( "isLoading" )
            return
        } else {
            this.props.removeLike( e )
        }

    }
    render() {
        let {loading, likes_quantity, liked, removeLike, addLike} = this.props

        // set button class based on prop-size input
        // currently only supporting sm and xs
        var btnClass = ""
        switch ( props.size ) {
            case "xs":
                btnClass = "btn-xs"
                break;
            case "s":
                btnClass = "btn-sm"
                break;
            default:
                btnClass = "btn-xs"
                break;
        }

        // set button class name based on liked prop
        const className = !liked ?
            'drop-shadow-lt lobster btn btn-default ' + btnClass :
            'drop-shadow-lt lobster btn btn-danger ' + btnClass

        // tooltip
        const tooltip = ( <Tooltip id={'like_button'}>{!props.liked ? 'Like' : 'Unlike'}</Tooltip> )
        return (
            <OverlayTrigger placement="bottom" overlay={tooltip}>
                {loading ?
                    <button style={{ fontSize: '16px' }} className={className}>
                        <span className={'vote_count'}>{likes_quantity} </span>
                        <span className={liked ? 'disliker' : 'liker'} rel="nofollow">
                            {liked ? <Glyphicon glyph='thumbs-down' /> : <i className='icon-hand-peace-o'></i>}
                        </span>
                    </button> :
                    <button onClick={liked ? ( e ) => removeLike( e ) : ( e ) => addLike( e )} 
                        style={{ fontSize: '16px' }} className={className}>
                        <span className={'vote_count'}>{likes_quantity} </span>
                        <span className={liked ? 'disliker' : 'liker'} rel="nofollow">
                            {liked ? <Glyphicon glyph='thumbs-down' /> : <i className='icon-hand-peace-o'></i>}
                        </span>
                    </button>}
            </OverlayTrigger>
        )
    }
}
const mapStateToProps = function( state, ownProps ) {
    return {
        liked: ownProps.object.can_vote ? false : true,
        likes_quantity: ownProps.object.vote_total,
        loading: state.likes.loading,
        error: state.error,
        object: ownProps.object,
        index: ownProps.index,
        search: ownProps.search
    }

}
const mapDispatchToProps = ( dispatch, props ) => {
    return {
        addLike: ( e ) => {
            dispatch( likeActions.likeObject( localStorage.user_id, props.object, props.index, props.item_index, props.search ) )
        },
        removeLike: ( e ) => {
            dispatch( likeActions.removeLike( localStorage.user_id, props.object, props.index, props.item_index, props.search ) )
        }
    }
}
export default connect( mapStateToProps, mapDispatchToProps )( LikesButton)