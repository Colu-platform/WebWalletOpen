var WalletStore = require('../stores/WalletStore');
var GeneralActions = require('../actions/GeneralActions');

var Status = React.createClass({
    getInitialState: function() {
        return WalletStore.getState();
    },
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
        if (this.state && this.state.updatedStatus) {
            return (
                <div className="status ok">
                    {this.state && this.state.updatedStatus}
                </div>
            );
        } else if (this.state && this.state.error) {
            return (
                <div className="status error">
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