import React, {Component} from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';
import CreateTopicModal from './SubforumComponents/CreateTopicModal';
import SubforumTopic from './SubforumComponents/SubforumTopic';
import Pagination from './Pagination';
import ConfirmationUI from './ConfirmationUI';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


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
            editModal: false,
            editData: [],
            currentPage: this.props.match.params.page ? this.props.match.params.page : 0,
            availablePages: 1,
            sortBy: 'latestPost'
        };
        this.updateTopics();
    }

    toggleCreateModal = e => {
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
        axios.defaults.withCredentials = true;
        axios.put('http://localhost:4000/subforum/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + '/new_topic', topic)
                .then(res => this.updateTopics())
                .catch((error) => console.log(error));
    }

    deleteTopic = (e, id) => {
        let deleteTopic = () => {
            axios.defaults.withCredentials = true;
            axios.delete('http://localhost:4000/subforum/delete_topic/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + "/" + id)
                    .then(res => !res.data.error ? this.updateTopics() : console.log(res.data.error))
                    .catch((error) => console.log(error));
        }
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                        <ConfirmationUI query={"Are you sure?"} msg={"you are about to delete a topic and all of its content"} closeFunction={onClose} yesFunction={deleteTopic}/>
                        );
            }
        });
    }

    updateTopics() {
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:4000/subforum/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + "/page/" + this.state.currentPage, {sortBy: this.state.sortBy})
                .then(res => !res.data.error ? this.setState({editModal: false, createModal: false, title: res.data.title, description: res.data.description, topics: res.data.topics, availablePages: res.data.availablePages}) : console.log(res.data.error))
                .catch((error) => console.log(error));
    }

    goToPage = (e, page) => {
        if (page >= this.state.availablePages || page < 0) {
            //do nothing
        } else {
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:4000/subforum/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + "/page/" + page)
                    .then(res => !res.data.error ? this.setState({currentPage: page, topics: res.data.topics, availablePages: res.data.availablePages}) : console.log(res.data.error))
                    .catch((error) => console.log(error));
        }
    }

    sortBy = e => {
        let sorting = e.target.value;
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:4000/subforum/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + "/page/" + 0, {sortBy: sorting})
                .then(res => !res.data.error ? this.setState({currentPage: 0, sortBy: sorting, createModal: false, title: res.data.title, description: res.data.description, topics: res.data.topics, availablePages: res.data.availablePages}) : console.log(res.data.error))
                .catch((error) => console.log(error));
    }

    toggleEditModal = e => {
        this.setState({editModal: !this.state.editModal});
    }

    openEditModal = (e, data) => {
        this.setState({editModal: true, editData: data});
    }

    editTopic = (data) => {
        axios.defaults.withCredentials = true;
        axios.put('http://localhost:4000/topic/' + this.props.match.params.sub_id + "/" + this.props.match.params.subt_id + '/edit_topic', data)
                .then(res => this.updateTopics())
                .catch((error) => console.log(error));
    }
    render() {
        return (
                <div id="subforum">
                    <div id="ag_subforum_topic_content">
                        {this.state.createModal ? <CreateTopicModal modalTitle={"Create topic in Subforum"} createTopic={this.createTopic} closeModal={this.toggleCreateModal}/> : null}
                        {this.state.editModal ? <CreateTopicModal data={this.state.editData} modalTitle={"Edit topic in Subforum"} createTopic={this.editTopic} closeModal={this.toggleEditModal}/> : null}
                        <div id="ag_subforum_topic_header">
                            <h4>{this.state.title}</h4>
                            <p>{this.state.description}</p>
                        </div>
                        <ul id="ag_subforum_topics">
                            <li className="ag_subforum_panel">
                                {
                                    sessionStorage.accessLevel > 0 ?
                                    <span onClick={this.toggleCreateModal} className="ag_subforum_create_topic_button ag_btn ag_common_btn">CREATE TOPIC</span>
                                            : <Link to='/' className="ag_subforum_create_topic_button ag_btn ag_common_btn">Login</Link>
                                }
                            </li>
                
                            <Pagination enableSort={true} sortBy={this.sortBy} goToPage={this.goToPage} currentPage={this.state.currentPage} availablePages={this.state.availablePages}/>
                            {this.state.topics.map((topic) => <SubforumTopic key={topic._id} subforum_id={this.props.match.params.sub_id} subforum_topic_id={this.props.match.params.subt_id} topic={topic} editTopic={this.openEditModal} removeTopic={this.deleteTopic}/>)}
                            <Pagination goToPage={this.goToPage} currentPage={this.state.currentPage} availablePages={this.state.availablePages}/>
                        </ul>
                    </div>
                </div>
                );
    }
}