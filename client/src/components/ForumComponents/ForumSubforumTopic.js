import React, {Component} from "react";
import ContentEditable from 'react-contenteditable';
import {Link} from 'react-router-dom';
import axios from 'axios';
import ConfirmationUI from '../ConfirmationUI';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


export default class ForumSubforumTopic extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            title: this.props.topic.title,
            description: this.props.topic.description,
            edit: {
                title: false,
                description: false
            },
            beforeEdit:
            {
                title: this.props.topic.title,
                description: this.props.topic.description
            }
        };
    }
    
    enableEdit = (e, editField)=>{
        let editStates = this.state.edit;
        editStates[editField] = true;
        let beforeEditStates = this.state.beforeEdit;
        beforeEditStates[editField] = e.target.textContent;
        this.setState({edit: editStates, beforeEdit: beforeEditStates});
    }
    cancelEdit = (e, editField) =>{
        let editStates = this.state.edit;
        editStates[editField] = false;
        this.setState({edit: editStates, [editField]: this.state.beforeEdit[editField]});
    }
    confirmEdit = (e, editField) =>{
        let finalTitle = this.trimSpaces(this.state[editField]).trim();
        if (finalTitle.length > 0)
        {
            axios.defaults.withCredentials = true;
            axios.put('http://localhost:4000/subforum/'+ this.props.subforum_id+'/update_subforum_topic/' + this.props.topic._id, {[editField]: finalTitle})
               .then(res => console.log(res.data))
               .catch((error) => console.log(error));
            let editStates = this.state.edit;
            editStates[editField] = false;
            let beforeEditStates = this.state.beforeEdit;
            beforeEditStates[editField] = finalTitle;
            this.setState({edit: editStates, [editField]: finalTitle, beforeEdit:beforeEditStates});
        }
    }
    handleContentEditable= (e, editField) =>{
        if (e.target.value.length > 100){
        this.setState({[editField]: this.state[editField]});
        }else{
        this.setState({[editField]: e.target.value});
        }
    }
    pasteAsPlainText = event => {
        event.preventDefault();
        const text = event.clipboardData.getData('text/plain');
        document.execCommand('insertHTML', false, text);
    }
    disableNewlines = (event, editField) => {
      const keyCode = event.keyCode || event.which
      if (keyCode === 13) {
        event.returnValue = false;
          this.confirmEdit(event, editField);
        if (event.preventDefault){ event.preventDefault();}
      }
    }
    highlightAll = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0);
    }
    trimSpaces = string => {
        return string
          .replace(/&nbsp;/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<')
          .replace(/<br>/g, '');
    }
    
    editModeCancel(){
        if (this.props.editMode == false){
            let tempStates = this.state.edit;
            for (let i = 0; i < tempStates.length; i++){
                tempStates[i] = false;
            }
            this.setState({edit: tempStates});
        }
    }
    
    deleteSubforumTopic = e =>{
        let deleteTopic = () =>{
        this.props.deleteTopic(this.props.topic._id);
        }
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                        <ConfirmationUI query={"Are you sure?"} msg={"you are about to delete a subforum topic"} closeFunction={onClose} yesFunction={deleteTopic}/>
                        );
            }
        });
    }
    
    render() {
        
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
            let latestTopic = this.props.topic.topics[this.props.topic.topics.length-1];
            let date;
            let latestTopicDate='-';
        
            if (latestTopic){
                if (latestTopic.title.length > 20){ 
                    latestTopic.title = latestTopic.title.substring(0, 17) + "...";
                };
                date = new Date(latestTopic.creationDate);
                latestTopicDate= (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " " + months[date.getMonth()] + " " + date.getFullYear();
            }
        let messageCount = this.props.topic.topics.reduce((total, topic)=> total + topic.posts.length, 0);
        return (
                <li className="ag_subforum_topic">
                    <div className="ag_subforum_topic_logo"><img src="img/server-logo.png" alt="subforum logo"/></div>
                    <div className="ag_subforum_topic_details">
                        <h4>
                        {
                            this.props.editMode == true 
                            ? !this.state.edit.title
                                ? <span title="title" onClick={e => {this.enableEdit(e, "title")}}>{this.state.title}</span>
                                : <div>
                                    <ContentEditable title="title"
                                        onFocus={this.highlightAll}
                                        onKeyPress={e => {this.disableNewlines(e, "title")}}
                                        onPaste={this.pasteAsPlainText}
                                        html={this.state.title}
                                        data-column="title"
                                        className="content-editable"
                                        onChange={e => {this.handleContentEditable(e, "title")}}
                                    />
                                    <i onClick={e => {this.confirmEdit(e, "title")}} className="fas fa-check ag_confirm_tick"></i>
                                    <i onClick={e => {this.cancelEdit(e, "title")}} className="fas fa-times ag_cancel_tick"></i>
                                </div>
                                : <span title="title"><Link to={"/subforum/"+this.props.subforum_id+"/"+this.props.topic._id}>{this.state.beforeEdit.title}</Link></span>
                        }
                        </h4>
                        {
                            this.props.editMode == true 
                            ? !this.state.edit.description
                                ?<p title="description" onClick={e => {this.enableEdit(e, "description")}}>{this.state.description}</p>
                                :<div className="ag_subforum_topic_description_edit">
                                <ContentEditable title="description"
                                    onFocus={this.highlightAll}
                                    onKeyPress={e => {this.disableNewlines(e, "description")}}
                                    onPaste={this.pasteAsPlainText}
                                    html={this.state.description}
                                    data-column="description"
                                    className="content-editable"
                                    onChange={e => {this.handleContentEditable(e, "description")}}
                                    />
                                    <i onClick={e => {this.confirmEdit(e, "description")}} className="fas fa-check ag_confirm_tick"></i>
                                    <i onClick={e => {this.cancelEdit(e, "description")}} className="fas fa-times ag_cancel_tick"></i>
                                </div>
                            : <p title="description">{this.state.beforeEdit.description}</p>
                        }
                    </div>
                    <div className="ag_subforum_topic_statistic"><span><i className="far fa-comment-dots"></i> {messageCount}</span></div>
                    
                        
                        {
                        this.props.editMode ? <div className="ag_subforum_topic_latest_post"><i onClick={this.deleteSubforumTopic} className="fas fa-times-circle ag_subforum_topic_delete"></i> </div> :
                        latestTopic ?                  
                        <div className="ag_subforum_topic_latest_post">
                            <img src={"http://localhost:4000/img/profiles/"+latestTopic.postedBy.avatar}/>
                            <ul>
                                <li><Link to={'/subforum/'+this.props.subforum_id+'/'+this.props.topic._id+'/topic/'+latestTopic._id}>{latestTopic.title}</Link></li>
                                <li>{latestTopic.postedBy.username}</li>
                                <li>{latestTopicDate}</li>
                            </ul>
                        </div>: <div className="ag_subforum_topic_latest_post"><img src="img/profiles/profile.png"/><ul><li>-</li><li>-</li><li>-</li></ul></div>
                        }
                </li>
                );
    }
}