import React from 'react'
import PropTypes from 'prop-types'


import { Form, ValidatedInput } from '../lbc-bootstrap-validation'

const AboutMeForm = ( { about, _handleValidSubmit, _handleInvalidSubmit } ) => {
    return <Form className="settings-form"
        onValidSubmit={( values ) => _handleValidSubmit( values )}
        onInvalidSubmit={( values, errors ) => _handleInvalidSubmit( values, errors )}>

        <ValidatedInput
            type='textarea'
            label="Tell people what you're all about?"
            defaultValue={about}
            name='about_me'
            hasButton={true}
        >
        </ValidatedInput></Form>
}
AboutMeForm.propTypes = {
    about: PropTypes.string,
    _handleValidSubmit: PropTypes.func.isRequired,
    _handleInvalidSubmit: PropTypes.func.isRequired,
}
export default AboutMeForm