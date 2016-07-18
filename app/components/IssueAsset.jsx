var WalletStore = require('../stores/WalletStore');
var ColuActions = require('../actions/ColuActions');
var GeneralActions = require('../actions/GeneralActions');
var Status = require('./Status.jsx');

var IssueAsset = React.createClass({
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
        var asset = {
                amount: this.refs.amount && this.refs.amount.value,
                divisibility: this.refs.divisibility && this.refs.divisibility.value,
                reissueable: false,
                transfer: [{
                    amount: this.refs.amount && this.refs.amount.value
                }],
                metadata: {
                    'assetName': this.refs.assetName && this.refs.assetName.value,
                    'issuer': 'Colu Demo Wallet',
                    'urls': [{name:'icon', url: this.refs.iconUrl && this.refs.iconUrl.value, mimeType: 'image/png', dataHash: ''}]
                }
            };

		e.preventDefault();
		//Display the status (issued successfully/failed) with details that will be updated in the issueAsset callback
		ColuActions.issueAsset(asset);
	},
	render: function () {
		//Build the Issue Asset Form
		return (
			<div className="view-content">
		        <form className="issue-asset-form" onSubmit={this.handleSubmit} >
		            <div className = "group">
		                <input ref="assetName" />
		                <span className="bar"></span>
		            	<label>ASSET NAME</label>
		            </div>
                    <div className = "group">
		            	<input ref="iconUrl" />
		            	<span className="bar"></span>
		            	<label>COIN ICON URL</label>
		            </div>
		            <div className = "group">
		            	<input ref="amount" />
		            	<span className="bar"></span>
		            	<label>AMOUNT</label>
		            </div>
		            <div className = "group">
		            	<input ref="divisibility" />
		            	<span className="bar"></span>
		            	<label>DIVISIBILITY</label>
		            </div>
    
		            <button className="btn" type="submit" >SEND</button>
		        </form>
		        <Status />
		    </div>
		);
	}
});

module.exports = IssueAsset;