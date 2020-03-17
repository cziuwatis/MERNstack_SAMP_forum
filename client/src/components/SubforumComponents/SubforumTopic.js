import React, {Component} from "react";
import {Link} from 'react-router-dom';


export default class SubforumTopic extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            title: this.props.topic.title,
            creationDate: this.props.topic.creationDate,
            postedBy: this.props.topic.postedBy,
            contextMenuOpen: false
        };
    }

    toggleContextMenu = e => {
        this.setState({contextMenuOpen: !this.state.contextMenuOpen});
    }

    openEditContextualMenu = e => {
        this.setState({contextMenuOpen: true});
    }
    closeEditContextualMenu = e => {
        this.setState({contextMenuOpen: false});
    }

    deleteTopic = e => {
        this.props.removeTopic(e, this.props.topic._id);
    }
    editTopic = e => {
        this.closeEditContextualMenu();
        this.props.editTopic(e, {_id: this.props.topic._id, title: this.state.title, content: this.props.topic.content});
    }
    render() {
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let date = new Date(this.state.creationDate);
        let creationDisplayDate = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " " + months[date.getMonth()] + " " + date.getFullYear();
        date = new Date(this.props.topic.latestPost.postDate);
        let latestPostDate = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " " + months[date.getMonth()] + " " + date.getFullYear();
        return (
                <li className="ag_subforum_topic">
                    <div className="ag_subforum_topic_details">
                        <h4><Link to={"/subforum/" + this.props.subforum_id + "/" + this.props.subforum_topic_id + "/topic/" + this.props.topic._id}>{this.props.topic.title}</Link></h4>
                        <p>By <a href="#">{this.props.topic.postedBy.username}</a>, on {creationDisplayDate}</p>
                    </div>
                    <div className="ag_subforum_topic_statistics"><span><i className="far fa-comment-dots"></i> {this.props.topic.postCount}</span></div>
                    <div className="ag_subforum_topic_latest_post">
                        <img src={"/img/profiles/profile.png"} alt="profile picture"/>
                        <ul>
                            <li>{this.props.topic.latestPost.postedBy.username}</li>
                            <li>{latestPostDate}</li>
                        </ul>
                    </div>
                    {
                        sessionStorage.accessLevel > 3 ?
                                    <div className="ag_subforum_topic_edit_container">
                                        <span onClick={this.toggleContextMenu}>&#10247;</span>
                                        {
                                                this.state.contextMenuOpen ?
                                                            <ul className="ag_subforum_topic_edit_context_menu">
                                                                <li onClick={this.deleteTopic} className="ag_subforum_topic_edit_context_option">Delete</li>
                                                                <li onClick={this.editTopic} className="ag_subforum_topic_edit_context_option">Edit</li>
                                                                <li onClick={this.closeEditContextualMenu} className="ag_subforum_topic_edit_context_option">Close</li>
                                                            </ul>
                                                        : null
                                        }
                                    </div> : null
                    }
                </li>
                );
    }
}