import React, {Component} from "react";
import axios from 'axios';
import Credentials from './SettingsComponents/Credentials';
import Profile from './SettingsComponents/Profile';
import Avatar from './SettingsComponents/Avatar';
export default class Settings extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            modals: {
                credentials: false,
                profile: true,
                avatar: false
            },
            user: {
            }
        };
    }

    componentDidMount() {
        axios.defaults.withCredentials = true;
        axios.get('http://localhost:4000/users/get_user')
                .then(res => !res.data.error ? this.setState({user: res.data}) : res.data.error.includes('relog') ? this.relog() : alert(res.data.error))
                .catch((error) => console.log(error));

    }

    relog() {
        sessionStorage.loggedIn = 'false';
        sessionStorage.accessLevel = 0;
        sessionStorage.username = '';
    }

    handleMenuChange = e => {
        let modals = this.state.modals;
        Object.entries(modals).forEach(([key]) => modals[key] = false);
        modals[e.target.getAttribute('name')] = true;
        this.setState({modals: modals});
    }

    render() {
        if (sessionStorage.loggedIn === 'false' || !this.state.user) {
            window.location.pathname = '/'; //using this since header needs to be rerendered
            //return <Redirect to={'/'}/>
        }
        return (
                <div id="ag_settings_container">
                    <div id="ag_settings">
                        <h1 className="ag_settings_header">User Settings</h1>
                        <ul className="ag_settings_menu">
                            <li name='avatar' onClick={this.handleMenuChange} className={"ag_settings_menu_option " + (this.state.modals.avatar ? "active" : "")}><i className="fas fa-user-circle"></i> Avatar</li>
                            <li name='profile' onClick={this.handleMenuChange} className={"ag_settings_menu_option " + (this.state.modals.profile ? "active" : "")}><i className="fas fa-clipboard"></i> Profile</li>
                            <li name='credentials' onClick={this.handleMenuChange} className={"ag_settings_menu_option " + (this.state.modals.credentials ? "active" : "")}><i className="fas fa-key"></i> Credentials</li>
                        </ul>
                        { this.state.modals.credentials && this.state.user.username ? <Credentials /> : null}
                        { this.state.modals.profile && this.state.user.username ? <Profile username={this.state.user.username} email={this.state.user.email}/> : null}
                        { this.state.modals.avatar && this.state.user.username ? <Avatar avatar={this.state.user.avatar} userId={this.state.user._id} /> : null}
                    </div>
                </div>
                );
    }
}