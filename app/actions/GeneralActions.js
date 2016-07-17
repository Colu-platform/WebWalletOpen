var alt = require('../alt.js');
var consts = require('../consts.js');

function GeneralActions() {
  this.generateActions(
    'changeViewSuccess'
  );
}

//change the view inside the wallet
GeneralActions.prototype.changeView = function(currentView) {
  var that = this;
  that.actions.changeViewSuccess(currentView); 
};

module.exports = alt.createActions(GeneralActions);