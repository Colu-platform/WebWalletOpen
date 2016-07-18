var WalletStore = require('../stores/WalletStore');
var ColuActions = require('../actions/ColuActions');
var consts = require('../consts.js');

var Asset = React.createClass({
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
		//Build individual asset in the asset list according to render style that is passed from the Asset List component
		//TableView: where each asset is a row and asset properties are cells
		//Select: where each asset is option that contains asset id
		if (this.props.renderStyle === consts.assetRenderStyle.grid) {
			return (
				<div className="row" >
					<div className='cell address-cell'>{this.props.asset.address}</div>
					<div className='cell assetid-cell'>{this.props.asset.assetId}</div>
					<div className='cell amount-cell'>{this.props.asset.amount}</div>
				</div>
			);
		} else if (this.props.renderStyle === consts.assetRenderStyle.list) {
			return (
				<option>{this.props.asset.assetId}</option>
			);
		}
	}
});

module.exports = Asset;