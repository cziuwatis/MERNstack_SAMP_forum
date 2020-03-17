import React, {Component} from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';
import Post from './TopicComponents/Post';
import CreatePost from './TopicComponents/CreatePost';
import Pagination from './Pagination';
import ConfirmationUI from './ConfirmationUI';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import  { Redirect } from 'react-router-dom'


        export default class Topic extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            subforumTitle: "",
            title: "Topic Name",
            creationDate: "",
            postedBy: "",
            posts: [],
            currentPage: this.props.match.params.page ? this.props.match.params.page : 0,
            availablePages: 1
        };
        this.updatePosts();
    }

    createPost = data => {
        axios.defaults.withCredentials = true;
        axios.put('http://localhost:4000/topic/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + '/' + this.props.match.params.top_id + "/new_post", {content: data.content})
                .then(res => !res.data.error ? this.goToPage("", parseInt(res.data.availablePages - 1)) : console.log("An error seems to have occurred"))
                .catch((error) => console.log(error));
    }

    updatePosts() {
        axios.defaults.withCredentials = true;
        axios.get('http://localhost:4000/topic/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + "/" + this.props.match.params.top_id + "/" + this.state.currentPage)
                .then(res => !res.data.error ? this.setState({posts: res.data.topic.posts, currentPage: res.data.currentPage, availablePages: res.data.availablePages, subforumTitle: res.data.subforum.title, title: res.data.topic.title, creationDate: res.data.topic.creationDate, postedBy: res.data.topic.postedBy}) : res.data.error.includes('Posts not found for specified topic') ? this.setState({availablePages: -1}) : console.log(res.data.error))
                .catch((error) => console.log(error));
    }
    goToPage = (e, page) => {
        if (page > this.state.availablePages || page < 0) {
            //do nothing
            console.log("do nothing");
        } else {
            axios.defaults.withCredentials = true;
            axios.get('http://localhost:4000/topic/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + "/" + this.props.match.params.top_id + "/" + page)
                    .then(res => !res.data.error ? this.setState({posts: res.data.topic.posts, currentPage: res.data.currentPage, availablePages: res.data.availablePages, subforumTitle: res.data.subforum.title, title: res.data.topic.title, creationDate: res.data.topic.creationDate, postedBy: res.data.topic.postedBy}) : res.data.error.includes('Posts not found for specified topic') ? this.setState({availablePages: -1}) : console.log(res.data.error))
                    .catch((error) => console.log(error));
        }
    }

    removePost = id => {
        let deletePost = () => {
            axios.defaults.withCredentials = true;
            axios.delete('http://localhost:4000/topic/delete_post/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + "/" + this.props.match.params.top_id + "/" + id)
                    .then(res => !res.data.error ? this.state.currentPage >= res.data.availablePages ? this.goToPage(null, res.data.availablePages - 1) : this.updatePosts() : res.data.error.includes('Posts not found for specified topic') ? this.setState({availablePages: -1}) : console.log(res.data.error))
                    .catch((error) => console.log(error));
        }
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                        <ConfirmationUI query={"Are you sure?"} msg={"you are about to delete a post (the topic will be deleted if it is the original post)"} closeFunction={onClose} yesFunction={deletePost}/>
                        );
            }
        });
    }

    render() {
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let date = new Date(this.state.creationDate);
        let creationDisplayDate = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
        if (this.state.availablePages < 0) {
            return <Redirect to={'/subforum/' + this.props.match.params.sub_id + '/' + this.props.match.params.subt_id}/>
        }
        return (
                <div id="topic">
                    <div id="ag_topic_content">
                        <div id="ag_topic_header">
                            <h4>{this.state.title}</h4>
                            <p>by <a>User_Name</a> on {creationDisplayDate} in <Link to={'/subforum/' + this.props.match.params.sub_id + '/' + this.props.match.params.subt_id}>{this.state.subforumTitle}</Link></p>
                        </div>
                        <ul id="ag_topic_posts">
                            <Pagination goToPage={this.goToPage} currentPage={this.state.currentPage} availablePages={this.state.availablePages}/>
                            {this.state.posts.map((post) => <Post key={post._id} removePost={this.removePost} post={post}/>)}
                            <Pagination goToPage={this.goToPage} currentPage={this.state.currentPage} availablePages={this.state.availablePages}/>
                            {
                                sessionStorage.accessLevel > 0 ?
                                    <CreatePost createPost={this.createPost}/>
                                        : <li className="ag_create_post_container"><span className="ag_create_post_login">You must be logged in to be able to post</span><Link to='/login' className="ag_btn ag_common_btn ag_create_post_button">Login</Link></li>
                            }
                        </ul>
                    </div>
                </div>
                );
    }
}