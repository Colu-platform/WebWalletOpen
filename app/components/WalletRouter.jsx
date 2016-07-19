var React = require('react');
var Router = require('react-router').Router;

var IssueAsset = require('./IssueAsset.jsx');
var AssetsGrid = require('./AssetsGrid.jsx');
var Nav = require('./Nav.jsx');
var SendAsset = require('./SendAsset.jsx');

var consts = require('../consts.js');


//{this.props.children} renders the active child route handler
//The reason for nesting routes this particular way is because we are going to place
//Nav menu (which is constant along all the routes) next to the active route, inside the Container component

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

var routes = {
    path: '/',
    component: Container,
    childRoutes: [
        { path: '/issue', component: IssueAsset },
        { path: '/assets', component: AssetsGrid, renderStyle: consts.assetRenderStyle.grid},
        { path: '/sendAsset', component: SendAsset}
    ]
};

var WalletRouter = React.createClass({
	render: function () {
		return (
			<Router routes={routes} />
		);
	}
});

module.exports = WalletRouter;