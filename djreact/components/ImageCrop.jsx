import React from 'react'
import * as formActions from '../actions/formActions'
import { connect } from 'react-redux'
import ReactCrop from 'react-image-crop'
import Modal from 'react-modal'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import * as crop_utils from "../crop_utils.js"
/**
  *  class: ImageCrop
  *  description: Provides cropping ability and UI for cover, profile, and post picture uploads
  *  parameters (param_name : default : [options]): 
  *   type : 'profile' : ['cover','post','profile']
  *   index : 0 
  *   check_user : false : ['true','false']
  *   
  *   TODO: 
  *   - improve the display
  *   - add ability to add video
  *   - consider making separate components for each image cropper, for cleanliness sake
 **/
export class ImageCrop extends React.Component {
    constructor( props ) {
        super( props );
        this.state = {
            text: '',
            loading: false,
            error: null,
            index: props.index,
            type: props.type,
            check_user: props.check_user,
            crop: this.getCropMax(),
            temps: [],
            crops: [],
            files: [],
            pictures: [],
            cropped: [false],
        }
    }
    componentWillMount() {
        console.log( "ImageCrop: componentWillMount()" )
    }
    componentDidMount() {
        console.log( "ImageCrop: componentDidMount()" )
    }
    componentWillUpdate() {
    }
    handleTextChange = ( e ) => {
        e.preventDefault()
        this.state.text = e.target.value
        this.forceUpdate()
    }
    setCropped = ( index ) => {
        this.state.cropped[index] = true
        this.forceUpdate()
    }
    resetCropped = ( index ) => {
        this.state.cropped[index] = false
        this.forceUpdate()
    }
    updateCrop = ( picture_index, crop ) => {
        crop !== null ? this.state.crops[picture_index] = crop : this.state.crops.splice( picture_index, 1 )
        this.state.crops
        this.forceUpdate()
    }
    onCropChange = ( picture_index, e ) => {
        const crop = { x: e.x, y: e.y, width: e.width, height: e.height, aspect: e.aspect }
        this.updateCrop( picture_index, crop )
    }
    getCropMax = () => {
        var crop = null
        const type = this.props.type !== undefined ? this.props.type : this.state.type
        switch ( type ) {
            case 'post':
                crop = { x: 0, y: 0, width: 100, height: 100, aspect: undefined }
                break;
            case 'cover':
                crop = { x: 0, y: 0, width: 100, height: 100, aspect: 2.5 / 1 }
                break;
            default:
                crop = { x: 0, y: 0, width: 100, height: 100, aspect: 1 / 1 }
                break;
        }
        return crop

    }
    setCropMax = ( picture_index ) => {
        if ( this.state !== undefined ) {
            var crop = null

            switch ( this.props.type ) {
                case 'post':
                    crop = { x: 0, y: 0, width: 100, height: 100, aspect: undefined }
                    break;
                case 'cover':
                    crop = { x: 0, y: 0, width: 100, height: 100, aspect: 2.5 / 1 }
                    break;
                default:
                    crop = { x: 0, y: 0, width: 100, height: 100, aspect: 1 / 1 }
                    break;
            }

            this.state.crops[picture_index] = crop
            this.forceUpdate()
        }
    }
    submitCrop = ( picture_index, e ) => {
        e.preventDefault()
        //for(var i = 0;i<this.state.files.length;i++){
        var imgDest = crop_utils.cropImage(
            this.state.temps[picture_index],
            this.state.temps[picture_index],
            this.state.crops[picture_index], 1000, 1000 )
        this.updateImageForCrop( picture_index, this.state.pictures[picture_index], imgDest );
        this.setCropped( picture_index )
        this.setCropMax( picture_index )
        //}

    }
    updateImageForCrop = ( picture_index, filename, img ) => {
        if ( filename !== null ) {
            this.state.pictures[picture_index] = filename
            this.state.temps[picture_index] = img
        } else {
            this.state.files = []
            this.state.pictures = []
            this.state.temps = []
            this.state.crops = []
        }
        this.forceUpdate()

    }
    updateFiles = ( files ) => {
        if ( files.length > 0 ) {
            this.state.files = files
            this.forceUpdate()
            for ( var i = 0; i < this.state.files.length; i++ ) {
                const _i = i
                this.resetCropped( _i )
                this.updateCrop( _i, this.getCropMax() )
            }
        }
    }
    resetFiles = ( e ) => {
        console.log( 'ImageCrop: resetFiles' )
        this.state.files = []
        this.state.pictures == []
        this.state.temps = []

        this.state.cropped = [false]
        this.forceUpdate()
    }
    prevent = ( e ) => { e.preventDefault() }
    handleImageChange = ( e ) => {
        console.log( 'ImageCrop: handleImageChange' )
        this.updateFiles( e.target.files )
        for ( var i = 0; i < this.state.files.length; i++ ) {
            const imageType = /^image\//;
            const _i = i
            const picture = e.target.files[_i]
            // if the file is not of image type, continue the loop
            if ( !picture || !imageType.test( picture.type ) ) {
                //this.state.files.splice(i,1)
                continue;
            } else {

                const reader = new FileReader();
                reader.onload = ( e2 ) => {
                    this.updateImageForCrop( _i, picture.name, e2.target.result )
                };

                reader.readAsDataURL( picture );
            }
        }
    }

    handlePostSubmit = ( e ) => {
        e.preventDefault()
        this.props.dispatch( formActions.addPost( this.state.text, this.state.temps, this.state.pictures ) )
        this.resetFiles( e )
    }
    handleSubmit = ( base64, picture, e ) => {
        this.props.dispatch( formActions.uploadCoverImage( base64, picture ) )
        this.resetFiles( e )
    }
    handleProfileSubmit = ( base64, picture, e ) => {
        this.props.dispatch( formActions.uploadProfileImage( base64, picture ) )
        this.resetFiles( e )
    }
    handleCoverImageChange = ( e ) => {
        this.props.dispatch( formActions.updateCoverFiles( e.target.files ) )
        const imageType = /^image\//;
        const picture = e.target.files[0]
        if ( !picture || !imageType.test( picture.type ) ) {
            return;
        }

        const reader = new FileReader();

        reader.onload = ( e2 ) => {
            this.props.dispatch( formActions.updateCoverImageForCrop( picture.name, e2.target.result ) )
            this.props.dispatch( formActions.setCoverCropMax() )
        };

        reader.readAsDataURL( picture );
    }
    openProfileCrop = ( e ) => {
        this.state.profileCrop = true
        this.forceUpdate()
    }
    closeProfileCrop = ( e ) => {
        this.state.profileCrop = false
        this.forceUpdate()
    }
    generateNodePost( crop, temp, index ) {
        return (
            <span className="post-temp-crops-inner" key={'post_temp_crop_' + index}>
                <ReactCrop onChange={( e ) => this.onCropChange( index, e )}
                    src={temp == null ? ' ' : temp}
                    crop={crop == null ? state.crop : crop} />
                <div className="post-image-buttons">
                    <button onClick={( e ) => this.submitCrop( index, e )}
                        className={'btn btn-xs btn-default'} type={'submit'}>
                        <img style={{ height: '23px' }} src="/static/img/cropper.png" />
                        <input id={'file-hidden_' + index} type={'hidden'}
                            name={'picture'} value={temp}></input>
                    </button>
                </div>
            </span>
        )

    }

    render() {

        const state = this.state
        var lowOpac = ""
        let nodes = []
        let forms = []
        switch ( state.type ) {
            case "post":
                let file_input = (
                    <label
                        key={'picture_post_'}
                        htmlFor={"picture"}
                        onClick={state.files.length > 0 ? ( () => this.resetFiles ) : undefined}
                        className={'btn ' +
                            ( state.files.length === 0 ? 'btn-info' : 'btn-danger' )}>
                        <input id={"picture"} type={'file'} className={'post-file-input'} style={{ opacity: '0', height: '0px', width: '30px', zIndex: '1' }}
                            name={'picture'} onChange={this.handleImageChange} multiple></input>
                        <i className={'glyphicon ' +
                            ( state.files.length === 0 ?
                                'glyphicon-camera lo-white' :
                                'glyphicon-trash lo-red' ) + ' border-sm'}
                            style={{ fontSize: '25px' }}></i>
                    </label> )
                let form = (
                    <form key={'picture_post_form'} ref="form" onSubmit={this.handlePostSubmit} encType={'multipart/form-data'}>
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
                                value={this.state.text} onChange={( e ) => this.handleTextChange( e )}
                                className={'form-control'} />
                            {file_input}
                        </div>
                    </form> )
                forms.push( form )

                // crop nodes for post. loop through temp (b64) images
                state.temps.map(( temp, index ) =>
                    nodes.push( this.generateNodePost( state.crops[index], temp, index ) ) )
                break;

            /** Cover Image */

            case "cover":
                const c_tooltip = <Tooltip id="c_tooltip">Change Cover</Tooltip>
                let cover_node = (
                    <div key='cover_crop_wrapper' className="p-cover-wrapper">
                        <div className={'p_cover'}>
                            {state.temps[0] !== undefined ?
                                <ReactCrop
                                    style={{ width: '100%', height: '100%' }}
                                    onChange={( e ) => this.onCropChange( 0, e )}
                                    src={state.temps[0]}
                                    crop={state.crop} /> :
                                <img className="drop-shadow" src={this.props.initial}></img>
                            }
                        </div>

                        <span className="input-group controls text-right">
                            <span className="input-group-btn">
                                {state.cropped[0] ? (
                                    <button onClick={
                                        ( e ) => this.handleSubmit( state.temps[0], state.pictures[0], e )}
                                        style={{}} className={'btn btn-success'}
                                        type={'submit'}>
                                        <i className="glyphicon glyphicon-save border-sm lo-white"
                                            style={{ fontSize: '17px', top: '3px' }} />
                                    </button>
                                ) : ( '' )}
                                <OverlayTrigger placement="left" overlay={c_tooltip}>
                                    <div className="lo-white btn btn-default" style={{ maxWidth: '35px', maxHeight: '35px' }}>
                                        <label htmlFor="id_cover"
                                            onClick={state.temps[0] !== undefined ? this.resetFiles : undefined}
                                            className="label-hover" style={{}}>
                                            <i className={'glyphicon glyphicon-camera border-sm lo-white'}
                                                style={{ fontSize: '18px', left: '-4px', top: '0' }}></i>
                                        </label>
                                        <input id="id_cover" type="file" style={{ opacity: '0', height: '0px' }} onChange={( e ) => this.handleImageChange( e )}></input>
                                    </div>
                                </OverlayTrigger>

                                {( state.temps[0] !== undefined && state.temps[0] !== "" ) && (
                                    <button className="cover-crop-button" onClick={( e ) => this.submitCrop( 0, e )}
                                        style={{}}
                                        className={'btn btn-default cover-crop-button'}
                                        type={'submit'}>
                                        <img height="20px" width="20px" src="/static/img/cropper.png" />
                                        <input id="file-hidden2"
                                            type={'hidden'}
                                            name={'file'}
                                            value={state.temps[0] !== undefined ?
                                                state.temps[0] : null}></input>
                                    </button> )}
                            </span>
                        </span>
                    </div> )
                nodes.push( cover_node )
                break;

            /** Profile Image */

            case "profile":
                const customStyles = {
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        width: 'auto',
                        maxWidth: '100vw',
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        borderRadius: '20px',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        transform: 'translate(-50%, -50%)'
                    },
                    overlay: {
                        backgroundColor: 'rgba(0,0,0,0.55)'
                    }
                };
                const sp_tooltip = <Tooltip id="save_p_image_tooltip">Save Profile Image</Tooltip>
                const choose_img_tooltip = <Tooltip id="choose_img_tooltip">Choose Profile Image</Tooltip>
                const select_img_tooltip = <Tooltip id="select_p_image_tooltip">Select Image</Tooltip>
                const crop_tooltip = <Tooltip id="crop_p_tooltip">Crop Current Selection</Tooltip>
                const close_tooltip = <Tooltip id="close_p_tooltip">Close</Tooltip>
                let profile_node = (
                    <div key={'2'} className="profile-image-wrapper">
                        <img className={'p_img_round img-thumbnail drop-shadow-lt'} style={{ zIndex: '0' }}
                            src={this.props.initial_profile} />
                        {state.check_user ?
                            <OverlayTrigger placement="bottom" overlay={choose_img_tooltip}>
                                <label className="profile-file-button">
                                    <i onClick={( e ) => this.openProfileCrop( e )}
                                        className={'glyphicon glyphicon-camera border-sm p-cam lo-white pull-left btn btn-default btn-sm'}>
                                    </i>

                                </label>
                            </OverlayTrigger> : null}
                        <Modal
                            onRequestClose={( e ) => this.closeProfileCrop( e )}
                            isOpen={state.profileCrop}
                            classes={'inset-shade'}
                            style={customStyles}>
                            <span style={{ paddingTop: '10px', paddingBottom: '5px' }}
                                className="input-group-btn text-center">
                                {state.cropped[0] && (
                                    <OverlayTrigger placement="bottom" overlay={sp_tooltip}>
                                        <button onClick={( e ) => this.handleProfileSubmit(
                                            state.temps[0], state.pictures[0], e )}
                                            className={'btn btn-default btn-sm'} type={'submit'}>
                                            <i className="glyphicon glyphicon-save border-sm lo-green" />
                                        </button>
                                    </OverlayTrigger>
                                )}
                                <OverlayTrigger placement="bottom" overlay={select_img_tooltip}>
                                    <label htmlFor="profile_file"
                                        className={'btn btn-default btn-sm'}>
                                        <i className={'glyphicon glyphicon-camera border-sm lo-white '}></i>

                                    </label>
                                </OverlayTrigger>
                                {( state.temps[0] !== undefined && state.temps[0] !== "" ) && (
                                    <OverlayTrigger placement="bottom" overlay={crop_tooltip}>
                                        <button onClick={( e ) => this.submitCrop( 0, e )}
                                            className={'btn btn-default btn-sm'} type={'submit'}>
                                            <img height="23"
                                                src="/static/img/cropper.png" />
                                        </button>
                                    </OverlayTrigger>
                                )}
                                <OverlayTrigger placement="bottom" overlay={close_tooltip}>
                                    <span className={'btn btn-danger btn-sm'} onClick={( e ) => this.closeProfileCrop( e )} >
                                        <i className={'glyphicon glyphicon-remove border-sm lo-white'}></i>
                                    </span>
                                </OverlayTrigger>
                            </span>
                            <input id="profile_file"
                                type="file"
                                style={{ opacity: '0', height: '0px', width: '0px' }}
                                onChange={( e ) => this.handleImageChange( e )}>
                            </input>
                            {state.temps[0] !== undefined ?
                                <ReactCrop
                                    imageStyle={{ maxWidth: '300px', maxHeight: '300px' }}
                                    className={'img-thumbnail'}
                                    onChange={( e ) => this.onCropChange( 0, e )}
                                    src={state.temps[0] !== undefined ? state.temps[0] : this.props.initial_profile}
                                    crop={state.crop} /> :
                                <img style={{ maxWidth: '300px', maxHeight: '300px' }}
                                    className={'img-thumbnail drop-shadow-lt'} src={this.props.initial_profile} />}

                        </Modal>
                    </div>
                )
                nodes.push( profile_node )
                break;
            default:
                break;
        }
        return (
            <span>
                {state.type === 'post' && forms}

                <span key={'post_crop_nodes'} className={state.type === 'post' ? 'post-temp-crops' : undefined}>
                    {nodes}
                </span>

            </span>
        )
    }
}
const mapStateToProps = function( state, ownProps ) {
    return {
        initial: state.globalfeed.currentProfile.profile.cover_image_url,
        initial_profile: state.globalfeed.currentProfile.profile.profile_image
    }

}
export default connect( mapStateToProps, null )( ImageCrop )

