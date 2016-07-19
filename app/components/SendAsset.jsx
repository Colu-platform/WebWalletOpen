var React = require('react');

var AssetsGrid = require('./AssetsGrid.jsx');
var consts = require('../consts.js');

var ColuActions = require('../actions/ColuActions');
var GeneralActions = require('../actions/GeneralActions');

var WalletStore = require('../stores/WalletStore');

var SendAsset = React.createClass({
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
		GeneralActions.resetStatus();
	},
	handleSubmit: function (e) {
		var assetInfo = {
				from: this.state.addresses,
				assetId: this.state && this.state.chosenAssetId,
				amount: this.refs.amount && this.refs.amount.value
			};
		
		//If an address to send is entered, send to address
		//If phone number is entered and no address, send to phone number
		if (this.refs.toAddress && this.refs.toAddress.value) {
			assetInfo.toAddress = this.refs.toAddress.value;
		} else if (this.refs.toPhoneNumber && this.refs.toPhoneNumber.value) {
			assetInfo.toPhoneNumber = this.refs.toPhoneNumber.value;
		}
		
		e.preventDefault();
		//Display the status (sent successfully/failed) with details that will be updated in the sendAsset callback
		ColuActions.sendAsset(assetInfo);
	},
	render: function () {
		//Build the To Send Form and render Assets List as a list of options
		//When a specific asset is chosen from the option list, update the
		//amount field placeholder with the available amount for that asset
		return (
			<div className="view-content">
				<form className="sendto-form" onSubmit={this.handleSubmit} >
					<div className = "group">
						<AssetsGrid renderStyle={consts.assetRenderStyle.list} />
						<label>FROM</label>
					</div>
					<div className = "group">
						<input ref="toAddress" />
						<span className="bar"></span>
						<label>TO ADDRESS</label>
					</div>
					<div className = "group">
						<input ref="toPhoneNumber" />
						<span className="bar"></span>
						<label>TO PHONE NUMBER</label>
					</div>
					<div className = "group">
						<input ref="amount" placeholder={this.state ? this.state.assetAmount : ''} />
						<span className="bar"></span>
						<label>AMOUNT</label>
					</div>
					<button className="btn" type="submit" >SEND</button>
				</form>
			</div>
		);
	}
});

module.exports = SendAsset;