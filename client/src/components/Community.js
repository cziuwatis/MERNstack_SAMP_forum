import React, {Component} from "react";
import axios from 'axios';
import MemberBox from './CommunityComponents/MemberBox';

export default class Community extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            moreAvailable: true
        }
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:4000/users/')
                .then(res => !res.data.error ? this.setState({users: res.data.users, moreAvailable: res.data.users.length > 0}) : console.log(res.data.error))
                .catch((error) => console.log(error));
    }
    loadMore = e => {
        if (this.state.moreAvailable && this.state.users.length % 8 == 0) {
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:4000/users/', {last_id: this.state.users[this.state.users.length - 1]._id})
                    .then(res => !res.data.error ? this.setState({users: this.state.users.concat(res.data.users), moreAvailable: res.data.users.length > 0}) : console.log(res.data.error))
                    .catch((error) => console.log(error));
        }
    }
    deleteUser = userId => {
        this.setState({users: this.state.users.filter(user => user._id != userId)});
    }

    render() {
        return (
                <div id='ag_community_container'>
                    <div id='ag_community'>
                        <h1 className='ag_community_title'>Community Members</h1>
                        <div>
                            search bar would be here?
                        </div>
                        <ul className='ag_community_members_container'>
                            {this.state.users.map(user => <MemberBox key={user._id} deleteUser={this.deleteUser} user={user}/>)}
                            <li onClick={this.loadMore} className={'ag_community_load_more ' + (!this.state.moreAvailable || this.state.users.length % 8 > 0 ? 'ag_community_load_more_disabled' : 'enab')}>Load more...</li>
                        </ul>
                    </div>
                </div>
                );
    }

}