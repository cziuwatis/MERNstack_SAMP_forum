import React, {Component} from "react";
import Form from 'react-bootstrap/Form'
import {Link} from 'react-router-dom';
import axios from 'axios';


export default class AddCar extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            model: '',
            colour: '',
            year: '',
            price: ''
        }
    }


    componentDidMount() 
    {     
        this.inputToFocus.focus();
    }
 
 
    handleChange = (e) => 
    {
        this.setState({[e.target.name]: e.target.value})
    }


    handleSubmit = (e) => 
    {
        e.preventDefault();

        const carObject = {
            model: this.state.model,
            colour: this.state.colour,
            year: this.state.year,
            price: this.state.price
        };
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:4000/cars/add_car', carObject)
             .then(res => this.props.history.push('/DisplayAllCars'),
             ((error) => console.log(error)));

    }


    render()
    {
        return (
                <div className="form-container">
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="model">
                      <Form.Label>Model</Form.Label>
                      <Form.Control ref = {(input) => { this.inputToFocus = input }} type="text" name="model" value={this.state.model} onChange={this.handleChange} />
                    </Form.Group>
    
                    <Form.Group controlId="colour">
                      <Form.Label>Colour</Form.Label>
                      <Form.Control type="text" name="colour" value={this.state.colour} onChange={this.handleChange} />
                    </Form.Group>
    
                    <Form.Group controlId="year">
                      <Form.Label>Year</Form.Label>
                      <Form.Control type="text" name="year" value={this.state.year} onChange={this.handleChange} />
                    </Form.Group>
    
                    <Form.Group controlId="price">
                      <Form.Label>Price</Form.Label>
                      <Form.Control type="text" name="price" value={this.state.price} onChange={this.handleChange} />
                    </Form.Group>
            
                    <span className="green-button" onClick={this.handleSubmit}>
                      Add
                    </span>
            
                    <Link className="red-button" to={"/DisplayAllCars"}>
                      Cancel
                    </Link>
                  </Form>
                </div>
               );
        }
}
