(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

alt = require('../alt.js');

function EnterPrivateSeedActions() {
  this.generateActions('coluInitSuccess', 'coluInitFail');
}

EnterPrivateSeedActions.prototype.coluInit = function (privateSeed) {
  var settings = {
    network: 'testnet',
    privateSeed: privateSeed
  },
      that = this;

  try {
    colu = new Colu(settings);

    colu.on('connect', function () {
      if (!privateSeed) {
        privateSeed = colu.hdwallet.getPrivateSeed();
      }
      //that.setState({
      //    privateSeed: privateSeed
      //});

      this.actions.coluInitSuccess(privateSeed);

      $(".wallet-content").css("display", "block");
    });

    colu.init();
  } catch (e) {
    this.actions.coluInitFail(e);
    console.log("Enter a valid private seed", e);
  }
};

module.exports = alt.createActions(EnterPrivateSeedActions);

},{"../alt.js":2}],2:[function(require,module,exports){
'use strict';

Alt = require('alt');

module.exports = new Alt();

},{"alt":"alt"}],3:[function(require,module,exports){
'use strict';

var WalletStore = require('../stores/WalletStore');
var EnterPrivateSeedActions = require('../actions/EnterPrivateSeedActions');

var EnterPrivateSeed = React.createClass({
	displayName: 'EnterPrivateSeed',

	componentDidMount: function componentDidMount() {
		WalletStore.listen(this.onChange);
	},
	onChange: function onChange(state) {
		this.setState(state);
	},
	handleSubmit: function handleSubmit(e) {
		var privateSeed = this.refs.privateSeed.value;

		e.preventDefault();
		EnterPrivateSeedActions.coluInit();
	},
	render: function render() {
		return React.createElement(
			'form',
			{ className: 'enter-privateseed-form', onSubmit: this.handleSubmit },
			React.createElement(
				'div',
				{ className: 'group' },
				React.createElement('input', { name: 'privateSeed', ref: 'privateSeed' }),
				React.createElement('span', { className: 'bar' }),
				React.createElement(
					'label',
					null,
					'Private Seed'
				),
				React.createElement(
					'button',
					{ className: 'btn', type: 'submit', ref: 'submitButton' },
					'ENTER'
				)
			)
		);
	}
});

module.exports = EnterPrivateSeed;

},{"../actions/EnterPrivateSeedActions":1,"../stores/WalletStore":4}],4:[function(require,module,exports){
'use strict';

alt = require('../alt.js');
var EnterPrivateSeedActions = require('../actions/EnterPrivateSeedActions.js');

function WalletStore() {
  this.bindActions(EnterPrivateSeedActions);
  this.privateSeed = 0;
}

WalletStore.prototype.onColuInitSuccess = function (privateSeed) {
  this.privateSeed = privateSeed;
};

WalletStore.prototype.onColuInitFail = function (e) {
  this.privateSeed = e.toString();
};

module.exports = alt.createStore(WalletStore);

},{"../actions/EnterPrivateSeedActions.js":1,"../alt.js":2}],5:[function(require,module,exports){
'use strict';

require('alt');
var colu;
var EnterPrivateSeed = require('./components/EnterPrivateSeed.jsx');

var SendAsset = React.createClass({
				displayName: 'SendAsset',

				sendAsset: function sendAsset(assetInfo) {
								var that = this,
								    asset = {
												from: [assetInfo.from],
												to: [{
																address: assetInfo.toAddress,
																assetId: assetInfo.assetId,
																amount: assetInfo.amount
												}]
								};
								colu.sendAsset(asset, function (err, body) {
												if (err) return console.error(err);
												//need to update the store
								});
				},
				handleSubmit: function handleSubmit(e) {
								var assetInfo = {
												from: this.refs.from.value,
												toAddress: this.refs.toAddress.value,
												assetId: this.refs.assetid.value,
												amount: this.refs.amount.value
								};
								e.preventDefault();
								this.sendAsset(assetInfo);
				},
				render: function render() {
								return React.createElement(
												'form',
												{ className: 'sendto-form', onSubmit: this.handleSubmit },
												React.createElement(
																'div',
																{ className: 'group' },
																React.createElement('input', { ref: 'from' }),
																React.createElement('span', { className: 'bar' }),
																React.createElement(
																				'label',
																				null,
																				'FROM'
																)
												),
												React.createElement(
																'div',
																{ className: 'group' },
																React.createElement('input', { ref: 'toAddress' }),
																React.createElement('span', { className: 'bar' }),
																React.createElement(
																				'label',
																				null,
																				'TO ADDRESS'
																)
												),
												React.createElement(
																'div',
																{ className: 'group' },
																React.createElement('input', { ref: 'assetid' }),
																React.createElement('span', { className: 'bar' }),
																React.createElement(
																				'label',
																				null,
																				'ASSET ID'
																)
												),
												React.createElement(
																'div',
																{ className: 'group' },
																React.createElement('input', { ref: 'amount' }),
																React.createElement('span', { className: 'bar' }),
																React.createElement(
																				'label',
																				null,
																				'AMOUNT'
																)
												),
												React.createElement(
																'button',
																{ className: 'btn', type: 'submit' },
																'SEND'
												)
								);
				}
});

var Wallet = React.createClass({
				displayName: 'Wallet',

				getInitialState: function getInitialState() {
								return {
												privateSeed: null,
												assets: [],
												error: null,
												currentView: 0
								};
				},
				getAssets: function getAssets() {
								var that = this,
								    assets = [];
								colu.getAssets(function (err, body) {
												if (err) {
																return console.error(err);
												}
												assets = body;
												assets.unshift({ address: 'ADDRESS', assetId: 'ASSET ID', amount: 'AMOUNT' });
												that.setState({
																assets: assets,
																currentView: 1
												});
								});
				},
				issueAsset: function issueAsset() {
								var that = this,
								    asset = {
												amount: 10,
												divisibility: 0,
												reissueable: false,
												transfer: [{
																amount: 10
												}],
												metadata: {
																'assetName': 'Mission Impossible 15',
																'issuer': 'Fox Theater',
																'description': 'Movie ticket to see the New Tom Cruise flick',
																'urls': [{ name: 'icon', url: 'https://pbs.twimg.com/profile_images/572390580823412736/uzfQSciL_bigger.png', mimeType: 'image/png', dataHash: '' }],
																'userData': {
																				'meta': [{ key: 'Item ID', value: 2, type: 'Number' }, { key: 'Item Name', value: 'Item Name', type: 'String' }, { key: 'Company', value: 'My Company', type: 'String' }, { key: 'Address', value: 'San Francisco, CA', type: 'String' }]
																}
												}
								};
								colu.issueAsset(asset, function (err, body) {
												if (err) return console.error(err);
												that.setState({
																currentView: 2
												});
								});
				},

				displaySendAsset: function displaySendAsset() {
								var that = this;
								that.setState({
												currentView: 3
								});
				},

				render: function render() {
								var divStyle = {
												display: 'none'
								},
								    assetsGrid = this.state.assets.map(function (asset, i) {
												return React.createElement(
																'div',
																{ key: 'grid-row-' + i, className: 'row' },
																React.createElement(
																				'div',
																				{ className: 'cell address-cell' },
																				asset.address
																),
																React.createElement(
																				'div',
																				{ className: 'cell assetid-cell' },
																				asset.assetId
																),
																React.createElement(
																				'div',
																				{ className: 'cell amount-cell' },
																				asset.amount
																)
												);
								}),
								    views = [{
												name: 'empty',
												loadView: ''
								}, {
												name: 'viewAssets',
												loadView: assetsGrid
								}, {
												name: 'issueAsset',
												loadView: 'Asset issued'
								}, {
												name: 'sendAsset',
												loadView: React.createElement(SendAsset, { sendAsset: this.sendAsset })
								}];
								return React.createElement(
												'div',
												{ id: '' },
												React.createElement(
																'div',
																{ className: 'enter-private-seed' },
																React.createElement(EnterPrivateSeed, null)
												),
												React.createElement(
																'div',
																{ className: 'wallet-content', style: divStyle },
																React.createElement(
																				'div',
																				{ className: 'private-seed' },
																				'PRIVATE SEED ',
																				this.state.privateSeed
																),
																React.createElement(
																				'button',
																				{ className: 'btn nav-btn', type: 'submit', onClick: this.getAssets },
																				'VIEW ASSETS'
																),
																React.createElement(
																				'button',
																				{ className: 'btn nav-btn', type: 'submit', onClick: this.issueAsset },
																				'ISSUE AN ASSET'
																),
																React.createElement(
																				'button',
																				{ className: 'btn nav-btn', type: 'submit', onClick: this.displaySendAsset },
																				'SEND AN ASSET'
																),
																React.createElement(
																				'div',
																				{ className: 'view-content' },
																				views[this.state.currentView].loadView
																)
												)
								);
				}
});

ReactDOM.render(React.createElement(Wallet, null), document.getElementById("display"));

},{"./components/EnterPrivateSeed.jsx":3,"alt":"alt"}]},{},[5])


//# sourceMappingURL=vendor.bundle.js.map
