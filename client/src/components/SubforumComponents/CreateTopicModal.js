import React, {Component} from "react";
import CKEditor from '@ckeditor/ckeditor5-react';
import classicEditor from '@ckeditor/ckeditor5-build-classic';


export default class CreateTopicModal extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            title: "Topic title here",
            content: "<p>Topic content goes here!</p>"
        };
    }

    handleTitleChange = e => {

        let text = e.target.value;
        if (text.length <= 0) {
            e.target.classList.add("ag_incorrect_input");
        } else {
            e.target.classList.remove("ag_incorrect_input");
        }
        if (text.length > 80) {
            this.setState({title: this.state.title});
        } else {
            this.setState({title: text});
        }
    }

    handleContentChange = (e, editor) => {
        let text = editor.getData();
        if (text.length <= 0) {
            editor.ui.getEditableElement().classList.add("ag_incorrect_input");
        } else {
            editor.ui.getEditableElement().classList.remove("ag_incorrect_input");
        }
        if (text.length > 10000) {
            this.setState({content: this.state.content});
            editor.data.set(this.state.content);
        } else {
            this.setState({content: text});
        }
    }

    confirmTopic = e => {
        e.preventDefault();
        if (this.state.title.length <= 0 || this.state.content.length <= 0 || this.state.title.length > 80 || this.state.content.length > 10000) {
            alert("One or more fields are empty or their character limit has been reached");
            return false;
        } else {

            this.props.createTopic({title: this.state.title, content: this.state.content});
        }
    }

    render() {

        /**
         * Having cancel button come before submit will cause for it to be executed when enter is pressed.
         * A way to avoid that is to change that button to not a button e.g span or a.
         * I didn't do that, I just changed their positions.
         */
        return (
                <div className="ag_create_topic_modal_container">
                    <form onSubmit={this.confirmTopic} className="ag_create_topic_modal">
                        <h3 className="ag_create_topic_header">Create topic in Subforum</h3>
                        <label>Topic Title</label>
                        <input value={this.state.title} onChange={this.handleTitleChange} className="ag_create_topic_title" type="text"/>
                        <hr/>
                        <label>Content</label>
                        <div className="ag_create_topic_content">
                            <CKEditor
                                name="content"
                                onBlur={this.handleContentChange}
                                onChange={this.handleContentChange}
                                editor={ classicEditor }
                                data={this.state.content}
                                config={ {
                                toolbar: ['bold', 'italic', 'link', '|', 'undo', 'redo', '|', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable'],
                                height: 200
                                } }
                                />
                        </div>
                        <hr/>
                        <div className="ag_create_topic_control">
                            <button type="submit" onClick={this.confirmTopic} className="ag_btn">CREATE</button>
                            <button onClick={this.props.closeModal} className="ag_btn">CANCEL</button>
                        </div>
                    </form>
                </div>
                            );
                }
    }