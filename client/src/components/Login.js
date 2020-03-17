import React, {Component} from "react";
import axios from 'axios';
import  { Redirect } from 'react-router-dom';
export default class Login extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            email: "",
            password: "",
            loggedIn: false,
            valid: true,
            accessLevel: 0
        }
    }

    login(data) {
        if (data.valid) {
            sessionStorage.loggedIn = 'true';
            sessionStorage.accessLevel = data.accessLevel;
        }
        this.setState({loggedIn: data.valid, valid: data.valid});
    }

    handleSubmit = e => {
        e.preventDefault();
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:4000/users/login', {email: this.state.email.trim(), password: this.state.password})
                .then(res => !res.data.error ?
                            this.login(res.data)
                            : this.handleError(res.data.error))
                .catch((error) => console.log(error));

    }

    handleError(error) {
        alert(error);
    }

    handleChange = e =>
    {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        if (sessionStorage.loggedIn === 'true' || this.state.loggedIn == true) {
            sessionStorage.loggedIn = 'true';
            window.location.pathname = '/'; //using this since header needs to be rerendered
            //return <Redirect to={'/'}/>
        }
        return (
                <div id="ag_login">
                    <form onSubmit={this.handleSubmit} autoComplete="off" id="ag_login_form">
                        <h2 className='ag_login_title'>Login</h2>
                        {
                            !this.state.valid ?
                                    <div className="ag_login_error_container">
                                        <span className="ag_login_error">LOGIN CREDENTIALS DO NOT MATCH</span>
                                    </div>
                                    : null
                        }
                        <div className='ag_login_inputs_container'>
                            <label>email</label>
                            <input name="email" value={this.state.email} onChange = {this.handleChange} className='ag_login_input' type='text' placeholder='Enter your email here'/>
                            <label>password</label>
                            <input name="password" value={this.state.password} onChange = {this.handleChange} className='ag_login_input' type='password' placeholder='Enter your password here'/>
                        </div>
                        <div className='ag_login_buttons_container'>
                            <button onClick={this.handleSubmit} className='ag_btn ag_common_btn'>Login</button>
                        </div>
                    </form>
                </div>
                );
    }
}