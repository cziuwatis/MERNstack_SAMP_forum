import React, {Component} from "react";
import axios from 'axios';
export default class Credentials extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirmedPassword: '',
            changedOnce: false,
            success: false
        };
    }
    handleChange = e =>
    {
        this.setState({[e.target.name]: e.target.value, changedOnce: true, success: false});
    }
    handleSubmit = e => {
        e.preventDefault();
        let errorMessages = this.validatePassword();
        errorMessages = errorMessages.concat(this.validateConfirmedPassword());
        if (!errorMessages.length) {
            axios.defaults.withCredentials = true;
            axios.put('http://localhost:4000/users/edit_user/', {password: this.state.password})
                    .then(res => !res.data.error ? this.updateProfile() : alert(res.data.error))
                    .catch((error) => console.log(error));
        } else {
            this.setState({changedOnce: true});
        }
    }
    updateProfile() {
        this.setState({success: true, changedOnce: true});
    }

    validatePassword()
    {
        let errorMessage = [];

        if (String(this.state.password).length < 10)
        {
            errorMessage.push(<span key={4} className="ag_settings_setting_error"><i className="fas fa-exclamation-triangle"></i>Password cannot be less than 10 characters in length</span>);
        }
        if (!/[a-z]+/.test(String(this.state.password)))
        {
            errorMessage.push(<span key={5} className="ag_settings_setting_error"><i className="fas fa-exclamation-triangle"></i>Password must contain a lowercase letter</span>);
        }
        if (!/[A-Z]+/.test(String(this.state.password)))
        {
            errorMessage.push(<span key={6} className="ag_settings_setting_error"><i className="fas fa-exclamation-triangle"></i>Password must contain an uppercase letter</span>);
        }
        if (!/[0-9]+/.test(String(this.state.password)))
        {
            errorMessage.push(<span key={7} className="ag_settings_setting_error"><i className="fas fa-exclamation-triangle"></i>Password must contain a digit</span>);
        }
        if (!/[£!#€$%^&*]+/.test(String(this.state.password)))
        {
            errorMessage.push(<span key={8} className="ag_settings_setting_error"><i className="fas fa-exclamation-triangle"></i>Password must contain at least one of the following symbols [£!#€$%^&*]</span>);
        }
        return errorMessage;
    }

    validateConfirmedPassword()
    {
        let errorMessage = [];
        if (this.state.password !== this.state.confirmedPassword) {
            errorMessage.push(<span key={22} className="ag_settings_setting_error"><i className="fas fa-exclamation-triangle"></i>Passwords must match!</span>);
        }
        return errorMessage;
    }
    render() {
        let errorMessages;
        if (this.state.changedOnce) {
            errorMessages = this.validatePassword();
            errorMessages = errorMessages.concat(this.validateConfirmedPassword());
        }
        return (
                <div className="ag_settings_setting_container">
                    <form onSubmit={this.handleSubmit} className="ag_settings_setting ag_settings_change_credentials">
                        <div className="ag_settings_setting_error_container">
                            {this.state.success ? <span key={55} className='ag_settings_setting_success'>Successfully saved!</span> : null}
                            {errorMessages}
                        </div>
                        <label>password</label>
                        <input type='password' autoComplete="new-password" name='password' className="ag_new_password_input" onChange={this.handleChange} value={this.state.password}/>
                        <label>confirm password</label>
                        <input type='password' autoComplete="new-password" name='confirmedPassword' className="ag_confirm_password_input" onChange={this.handleChange} value={this.state.confirmedPassword}/>
                        <button onSubmit={this.handleSubmit} className="ag_btn ag_common_btn">Save</button>
                    </form>
                </div>
                );
    }
}