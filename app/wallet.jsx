var React = require('react');
var ReactDOM = require('react-dom');

// Components
var EnterPrivateSeed = require('./components/EnterPrivateSeed.jsx');
var WalletRouter = require('./components/WalletRouter.jsx');

//Stores
var WalletStore = require('./stores/WalletStore');

//Actions
var ColuActions = require('./actions/ColuActions');

//Create the wallet
var Wallet = React.createClass({
	getInitialState: function () {
		return {
			privateSeed: null,
			assets: [],
			error: null,
			sentAsset: 0,
			assetIdsForAddress: [],
			updatedStatus: null,
			hasWallet: localStorage.getItem('privateSeed')
		};
	},
	componentWillMount: function() {
		var currentPrivateSeed = localStorage.getItem('privateSeed');

		//Initialize Colu, remember while this action is running you cannot dispatch another action (this will produce an error)
		if (currentPrivateSeed) {
			ColuActions.coluInit(currentPrivateSeed);
		}
	},
	componentDidMount: function() {
		//subscribe to the store
		WalletStore.listen(this.onChange);
	},
	onChange: function(state) {
		//Update this component's state with what's in the WalletSore
		this.setState(state);
	},
	componentWillUnmount: function() {
		//Stop updating component's state once it's not active
		WalletStore.unlisten(this.onChange);
	},
	render: function() {
		if (this.state.privateSeed) {//Returning user (because initialized with currentPrivateSeed): When colu is ready return the wallet content
			return (
				<div>
					<EnterPrivateSeed />
					<div className="wallet-main" >
						<div className="private-seed">{this.state.privateSeed}</div>
						<WalletRouter />
					</div>
				</div>
			);
		} else if (this.state.hasWallet) {//Returning user but colu is not ready yet, display loading
			return (
				<div>
					<EnterPrivateSeed />
				<p style={{textAlign:'center', color: '#4dd9b4'}}>loading...</p>
				</div>
			);
		} else {//New user: display the enter private seed form only
			return(
				<EnterPrivateSeed />
			);
		}
	}
});

ReactDOM.render(<Wallet />, document.getElementById('display'));