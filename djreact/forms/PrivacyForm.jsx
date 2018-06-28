import React from 'react'
import PropTypes from 'prop-types'

import { Form, ValidatedInput } from '../lbc-bootstrap-validation'

export default class PrivacyForm extends React.Component {
    render() {
        return <Form ref={'form'} className="settings-form"
            onValidSubmit={( values ) => this.props._handleValidSubmit( values )}
            onInvalidSubmit={( values, errors ) => this.props._handleInvalidSubmit( values, errors )}>

            <ValidatedInput
                type='checkbox'
                label='Hide Profile?'
                submit={(e) => this.refs.form.submit(e)}
                defaultValue={this.props.privacy}
                name='is_private'
                hasButton={false}
            /></Form>
    }
}
PrivacyForm.propTypes = {
    privacy: PropTypes.bool.isRequired,
    _handleValidSubmit: PropTypes.func.isRequired,
    _handleInvalidSubmit: PropTypes.func.isRequired,
}