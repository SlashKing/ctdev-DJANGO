import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ValidatedInput from '../lbc-bootstrap-validation/ValidatedInput'
import Form from '../lbc-bootstrap-validation/Form'

export default class PasswordForm extends Component {
    constructor( props ) {
        super( props )
    }
    render() {
        return <Form
            className="settings-form"
            onValidSubmit={( values ) => this.props._handleValidSubmit( values )}
            onInvalidSubmit={( values, errors ) => this.props._handleInvalidSubmit( errors, values )}>

            <ValidatedInput
                hasButton={false}
                type='password'
                name='password'
                label='Password'
                validationEvent='onChange'
                // You can pass params to validation rules
                validate={( val, context ) => {
                    var moreThanEight = new RegExp( "^(?=.{8,})" );
                    var oneUpperOneLower = new RegExp( "^(?=.*[a-z])(?=.*[A-Z])" )
                    var specialChar = new RegExp( "^(?=.*[!@#\$%\^&\*])" )
                    var oneNumber = new RegExp( "^(?=.*[0-9])" )
                    var str = ''
                    if ( !moreThanEight.test( val ) ) {
                        str += 'Must be more than eight characters. '
                    } 
                    if ( !oneUpperOneLower.test( val ) ) {
                        str += 'Need one upper and one lower case letter. '
                    } 
                    if ( !specialChar.test( val ) ) {
                        str += 'Need a special character in your password. '
                    }
                    if ( !oneNumber.test( val ) ) {
                        str += 'Need at least one number. '
                    }
                    return str
                    }
                }
            />

            <ValidatedInput
                hasButton={true}
                type='password'
                name='password-confirm'
                label='Confirm Password'
                // Validate can be a function as well
                validationEvent='onChange'
                validate={( val, context ) => { return val === context.password }}
                // If errorHelp property is a string, then it is used
                // for all possible validation errors
                errorHelp='Passwords do not match'
            />
        </Form>
    }

}