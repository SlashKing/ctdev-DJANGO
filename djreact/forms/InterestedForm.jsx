import React from 'react'
import PropTypes from 'prop-types'
import { Form, ValidatedInput } from '../lbc-bootstrap-validation'

const InterestedForm = ( { interested, _handleValidSubmit, _handleInvalidSubmit } ) => {
    return <Form className="settings-form"
        onValidSubmit={( values ) => _handleValidSubmit( values )}
        onInvalidSubmit={( values, errors ) => _handleInvalidSubmit( values, errors )}>

        <ValidatedInput
            type='select'
            label='Which way do you swing?'
            defaultValue={interested}
            name='interested_in'
            options={true}
            hasButton={true}
        >
            <option value={'FM'} label={'Female'} />
            <option value={'MA'} label={'Male'} />
            <option value={'BI'} label={'Both'} />
        </ValidatedInput></Form>
}
InterestedForm.propTypes = {
    interested: PropTypes.string.isRequired,
    _handleValidSubmit: PropTypes.func.isRequired,
    _handleInvalidSubmit: PropTypes.func.isRequired,
}
export default InterestedForm