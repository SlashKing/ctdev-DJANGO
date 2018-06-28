import React from "react"
import { connect } from "react-redux"
import * as commentActions from "../actions/commentActions"
export class NewCommentForm extends React.Component{
	constructor(props) {
		super(props);
		
		this.state = {
			index: props.index,
			comment_id: props.comment_id,
			object_id: props.target_object,
			object_content_type: props.content_type,
			object_content_type_id: props.content_type_id,
			security_hash:props.security_hash,
			timestamp:props.timestamp,
			user: localStorage.user_id,
			search: props.search,
			comment: "",
			picture: "",
			temp: "",
			file: undefined,
			loading: false,
			show_comment_posted: false,
		}
	}
	componentWillMount(){
	}
	componentDidMount(){}
	updateTextArea = (e) =>{
		this.setState({comment : e.target.value})
	}
	showLoading(){
		this.setState({loading: true})
	}
	hideLoading(){
		this.setState({loading: false})
	}
	showCommentPosted(){
		this.setState({show_comment_posted: true})
	}
	hideCommentPosted(){
		this.setState({show_comment_posted: false})
	}
	handleSubmit=(e)=>{
		e.preventDefault()
		const _this = this
		_this.setState({comment : ""})
		_this.setState({show_comment_posted: true})
		_this.setState({loading: true})
		_this.props.dispatch(
			commentActions.addComment(
				_this.state.comment,
				_this.state.object_id, 
				_this.state.object_content_type,
				_this.state.object_content_type_id,
				_this.state.security_hash,
				_this.state.timestamp,
				_this.state.index,
				_this.state.search
			)
		)
		setTimeout(function(){
			_this.setState({show_comment_posted: false})
			_this.setState({loading: false})
		},2000)
		
	}
	handleNewComment = (e) =>{
	}
	render(){
		return(
			<form id={"comment-form-" + this.state.object_id} onSubmit={this.handleSubmit} data-object-id={this.state.object_id} className="js-comments-form comments-form form-horizontal">
				<input type="hidden" name="csrfmiddlewaretoken" value={localStorage.cookie}/>
		        
					<div className="comment input-group controls">
						<div className="input-group-addon btn btn-xs btn-info">
							<button style={{background:'none',border:'none'}} type="submit">
								<i className="glyphicon glyphicon-comment lo-white border-sm"></i> 
							</button>
						</div>
						
						<textarea onChange={this.updateTextArea} name="comment" 
						    className="comment-textarea form-control" 
						    maxLength="420"
						    required={'true'} 
						    placeholder="Come on... Don't be shy..." 
						    value={this.state.comment} style={{lineHeight: '13px'}}></textarea>
						<input type="hidden" name="object_pk" value={this.state.object_id} id="id_object_pk"/>
						<input type="hidden" name="security_hash" value={this.state.security_hash} id="id_security_hash"/>
						<input type="hidden" name="timestamp" value={this.state.timestamp} id="id_timestamp"/>
						<input type="hidden" name="content_type_id" value={this.state.object_content_type_id} id="id_content_type_id"/>
						<input type="hidden" name="content_type" value={this.state.object_content_type} id="id_content_type"/>
						
						
					</div>
		        {this.state.loading &&(<img src="/static/fluent_comments/img/ajax-wait.gif" alt="" className="ajax-loader"></img>) }
		        {this.state.show_comment_posted ? <span className="comment-added-message">Your comment is being posted!</span> : ("")}
			</form>
				
		)
	}
}
export default connect(null,null)(NewCommentForm)