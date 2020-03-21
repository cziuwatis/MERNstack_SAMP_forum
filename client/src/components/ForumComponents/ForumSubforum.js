import React, {Component} from "react";
import ForumSubforumTopic from './ForumSubforumTopic';
import ContentEditable from 'react-contenteditable';
import axios from 'axios';


export default class ForumSubforum extends Component
{

    constructor(props)
    {
        super(props);
        this.state = {
            title: this.props.subforum.title,
            topics: this.props.subforum.topics,
            edit: false,
            beforeEditTitle: this.props.subforum.title,
            topicEditMode: false
        };
    }
    
    toggleEditMode = e =>{
        e.target.classList.toggle("active");
        this.setState({topicEditMode: !this.state.topicEditMode});
    }
    
    enableEdit = e=>{
        if (sessionStorage.accessLevel > 3)
        {
            this.setState({edit: true, beforeEditTitle: this.state.title});
        }
    }
    
    cancelEdit = e =>{
        this.setState({edit: false, title: this.state.beforeEditTitle});
    }

    confirmEdit = e =>{
        let finalTitle = this.trimSpaces(this.state.title).trim();
        if (finalTitle.length > 0)
        {
            axios.defaults.withCredentials = true;
            axios.put('http://localhost:4000/forum/update_subforum/' + this.props.subforum._id, {title: finalTitle})
               .then(res => console.log(res.data))
               .catch((error) => console.log(error));
            this.setState({edit: false, title: finalTitle});
        }
    }
    updateTopics(){
        setTimeout(() => {
            axios.defaults.withCredentials = true;
            axios.get('http://localhost:4000/subforum/'+this.props.subforum._id)
                    .then(res => this.setState({topics: res.data.topics}))
                    .catch((error) => console.log(error));
        }, 200);
    }
    handleContentEditable= e =>{
        if (e.target.value.length > 50){
        this.setState({title: this.state.title});
        }else{
        this.setState({title: e.target.value});
        }
    }
    pasteAsPlainText = event => {
        event.preventDefault();
        const text = event.clipboardData.getData('text/plain');
        document.execCommand('insertHTML', false, text);
    }
    disableNewlines = event => {
      const keyCode = event.keyCode || event.which
      if (keyCode === 13) {
        event.returnValue = false
          this.confirmEdit();
        if (event.preventDefault) event.preventDefault()
      }
    }
    highlightAll = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0)
    }
    trimSpaces = string => {
        console.log(string);
        return string
          .replace(/&nbsp;/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<')
          .replace(/<br>/g, '')
    }
    
    addTopic = e =>{
        axios.defaults.withCredentials = true;
        axios.put('http://localhost:4000/subforum/'+this.props.subforum._id+'/new_subforum_topic')
                .then(res => console.log(res.data))
                .catch((error) => console.log(error));
        this.updateTopics();
    }
    move = e=>{
        this.props.move(e.target.getAttribute('name'), this.props.subforum);
    }
    
    
    deleteTopic = id =>{
        axios.defaults.withCredentials = true;
        axios.delete('http://localhost:4000/subforum/delete/'+this.props.subforum._id+'/'+id)
                .then(res => res.data.error? alert(res.data.error) : this.setState({topics: this.state.topics.filter(topic => topic._id !== id)}) )
                .catch((error) => console.log(error));
    }
    
    render() {

        return (
                <li className="ag_subforum">
                    <div className="ag_subforum_title">
                        <h3>
                            {
                            !this.state.edit 
                            ? <span onClick={this.enableEdit}>{this.state.title}</span> 
                            : <div>
                                <ContentEditable
                                    onFocus={this.highlightAll}
                                    onKeyPress={this.disableNewlines}
                                    onPaste={this.pasteAsPlainText}
                                    html={this.state.title}
                                    data-column="title"
                                    className="content-editable"
                                    onChange={this.handleContentEditable}
                                    />
                                    <i onClick={this.confirmEdit} className="fas fa-check ag_confirm_tick"></i>
                                    <i onClick={this.cancelEdit} className="fas fa-times ag_cancel_tick"></i>
                                </div>
                            }
                        </h3>
                    </div>
                    {
                        sessionStorage.accessLevel > 3 ?
                        <div className="ag_subforum_control">
                            <span onClick={e => this.props.removeSubforum(this.props.subforum._id)} className="ag_btn ag_common_btn">Remove subforum</span>
                            <span name='-1' onClick={this.move} className="ag_btn ag_common_btn">Up</span>    
                            <span onClick={this.toggleEditMode} className="ag_btn ag_common_btn">Edit</span>
                            <span name='1' onClick={this.move} className="ag_btn ag_common_btn">Down</span>
                            <span onClick={this.addTopic} className="ag_btn ag_common_btn">Add topic</span>
                        </div> : null
                    }
                    <ul>
                        {this.state.topics.map((topic) => <ForumSubforumTopic key={topic._id} deleteTopic={this.deleteTopic} editMode={this.state.topicEditMode} subforum_id={this.props.subforum._id} topic={topic} />)}
                    </ul>
                </li>
                );
    }
}