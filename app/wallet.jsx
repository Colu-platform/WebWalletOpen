// Components
var EnterPrivateSeed = require('./components/EnterPrivateSeed.jsx');
var WalletRouter = require('./components/WalletRouter.jsx');
var Status = require('./components/Status.jsx');

//Stores
var WalletStore = require('./stores/WalletStore');

//Actions
var ColuActions = require('./actions/ColuActions');
var GeneralActions = require('./actions/GeneralActions');

//Constants
var consts = require('./consts.js');

//Create the wallet
var Wallet = React.createClass({
	getInitialState: function () {
		return {
			privateSeed: null,
			assets: [],
			error: null,
			currentView: consts.initial,
			sentAsset: 0,
			assetIdsForAddress: []
		};
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
		return (
			<div>
						<div className="enter-private-seed">
					<EnterPrivateSeed />
				</div>
				<div className="wallet-main" style={{display: 'none'}}>
						<div className="private-seed">{this.state.privateSeed}</div>
						<WalletRouter />
				</div>
		</div>
		);
	}
});

ReactDOM.render(<Wallet />, document.getElementById('display'));