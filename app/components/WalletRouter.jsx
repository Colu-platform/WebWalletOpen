var IssueAsset = require('./IssueAsset.jsx');
var AssetsGrid = require('./AssetsGrid.jsx');
var Nav = require('./Nav.jsx');
var WalletStore = require('../stores/WalletStore');
var ColuActions = require('../actions/ColuActions');
var SendAsset = require('./SendAsset.jsx');
var consts = require('../consts.js');

import React, { Component } from 'react'
import { Router, Route, Link, IndexRoute } from 'react-router'

const Container = (props) => <div className="wallet-content">
  <Nav />
  {props.children}
</div>

var WalletRouter = React.createClass({
    render: function () {
        return (
            <Router>
                <Route path='/' component={Container}>
                    <Route path='/issue' component={IssueAsset} />
                    <Route path='/assets' component={AssetsGrid} renderStyle={consts.assetRenderStyle.grid} />
                    <Route path='/sendAsset' component={SendAsset} />
                </Route>
            </Router>
        );
    }
});

module.exports = WalletRouter;