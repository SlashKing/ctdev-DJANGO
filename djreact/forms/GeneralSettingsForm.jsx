import React, { Fragment } from 'react'
import {
    PasswordForm, UsernameForm,
    PrivacyForm, AboutMeForm, RelStatusForm, BirthdayForm,
    EmailForm, GenderForm, InterestedForm,
} from '../forms'
const GeneralSettingsForm = ( { user, _handleValidSubmit, _handleInvalidSubmit } ) => {
    return <div style={{ flexDirection: 'column', margin: 'auto' }}>
        <AboutMeForm
            about={user.profile.about_me}
            _handleValidSubmit={_handleValidSubmit}
            _handleInvalidSubmit={_handleInvalidSubmit} />
        <RelStatusForm
            rel_status={user.profile.rel_status}
            _handleValidSubmit={_handleValidSubmit}
            _handleInvalidSubmit={_handleInvalidSubmit} />
        <BirthdayForm birthday={user.profile.date_of_birth} />
        <GenderForm
            gender={user.profile.gender}
            _handleValidSubmit={_handleValidSubmit}
            _handleInvalidSubmit={_handleInvalidSubmit} />
        <InterestedForm
            interested={user.profile.interested_in}
            _handleValidSubmit={_handleValidSubmit}
            _handleInvalidSubmit={_handleInvalidSubmit} />
        <PrivacyForm
            privacy={user.profile.is_private}
            _handleValidSubmit={_handleValidSubmit}
            _handleInvalidSubmit={_handleInvalidSubmit} />
        <UsernameForm
            username={user.username}
            _handleValidSubmit={_handleValidSubmit}
            _handleInvalidSubmit={_handleInvalidSubmit} />
        <EmailForm
            _handleValidSubmit={_handleValidSubmit}
            _handleInvalidSubmit={_handleInvalidSubmit}
            email={user.email} />
        <PasswordForm
            _handleValidSubmit={_handleValidSubmit}
            _handleInvalidSubmit={_handleInvalidSubmit} />
    </div>
}
export default GeneralSettingsForm