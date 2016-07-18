var WalletStore = require('../stores/WalletStore');
var ColuActions = require('../actions/ColuActions');
var Asset = require('./Asset.jsx');
var consts = require('../consts.js');

var AssetsGrid = React.createClass({
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
	handleChooseAsset: function() {
		//When an asset is chosen in the select, get asset addresses and total amount and populate the available amount to the form
		ColuActions.getAssetInfo(this.state.assets, this.refs.assetid.value);
	},
	render: function () {
		//When we got the assets, iterate over them and build assets list UI
		//according to the render style that is passed to the component
		var renderStyle = this.props.renderStyle || this.props.route.renderStyle;
		var assetsGrid = (this.state && this.state.assets) ? this.state.assets.map(function(asset,i) {
			if (renderStyle === consts.assetRenderStyle.grid) {
				return (
					<div key={'grid-row-' + i} className={'grid-row-' + i} >
						<Asset renderStyle={consts.assetRenderStyle.grid} asset={asset} key={'grid-row-' + i} />
					</div>
				);
			} else if (renderStyle === consts.assetRenderStyle.list) {
				return (
					<Asset renderStyle={consts.assetRenderStyle.list} asset={asset}/>
				);
			}
		}) : '';
		
		if (renderStyle === consts.assetRenderStyle.grid) {
			return (
				<div className="assets-grid">
					{assetsGrid}
				</div>
			);
		} else if (renderStyle === consts.assetRenderStyle.list) {
			return (
				<select ref="assetid" onChange={this.handleChooseAsset}>
					{assetsGrid}
				</select>
			);
		}
	}
});

module.exports = AssetsGrid;