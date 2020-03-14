import React, {Component} from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';


export default class SubforumTopic extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            title: this.props.topic.title,
            creationDate: this.props.topic.creationDate,
            postedBy: this.props.topic.postedBy
        };
    }
    render() {
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let date = new Date(this.state.creationDate);
        let creationDisplayDate = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " " + months[date.getMonth()] + " " + date.getFullYear();
        return (
                <li className="ag_subforum_topic">
                    <div className="ag_subforum_topic_details">
                        <h4><Link to={"/subforum/" + this.props.subforum_id + "/" + this.props.subforum_topic_id + "/topic/" + this.props.topic._id}>{this.state.title}</Link></h4>
                        <p>By <a href="#">User_Name</a>, on {creationDisplayDate}</p>
                    </div>
                    <div className="ag_subforum_topic_statistics"><span><i className="far fa-comment-dots"></i> {this.props.topic.posts.length}</span></div>
                    <div className="ag_subforum_topic_latest_post">
                        <img src={"/img/profiles/profile.png"} alt="profile picture"/>
                        <ul>
                            <li>User_Name</li>
                            <li>01 April 2020</li>
                        </ul>
                    </div>
                </li>
                );
    }
}