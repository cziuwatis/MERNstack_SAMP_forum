import React, {Component} from "react";
import ForumSubforum from './ForumComponents/ForumSubforum';
import ConfirmationUI from './ConfirmationUI';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
//import {Link} from 'react-router-dom';
import axios from 'axios';


export default class Forum extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            subforums: [
            ]
        };
        axios.defaults.withCredentials = true;
        axios.get('http://localhost:4000/forum/')
                .then(res => this.setState({subforums: res.data}))
                .catch((error) => console.log(error));
        //console.log(this.state);
    }

    addSubforum = e => {
        axios.defaults.withCredentials = true;
        axios.put('http://localhost:4000/forum/new_subforum')
                .then(res => console.log())
                .catch((error) => console.log(error));
        setTimeout(() => {
            axios.defaults.withCredentials = true;
            axios.get('http://localhost:4000/forum/')
                    .then(res => this.setState({subforums: res.data}))
                    .catch((error) => console.log(error))
        }, 200);

    }
    removeSubforum = id => {
        let deleteSubforum = () => {
        axios.defaults.withCredentials = true;
            axios.delete('http://localhost:4000/forum/delete_subforum/' + id)
                    .then(res => !res.data.error ? this.setState({subforums: this.state.subforums.filter((subforum) => subforum._id !== id)}) : console.log(res.data.error))
                    .catch((error) => console.log(error));
        }
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                        <ConfirmationUI query={"Are you sure?"} msg={"you are about to delete a subforum"} closeFunction={onClose} yesFunction={deleteSubforum}/>
                        );
            }
        });
    }
    render() {
        return (
                <div id="forum">
                    <div id="ag_main_content">
                        <ul>
                            {
                                sessionStorage.accessLevel > 3 ?
                                    <li className="ag_forum_control">
                                        <span onClick={this.addSubforum} className="ag_btn ag_common_btn">Add subforum</span>
                                    </li> : null
                            }
                            {this.state.subforums.map((subforum) => <ForumSubforum ref={subforum._id} key={subforum._id} subforum={subforum} removeSubforum={this.removeSubforum}/>)}
                        </ul>
                    </div>
                    <div id="ag_widgets">
                    </div>
                </div>
                );
    }
}