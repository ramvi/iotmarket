import React from "react";
import {render} from "react-dom";
import Web3 from "web3";
import Pudding from "ether-pudding";
import SimpleDataMarket from "./contracts/SimpleDataMarket.sol";
import BigNumber from "bignumber.js";
import TimerMixin from "react-timer-mixin";
import AccountRow from "./AccountRow.jsx";

// Preform the normal web3 configurations
var web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
Pudding.setWeb3(web3)

// Load our contract, giving it the Pudding object (standard pudding stuff)
SimpleDataMarket.load(Pudding)
// Create our Pudding contract object
var market = SimpleDataMarket.deployed()

var Accounts = React.createClass({
    getInitialState: function () {
        return {
            rows: [],
            accounts: [],
            refreshingBalances: false
        }
    },
    refreshBalances: function () {
        if (this.state.refreshingBalances) return;
        this.setState({refreshingBalances: true});

        var tmpRows = [];
        this.state.rows.forEach(function (r, i) {
            web3.eth.getBalance(r.props.address, function (error, result) {
                if (!error) {
                    tmpRows.push(<AccountRow
                        address={r.props.address}
                        balance={result}
                        updateUser={r.props.updateUser}
                        key={i}
                        getAccount={this.props.getAccount}/>);

                    // Done
                    if (tmpRows.length === this.state.rows.length) {
                        this.setState({
                            refreshingBalances: false,
                            rows: tmpRows,
                        });
                    }
                } else console.log(error);
            }.bind(this));
        }.bind(this));
    },
    componentDidMount: function () {
        this.setInterval(
            () => {
                this.refreshBalances()
            },
            2000
        )
    },
    mixins: [TimerMixin],
    componentWillReceiveProps: function () {
        if (!this.props.accounts.length) return;

        var accountsHtml = [];
        this.props.accounts.forEach(function (acc, i) {
            accountsHtml.push(<AccountRow
                address={acc}
                balance={null}
                updateUser={this.props.updateUser}
                key={i}
                getAccount={this.props.getAccount}/>)
        }.bind(this));
        this.setState({rows: accountsHtml});
    },
    render: function () {
        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Balance</th>
                </tr>
                </thead>
                <tbody>{this.state.rows}</tbody>
            </table>
        );
    }
});

export default Accounts;