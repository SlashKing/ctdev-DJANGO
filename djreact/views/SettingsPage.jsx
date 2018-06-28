import React, {Component} from 'react'
import PropTypes from 'prop-types'
import SettingsForm from '../components/SettingsForm'
const SettingsPage = ({user, type})=>{
    return <SettingsForm type={type} user={user}/>
}
SettingsPage.propTypes = {
        user: PropTypes.object.isRequired,
}
export default SettingsPage