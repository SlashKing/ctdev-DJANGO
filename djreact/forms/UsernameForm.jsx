import React from 'react'
import PropTypes from 'prop-types'

import ValidatedInput from '../lbc-bootstrap-validation/ValidatedInput';
import Form from '../lbc-bootstrap-validation/Form';

export default class UsernameForm extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return <Form className="settings-form"  
                onValidSubmit={(values)=>this.props._handleValidSubmit(values)} onInvalidSubmit={(errors, values)=>this.props._handleInvalidSubmit(errors,values)} >
                
            
            <ValidatedInput
                type='text'
                label='Username'
                meta='warning'
                name='username'
                hasButton={true}
                defaultValue={this.props.username}
                //onBlur={(e)=>e.target.value === '' && e.target.value = username}
                validate='required,isAlphanumeric,isLength:2:16'
                validationEvent='onChange'
                inputProps={{ validationState: 'error' }}
                
                errorHelp={{
                    required: 'This field is required',
                    isAlphanumeric: 'Must not contain special characters',
                    isLength: 'Must be more than 2 and less than 16 characters'
                }}>
                </ValidatedInput>
                </Form>
            }
        }
UsernameForm.propTypes = {
            username: PropTypes.string.isRequired,
    _handleValidSubmit: PropTypes.func.isRequired,
    _handleInvalidSubmit: PropTypes.func.isRequired,
}