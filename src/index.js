import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Branch from './Branch';
import LastDeployed from './LastDeployed';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Branch />, document.getElementById('root'));
ReactDOM.render(<LastDeployed />, document.getElementById('last-deployed'));
registerServiceWorker();
