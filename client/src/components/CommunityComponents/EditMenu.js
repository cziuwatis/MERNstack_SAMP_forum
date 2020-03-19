import React, {Component} from "react";

export default class EditMenu extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            username: this.props.username,
            email: ""
        }
    }

    confirm = e => {
        this.props.yesFunction({email: this.state.email, username: this.state.username});
        this.props.closeFunction();
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value});
    }
    validateUsername() {
        let errorMessage = [];
        if (this.state.username.trim().length < 3) {
            errorMessage.push(<span key={0} className="ag_registration_error"><i className="fas fa-exclamation-triangle"></i>Username needs to be longer than 3 characters</span>);
        }
        if (this.state.username.trim().length > 20) {
            errorMessage.push(<span key={1} className="ag_registration_error"><i className="fas fa-exclamation-triangle"></i>Username cannot be longer than 20 characters</span>);
        }
        if (/[^0-9a-zA-Z _-]+/.test(this.state.username.trim())) {
            errorMessage.push(<span key={2} className="ag_registration_error"><i className="fas fa-exclamation-triangle"></i>Username can only be made up of alphanumeric characters and these special characters:  _-</span>);
        }
        return errorMessage;
    }
    validateEmail()
    {
        let errorMessage = [];

        // valid email pattern
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!pattern.test(String(this.state.email).toLowerCase())) {
            errorMessage.push(<span key={3} className="ag_registration_error"><i className="fas fa-exclamation-triangle"></i>Invalid email, email must be of format email@email.com</span>);
        }
        return errorMessage;
    }
    
                //        <label>email</label>
                  //      <input className='ag_community_edit_user_input' onChange={this.handleChange} name='email' value={this.state.email}/>
    render() {
        return (
                <div className="confirmationUI">
                    <h3>{this.props.query}</h3>
                    <div className='ag_community_edit_user_container'>
                        <label>username</label>
                        <input className='ag_community_edit_user_input' onChange={this.handleChange} name='username' value={this.state.username}/>
                    </div>
                    <p>{this.props.msg}</p>
                    <span className="ag_btn ag_common_btn" onClick={this.props.closeFunction}>Cancel</span>
                    <span className="ag_btn ag_common_btn" onClick={this.confirm}>Save</span>
                </div>
                );
    }
}