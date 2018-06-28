import React from 'react'
import PropTypes from 'prop-types'

import { loginUser } from '../actions/chatActions'
import ChatApp from '../components/ChatApp'
import { cacheByKey} from '../common/cache_utils'

import { connect } from 'react-redux'

class Root extends React.Component {
	constructor(){
		super();
	}
  componentDidMount(){
  }
  componentDidUpdate(){
	  console.log("updatedRoot")
  }
  
  render() {
	const component = <ChatApp 
	    activeRooms={this.props.activeRooms} 
	    rooms={this.props.rooms} 
	    friends={this.props.friends}/>
    return (
      <div className="root-chat-component">
      		{component}
      </div>
    );
  }
}

Root.propTypes = {
  currentUser: PropTypes.object.isRequired,
  handleUserChange: PropTypes.func.isRequired,
  rooms: PropTypes.array.isRequired,
  friends: PropTypes.array.isRequired
};


const mapStateToProps = (state) => ({
  currentUser: state.globalfeed.user,
  rooms: state.chat.rooms,
  activeRooms:state.chat.activeRooms,
  friends: state.friends.objects
});

const mapDispatchToProps = (dispatch) => ({
  handleUserChange: (user) => {
    dispatch(loginUser(user));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
