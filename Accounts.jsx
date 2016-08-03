import React from "react";
import {render} from "react-dom";
import Web3 from "web3";
import Pudding from "ether-pudding";
import SimpleDataMarket from "./contracts/SimpleDataMarket.sol";
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
        /*componentWillReceiveProps: function () {
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
    },*/
    render: function () {
        var rows = this.props.accounts.map((a) => {
            let isSelected = this.props.getAccount() === a.address;
            return (
                <AccountRow
                    key={a.address}
                    address={a.address}
                    balance={a.balance}
                    updateUser={this.props.updateUser}
                    isSelected={isSelected} />
            );
        }, this);
        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Balance</th>
                </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
});

export default Accounts;