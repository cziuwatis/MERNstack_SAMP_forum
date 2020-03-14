import React from "react";
import {Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, exact, path, ...rest }) => 
(
    <Route
        exact = {exact}
        path = {path}
        render = {props => sessionStorage.loggedIn==="true" ? <Component {...props} {...rest} /> : <Redirect to="/forum"/> }
    />
);

export default PrivateRoute;