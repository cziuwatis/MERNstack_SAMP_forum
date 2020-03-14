import React, {Component} from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';
import CreateTopicModal from './SubforumComponents/CreateTopicModal';
import SubforumTopic from './SubforumComponents/SubforumTopic';


export default class Subforum extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            title: "",
            description: "",
            topics: [],
            createModal: false,
            currentPage: 0,
            availablePages: 1
        };
        this.updateTopics();
    }

    toggleModal = e => {
        this.setState({createModal: !this.state.createModal});
    }

    createTopic = data => {
        console.log(data);
        let topic = {
            title: data.title,
            postedBy: 0,
            posts: [
                {
                    postedBy: 0,
                    content: data.content
                }
            ]
        };
        axios.put('http://localhost:4000/subforum/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + '/new_topic', topic)
                .then(res => this.updateTopics())
                .catch((error) => console.log(error));

    }

    updateTopics() {
        axios.get('http://localhost:4000/subforum/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + "/page/" + this.state.currentPage)
                .then(res => !res.data.error ? this.setState({title: res.data.title, description: res.data.description, topics: res.data.topics, currentPage: res.data.page, availablePages: res.data.availablePages}) : console.log(res.data.error))
                .catch((error) => console.log(error));
    }

    render() {
        return (
                <div id="subforum">
                    <div id="ag_subforum_topic_content">
                        {this.state.createModal ? <CreateTopicModal createTopic={this.createTopic} closeModal={this.toggleModal}/> : null}
                        <div id="ag_subforum_topic_header">
                            <h4>{this.state.title}</h4>
                            <p>{this.state.description}</p>
                        </div>
                        <ul id="ag_subforum_topics">
                            <li className="ag_subforum_panel">
                                <span onClick={this.toggleModal} className="ag_subforum_create_topic_button ag_btn ag_common_btn">CREATE TOPIC</span>
                            </li>
                            <li className="ag_pagination_container">
                                <div className="ag_pagination">
                                    <span>&lt;&lt;  </span>
                                    <span>Previous  </span>
                                    <span className="ag_pagination_pages"><a href="#" className="ag_current_page">1</a><a href="#">2</a><a href="#">3</a><a href="#">4</a><a href="#">5</a></span>
                                    <span>  Next</span>
                                    <span>  &gt;&gt;</span>
                                </div>
                                <select className="ag_sort_select">
                                    <option value="">Sort</option>
                                    <option value="date">Date</option>
                                    <option value="title">Title</option>
                                </select>
                            </li>
                            {this.state.topics.map((topic) => <SubforumTopic key={topic._id} subforum_id={this.props.match.params.sub_id} subforum_topic_id={this.props.match.params.subt_id} topic={topic} />)}
                            <li className="ag_pagination_container">
                                <div className="ag_pagination">
                                    <span>&lt;&lt;  </span>
                                    <span>Previous  </span>
                                    <span className="ag_pagination_pages"><a href="#" className="ag_current_page">1</a><a href="#">2</a><a href="#">3</a><a href="#">4</a><a href="#">5</a><a href="#">6</a></span>
                                    <span>  Next</span>
                                    <span>  &gt;&gt;</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                );
    }
}