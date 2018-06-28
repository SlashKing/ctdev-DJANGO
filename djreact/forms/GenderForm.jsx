import React from 'react'
import PropTypes from 'prop-types'

import { Form, ValidatedInput } from '../lbc-bootstrap-validation'
const FEMALE = "Female", MALE = "Male", BOTH = "Transexual", F_KEY = "FM", M_KEY = "MA", T_KEY = "TR"
export default class GenderForm extends React.Component {
    constructor( props ) {
        super( props )

    }

    render() {
        return <Form className="settings-form"
            onValidSubmit={( values ) => this.props._handleValidSubmit( values )}
            onInvalidSubmit={( values, errors ) => this.props._handleInvalidSubmit( values, errors )}>


            <ValidatedInput name='gender'
                defaultValue={this.props.gender}
                label='Gender'
                name='gender'
                options={true}
                hasButton={true}
                type="select">
                <option value={F_KEY} label={FEMALE} />
                <option value={M_KEY} label={MALE} />
                <option value={T_KEY} label={BOTH} />
            </ValidatedInput></Form>
    }
}

GenderForm.propTypes = {
    gender: PropTypes.string.isRequired,
    _handleValidSubmit: PropTypes.func.isRequired,
    _handleInvalidSubmit: PropTypes.func.isRequired,
}