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
			apiColor: '',
			sprintBranch: 'Unchanged',
			conciergeBranch: 'Unchanged',
			libraryBranch: 'Unchanged',
			symfony1Branch: 'Unchanged',
			apiBranch: 'Unchanged'
		};
	}

	componentWillMount() {
		var parent = this;

		// MASTER BRANCH COLOR
		getJson("http://jenkins.kiwicollection.net/job/sprint-multibranch/job/master/api/json?tree=color")
		.then(function(response) {
			if (response.color.includes('-anime')) {
			    parent.setState({masterColor: response.color.substring(0, response.color.indexOf('-anime'))});
			} else {
			    parent.setState({masterColor: response.color});
			}

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
			getJson("http://jenkins.kiwicollection.net/job/concierge-multibranch/job/" + response + "/api/json?tree=color")
			.then(function(response) {
				if (response.color.includes('-anime')) {
				    parent.setState({conciergeColor: response.color.substring(0, response.color.indexOf('-anime'))});
				} else {
				    parent.setState({conciergeColor: response.color});
				}

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
			getJson("http://jenkins.kiwicollection.net/job/sprint-multibranch/job/" + response + "/api/json?tree=color")
			.then(function(response) {
				if (response.color.includes('-anime')) {
					console.log(response.color.substring(0, response.color.indexOf('-anime')));
				    parent.setState({sprintColor: response.color.substring(0, response.color.indexOf('-anime'))});
				} else {
				    parent.setState({sprintColor: response.color});
				}

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

		// DEVOPS BRANCH NAME
		getJson("https://git.kiwicollection.net/api/v4/projects/37/repository/branches?private_token="+ GITLAB_KEY +"&per_page=100")
		.then(function(response){
			for (var branch in response) {
				if (response[branch].merged === false && response[branch].name.includes('rc-')) {
				    parent.setState({devopsBranch: response[branch].name});

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
        	<div className="ui container">
	            <div id="last-deployed"></div>
	            <div className="ui centered header">
					<div className={`ui ${this.state.masterColor} statistic`}>
						<div className="label">{this.state.devopsBranch}</div>
						<div className="value">master</div>
					</div>
	            </div>
	        	<div className="ui five tiny statistics">
					<div className={`${this.state.sprintColor} statistic`}>
						<div className="label">{this.state.sprintBranch}</div>
						<div className="value">main</div>
						<div className="label">code-coverage</div>
					</div>
					<div className={`${this.state.conciergeColor} statistic`}>
						<div className="label">{this.state.conciergeBranch}</div>
						<div className="value">concierge</div>
						<div className="label">code-coverage</div>
					</div>
					<div className={`${this.state.libraryColor} statistic`}>
						<div className="label">{this.state.libraryBranch}</div>
						<div className="value">library</div>
					</div>
					<div className={`${this.state.symfony1Color} statistic`}>
						<div className="label">{this.state.symfony1Branch}</div>
						<div className="value">symfony1</div>
					</div>
					<div className={`${this.state.apiColor} statistic`}>
						<div className="label">coming soon</div>
						<div className="value">api</div>
						<div className="label">code-coverage</div>
					</div>
				</div>
			</div>
        );
    }
}

export default Branch;

