import React from "react"
import { is_this_user } from "../utils"
import * as followActions from "../actions/followActions"
import {updateIsFollowing} from "../actions/postActions"
import * as searchActions from "../actions/searchActions"
import { connect } from "react-redux"
export class FollowButton extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount(){
  	
  }
  componentDidMount(){
  }
  
  render() {
	let props = this.props
	var loading = props.loading
	var followOrRemove = ""
	var lowOpac = ""
	if(loading && loading !== undefined){
		// Do Something while the component is in a loading state
		lowOpac = "low-opac"
	}else{
		followOrRemove = !props.is_following ? props.follow : props.removeFollow
	}
	
	return (
		<button style={{borderRadius:'0', fontSize:'16px'}} 
	        data-toggle='tooltip' title={!props.is_following ? 'Follow':'Unfollow'} onClick={followOrRemove} 
	        className={!props.is_following ? ('drop-shadow-lt lobster btn btn-xs btn-default '+ lowOpac) : 
	            ( 'drop-shadow-lt lobster btn btn-xs btn-danger ' + lowOpac)} >
				{!props.is_following ? 'Follow':'Unfollow'}
		</button>
    )}
}
const mapStateToProps = function(state,ownProps){
		return {
			is_following: ownProps.user.is_following,
			loading: state.follows.loading,
			error:state.error,
			object: ownProps.object,
			index: ownProps.index
		}
	
}
const mapDispatchToProps = (dispatch,props) => {
  return {
	sendMessage: () => {
	    
	}, 
	joinRoom:() => {
	}
    
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(ChatComponent)