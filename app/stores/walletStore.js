var alt = require('../alt.js');
var ColuActions = require('../actions/ColuActions');
var GeneralActions = require('../actions/GeneralActions');
var consts = require('../consts.js');

function WalletStore() {
  //Update the store with what is passed from the actions
  this.bindActions(ColuActions);
  this.bindActions(GeneralActions);
}


//Colu
WalletStore.prototype.onColuInitSuccess = function(privateSeed) {
  this.privateSeed = privateSeed;
}

WalletStore.prototype.onGetAssetsSuccess = function(obj) {
  this.assets = obj.assets;
}

WalletStore.prototype.getAssetInfoSuccess = function(obj) {
  this.addresses = obj.addresses;
  this.chosenAssetId = obj.chosenAssetId;
  this.assetAmount = obj.assetAmount;
}


//Status messages
WalletStore.prototype.resetStatus = function() {
  this.updatedStatus = null;
  this.error = null;
}

WalletStore.prototype.onActionFailed = function(err) {
  this.error = 'There was an error: ' + JSON.stringify(err);
  this.updatedStatus = null;
}

WalletStore.prototype.onIssueAssetSuccess = function(asset) {
  this.updatedStatus = 'Issued Asset successfully. Asset Id: ' + (asset && asset.assetId);
  this.error = null;
}

WalletStore.prototype.onSendAssetSuccess = function(sentAsset) {
  this.updatedStatus = 'Sent Asset successfully. Transaction Id: ' + (sentAsset && sentAsset.txid);
  this.error = null;
}

module.exports = alt.createStore(WalletStore);