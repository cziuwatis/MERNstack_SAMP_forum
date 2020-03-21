import React, {Component} from "react";
import axios from 'axios';
export default class Avatar extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            image: 'http://localhost:4000/img/profiles/' + this.props.avatar,
            valid: false,
            uploadedOnce: false,
            errorMessages: []
        }
    }

    uploadImage = e => {
//        let imageFormObject = new FormData();
//        imageFormObject.append("imageName", 'profile-image-' + this.props.userId);
//        imageFormObject.append('imageData', e.target.files[0]);

        // this.setState({image: URL.createObjectURL(e.target.files[0])});


    }

    previewImage = e => {
        let file = e.target.files[0];
        let errors = this.validateImage(file);
        if (errors.length > 0) {
            e.preventDefault();
            this.setState({uploadedOnce: true, valid: false, errorMessages: errors});
        } else {
            this.setState({image: URL.createObjectURL(e.target.files[0]), valid: true, errorMessages: []});
        }
    }

    handleSubmit = e => {
        if (this.state.valid) {
            let file = new FormData(e.target).get('avatar');
            e.preventDefault();
            let imageFormObject = new FormData();
            imageFormObject.append("imageName", 'profile-image-' + this.props.userId);
            imageFormObject.append('imageData', file);
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:4000/image/upload', imageFormObject)
                    .then(res => !res.data.error ? window.location.pathname = '/settings' : alert(res.data.error))
                    .catch((error) => console.log(error));
        } else {
            e.preventDefault();
            this.setState({valid: false, uploadedOnce: true});
        }
    }

    validateImage(file) {
        let errorMessages = [];
        if (!(file.type === 'image/jpeg' || file.type === 'image/jpe' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/png')) {
            errorMessages.push(<span key={0} className="ag_settings_setting_error"><i className="fas fa-exclamation-triangle"></i>File type can only be of type JPEG, JPE, GIF, JPG or PNG!</span>);
        }
        if (file.size > 1024 * 1024 * 5) {
            errorMessages.push(<span key={1} className="ag_settings_setting_error"><i className="fas fa-exclamation-triangle"></i>File size cannot be greater than 5MB!</span>)
        }
        return errorMessages;
    }

    render() {
        return (
                <div className="ag_settings_setting_container">
                    <form onSubmit={this.handleSubmit} className='ag_settings_setting ag_settings_change_avatar'>
                        <div className="ag_settings_setting_error_container">
                            {this.state.success ? <span key={55} className='ag_settings_setting_success'>Successfully saved!</span> : null}
                            {this.state.errorMessages}
                        </div>
                        <div className='ag_settings_avatars_images_container'>
                            <img className='ag_settings_avatar_post' src={this.state.image} alt='uploadImage' />
                            <img className='ag_settings_avatar_square' src={this.state.image} alt='uploadImage' />
                            <img className='ag_settings_avatar_round' src={this.state.image} alt='uploadImage' />
                        </div>
                        <div className='ag_settings_avatar_upload_image_container'>
                            <span className='ag_settings_avatar_image_info'>Accepted formats for images are JPG, JPE, JPEG, PNG and GIF, file size cannot be greater than 5MB</span>
                            <label className='ag_btn ag_common_btn' htmlFor='ag_settings_avatar_upload'>Upload a new profile picture</label>
                            <input name='avatar' id='ag_settings_avatar_upload' type='file' onChange={this.previewImage} />
                        </div>
                        <button onSubmit={this.handleSubmit} className="ag_btn ag_common_btn ag_submit_button">Save</button>
                    </form>
                </div>
                );
    }
}