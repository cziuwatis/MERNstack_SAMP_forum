import React, {Component} from "react";
import Form from 'react-bootstrap/Form';
import LoginForm from './LoginForm';

import {Redirect, Link} from 'react-router-dom';


export default class Login extends Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            loggedIn: sessionStorage.loggedIn === "true" ? true : false
        };
    }

    render()
    {
        let content = (<div>
                <Link to="/LoginForm" >Login</Link>
                <Link to="/RegistrationForm" >Register</Link>
                    </div>);
                  
        if(this.state.loggedIn === true)
        {
            return <Redirect to='/DisplayAllCars' />;
        }
        
        
        return (
                <div className="form-container">                  
                  {content}
                </div>
               );
        }
}