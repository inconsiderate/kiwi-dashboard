import React, { Component } from 'react';
import { getJson } from './Api.js';
import 'whatwg-fetch';

class LastDeployed extends Component {
	constructor(props) {
		super(props);

		this.state = {
			sprint: '',
			timestamp: ''
		};
	}
	
	componentWillMount() {
		var parent = this;
		var moment = require('moment');

		getJson("http://jenkins.kiwicollection.net/view/Production/job/Production%20-%20Step%203%20-%20Add%20New%20and%20Remove%20Old%20Main%20App%20in%20Load%20Balancer/lastBuild/api/json")
		.then(function(response) {

			var datetime = moment(response.timestamp);

		    parent.setState({sprint: response.actions[0].parameters[0].value.toUpperCase()});
		    parent.setState({timestamp: datetime.format('MMM Do h:mma')});

			return response;
		})
	}

    render() {
        return (
            <div className="ui container branchContainer">
	            <div className="ui center aligned segment">{this.state.sprint} deployed on {this.state.timestamp}</div>
			</div>
        );
    }
}

export default LastDeployed;