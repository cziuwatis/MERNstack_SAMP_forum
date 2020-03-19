import React, {Component} from "react";

export default class ConfirmationUI extends Component
{
    constructor(props)
    {
        super(props);
    }

    confirm = e => {
        this.props.yesFunction();
        this.props.closeFunction();
    }

    render() {
        return (
<div className="confirmationUI">
    <h3>{this.props.query}</h3>
    <p>{this.props.msg}</p>
    <span className="ag_btn ag_common_btn" onClick={this.props.closeFunction}>Cancel</span>
    <span className="ag_btn ag_common_btn" onClick={this.confirm}>Ok</span>
</div>
                );
    }
}