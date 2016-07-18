var alt = require('../alt.js');
var consts = require('../consts.js');

function GeneralActions() {
	this.generateActions(
		'resetStatus'
	);
}

//change the view inside the wallet
GeneralActions.prototype.resetStatus = function() {
	this.actions.resetStatus(); 
};

module.exports = alt.createActions(GeneralActions);