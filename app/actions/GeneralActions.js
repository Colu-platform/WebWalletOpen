var alt = require('../alt.js');
var consts = require('../consts.js');

function GeneralActions() {
  this.generateActions(
    'resetStatus'
  );
}

//change the view inside the wallet
GeneralActions.prototype.resetStatus = function() {
  var that = this;
  that.actions.resetStatus(); 
};

module.exports = alt.createActions(GeneralActions);