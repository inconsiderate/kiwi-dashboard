import React, { Component } from 'react';
import { getJson } from './Api.js';
import 'whatwg-fetch';

var GITLAB_KEY = process.env.GITLAB_KEY || null;
var gitQueryParams = "?private_token=&per_page=100";
var jenkinsQueryParams = "/api/json?tree=color,url";

class Branch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			master: {
				jenkinsSource: 'http://jenkins.kiwicollection.net/job/sprint-multibranch/job/master',
				gitSource: null,
				color: '',
				jenkinsLink: '',
				gitlabLink: '',
				codecoverageLink: '',
				branch: 'Unchanged'
			},
			concierge: {
				jenkinsSource: 'http://jenkins.kiwicollection.net/job/concierge-multibranch/job/',
				gitSource: 'https://git.kiwicollection.net/api/v4/projects/71/repository/branches',
				color: '',
				jenkinsLink: '',
				gitlabLink: 'https://git.kiwicollection.net/application/concierge',
				codecoverageLink: '',
				branch: 'Unchanged'
			},
			mainapp: {
				jenkinsSource: 'http://jenkins.kiwicollection.net/job/sprint-multibranch/job/',
				gitSource: 'https://git.kiwicollection.net/api/v4/projects/72/repository/branches',
				color: '',
				jenkinsLink: '',
				gitlabLink: 'https://git.kiwicollection.net/application/main',
				codecoverageLink: '',
				branch: 'Unchanged'
			},
			symfony1: {
				jenkinsSource: null,
				gitSource: 'https://git.kiwicollection.net/api/v4/projects/55/repository/branches',
				color: '',
				jenkinsLink: '',
				gitlabLink: 'https://git.kiwicollection.net/kiwicollection/kiwi-main',
				codecoverageLink: '',
				branch: 'Unchanged'
			},
			devops: {
				jenkinsSource: null,
				gitSource: 'https://git.kiwicollection.net/api/v4/projects/37/repository/branches',
				color: '',
				jenkinsLink: '',
				gitlabLink: 'https://git.kiwicollection.net/kiwicollection/devops',
				codecoverageLink: '',
				branch: 'Unchanged'
			},
			library: {
				jenkinsSource: null,
				gitSource: 'https://git.kiwicollection.net/api/v4/projects/73/repository/branches',
				color: '',
				jenkinsLink: '',
				gitlabLink: 'https://git.kiwicollection.net/shared/library',
				codecoverageLink: '',
				branch: 'Unchanged'
			}
		};
	}

	componentWillMount() {
		let parent = this;
		var counter = 0;
		for (var property in parent.state) {
			counter++;
			let currentState = []; 
			currentState[counter] = {...this.state[property]};
			if (currentState[counter].gitSource) {			
				let git = currentState[counter].gitSource + gitQueryParams;

				getJson(git)
				.then(function(response){
					for (var branch in response) {
						if (response[branch].merged === false && response[branch].name.includes('rc-')) {
							currentState[counter].branch = response[branch].name;

							return response[branch].name;
						}
					}
				})
				.then(function(response){
					if (currentState[counter].jenkinsSource) {
						let jenkinsUrl = currentState[counter].jenkinsSource + response + jenkinsQueryParams;

						getJson(jenkinsUrl)
						.then(function(response) {
							currentState[counter].color = response.color;
							currentState[counter].jenkinsLink = response.url;
							if (response.color.includes('-anime')) {
								currentState[counter].color = response.color.substring(0, response.color.indexOf('-anime'));
							}

							var obj = {};
							obj[property] = currentState[counter];
						    parent.setState({obj});
						})			
					}
					return response;
				})
			} 

			if (!currentState[counter].gitSource && currentState[counter].jenkinsSource) {
				console.log(property);
				console.log(currentState[counter].gitSource);
				console.log(currentState[counter].jenkinsSource);

				let jenkinsUrl = currentState[counter].jenkinsSource + jenkinsQueryParams;

				getJson(jenkinsUrl)
				.then(function(response) {
									console.log(property);
				console.log(currentState[counter].gitSource);
				console.log(currentState[counter].jenkinsSource);
					currentState[counter].color = response.color;
					currentState[counter].jenkinsLink = response.url;
					if (response.color.includes('-anime')) {
						currentState[counter].color = response.color.substring(0, response.color.indexOf('-anime'));
					}

					var obj = {};
					obj[property] = currentState[counter];
					console.log(obj);
				    parent.setState({obj});

				    return response;
				})			
			}
		}
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
		            	<a href={this.state.master.jenkinsLink} target="_blank" className={`ui basic ${this.state.master.color} value`}>Master</a>
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
			            <a href="" className="content">
			            	<img className="right floated mini ui image" alt="test" src="/images/api.gif" />
			            	<div className="header">API</div>
			            	<div className="meta"></div>
			            	<div className="description">Some extra details on code coverage, etc. Maybe the last commit? I don't know.</div>
			            </a>
			            <div className="extra content">
			            	<div className="ui two buttons">
				            	<div className={`ui basic black button`}>coming soon</div>
				            	<a href="" target="_blank" className={`ui basic black button`}>coming soon</a>
				            </div>
			            </div>
	            	</div>
	            </div>
			</div>
        );
    }
}

export default Branch;

