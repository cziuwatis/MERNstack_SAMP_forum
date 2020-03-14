import React, {Component} from "react";
import {Redirect} from 'react-router-dom';

export default class RegistrationForm extends Component
{
    constructor()
    {
        super();
        this.state =
                {
                    email: "",
                    password: "",
                    confirmedPassword: "",
                    changedOnce: false,
                    loggedIn: false
                };
    }

    handleChange = e =>
    {
        this.setState({[e.target.name]: e.target.value});
        this.setState({changedOnce: true});
    }
    ;
            handleSubmit = e =>
    {
        const formInputsState = this.validate();

        if (Object.keys(formInputsState).every(index => formInputsState[index]))
        {
            sessionStorage.loggedIn = 'true';
            this.setState({loggedIn: true});
        } else // invalid inputs in form
        {
            e.preventDefault();
            return;
        }
    }
    ;
            componentDidMount()
    {
        this.inputToFocus.focus();
    }

    validateEmail()
    {
        // valid email pattern
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(String(this.state.email).toLowerCase());
    }

    validatePassword()
    {
        //const pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[£!#€$%^&*]).{10,}$/;        
        //return pattern.test(String(this.state.password)); 
        return this.validatePasswordErrors().length === 0;
    }
    validatePasswordErrors()
    {
        let errorMessage = [];

        if (String(this.state.password).length < 10)
        {
            errorMessage.push(<li>Password cannot be less than 10 characters in length</li>);
        }
        if (!/[a-z]+/.test(String(this.state.password)))
        {
            errorMessage.push(<li>Password must contain a lowercase letter</li>);
        }
        if (!/[A-Z]+/.test(String(this.state.password)))
        {
            errorMessage.push(<li>Password must contain an uppercase letter</li>);
        }
        if (!/[0-9]+/.test(String(this.state.password)))
        {
            errorMessage.push(<li>Password must contain a digit</li>);
        }
        if (!/[£!#€$%^&*]+/.test(String(this.state.password)))
        {
            errorMessage.push(<li>Password must contain at least one of the following symbols [£!#€$%^&*]</li>);
        }
        return errorMessage;
    }
    validateConfirmedPassword()
    {
        return this.state.password === this.state.confirmedPassword;
    }

    validate()
    {
        return {
            email: this.validateEmail(),
            password: this.validatePassword(),
            confirmedPassword: this.validateConfirmedPassword()
        };
    }

    render()
    {

        let states = {email: true, password: true, confirmedPassword: true};
        let correctString = "";
        if (this.state.changedOnce)
        {
            states = this.validate();
            correctString = "correct";

        }
        if (this.state.loggedIn === true)
        {
            return <Redirect to='/DisplayAllCars' />;
        }
        return (
                <form noValidate = "true" id = "loginForm" onSubmit = {this.handleSubmit}>
                    <div className = {states.email ? correctString : "error"}>
                        <input  
                            name = "email"              
                            type = "email"
                            placeholder = "Email"
                            value = {this.state.email}
                            onChange = {this.handleChange}
                            ref = {(input) => {
                                    this.inputToFocus = input
                            }}
                
                            />
                    </div>
                    <div className={states.email ? "hide" : ""}>
                        <span className="errorMessage">Email needs to be of format a@a.com</span>
                    </div>
                
                    <div className = {states.password ? correctString : "error"}>
                        <input   
                            name = "password"          
                            type = "password"
                            placeholder = "Password"
                            value = {this.state.password}
                            onChange = {this.handleChange}
                
                            />
                    </div>
                    <div className={states.password ? "hide" : ""}>
                        <ul className="errorMessage"> {this.validatePasswordErrors()}</ul>
                    </div>
                
                    <div className = {states.confirmedPassword ? correctString : "error"}>
                        <input   
                            name = "confirmedPassword"          
                            type = "password"
                            placeholder = "Confirm Password"
                            value = {this.state.confirmedPassword}
                            onChange = {this.handleChange}
                
                            />
                    </div>
                    <div className={states.confirmedPassword ? "hide" : ""}>
                        <span className="errorMessage">Passwords must match!</span>
                    </div>
                
                
                    <input 
                        type = "submit" 
                        value = "Register" 
                        className={(this.state.changedOnce && Object.keys(states).every(state => states[state] === true) ? "" : "disabled")}
                        />
                </form>
                    );
    }
}