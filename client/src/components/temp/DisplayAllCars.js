import React, {Component} from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';

import CarTable from './CarTable';
import Login from './Login';
import Logout from './Logout';


export default class DisplayAllCars extends Component 
{
    constructor(props) 
    {
        super(props)
        this.state = {
            cars: []
        };    
        // timer is needed to allow the database change to take effect before getting the results
        axios.defaults.withCredentials = true;
        axios.get('http://localhost:4000/cars/')
                               .then(res => this.setState({cars: res.data}),
                               ((error) => console.log(error)), 200);
  }
  

  render() {  
            let content = <div>
                            <div className="logout">
                              <Logout/>
                            </div>
                            <div className="table-container">
                              <CarTable cars={this.state.cars} /> 
                              <div className="add-new-car">
                                <Link className="blue-button" to={"/AddCar"}>Add New Car</Link>
                              </div>
                            </div>
                          </div>
                          
            if(sessionStorage.loggedIn === 'false')
            {
                content = <div className="table-container">
                            <h1>Access Denied</h1>
                            <div>
                              <Login/>
                            </div>
                          </div>
            }
            return (           
              <div >
                {content}
            </div>
    );
  }
}