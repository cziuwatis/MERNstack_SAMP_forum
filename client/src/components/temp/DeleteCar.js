import React, {Component} from "react";
import axios from 'axios';


export default class DeleteCar extends Component 
{
    constructor(props) 
    {
        super(props);
        axios.defaults.withCredentials = true;
        axios.delete('http://localhost:4000/cars/delete_car/' + this.props.match.params.id)
             .then(res => this.props.history.push('/DisplayAllCars'),
             (error => console.log(error)))
    }
  
  
    render() 
    {
        return (<div></div>);
    }
}
