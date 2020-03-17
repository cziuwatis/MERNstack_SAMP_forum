import React, {Component} from "react";
import axios from 'axios';
import  { Redirect } from 'react-router-dom';
export default class Register extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            confirmedPassword: "",
            loggedIn: false,
            changedOnce: {username: false,
                email: false,
                password: false,
                confirmedPassword: false
            }
        }
    }

    handleError(error) {
        alert(error);
    }

    register() {
        sessionStorage.loggedIn = true;
        sessionStorage.accessLevel = 1;
        sessionStorage.username = this.state.username;
        this.setState({loggedIn: true});
    }

    handleSubmit = e =>
    {
        e.preventDefault();
        const formInputsState = this.validate();

        if (Object.keys(formInputsState).every(index => formInputsState[index]))
        {
            const {username, email, password} = this.state;
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:4000/users/register', {username: username.trim(), email: email.trim(), password: password})
                    .then(res => !res.data.error ?
                                this.register()
                                : this.handleError(res.data.error))
                    .catch((error) => console.log(error));
        } else // invalid inputs in form
        {
            this.setState({changedOnce: {username: true, email: true, password: true, confirmedPassword: true}});
            return;
        }
    }

    validate() {
        return {

            username: (this.validateUsername().length == 0),
            email: (this.validateEmail().length == 0),
            password: (this.validatePassword().length == 0),
            confirmedPassword: (this.validateConfirmedPassword().length == 0)
        };
    }

    handleChange = e =>
    {
        let changedOnceStates = this.state.changedOnce;
        changedOnceStates[e.target.name] = true;
        this.setState({[e.target.name]: e.target.value, changedOnce: changedOnceStates});
    }

    validateUsername() {
        let errorMessage = [];
        if (this.state.username.trim().length < 3) {
            errorMessage.push(<span key={0} className="ag_registration_error"><i className="fas fa-exclamation-triangle"></i>Username needs to be longer than 3 characters</span>);
        }
        if (this.state.username.trim().length > 20) {
            errorMessage.push(<span key={1} className="ag_registration_error"><i className="fas fa-exclamation-triangle"></i>Username cannot be longer than 20 characters</span>);
        }
        if (/[^0-9a-zA-Z _-]+/.test(this.state.username.trim())) {
            errorMessage.push(<span key={2} className="ag_registration_error"><i className="fas fa-exclamation-triangle"></i>Username can only be made up of alphanumeric characters and these special characters:  _-</span>);
        }
        return errorMessage;
    }

    validateEmail()
    {
        let errorMessage = [];

        // valid email pattern
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!pattern.test(String(this.state.email).toLowerCase())) {
            errorMessage.push(<span key={3} className="ag_registration_error"><i className="fas fa-exclamation-triangle"></i>Invalid email, email must be of format email@email.com</span>);
        }
        return errorMessage;
    }

    validatePassword()
    {
        let errorMessage = [];

        if (String(this.state.password).length < 10)
        {
            errorMessage.push(<span key={4} className="ag_registration_error"><i className="fas fa-exclamation-triangle"></i>Password cannot be less than 10 characters in length</span>);
        }
        if (!/[a-z]+/.test(String(this.state.password)))
        {
            errorMessage.push(<span key={5} className="ag_registration_error"><i className="fas fa-exclamation-triangle"></i>Password must contain a lowercase letter</span>);
        }
        if (!/[A-Z]+/.test(String(this.state.password)))
        {
            errorMessage.push(<span key={6} className="ag_registration_error"><i className="fas fa-exclamation-triangle"></i>Password must contain an uppercase letter</span>);
        }
        if (!/[0-9]+/.test(String(this.state.password)))
        {
            errorMessage.push(<span key={7} className="ag_registration_error"><i className="fas fa-exclamation-triangle"></i>Password must contain a digit</span>);
        }
        if (!/[£!#€$%^&*]+/.test(String(this.state.password)))
        {
            errorMessage.push(<span key={8} className="ag_registration_error"><i className="fas fa-exclamation-triangle"></i>Password must contain at least one of the following symbols [£!#€$%^&*]</span>);
        }
        return errorMessage;
    }

    validateConfirmedPassword()
    {
        let errorMessage = [];
        if (this.state.password !== this.state.confirmedPassword) {
            errorMessage.push(<span key={9} className="ag_registration_error"><i className="fas fa-exclamation-triangle"></i>Passwords must match!</span>);
        }
        return errorMessage;
    }

    render() {
        if (sessionStorage.loggedIn === 'true' || this.state.loggedIn == true) {
            sessionStorage.loggedIn = 'true';
            window.location.pathname = '/';
            //return <Redirect to={'/'}/>
        }
        let usernameErrors = this.validateUsername();
        let emailErrors = this.validateEmail();
        let passwordErrors = this.validatePassword();
        let confirmedPasswordErrors = this.validateConfirmedPassword();
        return (
                <div id="ag_registration">
                    <form onSubmit={this.handleSubmit} autoComplete="off" id="ag_registration_form">
                        <h2 className='ag_registration_title'>Register</h2>
                        <div className='ag_registration_inputs_container'>
                            <label>username</label>
                            <input name="username" value={this.state.username} onChange = {this.handleChange} ref={(input) => {
                        this.inputToFocus = input
                                   }} className='ag_registration_input' type='text' placeholder='Enter your username here'/>
                            <div className={"ag_registration_error_container " + (!usernameErrors.length || !this.state.changedOnce.username ? "hide" : "")}>
                                {usernameErrors}
                            </div>
                            <label>email</label>
                            <input name="email" value={this.state.email} onChange = {this.handleChange} className='ag_registration_input' type='text' placeholder='Enter your email here'/>
                            <div className={"ag_registration_error_container " + (!emailErrors.length || !this.state.changedOnce.email ? "hide" : "")}>
                                {emailErrors}
                            </div>
                            <label>password</label>
                            <input name="password" value={this.state.password} onChange = {this.handleChange} className='ag_registration_input' type='password' placeholder='Enter your password here'/>
                            <div className={"ag_registration_error_container " + (!passwordErrors.length || !this.state.changedOnce.password ? "hide" : "")}>
                                {passwordErrors}
                            </div>
                            <label>confirm password</label>
                            <input name="confirmedPassword" value={this.state.confirmedPassword} onChange = {this.handleChange} className='ag_registration_input' type='password' placeholder='Confirm your password'/>
                            <div className={"ag_registration_error_container " + (!confirmedPasswordErrors.length || !this.state.changedOnce.confirmedPassword ? "hide" : "")}>
                                {confirmedPasswordErrors}
                            </div>
                        </div>
                        <div className='ag_registration_buttons_container'>
                            <button onClick={this.handleSubmit} className='ag_btn ag_common_btn'>Register</button>
                        </div>
                    </form>
                </div>
                    );
    }
}