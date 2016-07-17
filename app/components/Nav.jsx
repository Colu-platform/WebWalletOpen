var WalletStore = require('../stores/WalletStore');
var ColuActions = require('../actions/ColuActions');
var consts = require('../consts.js');


import { Link } from 'react-router'


var Nav = React.createClass({
	componentDidMount: function() {
        WalletStore.listen(this.onChange);
    },
    onChange: function(state) {
        this.setState(state);
    },
    componentWillUnmount: function() {
        WalletStore.unlisten(this.onChange);
    },
    render: function () {
        return (
            <div className="wallet-nav">
                <Link className="btn nav-btn" to='/issue'>ISSUE</Link>
                <Link className="btn nav-btn" to='/assets'>VIEW ASSETS</Link>
                <Link className="btn nav-btn" to='/sendAsset'>SEND AN ASSET</Link>
            </div>
        );
    }
});

module.exports = Nav;