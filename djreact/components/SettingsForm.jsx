import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    GeneralSettingsForm, PasswordForm, UsernameForm,
    PrivacyForm, AboutMeForm, RelStatusForm, BirthdayForm,
    EmailForm, GenderForm, InterestedForm,
} from '../forms'
class SettingsForm extends Component {
    constructor() {
        super()
    }
    renderForm() {
        switch ( this.props.type ) {
            case 'email':
                return <EmailForm
                    _handleValidSubmit={this._handleValidSubmit}
                    _handleInvalidSubmit={this._handleInvalidSubmit}
                    email={this.props.user.email} />
            case 'changepassword':
                return <PasswordForm
                    _handleValidSubmit={this._handleValidSubmit}
                    _handleInvalidSubmit={this._handleInvalidSubmit} />
            case 'username':
                return <UsernameForm
                    username={this.props.user.username}
                    _handleValidSubmit={this._handleValidSubmit}
                    _handleInvalidSubmit={this._handleInvalidSubmit} />
            case 'gender':
                return <GenderForm
                    gender={this.props.user.profile.gender}
                    _handleValidSubmit={this._handleValidSubmit}
                    _handleInvalidSubmit={this._handleInvalidSubmit} />
            case 'privacy':
                return <PrivacyForm
                    privacy={this.props.user.profile.is_private}
                    _handleValidSubmit={this._handleValidSubmit}
                    _handleInvalidSubmit={this._handleInvalidSubmit} />
            case 'interested':
                return <InterestedForm
                    interested={this.props.user.profile.interested_in}
                    _handleValidSubmit={this._handleValidSubmit}
                    _handleInvalidSubmit={this._handleInvalidSubmit} />
            case 'about':
                return <AboutMeForm
                    about={this.props.user.profile.about_me}
                    _handleValidSubmit={this._handleValidSubmit}
                    _handleInvalidSubmit={this._handleInvalidSubmit} />
            case 'birthday':
                return <BirthdayForm
                    birthday={this.props.user.profile.date_of_birth}
                    _handleValidSubmit={this._handleValidSubmit}
                    _handleInvalidSubmit={this._handleInvalidSubmit} />
            case 'rel_status':
                return <RelStatusForm
                    rel_status={this.props.user.profile.rel_status}
                    _handleValidSubmit={this._handleValidSubmit}
                    _handleInvalidSubmit={this._handleInvalidSubmit} />
            default:
                return <GeneralSettingsForm
                    user={this.props.user}
                    _handleValidSubmit={this._handleValidSubmit}
                    _handleInvalidSubmit={this._handleInvalidSubmit} />
        }
    }
    render() {
        return (
            this.renderForm()
        )
    }

    _handleValidSubmit = ( values ) => {
        /**  Values is an object containing all values 
         *   from the inputs                           
         */
        const data = { ...data, ...values }

        console.log( values, data )
    }

    _handleInvalidSubmit = ( errors, values ) => {
        // Errors is an array containing input names
        // that failed to validate
        console.log( values, errors )
    }
}
export default SettingsForm