var alt = require('../alt.js');
var consts = require('../consts.js');
var Colu = require('colu');

function ColuActions() {
	this.generateActions(
		'coluInitSuccess',
		'actionFailed',
		'sendAssetSuccess',
		'getAssetsSuccess',
		'displaySendAssetSuccess',
		'issueAssetSuccess',
		'getAddressInfoSuccess',
		'getAssetInfoSuccess'
	);
}


//---------------------- UTIL FUNCTIONS --------------------//

//Removes duplicate objects by a given property from an array of objects
function removeDuplicates(arr, prop) {
	var new_arr = [];
	var lookup  = {};

	for (var i in arr) {
		lookup[arr[i][prop]] = arr[i];
	}

	for (i in lookup) {
		new_arr.push(lookup[i]);
	}
	return new_arr;
}

//---------------------- COLU FUNCTIONS --------------------//

//Get all the assets a private seed has in his wallet
function getAssets(callback) {
	var that = this,
		assets = [];
	ColuActions.colu.getAssets(function (err, body) {
		if (err) {
			return callback(err);
		}
	
		assets = body;
	
		//insert the header into the assets array
		assets.unshift({address:'ADDRESS', assetId: 'ASSET ID', amount: 'AMOUNT'});
	
		callback(null, assets);
	});
}

//Initialize Colu sdk
ColuActions.prototype.coluInit = function(privateSeed) {
  var settings = {
		network: 'testnet',
		privateSeed: privateSeed,
		events: true,
		eventsSecure: false
	},
	address,
	that = this;

	function getAssetsCallback(err, assets) {
		if (err) {
			return that.actions.actionFailed(err);
		}
		//If we have successfully initialized the wallet, update the state with the private seed (to be displayed in the wallet content)
		that.actions.coluInitSuccess({privateSeed: privateSeed, assets: assets, error: null});
	}

	try {
		ColuActions.colu = new Colu(settings);
	
		ColuActions.colu.on('connect', function () {
			//When a new transaction happens (issue, send, receive etc) we get the updated assets
			ColuActions.colu.onNewCCTransaction(function (transaction) {
				if (transaction) {
					getAssets(getAssetsCallback);
				}
			});
			//If no private key is entered, the wallet initialized using a random private key, we retrieve it
			if (!privateSeed) {
				privateSeed = ColuActions.colu.hdwallet.getPrivateSeed();
				//get an address to be able to do transactions
				address = ColuActions.colu.hdwallet.getAddress();
			}
	
			getAssets(getAssetsCallback);

		});

		ColuActions.colu.init();
	
	} catch (e) {
		that.actions.actionFailed(e);
	}
};

//Issue a new asset
ColuActions.prototype.issueAsset = function(asset) {
	var that = this;

	ColuActions.colu.issueAsset(asset, function (err, body) {
		if (err) {
			return that.actions.actionFailed(err);
		}
		that.actions.issueAssetSuccess(body);
	});
};

//Send and asset to an address or phone number
ColuActions.prototype.sendAsset = function(assetInfo) {
	var that = this,
		asset = {
			from: assetInfo.from,//all the addresses for this asset
			to: [{
				address: assetInfo.toAddress,
				phoneNumber: assetInfo.toPhoneNumber,
				assetId: assetInfo.assetId,
				amount: assetInfo.amount
			}]
		};
	ColuActions.colu.sendAsset(asset, function (err, body) {
		if (err) {
			return that.actions.actionFailed(err);
		}
		that.actions.sendAssetSuccess(body); 
	});
};

//Get info for the individual asset
ColuActions.prototype.getAssetInfo = function(assets, chosenAssetId) {
	var that = this;
	var assetsIds = {};
	var noDupArr = removeDuplicates(assets, 'assetId');
	var addresses = [];
	var addressesArr = [];
	var assetAmount = 0;

	//Build and object where every key is Assed Id, and the value is an array of objects,
	//each containing and address for that specific asset and the amount of asset on that address
	for (var i in noDupArr) {
		assetsIds[noDupArr[i].assetId] = assets.map(function (asset) {
			if (asset.assetId === noDupArr[i].assetId) {
				return {
					address: asset.address,
					amount: asset.amount
				};
			}
			return;
		})
		.filter(function (assetId) {
			return assetId;
		});
	}

	//get just the array of objects for the specific asset
	addresses = assetsIds[chosenAssetId];

	//calculate total amount of the asset on all the addresses, and build an array of just addresses
	for (var i in addresses) {
		assetAmount += addresses[i].amount;
		addressesArr.push(addresses[i].address);
	}

	that.actions.getAssetInfoSuccess({
		chosenAssetId: chosenAssetId,
		addresses: addressesArr,
		assetAmount: assetAmount + ' AVAILABLE'//update the amount for the chosen asset
	});
};

module.exports = alt.createActions(ColuActions);