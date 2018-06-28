import React from 'react'
import PropTypes from 'prop-types'
import dateFormat from 'dateformat'


const Message = ({ currentUser, this_user, user, content, timestamp }) => {
  // Server returns normal unix timestamp in seconds, but Javascript
  // uses milliseconds so we multiply by 1000
  const date = new Date(timestamp * 1000);
  return (
	<div className="message-container">
    	<span className="timestamp">
    		{dateFormat(date, 'mmm dS, h:MM TT')}
    	</span>
    	<div className="message">
    	 {user.username !== currentUser.username && (<span className="user">
    	 	{
    	 		//this_user.first_name}	
    	 	}
    	 	<img className="n_img_round	" src={user.profile.profile_image} />
    	 </span>)}
	      <span className="content">{content} </span>
      </div>
    </div>
  )
}

Message.propTypes = {
  currentUser: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
}

export default Message;
