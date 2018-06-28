import React from 'react'
export default class TypingIndicatorComponent extends React.Component {
    constructor( props ) {
        super( props )
    }
    render() {
        return (
            <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        )
    }
}