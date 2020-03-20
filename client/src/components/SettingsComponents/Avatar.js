import React, {Component} from "react";
import axios from 'axios';
export default class Avatar extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            image: '/img/profiles/profile.png'
        }
    }

    uploadImage = e => {
        let imageFormObject = new FormData();
        imageFormObject.append("imageName", 'profile-image-' + this.props.userId);
        imageFormObject.append('imageData', e.target.files[0]);

        // this.setState({image: URL.createObjectURL(e.target.files[0])});

        axios.defaults.withCredentials = true;
        axios.post('http://localhost:4000/image/upload', imageFormObject)
                .then(res => !res.data.error ? this.setState({image: URL.createObjectURL(e.target.files[0])}) : alert(res.data.error))
                .catch((error) => console.log(error));
    }

    render() {
        return (
                <div>
                    <form>
                        <img src={this.state.image} alt='uploadImage' />
                        <input type='file' onChange={this.uploadImage} />
                    </form>
                </div>
                );
    }
}