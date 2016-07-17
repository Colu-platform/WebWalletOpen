var WalletStore = require('../stores/WalletStore');
var ColuActions = require('../actions/ColuActions');
var GeneralActions = require('../actions/GeneralActions');
var consts = require('../consts.js');

var Status = React.createClass({
	componentDidMount: function() {
        WalletStore.listen(this.onChange);
        GeneralActions.changeView(consts.initialView);
    },
    onChange: function(state) {
        this.setState(state);
    },
    componentWillUnmount: function() {
        WalletStore.unlisten(this.onChange);
    },
    render: function () {
        if (this.state && this.state.updatedStatus) {
            return (
                <div className="ok">
                    {this.state && this.state.updatedStatus}
                </div>
            );
        } else if (this.state && this.state.error) {
            return (
                <div className="error">
                    {this.state && this.state.error}
                </div>
            );
        } else {
            return (
                <div className="status" />
            );
        }
    }
});

module.exports = Status;