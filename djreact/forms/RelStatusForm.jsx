import React from 'react'
import PropTypes from 'prop-types'


import { Form, ValidatedInput } from '../lbc-bootstrap-validation'

const RelStatusForm = ( { rel_status, _handleValidSubmit, _handleInvalidSubmit } ) => {
    return <Form className="settings-form"
        onValidSubmit={( values ) => _handleValidSubmit( values )}
        onInvalidSubmit={( values, errors ) => _handleInvalidSubmit( values, errors )}>

        <ValidatedInput
            type='select'
            label='Relationship Status'
            defaultValue={rel_status}
            name='rel_status'
            options={true}
            hasButton={true}
        >
            <option value={'SI'} label={'Single'} />
            <option value={'DA'} label={'In Relationship'} />
            <option value={'JL'} label={'Just Looking'} />
            <option value={'IC'} label={" It's Complicated"} />
            <option value={'EN'} label={'Engaged'} />
            <option value={'SE'} label={'Separated'} />
            <option value={'WI'} label={'Widowed'} />
        </ValidatedInput></Form>
}
RelStatusForm.propTypes = {
    rel_status: PropTypes.string.isRequired,
    _handleValidSubmit: PropTypes.func.isRequired,
    _handleInvalidSubmit: PropTypes.func.isRequired,
}
export default RelStatusForm