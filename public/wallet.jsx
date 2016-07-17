var colu;

var EnterPrivateSeed = React.createClass({
	handleSubmit: function (e) {
		var privateSeed = this.refs.privateSeed.value;

		e.preventDefault();
		this.props.coluInit(privateSeed);
	},
	render: function () {
		return (
		    <form className="enter-privateseed-form" onSubmit={this.handleSubmit}>
		        <div className = "group">
		        	<input name="privateSeed" ref="privateSeed" />
		        	<span className="bar"></span>
		        	<label>Private Seed</label>
		        	<button className="btn" type="submit" ref="submitButton">ENTER</button>
		        </div>
		    </form>
		);
	}
});

var SendAsset = React.createClass({
	sendAsset: function (assetInfo) {
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
            if (err) return console.error(err)
            	//need to update the store 
        });
	},
	handleSubmit: function (e) {
		var assetInfo = {
			from: this.refs.from.value,
            toAddress: this.refs.toAddress.value,
            assetId: this.refs.assetid.value,
            amount: this.refs.amount.value
        };
		e.preventDefault();
		this.sendAsset(assetInfo);
	},
	render: function () {
		return (
		    <form className="sendto-form" onSubmit={this.handleSubmit}>
		        <div className = "group">
		        	<input ref="from" />
		        	<span className="bar"></span>
		        	<label>FROM</label>
		        </div>
                <div className = "group">
		        	<input ref="toAddress" />
		        	<span className="bar"></span>
		        	<label>TO ADDRESS</label>
		        </div>
                <div className = "group">
		        	<input ref="assetid" />
		        	<span className="bar"></span>
		        	<label>ASSET ID</label>
		        </div>
                <div className = "group">
		        	<input ref="amount" />
		        	<span className="bar"></span>
		        	<label>AMOUNT</label>
		        </div>
		        <button className="btn" type="submit" >SEND</button>
		    </form>
		);
	}
});

var Wallet = React.createClass({
	getInitialState: function () {
		return {
			privateSeed: null,
			assets: [],
			error: null,
			currentView: 0
		};
	},
	getAssets: function () {
		var that = this,
		    assets = [];
		colu.getAssets(function (err, body) {
            if (err) {
            	return console.error(err);
            }
            assets = body;
            assets.unshift({address:'ADDRESS', assetId: 'ASSET ID', amount: 'AMOUNT'});
            that.setState({
		        assets: assets,
		        currentView: 1
		    });
        });
	},
	issueAsset: function () {
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
                    'urls': [{name:'icon', url: 'https://pbs.twimg.com/profile_images/572390580823412736/uzfQSciL_bigger.png', mimeType: 'image/png', dataHash: ''}],
                    'userData': {
                        'meta' : [
                            {key: 'Item ID', value: 2, type: 'Number'},
                            {key: 'Item Name', value: 'Item Name', type: 'String'},
                            {key: 'Company', value: 'My Company', type: 'String'},
                            {key: 'Address', value: 'San Francisco, CA', type: 'String'}
                        ]
                    }
                }
            };
		colu.issueAsset(asset, function (err, body) {
            if (err) return console.error(err)
            that.setState({
			    currentView: 2
		    });
        });
	},
	
	displaySendAsset: function() {
		var that = this;
		that.setState({
		    currentView: 3
		});
	},
	coluInit: function (privateSeed) {
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
                that.setState({
			        privateSeed: privateSeed
		        });

                $(".wallet-content").css("display", "block");
            });

        	colu.init();
        } catch (e) {
        	that.setState({
			    privateSeed: privateSeed
		    });
            console.log("Enter a valid private seed", e);
        }
	},
	render: function() {
		var divStyle = {
                display: 'none'
            },
            assetsGrid = this.state.assets.map(function(asset,i) {
                return (
                    <div key={'grid-row-' + i} className='row'>
                        <div className='cell address-cell'>{asset.address}</div>
                        <div className='cell assetid-cell'>{asset.assetId}</div>
                        <div className='cell amount-cell'>{asset.amount}</div>
                    </div>
                );
            }),
            views = [{
                name: 'empty',
                loadView: ''
            },{
                name: 'viewAssets',
                loadView: assetsGrid
            },{
                name: 'issueAsset',
                loadView: 'Asset issued'
            },{
                name: 'sendAsset',
                loadView: <SendAsset sendAsset={this.sendAsset}/>
            }];
	    return (
	    	<div id="">
	            <div className="enter-private-seed">
				    <EnterPrivateSeed coluInit={this.coluInit}/>
			    </div>
			    <div className="wallet-content" style={divStyle} >
			        <div className="private-seed">PRIVATE SEED {this.state.privateSeed}</div>
			        <button className="btn nav-btn" type="submit" onClick={this.getAssets}>VIEW ASSETS</button>
			        <button className="btn nav-btn" type="submit" onClick={this.issueAsset}>ISSUE AN ASSET</button>
			        <button className="btn nav-btn" type="submit" onClick={this.displaySendAsset}>SEND AN ASSET</button>
			        <div className="view-content">{views[this.state.currentView].loadView}</div>
			    </div>
			</div>
	    );
	}
});

ReactDOM.render(<Wallet />, document.getElementById("display"));