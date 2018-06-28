import React from 'react'
import PropTypes from 'prop-types'

import { Form, ValidatedInput } from '../lbc-bootstrap-validation'

export default class EmailForm extends React.Component {
    constructor( props ) {
        super( props )
    }
    render() {
        return <Form className="settings-form"
            onValidSubmit={( values ) => this.props._handleValidSubmit( values )} onInvalidSubmit={( errors, values ) => this.props._handleInvalidSubmit( errors, values )} >
            <ValidatedInput
                type='text'
                label='Email'
                meta='warning'
                name='email'
                hasButton={true}
                defaultValue={this.props.email}
                //onBlur={(e)=>e.target.value === '' && e.target.value = username}
                validate='required,isEmail'
                validationEvent='onChange'
                inputProps={{ validationState: 'error' }}

                errorHelp={{
                    required: 'This field is required',
                    isEmail: 'Must be a valid email address (...@example.com)'
                }} />
        </Form>
    }
}
EmailForm.propTypes = {
    email: PropTypes.string.isRequired,
    _handleValidSubmit: PropTypes.func.isRequired,
    _handleInvalidSubmit: PropTypes.func.isRequired,
}