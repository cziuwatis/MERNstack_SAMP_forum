import React, {Component} from 'react';
import {Link} from 'react-router-dom';


export default class CarTableRow extends Component 
{    
    deleteCar = () => 
    {
         this.props.history.push('/DeleteCar/' + this.props.obj._id);
    }
    
    
    editCar = () => 
    {
        this.props.history.push('/EditCar/' + this.props.obj._id);
    }

    render() 
    {
        return (
                <tr>
                  <td>{this.props.car.model}</td>
                  <td>{this.props.car.colour}</td>
                  <td>{this.props.car.year}</td>
                  <td>{this.props.car.price}</td>
                  <td>
                    <Link className="green-button" to={"/EditCar/" + this.props.car._id}>
                      Edit
                    </Link>
                                        
                    <Link className="red-button" to={"/DeleteCar/" + this.props.car._id}>
                      Delete
                    </Link>                     
                  </td>
                </tr>
               );
    }
}