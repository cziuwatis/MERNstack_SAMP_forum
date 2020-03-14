import React, {Component} from "react";
import CKEditor from '@ckeditor/ckeditor5-react';
import classicEditor from '@ckeditor/ckeditor5-build-classic';


export default class CreatePost extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            content: "Amazing content!"
        }
    }
    confirmPost = e => {
        e.preventDefault();
        if (this.state.content.length <= 0 || this.state.content.length > 10000) {
            alert("Post cannot be empty nor can it exceed the allowed character limit!");
            return false;
        } else {
            this.props.createPost({content: this.state.content});
            this.setState({content: ""});
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

    render() {
        return (
                <li className="ag_create_post_container">
                <CKEditor
                    name="content"
                    onBlur={this.handleContentChange}
                    onChange={this.handleContentChange}
                    editor={ classicEditor }
                    data={this.state.content}
                    config={ {
                                toolbar: ['bold', 'italic', 'link', '|', '|', 'undo', 'redo', '|', 'bulletedList', 'numberedList', 'blockQuote'],
                                height: 200
                    } }
                    />
                <span onClick={this.confirmPost} className="ag_btn ag_common_btn ag_create_post_button">Create Post</span>
                </li>
                            );
                }

    }