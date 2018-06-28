import React from 'react'
import { SplitButton, MenuItem } from 'react-bootstrap'
const LeftSidebarComponent = function( props ) {
    return (
        <div className="settings-dropdown">
            <SplitButton
                onClick={(e)=> props.onGeneralClick(e)} 
                id="settings_dropdown" 
                title="Settings">
                <MenuItem className="menu-item" onClick={(e)=>props.onAboutMeClick(e)}>About Me</MenuItem>
                <MenuItem className="menu-item" onClick={(e)=>props.onBirthdayClick(e)}>Birthday</MenuItem>
                <MenuItem className="menu-item" onClick={(e)=>props.onGenderClick(e)}>Gender</MenuItem>
                <MenuItem className="menu-item" onClick={(e)=>props.onStatusClick(e)}>Relationship Status</MenuItem>
                <MenuItem className="menu-item" onClick={(e)=>props.onInterestedClick(e)}>Interested In</MenuItem>
                <MenuItem className="menu-item" onClick={(e)=>props.onPrivacyClick(e)}>Privacy</MenuItem>
                <MenuItem className="menu-item" onClick={(e)=>props.onUsernameClick(e)}>Username</MenuItem>
                <MenuItem className="menu-item" onClick={(e)=>props.onCPasswordClick(e)}>Change Password</MenuItem>
                <MenuItem className="menu-item" onClick={(e)=>props.onLPasswordClick(e)}>Lost Password</MenuItem>
                <MenuItem className="menu-item" onClick={(e)=>props.onEmailClick(e)}>Email</MenuItem>
            </SplitButton>
        </div>
    );
}
export default LeftSidebarComponent