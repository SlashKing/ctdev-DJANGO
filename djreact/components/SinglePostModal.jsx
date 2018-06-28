import React from "react"
import { connect } from "react-redux"
import { is_this_user } from "../utils"
import CommentListPostModal from "../components/CommentListPostModal"
import RemovePost from "../components/RemovePost"
import LikesButton from "../components/LikesButton"
import FollowButton from "../components/FollowButton"
import FriendButton from "../components/FriendButton"
import PlusMinusButton from "../components/PlusMinusButton"
import NewCommentForm from "../components/NewCommentForm"
import FocusableImage from "../components/FocusableImage"
import * as postActions from "../actions/postActions"
//import * from "../common/constants/endpoints/config"
export class SinglePostModal extends React.Component {
	constructor(props) {
    super(props);
	this.state = {
		hide_form:true,
		edit_post:false,
		post_text: props.post.text
	}
}
showForm = (e) => {
	this.setState({hide_form:false})
}
hideForm = (e) => {
	this.setState({hide_form:true})
}
edit = (e) => {
	e.preventDefault()
	this.setState({edit_post:true})
}
saveChanges = (text,index, id,search_index=undefined, e) => {
	this.setState({edit_post:false})
	this.props.updatePost(text, index, id,search_index)
}
cancelEdit = (e) => {
	e.preventDefault()
	this.setState({edit_post:false})
	this.setState({post_text:this.props.post.text})
}
updateTextArea = (e) => {
	e.preventDefault()
	this.setState({post_text: e.target.value})
}
	componentDidMount(){
}
	componentWillUnmount() {
	
}
	removePost = (idx,id,search,e) => {
	e.preventDefault()
	this.props.removePost(id)
}
	
  render() {
    const state = this.props;
    let {post, user, index} = this.props
	const currentuser = user.id
    let postNodes = []
	let comments_set = post.comments_set
	
	const is_currentuser_post = is_this_user(currentuser, post.user.id)
	
	const editPost = !this.state.edit_post ? this.edit : (e)=> this.saveChanges(this.state.post_text,index,post.id,state.search)
	var hideShow = this.state.hide_form ? this.showForm : this.hideForm
	
	var sec_data = post.security_data.split('|')
	
	var pictures = []
    for(var i = 0; i<post.pictures.length;i++){
    var post_image_class = ''
    if(post.pictures.length > 0){
        if((post.pictures.length)%2===0){
            post_image_class = '50%'
        }else{
            if(i+1 === post.pictures.length){
                post_image_class = '100%'
            }else{
                post_image_class = '50%'
            }
        }
    }else{
        post_image_class = '100%'
    }
    pictures.push(
        <FocusableImage key={post.pictures[i].id + '_focusable_post'}
            col_style={post_image_class} styles={'img-thumbnail'} src={ post.pictures[i].file} />)
   
    }
    let node = (
		<div id="single-post" key={post.id + '-single'}>
        {state.currentProfile === undefined && (
			<ul className={'col-xs-12 list-inline pad-lr-3 text-left'}>
               
				<li>
					<div className={'border-sm lo-white lobster'}>
						<a onClick={()=> this.props.currentProfileActivator(post.user)} 
							data-toggle={'tooltip'} 
							title={'Visit Profile'} 
                            data-placement={'right'}
							className={'no-dec'}>
							<img 
								className={'u_img_round drop-shadow low-opac'} 
								src={'' + post.user.profile.profile_image}/>
						</a>{post.user.username}
					</div>
				</li>
				{is_currentuser_post ? (
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
									onClick={(e)=> this.removePost(index,post.id,state.search,e)} 
									value={post.id} 
									index={index} />
							</li>
							<li>
								<a onClick={editPost}>
									{!this.state.edit_post ? "Edit Post" : "Save Changes"}
								</a>
							</li>
							{this.state.edit_post && (<li><a onClick={this.cancelEdit}>Cancel Edit</a></li>)}
							<li>
								<a onClick={(e)=> this.props.singlePostActivator(post,index,e)}>{state.isSinglePost ? "Show Feed" : "Focus Post"}</a>
							</li>
						
						</ul>
				</li>

				):(state.currentProfile === undefined && (<li><FriendButton 
				            setScroll={this.props.setScroll}
                        scrollListener={this.props.scrollListener}
				                index={index} 
								object={post}
								from_user={currentuser} 
								request_sent={post.user.request_sent} 
								request_rejected={post.user.request_rejected} 
								request_received={post.user.request_received} 
								are_friends={post.user.are_friends} 
								current_user={post.user.id} 
								/></li>))}
			</ul>)}
			<hr className={'fancy'}/>
			<div>

        <div className="col-xs-12 pad-lr-3 post-date pull-right text-right">
            <span style={{fontWeight:"1000",fontSize:'12px'}}>
                {post.timesince_post}
            </span>
        </div>
			<p className={'post-container drop-shadow text-center border-md lo-white lobster mine'}>
				{this.state.edit_post ? 
					<textarea 
						value={this.state.post_text} 
						onChange={this.updateTextArea} 
						className={'form-control'}/> : 
						post.text 
				}
			</p>
			{pictures}
			</div>
			<hr className={'fancy'}/>
            <div className={'text-center'} style={{width:'100%'}}>
			    <div className={'btn-group text-center'} style={{margin:'0 auto',display:'inline-block'}}>
				<LikesButton index={index} object={post} search={this.props.search} />
				{!is_currentuser_post && 
					this.props.currentProfile === undefined && (
						<FollowButton 
							index={index} 
							is_following={post.user.is_following} 
							search={this.props.search} 
							object={post} 
							user={post.user}/>
					)
				}
				
					<span style={{fontSize:'16px'}} 
						className={'drop-shadow-lt btn-xs btn btn-default lobster'} 
						data-toggle={'tooltip'} 
						title={'Expand Comments'}>
						<div className={'comment-toggle'} 
							data-toggle={'collapse'} 
							aria-expanded={'false'} 
							data-target={'#comments-single-' + post.id}>
								Comments (<span id={'comment-count-' + post.id}>{comments_set.length}</span>)
						</div>
					</span>
					<PlusMinusButton 
						onClick={hideShow} 
						show_hide={this.state.hide_form}/>
			</div>{!this.state.hide_form &&
						(<NewCommentForm 
							target_object={post.id} 
							content_type_id={post.this_content_type.id}
							content_type={post.this_content_type.app_label + "." + post.this_content_type.model} 
							security_hash={sec_data[0]} 
							timestamp={sec_data[1]}
							index={index}
							search={this.props.search}/>)}
				
			</div>
		</div>
      )
	  
      postNodes.push(node)
		if(comments_set!= null){
			let node_comment_list = (
					<CommentListPostModal 
						key={'comments-modal-' +post.id} 
						user={user} profile_activator={this.props.currentProfileActivator} 
						search={this.props.search}
						post={post.id}
			            comments_set={post.comments_set}
						security_data={post.security_data} 
						content_type={post.this_content_type.app_label + "." + post.this_content_type.model} 
						content_type_id={post.this_content_type.id} index={index}
					/>
				)
			postNodes.push(node_comment_list)
		}

    return (
	<div>{postNodes}</div>
    )
  }
}
const mapStateToProps = function(store,ownProps) {
  return {
	post: ownProps.post,
	currentProfile: ownProps.currentProfile,
	isSinglePost: ownProps.isSinglePost,
	user: store.globalfeed.user
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
	updatePost: (text,index,id,search_index) => {
		console.log(search_index,"search_index")
		dispatch(postActions.updatePost(text,index,id,search_index))
	},
	removePost: (id) => {dispatch(postActions.deletePost(localStorage.token, id))},
	setSinglePost:(value) => {
	    dispatch(postActions.setSinglePost(value))},
	setActivePost: (value) => {dispatch(postActions.setActivePost(value))},
	//fetchPosts: (token) => {dispatch(postActions.fetchPosts(token))}
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(SinglePostModal)