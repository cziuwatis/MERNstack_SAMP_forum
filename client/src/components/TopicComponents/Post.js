import React, {Component} from "react";
import {Link} from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';

export default class Post extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            content: this.props.post.content,
            postDate: this.props.post.postDate,
            postedBy: this.props.post.postedBy,
            contextMenuOpen: false
        }
    }
    toggleContextMenu = e => {
        this.setState({contextMenuOpen: !this.state.contextMenuOpen});
    }

    deletePost = e => {
        this.props.removePost(this.props.post._id);
    }

    render() {
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let date = new Date(this.state.postDate);
        let postDisplayDate = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + " " + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " " + months[date.getMonth()] + " " + date.getFullYear();
        let role = this.props.post.postedBy.role;
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
                <li className="ag_topic_post">
                    <div className="ag_topic_post_header">
                        <div className="ag_topic_post_header_profile_image_container">
                            <img className="ag_topic_post_header_profile_image" src={"http://localhost:4000/img/profiles/" + this.props.post.postedBy.avatar} alt="profile picture"/>
                        </div>
                        <div className="ag_topic_post_header_details">
                            <span className={"ag_topic_post_username ag_user_role " + role}><a>{this.state.postedBy.username}</a></span>
                            <span className="ag_topic_post_datetime"><i className="fas fa-clock"></i> {postDisplayDate}</span>
                            {
                                sessionStorage.accessLevel > 3 ?
                                    <div>
                                        <span className="ag_topic_post_toggle_contextual_menu" onClick={this.toggleContextMenu}>&#10247;</span>
                                        {
                                                        this.state.contextMenuOpen ?
                                                            <ul className="ag_post_edit_context_menu">
                                                                <li onClick={this.deletePost} className="ag_post_edit_context_option">Delete</li>
                                                                <li onClick={this.toggleContextMenu} className="ag_post_edit_context_option">Close</li>
                                                            </ul> : null
                                        }
                                    </div> : null
                            }
                        </div>
                    </div>
                    <div className="ag_topic_post_profile">
                        <div className="ag_topic_post_profile_image_container">
                            <img className="ag_topic_post_profile_image" src={"http://localhost:4000/img/profiles/" + this.props.post.postedBy.avatar} alt="profile picture"/>
                        </div>
                        <ul className="ag_topic_post_profile_info">
                            <li><span>Total posts</span><span>{this.props.post.postedBy.postCount}</span></li>
                            <li><span>Country</span><span>{this.state.postedBy.country}</span></li>
                            <li><span>Role</span><span>{role}</span></li>
                        </ul>
                    </div>
                    <div className="ag_topic_post_content">
                        {ReactHtmlParser(this.state.content)}
                    </div>
                </li>
                );
    }
}