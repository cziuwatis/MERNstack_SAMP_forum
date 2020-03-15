import React, {Component} from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';
import Post from './TopicComponents/Post';
import CreatePost from './TopicComponents/CreatePost';
import Pagination from './Pagination';


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
        axios.put('http://localhost:4000/topic/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + '/' + this.props.match.params.top_id + "/new_post", {postedBy: 0, content: data.content})
                .then(res => !res.data.error ? this.goToPage("", parseInt(res.data.availablePages - 1)) : console.log("An error seems to have occurred"))
                .catch((error) => console.log(error));
    }

    updatePosts() {
        axios.get('http://localhost:4000/topic/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + "/" + this.props.match.params.top_id + "/" + this.state.currentPage)
                .then(res => !res.data.error ? this.setState({posts: res.data.topic.posts, currentPage: res.data.currentPage, availablePages: res.data.availablePages, subforumTitle: res.data.subforum.title, title: res.data.topic.title, creationDate: res.data.topic.creationDate, postedBy: res.data.topic.postedBy}) : console.log(res.data.error))
                .catch((error) => console.log(error));
    }
    goToPage = (e, page) => {
        if (page > this.state.availablePages || page < 0) {
            //do nothing
            console.log("do nothing");
        } else {
            axios.get('http://localhost:4000/topic/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + "/" + this.props.match.params.top_id + "/" + page)
                    .then(res => !res.data.error ? this.setState({posts: res.data.topic.posts, currentPage: res.data.currentPage, availablePages: res.data.availablePages, subforumTitle: res.data.subforum.title, title: res.data.topic.title, creationDate: res.data.topic.creationDate, postedBy: res.data.topic.postedBy}) : console.log(res.data.error))
                    .catch((error) => console.log(error));
        }
    }
    render() {
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let date = new Date(this.state.creationDate);
        let creationDisplayDate = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
        return (
                <div id="topic">
                    <div id="ag_topic_content">
                        <div id="ag_topic_header">
                            <h4>{this.state.title}</h4>
                            <p>by <a>User_Name</a> on {creationDisplayDate} in <Link to={'/subforum/' + this.props.match.params.sub_id + '/' + this.props.match.params.subt_id}>{this.state.subforumTitle}</Link></p>
                        </div>
                        <ul id="ag_topic_posts">
                            <Pagination goToPage={this.goToPage} currentPage={this.state.currentPage} availablePages={this.state.availablePages}/>
                            {this.state.posts.map((post) => <Post key={post._id} post={post}/>)}
                            <Pagination goToPage={this.goToPage} currentPage={this.state.currentPage} availablePages={this.state.availablePages}/>
                            <CreatePost createPost={this.createPost}/>
                        </ul>
                    </div>
                </div>
                );
    }
}