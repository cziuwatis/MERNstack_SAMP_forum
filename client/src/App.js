import React, {Component} from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./css/main.css";

import Forum from "./components/Forum";
import Topic from "./components/Topic";
import Subforum from "./components/Subforum";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Register from "./components/Register";
import Login from "./components/Login";


if (typeof sessionStorage.loggedIn === 'undefined')
{
    sessionStorage.loggedIn = 'false';
}


export default class App extends Component
{
    render()
    {
        return (
                <BrowserRouter>
                    <Header/>
                    <Switch>
                    <Route exact path='/' component={Forum}/>
                    <Route exact path='/register' component={Register}/>
                    <Route exact path='/login' component={Login}/>
                    <Route exact path='/topic/:id' component={Topic}/>
                    <Route exact path='/subforum/:sub_id/:subt_id' component={Subforum}/>
                    <Route exact path='/subforum/:sub_id/:subt_id/page/:page' component={Subforum}/>
                    <Route exact path='/subforum/:sub_id/:subt_id/topic/:top_id' component={Topic}/>
                    <Route exact path='/subforum/:sub_id/:subt_id/topic/:top_id/page/:page' component={Topic}/>
                    <Route path="*" component={() => <h3>Invalid URL. Webpage does not exist</h3>} />                            
                        </Switch>
                </BrowserRouter>);//header solution found in https://forums.meteor.com/t/react-router-how-to-render-component-within-a-layout-vs-stand-alone/45767/2
    }
}