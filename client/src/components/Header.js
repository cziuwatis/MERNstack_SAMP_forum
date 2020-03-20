import React, {Component} from "react";
import axios from 'axios';
import {Link} from 'react-router-dom';
export default class Header extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            profileContextOpen: false,
            server_stats: {
                hostname: "Rls.lt 0.3.7 | Realus Lietuvos Serveris",
                ip: "samp.rls.lt",
                version: "3.7.2",
                maxPlayers: 300,
                playerCount: 0
            }
        };
    }

    toggleContext = e => {
        this.setState({profileContextOpen: !this.state.profileContextOpen});
    }

    logOut = e => {
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:4000/users/logout')
                .then(res => console.log("logged out"))
                .catch((error) => console.log(error));
        sessionStorage.loggedIn = 'false';
        sessionStorage.accessLevel = 0;
        sessionStorage.username = '';
        window.location.pathname = '/';
    }
    componentDidMount() {
        axios.defaults.withCredentials = true;
        axios.get('http://localhost:4000/forum/server_stats')
                .then(res => this.setState({server_stats: res.data}))
                .catch((error) => console.log(error));
    }
    render() {
        let maxPlayers = this.state.server_stats.maxPlayers;
        let playerCount = this.state.server_stats.playerCount;
        let playerStatsBackgroundPercentageStyle = {backgroundSize: (playerCount / maxPlayers * 100) + '% 100%'};
        return (
                <header id="ag_header">
                    <nav id="ag_top_header">
                        <ul>
                            <li><Link to="/"><i className="fas fa-warehouse"></i> Forum</Link></li>
                            <li id="ag_header_community">
                                <Link to="/community"><i className="fas fa-users"></i> Community</Link>
                            </li>
                            {
                                sessionStorage.loggedIn === 'true' ?
                                    <li id="ag_user_header_profile">
                                        <div className="ag_top_header_dropdown">
                                            <a className={this.state.profileContextOpen ? "ag_active_header" : ""} onClick={this.toggleContext}>
                                                <img id="ag_header_avatar" src={"/img/profiles/profile.png"} alt="profile_picture"/>
                                                {sessionStorage.username}
                                                <i className="fas fa-caret-down"></i>
                                            </a>
                                            {
                                                            this.state.profileContextOpen ? <div className="ag_top_header_dropdown_content">
                                                                <Link to="/settings">Settings</Link>
                                                                <a onClick={this.logOut} >Logout</a>
                                                            </div> : null
                                            }
                                        </div>
                                    </li> : <li><Link to="/register">Register</Link><Link to="/login">Login</Link></li>
                            }
                        </ul>
                    </nav>
                    <div id="ag_header_logo">
                        <img src={"/img/server-logo.png"} alt="logo"/>
                    </div>
                    <div id="ag_header_content">
                        <div id="ag_server_details">
                            <table>
                                <tbody>
                                    <tr>
                                        <th colSpan="2">{this.state.server_stats.hostname}</th>
                                        <th rowSpan="4">
                                            <img src={"/img/server-logo.png"} alt="server logo"/>
                                        </th>
                                    </tr>
                                    <tr>
                                        <td>IP: </td>
                                        <td>{this.state.server_stats.ip}</td>
                                    </tr>
                                    <tr>
                                        <td>Players: </td>
                                        <td id="ag_server_details_player_count" style={playerStatsBackgroundPercentageStyle}>{this.state.server_stats.playerCount}/{this.state.server_stats.maxPlayers}</td>
                                    </tr>
                                    <tr>
                                        <td>Version: </td>
                                        <td>{this.state.server_stats.version}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div id="ag_header_connect">
                            <a href="#" className="ag_btn ag_primary_btn">JOIN US ON STEAM <i className="fab fa-steam"></i></a>
                            <a href="#" className="ag_btn ag_primary_btn">JOIN DISCORD <i className="fab fa-discord"></i></a>
                        </div>
                    </div>
                </header>
                );
    }
}