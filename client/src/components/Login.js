import React, {Component} from "react";
export default class Login extends Component
{
    
    render() {
        return (
                <div id="ag_registration">
                    {console.log("render")}
                    <form onSubmit={this.handleSubmit} autoComplete="off" id="ag_registration_form">
                        <h2 className='ag_registration_title'>Register</h2>
                        <div className='ag_registration_inputs_container'>
                            <label>username</label>
                            <input name="username" value={this.state.username} onChange = {this.handleChange} ref={(input) => {
                        this.inputToFocus = input
                                   }} className='ag_registration_input' type='text' placeholder='Enter your username here'/>
                            <div className={"ag_registration_error_container " + (!usernameErrors.length || !this.state.changedOnce.username ? "hide" : "")}>
                                {usernameErrors}
                            </div>
                            <label>email</label>
                            <input name="email" value={this.state.email} onChange = {this.handleChange} className='ag_registration_input' type='text' placeholder='Enter your email here'/>
                            <div className={"ag_registration_error_container " + (!emailErrors.length || !this.state.changedOnce.email ? "hide" : "")}>
                                {emailErrors}
                            </div>
                            <label>password</label>
                            <input name="password" value={this.state.password} onChange = {this.handleChange} className='ag_registration_input' type='password' placeholder='Enter your password here'/>
                            <div className={"ag_registration_error_container " + (!passwordErrors.length || !this.state.changedOnce.password ? "hide" : "")}>
                                {passwordErrors}
                            </div>
                            <label>confirm password</label>
                            <input name="confirmedPassword" value={this.state.confirmedPassword} onChange = {this.handleChange} className='ag_registration_input' type='password' placeholder='Confirm your password'/>
                            <div className={"ag_registration_error_container " + (!confirmedPasswordErrors.length || !this.state.changedOnce.confirmedPassword ? "hide" : "")}>
                                {confirmedPasswordErrors}
                            </div>
                        </div>
                        <div className='ag_registration_buttons_container'>
                            <button onClick={this.handleSubmit} className='ag_btn ag_common_btn'>Register</button>
                        </div>
                    </form>
                </div>
                );
    }
}