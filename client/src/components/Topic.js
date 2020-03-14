import React, {Component} from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';
import Post from './TopicComponents/Post';
import CreatePost from './TopicComponents/CreatePost';


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
            posts: []
        };
        this.updatePosts();
    }

    createPost = data => {
        axios.put('http://localhost:4000/topic/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + '/' + this.props.match.params.top_id + "/new_post", {postedBy: 0, content: data.content})
                .then(res => this.updatePosts())
                .catch((error) => console.log(error));
    }

    updatePosts(){
        axios.get('http://localhost:4000/topic/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + "/" + this.props.match.params.top_id)
                .then(res => !res.data.error ? this.setState({subforumTitle: res.data.subforum.title, title: res.data.topic.title, creationDate: res.data.topic.creationDate, postedBy: res.data.topic.postedBy, posts: res.data.topic.posts}) : console.log(res.data.error))
                .catch((error) => console.log(error));
    }
    
    render() {
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let date = new Date(this.state.creationDate);
        let creationDisplayDate = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

        return (
                <div id="topic">
                    {console.log(this.state.posts)}
                    <div id="ag_topic_content">
                        <div id="ag_topic_header">
                            <h4>{this.state.title}</h4>
                            <p>by <a>User_Name</a> on {creationDisplayDate} in <Link to={'/subforum/' + this.props.match.params.sub_id + '/' + this.props.match.params.subt_id}>{this.state.subforumTitle}</Link></p>
                        </div>
                        <ul id="ag_topic_posts">
                            <li className="ag_pagination_container">
                                <div className="ag_pagination">
                                    <span>&lt;&lt;  </span>
                                    <span>Previous  </span>
                                    <span className="ag_pagination_pages"><a href="#" className="ag_current_page">1</a><a href="#">2</a><a href="#">3</a><a href="#">4</a><a href="#">5</a><a href="#">6</a></span>
                                    <span>  Next</span>
                                    <span>  &gt;&gt;</span>
                                </div>
                            </li>
                            {this.state.posts.map((post) => <Post key={post._id} post={post}/>)}
                            <li className="ag_pagination_container">
                                <div className="ag_pagination">
                                    <span>&lt;&lt;  </span>
                                    <span>Previous  </span>
                                    <span className="ag_pagination_pages"><a href="#" className="ag_current_page">1</a><a href="#">2</a><a href="#">3</a><a href="#">4</a><a href="#">5</a><a href="#">6</a></span>
                                    <span>  Next</span>
                                    <span>  &gt;&gt;</span>
                                </div>
                            </li>
                            <CreatePost createPost={this.createPost}/>
                        </ul>
                    </div>
                </div>
                );
    }
}