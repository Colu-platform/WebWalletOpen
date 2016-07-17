var alt = require('../alt.js');
var ColuActions = require('../actions/ColuActions');
var GeneralActions = require('../actions/GeneralActions');
var consts = require('../consts.js');

function WalletStore() {
  //Bind the actions to this store
  this.bindActions(ColuActions);
  this.bindActions(GeneralActions);
}

//Update the store with what is passed from the actions
WalletStore.prototype.onColuInitSuccess = function(privateSeed) {
  this.privateSeed = privateSeed;
}

WalletStore.prototype.onIssueAssetSuccess = function(asset) {
  this.updatedStatus = 'Issued Asset successfully. Asset Id: ' + (asset && asset.assetId);
  this.error = null;
}

WalletStore.prototype.onSendAssetSuccess = function(sentAsset) {
  this.updatedStatus = 'Sent Asset successfully. Transaction Id: ' + (sentAsset && sentAsset.txid);
  this.error = null;
}

WalletStore.prototype.onGetAssetsSuccess = function(obj) {
  this.assets = obj.assets;
}

WalletStore.prototype.onActionFailed = function(err) {
  this.error = 'There was an error: ' + JSON.stringify(err);
  this.updatedStatus = null;
}

WalletStore.prototype.getAssetInfoSuccess = function(obj) {
  this.addresses = obj.addresses;
  this.chosenAssetId = obj.chosenAssetId;
  this.assetAmount = obj.assetAmount;
}

WalletStore.prototype.changeViewSuccess = function(currentView) {
  this.updatedStatus = null;
}

module.exports = alt.createStore(WalletStore);