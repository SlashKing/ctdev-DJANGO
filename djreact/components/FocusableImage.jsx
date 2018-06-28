import React from "react"
import Modal from "react-modal"
import { connect } from "react-redux"
export class FocusableImage extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            col_style: props.col_style,
            styles: props.styles,
            src: props.src,
            isOpen: false
        }
    }
    componentWillMount() {

    }
    componentDidMount() {
    }
    toggleModal = ( e ) => {
        this.state.isOpen = this.state.isOpen ? false : true
        this.forceUpdate()
    }
    render() {
        const customStyles = {
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                minWidth: '50%',
                maxWidth: '93vw',
                maxHeight: '85vh',
                overflowY: 'auto',
                textAlign: 'center',
                borderRadius: '20px',
                transform: 'translate(-50%, -50%)'
            },
            overlay: {
                backgroundColor: 'rgba(0,0,0,0.55)'
            }
        };

        return ( this.state.isOpen ?
            <Modal style={customStyles} isOpen={this.state.isOpen} onRequestClose={this.toggleModal}>
                <img className={this.state.styles} style={{ borderRadius: '0' }} src={this.state.src} />
            </Modal>
            : <img onClick={this.toggleModal} className={this.state.styles} src={this.state.src} />

        )
    }
}

export default FocusableImage