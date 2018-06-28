import React from "react"
import { connect } from "react-redux"
import { is_this_user } from "../utils"
import LikesButton from "../components/LikesButton"
import SingleComment from "../components/SingleComment"
export class CommentListPostModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			hide_form : true
		}
		
	}
	setLoading = (e) => {
		
	}
	render() {
		const {index, comments_set, user, search,post} = this.props
		const currentuser = localStorage.user_id
		var mRight = { marginRight: "3px"}
		var idx = index
		let commentNodes = []
		if(!this.state.loading){
		comments_set.forEach((item, index) => {
			var innernode= (
				<SingleComment
					key={item.id + '-modal-comment'}
					item={item}
					index={index}
					post_index={idx}
					search={search}
					currentProfileActivator={this.props.currentProfileActivator}
				/>
			)
			commentNodes.push(innernode)
			
		})
	}
    return (
		<div className='comments-post-wrapper drop-shadow-lt'>
			<div id={'comments-single-' + post} className="comment-toggle collapse">{commentNodes}</div>
		</div>
    )
  }
}
const mapStateToProps = function(store,ownProps) {
  return {
	  currentProfileActivator : ownProps.profile_activator,
	  user : ownProps.user,
      comments_set: store.globalfeed.activePost.comments_set,
	  post: ownProps.post,
	  content_type: ownProps.content_type,
	  content_type_id: ownProps.content_type_id,
	  security_data: ownProps.security_data,
	  index: ownProps.index,
  };
}
export default connect(mapStateToProps,null)(CommentListPostModal)