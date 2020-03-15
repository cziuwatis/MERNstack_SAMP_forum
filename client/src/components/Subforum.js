import React, {Component} from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';
import CreateTopicModal from './SubforumComponents/CreateTopicModal';
import SubforumTopic from './SubforumComponents/SubforumTopic';
import Pagination from './Pagination';


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
            currentPage: this.props.match.params.page ? this.props.match.params.page : 0,
            availablePages: 1
        };
        this.updateTopics();
    }

    toggleModal = e => {
        this.setState({createModal: !this.state.createModal});
    }

    createTopic = data => {
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
                .then(res => !res.data.error ? this.setState({createModal: false,title: res.data.title, description: res.data.description, topics: res.data.topics,  availablePages: res.data.availablePages}) : console.log(res.data.error))
                .catch((error) => console.log(error));
    }

    goToPage = (e, page) => {
        if (page >= this.state.availablePages || page < 0) {
            //do nothing
        } else {
            axios.get('http://localhost:4000/subforum/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + "/page/" + page)
                .then(res => !res.data.error ? this.setState({currentPage: page, topics: res.data.topics,  availablePages: res.data.availablePages}) : console.log(res.data.error))
                .catch((error) => console.log(error));
        }
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
                            <Pagination enableSort={true} goToPage={this.goToPage} currentPage={this.state.currentPage} availablePages={this.state.availablePages}/>
                            {this.state.topics.map((topic) => <SubforumTopic key={topic._id} subforum_id={this.props.match.params.sub_id} subforum_topic_id={this.props.match.params.subt_id} topic={topic} />)}
                            <Pagination goToPage={this.goToPage} currentPage={this.state.currentPage} availablePages={this.state.availablePages}/>
                        </ul>
                    </div>
                </div>
                );
    }
}