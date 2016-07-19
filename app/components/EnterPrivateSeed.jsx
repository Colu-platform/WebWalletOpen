var React = require('react');
var WalletStore = require('../stores/WalletStore');
var ColuActions = require('../actions/ColuActions');

var Status = require('./Status.jsx');

var EnterPrivateSeed = React.createClass({
	getInitialState: function() {
		return WalletStore.getState();
	},
	componentDidMount: function() {
		WalletStore.listen(this.onChange);
	},
	onChange: function(state) {
		this.setState(state);
	},
	componentWillUnmount: function() {
		WalletStore.unlisten(this.onChange);
	},
	handleSubmit: function (e) {
		var privateSeed = this.refs.privateSeed.value;

		e.preventDefault();
		//Initialize Colu with given private seed
		//if none is entered, colu sdk will generate a random one on initialization
		ColuActions.coluInit(privateSeed);
	},
	render: function () {
		//Build the Enter Private Seed form
		return (
			<form className="enter-privateseed-form">
				<div className = "group privateseed">
					<div className="privateseed-input">
						<input name="privateSeed" ref="privateSeed" />
						<span className="bar"></span>
						<label className="enter">Private Seed</label>
					</div>
					<button className="btn" type="submit" ref="submitButton" onClick={this.handleSubmit}>VIEW WALLET</button>
				</div>
				<Status/>
			</form>
		);
	}
});

module.exports = EnterPrivateSeed;