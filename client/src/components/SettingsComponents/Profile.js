import React, {Component} from "react";
import axios from 'axios';
export default class Profile extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username,
            email: this.props.email,
            changedOnce: false,
            success: false
        };
    }
    handleChange = e =>
    {
        this.setState({[e.target.name]: e.target.value, changedOnce: true, success: false});
    }

    validateUsername() {
        let errorMessage = [];
        if (this.state.username.trim().length < 3) {
            errorMessage.push(<span key={0} className="ag_settings_setting_error"><i className="fas fa-exclamation-triangle"></i>Username needs to be longer than 3 characters</span>);
        }
        if (this.state.username.trim().length > 20) {
            errorMessage.push(<span key={1} className="ag_settings_setting_error"><i className="fas fa-exclamation-triangle"></i>Username cannot be longer than 20 characters</span>);
        }
        if (/[^0-9a-zA-Z _-]+/.test(this.state.username.trim())) {
            errorMessage.push(<span key={2} className="ag_settings_setting_error"><i className="fas fa-exclamation-triangle"></i>Username can only be made up of alphanumeric characters and these special characters:  _-</span>);
        }
        return errorMessage;
    }

    validateEmail()
    {
        let errorMessage = [];

        // valid email pattern
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!pattern.test(String(this.state.email).toLowerCase())) {
            errorMessage.push(<span key={3} className="ag_settings_setting_error"><i className="fas fa-exclamation-triangle"></i>Invalid email, email must be of format email@email.com</span>);
        }
        return errorMessage;
    }

    handleSubmit = e => {
        e.preventDefault();
        let errorMessages = this.validateUsername();
        errorMessages = errorMessages.concat(this.validateEmail());
        if (!errorMessages.length) {
            axios.defaults.withCredentials = true;
            axios.put('http://localhost:4000/users/edit_user/', {username: this.state.username, email: this.state.email})
                    .then(res => !res.data.error ? this.updateProfile() : alert(res.data.error))
                    .catch((error) => console.log(error));
        } else {
            console.log("hey");
            this.setState({changedOnce: true});
        }
    }
    
    updateProfile(){
        sessionStorage.username = this.state.username;
        window.location.pathname = '/settings';
    }
    
    render() {
        let errorMessages;
        if (this.state.changedOnce) {
            errorMessages = this.validateUsername();
            errorMessages = errorMessages.concat(this.validateEmail());
        }
        return (
                <div className="ag_settings_setting_container">
                    <form onSubmit={this.handleSubmit} className="ag_settings_setting ag_settings_change_details">
                        <div className="ag_settings_setting_error_container">
                        {this.state.success ? <span key={55} className='ag_settings_setting_success'>Successfully saved!</span> : null}
                            {errorMessages}
                        </div>
                        <label>username</label>
                        <input name='username' className="ag_username_input" onChange={this.handleChange} value={this.state.username}/>
                        <label>email</label>
                        <input name='email' className="ag_email_input" onChange={this.handleChange} value={this.state.email}/>
                        <button onSubmit={this.handleSubmit} className="ag_btn ag_common_btn">Save</button>
                    </form>
                </div>
                );
    }
}