import React, { Component } from 'react';
import { getJson } from './Api.js';
import 'whatwg-fetch';

class LastDeployed extends Component {
	constructor(props) {
		super(props);

		this.state = {
			sprint: '',
			timestamp: '',
			color: 'black'
		};
	}
	
	componentWillMount() {
		var parent = this;
		var moment = require('moment');

		getJson("http://jenkins.kiwicollection.net/view/Production/job/Production%20-%20Step%203%20-%20Add%20New%20and%20Remove%20Old%20Main%20App%20in%20Load%20Balancer/lastBuild/api/json")
		.then(function(response) {
			var date = moment(response.timestamp);
			if (moment().diff(date, 'hours') < 8 ) {
				parent.setState({color: 'secondary inverted green'});
			}

		    parent.setState({sprint: response.actions[0].parameters[0].value.toUpperCase()});
		    parent.setState({timestamp: date.format('MMM Do h:mma')});

			return response;
		})
	}

    render() {
    	if (this.state.sprint) {
	        return (
	            <div className={`ui center aligned ${this.state.color} segment`}>{this.state.sprint} deployed {this.state.timestamp}</div>
	        );    		
    	} else {
    		return null;
    	}
    }
}

export default LastDeployed;