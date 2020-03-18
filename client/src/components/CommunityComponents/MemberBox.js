import React, {Component} from "react";
import axios from 'axios';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import ConfirmationUI from '../ConfirmationUI';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
export default class Community extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            role: this.props.user.role
        };
    }

    handlePromote = e => {
        console.log("promote" + this.props.user._id);
        axios.defaults.withCredentials = true;
        axios.put('http://localhost:4000/users/promote_user/' + this.props.user._id)
                .then(res => !res.data.error ? this.setState({role: (this.state.role + 1)}) : alert(res.data.error))
                .catch((error) => console.log(error));
    }
    handleDemote = e => {
        console.log("demote" + this.props.user._id);
        axios.defaults.withCredentials = true;
        axios.put('http://localhost:4000/users/demote_user/' + this.props.user._id)
                .then(res => !res.data.error ? this.setState({role: (this.state.role - 1)}) : alert(res.data.error))
                .catch((error) => console.log(error));
    }
    handleDelete = e => {
        console.log("delete " + this.props.user._id);
        let deleteUser = () => {
            axios.defaults.withCredentials = true;
            axios.delete('http://localhost:4000/users/delete_user/' + this.props.user._id)
                    .then(res => !res.data.error ? this.props.deleteUser(this.props.user._id) : alert(res.data.error))
                    .catch((error) => console.log(error));
        }
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                        <ConfirmationUI query={"Are you sure?"} msg={"you are about to delete a user (all their topics and posts will be deleted)"} closeFunction={onClose} yesFunction={deleteUser}/>
                        );
            }
        });
    }
    render() {
        let role = this.state.role;
        if (role >= 5) {
            role = 'admin';
        } else if (role >= 4) {
            role = "moderator"
        } else if (role >= 3) {
            role = "faithful"
        } else if (role >= 2) {
            role = "member"
        } else {
            role = 'guest';
        }

        return (
                <ContextMenuTrigger renderTag='li' id={this.props.user._id}>
                
                    <img className='ag_community_profile_image' src={"/img/profiles/profile.png"} alt='profile_picture' />
                    <span className={'ag_community_profile_username ag_user_role ' + role}>{this.props.user.username}</span>
                    <span className='ag_community_profile_role'>{role}</span>
                    <span className='ag_community_profile_post_count'>{this.props.user.postCount}</span>
                    <span className='ag_community_profile_country'>{this.props.user.country}</span>
                    { sessionStorage.accessLevel > 3 ?
                                    <ContextMenu id={this.props.user._id}>
                                        {this.state.role < 5 && (this.state.role < sessionStorage.accessLevel)
                                                        ? <MenuItem onClick={this.handlePromote}>Promote</MenuItem>
                                                        : <MenuItem disabled={true} >Promote</MenuItem>}
                                        {this.state.role > 1 && this.state.role < sessionStorage.accessLevel
                                                        ? <MenuItem onClick={this.handleDemote}>Demote</MenuItem>
                                                        : <MenuItem disabled={true} >Demote</MenuItem>}
                                        {this.state.role != 5
                                                        ? <MenuItem onClick={this.handleDelete}>Delete</MenuItem>
                                                        : <MenuItem disabled={true} >Delete</MenuItem>}
                                    </ContextMenu> : null
                    }
                </ContextMenuTrigger>
                );
    }

}