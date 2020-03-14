import React, {Component} from "react";
import Form from 'react-bootstrap/Form';
import {Redirect} from 'react-router-dom';
import axios from 'axios';


export default class Logout extends Component
{
    constructor(props)
    {
        super(props)
        this.state = ({loggedIn: true});
    }

    handleSubmit = (e) =>
    {
        e.preventDefault();
        axios.post('http://localhost:4000/users/logout/')
                .then(res => console.log(res));
        sessionStorage.loggedIn = 'false';
        this.setState({loggedIn: false});
    }

    render()
    {
        let content = <Form onSubmit={this.handleSubmit}>
            <span className="red-button" onClick={this.handleSubmit}>
                Log out
            </span>
        </Form>

        if (this.state.loggedIn === false)
        {
            content = <Redirect to='/DisplayAllCars' />
        }

        return (
                <div className="form-container">                  
                    {content}
                </div>
                );
    }
}