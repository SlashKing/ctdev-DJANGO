import React, { Fragment, Component } from 'react';
import { FormControl, Glyphicon, HelpBlock, InputGroup, FormGroup, Button, ControlLabel, Checkbox } from 'react-bootstrap';
import createFragment from 'react-addons-create-fragment';
import PropTypes from 'prop-types'
export default class ValidatedInput extends Component {
    constructor( props ) {
        super( props );

        const { validationEvent, validate, errorHelp, _registerInput, _unregisterInput, ...inputProps } = props;
        this._registerInput = _registerInput;
        this._unregisterInput = _unregisterInput;
        this.inputProps = inputProps;
        if ( !this._registerInput || !this._unregisterInput ) {
            throw new Error( 'Input must be placed inside the Form component' );
        }
    }
    componentWillMount() {
        this._registerInput( this );
    }

    componentWillUnmount() {
        this._unregisterInput( this );
    }

    render() {
        console.log( this.props.validate )
        return (
            <FormGroup controlId={this.props.username}
                validationState={this.props.validate !== undefined ? this.props.help ? 'warning' :
                    !this.props.options &&
                        this.props.type !== "checkbox" ? 'success' : undefined : undefined}>
                <ControlLabel>{this.props.label}</ControlLabel>
                <InputGroup>
                    {this.props.options ?
                        <FormControl
                            ref="control"
                            onChange={this.props.onChange}
                            name={this.props.name}
                            componentClass={this.props.type} placeholder="select" defaultValue={this.props.defaultValue}>
                            {this.props.children}
                        </FormControl>
                        :
                        this.props.type === "checkbox" ?
                            <FormControl
                                ref="control"
                                type={this.props.type}
                                onChange={this.props.submit}
                                name={this.props.name}
                                defaultValue={this.props.defaultValue}
                                style={{ marginTop: '0', height: '35px', width: '35px' }}
                            />
                            :<FormControl
                                    ref="control"
                                    onChange={this.props.onChange}
                                    type={this.props.type !== 'textarea' ? this.props.type : undefined}
                                    name={this.props.name}
                                    className="form-control"
                                    defaultValue={this.props.defaultValue}
                                    componentClass={this.props.type === 'textarea' ? this.props.type : undefined}
                                    placeholder={this.props.type === 'textarea' ? 'Tell others about yourself.' : undefined} />
                    }
					{!this.props.options && this.props.validate !== undefined ? this.props.help ?
                                    <FormControl.Feedback>
                                        <Glyphicon glyph='remove' />
                                    </FormControl.Feedback> :
                                    !this.props.options &&
                                        this.props.type !== "checkbox" ? undefined : undefined : undefined}
                    {this.props.hasButton && <InputGroup.Button>
                        <Button
                            type='submit'
                        >Save</Button>
                    </InputGroup.Button>}
                </InputGroup>
                <HelpBlock className={'help-block-settings'}>{this.props.help}</HelpBlock>
            </FormGroup>
        )

    }
}

ValidatedInput.propTypes = {
    name: PropTypes.string.isRequired,
    validationEvent: PropTypes.oneOf( [
        '', 'onChange', 'onBlur', 'onFocus'
    ] ),
    validate: PropTypes.oneOfType( [
        PropTypes.func,
        PropTypes.string
    ] ),
    errorHelp: PropTypes.oneOfType( [
        PropTypes.string,
        PropTypes.object
    ] ),
    hasButton: PropTypes.bool.isRequired,
    options: PropTypes.bool,
};

ValidatedInput.defaultProps = {
    validationEvent: '',
    options: false,
};
