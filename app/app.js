var IssueAsset = require('./components/IssueAsset.jsx');
var Wallet = require('./Wallet.jsx');
var Nav = require('./components/Nav.jsx');

import React, { Component } from 'react'
import { Router, Route, Link, IndexRoute } from 'react-router'

const Container = (props) => <div>
  <Nav />
  {props.children}
</div>

var App = React.createClass({
	render: function () {
        return (
            <Router>
                <Route path='/' component={Container}>
                    <IndexRoute component={Wallet} />
                    <Route path='/issue' component={IssueAsset} />
                </Route>
            </Router>
        );
    }
});

ReactDOM.render(<App />, document.getElementById('display'));