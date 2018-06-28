import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { Form, ValidatedInput } from '../lbc-bootstrap-validation'
import moment from 'moment'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'

import { SingleDatePicker, isInclusivelyBeforeDay } from 'react-dates'
export default class BirthdayForm extends React.Component {
    constructor( props ) {
        super( props )
        this.state = {
            date: moment( props.birthday, "YYYY-MM-DD" ),
            focused: false,
        }

    }
    submit( e ) {
        e.preventDefault()
        const data = { date_of_birth: jQuery( e.target ).find( 'input:text' ).val() }
        //this.props.setBirthday(data)
    }
    render() {
        return <form className="settings-form" action="#" onSubmit={( e ) => this.submit( e )}>
            <div className="form-group">
                <label style={{display:'block'}} className="control-label">Birthday</label>
                <SingleDatePicker
                    isOutsideRange={day => !isInclusivelyBeforeDay( day, moment() )}
                    numberOfMonths={1}
                    date={this.state.date} // momentPropTypes.momentObj or null
                    onDateChange={date => this.setState( { date } )} // PropTypes.func.isRequired
                    focused={this.state.focused} // PropTypes.bool
                    onFocusChange={( { focused } ) => this.setState( { focused } )} // PropTypes.func.isRequired
                /><Button style={{ borderRadius: '0', height: '40px' }} type="submit">Save</Button>
            </div>
        </form>
    }
}
BirthdayForm.propTypes = {
    birthday: PropTypes.string.isRequired,
}