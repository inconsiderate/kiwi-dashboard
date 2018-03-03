import React, { Component } from 'react';
import { getJson } from './Api.js';
import 'whatwg-fetch';

const GITLAB_KEY = process.env.GITLAB_KEY || null;

class Branch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			sprintColor: '',
			masterColor: '',
			conciergeColor: '',
			sprintBranch: '',
			conciergeBranch: '',
			libraryBranch: '',
			symfony1Branch: ''
		};
	}

	componentWillMount() {
		var parent = this;

		// MASTER BRANCH COLOR
		getJson("http://jenkins.kiwicollection.net/job/sprint-multibranch/job/master/api/json?tree=color")
		.then(function(response) {
		    parent.setState({masterColor: response.color});

			return response.color;
		})

		// CONCIERGE BRANCH NAME AND COLOR
		getJson("https://git.kiwicollection.net/api/v4/projects/71/repository/branches?private_token="+ GITLAB_KEY +"&per_page=100")
		.then(function(response){
			for (var branch in response) {
				if (response[branch].merged === false && response[branch].name.includes('rc-')) {
				    parent.setState({conciergeBranch: response[branch].name});

					return response[branch].name;
				}
			}
		})
		.then(function(response){
		    parent.setState({concierge: 'response'}); 
			getJson("http://jenkins.kiwicollection.net/job/concierge-multibranch/job/" + response + "/api/json?tree=color")
			.then(function(response) {
			    parent.setState({conciergeColor: response.color});

				return response.color;
			})
		})

		// MAIN SPRINT BRANCH NAME AND COLOR
		getJson("https://git.kiwicollection.net/api/v4/projects/72/repository/branches?private_token="+ GITLAB_KEY +"&per_page=100")
		.then(function(response){
			for (var branch in response) {
				if (response[branch].merged === false && response[branch].name.includes('rc-')) {
				    parent.setState({sprintBranch: response[branch].name});

					return response[branch].name;
				}
			}
		})
		.then(function(response){
		    parent.setState({concierge: 'response'}); 
			getJson("http://jenkins.kiwicollection.net/job/sprint-multibranch/job/" + response + "/api/json?tree=color")
			.then(function(response) {
			    parent.setState({sprintColor: response.color});

				return response.color;
			})
		})

		// SYMFONY1 BRANCH NAME
		getJson("https://git.kiwicollection.net/api/v4/projects/55/repository/branches?private_token="+ GITLAB_KEY +"&per_page=100")
		.then(function(response){
			for (var branch in response) {
				if (response[branch].merged === false && response[branch].name.includes('rc-')) {
				    parent.setState({symfony1Branch: response[branch].name});

					return response[branch].name;
				}
			}
		})

		// LIBRARY BRANCH NAME
		getJson("https://git.kiwicollection.net/api/v4/projects/73/repository/branches?private_token="+ GITLAB_KEY +"&per_page=100")
		.then(function(response){
			for (var branch in response) {
				if (response[branch].merged === false && response[branch].name.includes('rc-')) {
				    parent.setState({libraryBranch: response[branch].name});

					return response[branch].name;
				}
			}
		})
	}

    render() {
        return (
        	<div className="branchContainer">
	            <div id="last-deployed"></div>
	            <h1 className="ui huge centered header">Kiwi Dash</h1>
	        	<div className="ui five tiny statistics">
					<div className={`${this.state.sprintColor} statistic`}>
						<div className="label">{this.state.sprintBranch}</div>
						<div className="value">main</div>
						<div className="label">62%</div>
					</div>
					<div className={`${this.state.conciergeColor} statistic`}>
						<div className="label">{this.state.conciergeBranch}</div>
						<div className="value">concierge</div>
						<div className="label">92%</div>
					</div>
					<div className={`${this.state.libraryColor} statistic`}>
						<div className="label">{this.state.libraryBranch}</div>
						<div className="value">library</div>
					</div>
					<div className={`${this.state.symfony1Color} statistic`}>
						<div className="label">{this.state.symfony1Branch}</div>
						<div className="value">symfony1</div>
					</div>
					<div className={`${this.state.masterColor} statistic`}>
						<div className="label">{this.state.masterBranch}</div>
						<div className="value">master</div>
					</div>
				</div>
			</div>
        );
    }
}

export default Branch;

