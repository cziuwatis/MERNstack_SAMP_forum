import React, {Component} from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';

export default class Post extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            content: this.props.post.content,
            postDate: this.props.post.postDate,
            postedBy: this.props.post.postedBy
        }
    }
    render() {
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let date = new Date(this.state.postDate);
        console.log(this.state);
        let postDisplayDate = date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
        return (
                <li className="ag_topic_post">
                    <div className="ag_topic_post_header">
                        <div className="ag_topic_post_header_profile_image_container">
                            <img className="ag_topic_post_header_profile_image" src={"/img/profiles/profile.png"} alt="profile picture"/>
                        </div>
                        <div className="ag_topic_post_header_details">
                            <span className="ag_topic_post_username"><a>User_Name</a></span>
                            <span className="ag_topic_post_datetime"><i className="fas fa-clock"></i> {postDisplayDate}</span>
                        </div>
                    </div>
                    <div className="ag_topic_post_profile">
                        <div className="ag_topic_post_profile_image_container">
                            <img className="ag_topic_post_profile_image" src={"/img/profiles/profile.png"} alt="profile picture"/>
                        </div>
                        <ul className="ag_topic_post_profile_info">
                            <li><span>Total posts</span><span>22</span></li>
                            <li><span>Country</span><span>Ireland</span></li>
                            <li><span>Role</span><span>Administrator</span></li>
                        </ul>
                    </div>
                    <div className="ag_topic_post_content">
                        {ReactHtmlParser(this.state.content)}
                    </div>
                </li>
                );
    }
}