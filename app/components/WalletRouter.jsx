var IssueAsset = require('./IssueAsset.jsx');
var AssetsGrid = require('./AssetsGrid.jsx');
var Nav = require('./Nav.jsx');
var SendAsset = require('./SendAsset.jsx');

var consts = require('../consts.js');

import React, { Component } from 'react'
import { Router, Route, Link, IndexRoute } from 'react-router'

import createBrowserHistory from 'history/lib/createBrowserHistory';
let history = createBrowserHistory();

var Container = React.createClass({
	render: function () {
		return (
			<div className="wallet-content">
				<Nav />
					{this.props.children}
			</div>
		);
	}
})

var WalletRouter = React.createClass({
	render: function () {
		return (
			<Router>
				<Route path='/' history={history} component={Container}>
					<Route path='/issue' component={IssueAsset} />
					<Route path='/assets' component={AssetsGrid} renderStyle={consts.assetRenderStyle.grid} />
					<Route path='/sendAsset' component={SendAsset} />
				</Route>
			</Router>
		);
	}
});

module.exports = WalletRouter;