import React from 'react'
import {FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap'
export default class ValidatedInput extends React.Component {
	constructor(props){
		super(props)

	    this.state = {
	      value: ''
	    };
	  }

	  getValidationState=()=> {
	    const length = this.state.value.length;
	    if (length > 10) return 'success';
	    else if (length > 5) return 'warning';
	    else if (length > 0) return 'error';
	    return null;
	  }

	  handleChange=(e)=> {
	    this.setState({ value: e.target.value });
	  }
    render () {
        const {
            feedbackIcon,
            input,
            label,
            type,
            meta: { error, warning, touched },
            ...props
        } = this.props;
		console.log(this.props, message )
        let message;
        const validationState = touched && ( error && "error" ) || ( warning && "warning" ) || null;

        if ( touched && ( error || warning ) ) {
            message = <HelpBlock className="help-block">{ error || warning }</HelpBlock>;
        }

        return (
            <FormGroup controlId={name} validationState={ validationState }>
                <FormControl { ...input }
                             type={ type }
                             { ...props } />
                { feedbackIcon ? <FormControl.Feedback>{ feedbackIcon }</FormControl.Feedback> : null }
                { message }
            </FormGroup>
        );
    }
}