import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import App from './App';
import Pages from './pages/index';
import 'antd/dist/antd.css';
// import * as serviceWorker from './serviceWorker';
class Index extends Component {
	render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route  path="/app" component={App} /> {/* 首页 */}
					<Route exact path="/" component={Pages} /> {/* 列表 */}
				</Switch>
			</BrowserRouter>
		);
	}
}

ReactDOM.render(<Index />, document.getElementById('root'));

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
