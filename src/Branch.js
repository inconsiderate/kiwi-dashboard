import React, { Component } from 'react';
import { getJson } from './Api.js';
import 'whatwg-fetch';

const GITLAB_KEY = process.env.GITLAB_KEY || null;

class Branch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			master: {
				jenkinsSource: '',
				gitSource: '',
				color: '',
				jenkinsLink: '',
				gitlabLink: '',
				codecoverageLink: '',
				branch: 'Unchanged'
			},
			concierge: {
				color: '',
				jenkinsLink: '',
				gitlabLink: 'https://git.kiwicollection.net/application/concierge',
				codecoverageLink: '',
				branch: 'Unchanged'
			},
			mainapp: {
				color: '',
				jenkinsLink: '',
				gitlabLink: 'https://git.kiwicollection.net/application/main',
				codecoverageLink: '',
				branch: 'Unchanged'
			},
			symfony1: {
				color: '',
				jenkinsLink: '',
				gitlabLink: 'https://git.kiwicollection.net/kiwicollection/kiwi-main',
				codecoverageLink: '',
				branch: 'Unchanged'
			},
			devops: {
				color: '',
				jenkinsLink: '',
				gitlabLink: 'https://git.kiwicollection.net/kiwicollection/devops',
				codecoverageLink: '',
				branch: 'Unchanged'
			},
			library: {
				color: '',
				jenkinsLink: '',
				gitlabLink: 'https://git.kiwicollection.net/shared/library',
				codecoverageLink: '',
				branch: 'Unchanged'
			},
			api: {
				color: '',
				jenkinsLink: '',
				gitlabLink: 'https://git.kiwicollection.net/application/api',
				codecoverageLink: '',
				branch: 'Unchanged'
			},
		};
	}

	componentWillMount() {
		let parent = this;
		let master = {...parent.state.master};
		let concierge = {...parent.state.concierge};
		let mainapp = {...parent.state.mainapp};
		let symfony1 = {...parent.state.symfony1};
		let devops = {...parent.state.devops};
		let library = {...parent.state.library};
		let api = {...parent.state.api};

		// MASTER BRANCH COLOR
		getJson("http://jenkins.kiwicollection.net/job/sprint-multibranch/job/master/api/json?tree=color,url")
		.then(function(response) {
			master.color = response.color;
			master.jenkinsLink = response.url;
			if (response.color.includes('-anime')) {
			    master.color = response.color.substring(0, response.color.indexOf('-anime'));
			}

		    parent.setState({master});
			return response.color;
		})

		// CONCIERGE BRANCH NAME AND COLOR
		getJson("https://git.kiwicollection.net/api/v4/projects/71/repository/branches?private_token="+GITLAB_KEY+"&per_page=100")
		.then(function(response){
			for (var branch in response) {
				if (response[branch].merged === false && response[branch].name.includes('rc-')) {
					concierge.branch = response[branch].name;

				    parent.setState({concierge});
					return response[branch].name;
				}
			}
		})
		.then(function(response){
			getJson("http://jenkins.kiwicollection.net/job/concierge-multibranch/job/" + response + "/api/json?tree=color,url")
			.then(function(response) {
				concierge.color = response.color;
				concierge.jenkinsLink = response.url;
				if (response.color.includes('-anime')) {
					concierge.color = response.color.substring(0, response.color.indexOf('-anime'));
				}

			    parent.setState({concierge});
				return response.color;
			})
		})

		// MAIN SPRINT BRANCH NAME AND COLOR
		getJson("https://git.kiwicollection.net/api/v4/projects/72/repository/branches?private_token="+GITLAB_KEY+"&per_page=100")
		.then(function(response){
			for (var branch in response) {
				if (response[branch].merged === false && response[branch].name.includes('rc-')) {
					mainapp.branch = response[branch].name;

				    parent.setState({mainapp});
					return response[branch].name;
				}
			}
		})
		.then(function(response){
			getJson("http://jenkins.kiwicollection.net/job/sprint-multibranch/job/" + response + "/api/json?tree=color,url")
			.then(function(response) {
				mainapp.color = response.color;
				mainapp.jenkinsLink = response.url;
				if (response.color.includes('-anime')) {
					mainapp.color = response.color.substring(0, response.color.indexOf('-anime'));
				}

			    parent.setState({mainapp});
				return response.color;
			})
		})

		// SYMFONY1 BRANCH NAME
		getJson("https://git.kiwicollection.net/api/v4/projects/55/repository/branches?private_token="+GITLAB_KEY+"&per_page=100")
		.then(function(response){
			for (var branch in response) {
				if (response[branch].merged === false && response[branch].name.includes('rc-')) {
					symfony1.branch = response[branch].name;

				    parent.setState({symfony1});
					return response[branch].name;
				}
			}
		})

		// DEVOPS BRANCH NAME
		getJson("https://git.kiwicollection.net/api/v4/projects/37/repository/branches?private_token="+GITLAB_KEY+"&per_page=100")
		.then(function(response){
			for (var branch in response) {
				if (response[branch].merged === false && response[branch].name.includes('rc-')) {
					devops.branch = response[branch].name;

				    parent.setState({devops});
					return response[branch].name;
				}
			}
		})

		// LIBRARY BRANCH NAME
		getJson("https://git.kiwicollection.net/api/v4/projects/73/repository/branches?private_token="+GITLAB_KEY+"&per_page=100")
		.then(function(response){
			for (var branch in response) {
				if (response[branch].merged === false && response[branch].name.includes('rc-')) {
					library.branch = response[branch].name;

				    parent.setState({library});
					return response[branch].name;
				}
			}
		})
	}

    render() {
    	let masterMessageLabel = null;

    	if (this.state.master.color === 'blue') {
			masterMessageLabel = <div className="label">Clear Sailing Ahead</div>
    	} else {
			masterMessageLabel = <div className="ui red label">Master is Broken! Fix it!</div>
    	}

        return (
        	<div className="ui container">
	            <div id="last-deployed"></div>
	            <div className="ui centered header">
					<div className={`ui ${this.state.master.color} statistic`}>
		            	<a href={this.state.mainapp.jenkinsLink} target="_blank" className={`ui basic ${this.state.mainapp.color} value`}>Master</a>
						{masterMessageLabel}

					</div>
	            </div>

	            <div className="ui five centered stackable cards">
		            <div className="card">
			            <a href={this.state.mainapp.gitlabLink} className="content">
			            	<img className="right floated mini ui image" alt="test" src="/images/mainapp.png" />
			            	<div className="header">MAIN-APP</div>
			            	<div className="meta">{this.state.mainapp.branch}</div>
			            	<div className="description">Some extra details on code coverage, etc. Maybe the last commit? I don't know.</div>
			            </a>
			            <div className="extra content">
			            	<div className="ui two buttons">
				            	<a href={this.state.mainapp.jenkinsLink} target="_blank" className={`ui basic ${this.state.mainapp.color} button`}>Build Status</a>
				            	<a href={this.state.mainapp.codecoverageLink} target="_blank" className={`ui basic black button`}>72% coverage</a>
				            </div>
			            </div>
	            	</div>
		            <div className="card">
			            <a href={this.state.concierge.gitlabLink} className="content">
			            	<img className="right floated mini ui image" alt="test" src="/images/concierge.png" />
			            	<div className="header">CONCIERGE</div>
			            	<div className="meta">{this.state.concierge.branch}</div>
			            	<div className="description">Some extra details on code coverage, etc. Maybe the last commit? I don't know.</div>
			            </a>
			            <div className="extra content">
			            	<div className="ui two buttons">
				            	<a href={this.state.concierge.url} target="_blank" className={`ui basic ${this.state.concierge.color} button`}>Build Status</a>
				            	<a href={this.state.concierge.codecoverageLink} target="_blank" className={`ui basic black button`}>72% coverage</a>
				            </div>
			            </div>
	            	</div>
		            <div className="card">
			            <a href={this.state.library.gitlabLink} className="content">
			            	<img className="right floated mini ui image" alt="test" src="/images/library.jpg" />
			            	<div className="header">LIBRARY</div>
			            	<div className="meta">{this.state.library.branch}</div>
			            	<div className="description">Some extra details on code coverage, etc. Maybe the last commit? I don't know.</div>
			            </a>
	            	</div>
		            <div className="card">
			            <a href={this.state.symfony1.gitlabLink} className="content">
			            	<img className="right floated mini ui image" alt="test" src="/images/symfony1.png" />
			            	<div className="header">SYMFONY1</div>
			            	<div className="meta">{this.state.symfony1.branch}</div>
			            	<div className="description">Some extra details on code coverage, etc. Maybe the last commit? I don't know.</div>
			            </a>
	            	</div>
		            <div className="card">
			            <a href={this.state.api.gitlabLink} className="content">
			            	<img className="right floated mini ui image" alt="test" src="/images/api.gif" />
			            	<div className="header">API</div>
			            	<div className="meta">{this.state.api.branch}</div>
			            	<div className="description">Some extra details on code coverage, etc. Maybe the last commit? I don't know.</div>
			            </a>
			            <div className="extra content">
			            	<div className="ui two buttons">
				            	<div className={`ui basic ${this.state.api.color} black button`}>coming soon</div>
				            	<a href={this.state.api.codecoverageLink} target="_blank" className={`ui basic black button`}>coming soon</a>
				            </div>
			            </div>
	            	</div>
	            </div>
			</div>
        );
    }
}

export default Branch;

