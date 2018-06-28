import React from "react"
import { is_this_user } from "../utils"
import * as followActions from "../actions/followActions"
import * as postActions from "../actions/postActions"
import * as formActions from "../actions/formActions"
import * as crop_utils from "../crop_utils.js"
import { connect } from "react-redux"
import ImageCrop from "../components/ImageCrop"
import ReactCrop from 'react-image-crop'
export class NewPostForm extends React.Component {
    constructor( props ) {
        super( props );

    }
    componentWillMount() {

    }
    componentDidMount() {
    }
    handleTextChange = ( e ) => {
        e.preventDefault()
        this.props.handleTextChange( e.target.value )
    }
    prevent = ( e ) => { e.preventDefault() }
    handleSubmit = ( e ) => {
        e.preventDefault()

        this.props.handleSubmit( e.target.text.value, this.state.temps, this.state.pictures )
        // *** HACK *** can't set value on file select input with React using props
        e.target.picture.value = ''
    }
    render() {
        let props = this.props
        var loading = props.loading
        var lowOpac = ""
        if ( loading && loading !== undefined ) {
        } else {
        }
        var nodes = []
        var files = []
        let file_input = (
            <label htmlFor={"picture"} onClick={state.files.length > 0 && this.resetFiles} className={'btn ' +
                ( state.files.length === 0 ? 'btn-info' : 'btn-danger' ) + ' col-xs-6'}>
                <input id={"picture"}
                    type={'file'}
                    style={{ opacity: '0', height: '0px', width: '30px', zIndex: '1' }}
                    name={'picture'}
                    onChange={this.handleImageChange}
                    multiple>
                </input>
                <i className={'glyphicon ' + ( state.files.length === 0 ? 'glyphicon-camera lo-white' : 'glyphicon-trash lo-red' ) + ' border-sm'}
                    style={{ fontSize: '25px' }}>
                </i>
            </label> )
        for ( var i = 0; i < state.files.length; i++ ) {
            const currentCount = i
            let node = (
                <form ref="form" onSubmit={this.handleSubmit} encType={'multipart/form-data'}>
                    <input type={'hidden'}
                        name={'csrfmiddlewaretoken'}
                        value={localStorage.cookie}>
                    </input>
                    <div className={'input-group controls'}>
                        <div className={'input-group-addon btn btn-default post-submit'}>
                            <button style={{ border: 'none', background: 'none' }} type={'submit'}>
                                <i className={'glyphicon glyphicon-pencil border-sm lo-white'}></i>
                            </button>
                        </div>
                        <textarea name={'text'} rows={'8'} id={'post-text'} required={'true'} placeholder={'Share Something Dude...'}
                            value={props.copy} onChange={this.handleTextChange}
                            className={'form-control'} style={{ resize: 'none', borderRadius: '0', zIndex: '0' }} />
                        {file_input}
                    </div>
                    <span className="col-xs-6" key={currentCount}>
                        <ReactCrop onChange={( e ) => this.onCropChange( currentCount, e )}
                            src={state.temps[currentCount] !== undefined ? state.temps[currentCount] : ' '}
                            crop={state.crops[currentCount] !== undefined ? state.crops[currentCount] : state.crop} />
                        <div className="input-group">
                            <div className={'input-group-btn'}>
                                <button onClick={( e ) => this.submitCrop( currentCount, e )} className={'btn btn-success col-xs-6'} type={'submit'}>
                                    <img style={{ height: '29px' }} src="/static/img/cropper.png" />
                                    <input id={'file-hidden_' + currentCount} type={'hidden'} name={'picture'} value={state.temps[currentCount]}></input>
                                </button>
                            </div>
                        </div>
                    </span>
                </form> )
            nodes.push( node )
        }
        return (
            <div className={'text-center'}>
                {nodes}
            </div>
        )
    }
}
const mapStateToProps = function( state, ownProps ) {
    return {
        files: state.postform.files,
        temps: state.postform.temps,
        pictures: state.postform.pictures,
        crops: state.postform.crops,
        text: state.postform.text,
        loading: state.postform.loading,
        error: state.error
    }

}
const mapDispatchToProps = ( dispatch, props ) => {
    return {
        handleSubmit: ( content_type, base64, text, picture ) => {
            dispatch( formActions.addPost( content_type, base64, text, picture ) )
        },
        handleTextChange: ( text ) => {
            dispatch( formActions.updateTextArea( text ) )
        },

    }
}
export default connect( mapStateToProps, mapDispatchToProps )( NewPostForm )

