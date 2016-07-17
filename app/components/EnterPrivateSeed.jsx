var WalletStore = require('../stores/WalletStore');
var ColuActions = require('../actions/ColuActions');

var EnterPrivateSeed = React.createClass({
	componentDidMount: function() {
        WalletStore.listen(this.onChange);
    },
    onChange: function(state) {
        this.setState(state);
    },
    componentWillUnmount: function() {
        WalletStore.unlisten(this.onChange);
    },
	handleSubmit: function (e) {
		var privateSeed = this.refs.privateSeed.value;

		e.preventDefault();
		//Initialize Colu once per every private seed entered
		ColuActions.coluInit(privateSeed);
	},
	render: function () {
		//Build the Enter Private Seed form
		return (
		    <form className="enter-privateseed-form" onSubmit={this.handleSubmit}>
		        <div className = "group privateseed">
		            <div className="privateseed-input">
		            	<input name="privateSeed" ref="privateSeed" />
		            	<span className="bar"></span>
		            	<label className="enter">Private Seed</label>
		            </div>
		        	<button className="btn" type="submit" ref="submitButton">VIEW WALLET</button>
		        </div>
		    </form>
		);
	}
});

module.exports = EnterPrivateSeed;