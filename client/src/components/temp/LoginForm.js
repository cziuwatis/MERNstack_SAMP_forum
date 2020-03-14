import React, {Component} from "react";
import {Redirect} from 'react-router-dom';
import axios from 'axios';


export default class LoginForm extends Component 
{
    constructor() 
    {
        super();
        this.state = 
        {
			email:"",
			password:"",
            wasSubmittedAtLeastOnce:false,
            loggedIn:false 
        };
    }


    handleChange = e =>  
    {
        this.setState({[e.target.name]: e.target.value});
    }  


    handleSubmit = e => 
    {        
        this.setState({ wasSubmittedAtLeastOnce: true });
        const formInputsState = this.validate();
    
        if (Object.keys(formInputsState).every(index => formInputsState[index])) 
        {
        sessionStorage.loggedIn = 'true'; 
        this.setState({loggedIn:true}); 
        }
        else // invalid inputs in form
        {
            e.preventDefault();
            return;    
        }
    };

    validateEmail()
    {    
        // valid email pattern
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(String(this.state.email).toLowerCase());
    }


    validatePassword()
    {    
        const pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[£!#€$%^&*]).{10,}$/;
        return pattern.test(String(this.state.password)); 
    }

    validate() 
    {
        const email = this.state.email;
        const password = this.state.password;
        //console.log(email);
        axios.defaults.withCredentials = true;
        setTimeout(axios.post('http://localhost:4000/users/validate_user/', {email: email, password: password})
                               .then(res => console.log(res),
                               ((error) => console.log(error))), 200);
        
        return {
            email: this.validateEmail(),
            password: this.validatePassword()
        };
    }


    render() 
    {
        let errorMessage = "";
        if(this.state.wasSubmittedAtLeastOnce)
        {
            errorMessage = <div className="error">Login Details are incorrect<br/></div>;
        }
        if(this.state.loggedIn === true)
        {
            return <Redirect to='/DisplayAllCars' />;
        }
        return (          
          <form noValidate id="loginForm" onSubmit = {this.handleSubmit}>
            {errorMessage}
            
            <input     
                name = "email"
                type = "text"
                placeholder = "Email"
                value = {this.state.email}
                onChange = {this.handleChange}
            />
            
               
            <input   
              name = "password"
              type = "password"
              placeholder = "Password"
              value = {this.state.password}
              onChange = {this.handleChange}
            />

                                    
            <input 
              type = "submit" 
              value = "Login" 
            />
          </form>
        );
    }
}