import React from "react";
import {render} from "react-dom";
import Web3 from "web3";
import Pudding from "ether-pudding";
import SimpleDataMarket from "./contracts/SimpleDataMarket.sol";
import BigNumber from "bignumber.js";
import Accounts from "./Accounts.jsx";
import NewSensor from "./NewSensor.jsx";
import Sensors from "./Sensors.jsx";
import CheckAccess from "./CheckAccess.jsx";
import Withdraw from "./Withdraw.jsx";

// Preform the normal web3 configurations
var web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
Pudding.setWeb3(web3)

// Load our contract, giving it the Pudding object (standard pudding stuff)
SimpleDataMarket.load(Pudding)
// Create our Pudding contract object
var market = SimpleDataMarket.deployed()

var IotMarket = React.createClass({
    getInitialState: function () {
        return {
            accounts: [],
            text: ""
        };
    },
    isRegistered: function () {
        var market = SimpleDataMarket.deployed();
        market.isRegistered.call(this.state.account).then(function (result) {
            console.log(result);
        })
    },
    updateUser: function (address) {
        this.setState({account: address});
    },
    componentWillMount: function () {
        web3.eth.getAccounts(function (err, _accounts) {
            if (err != null) {
                alert("There was an error fetching your accounts.");
                return;
            }

            if (_accounts.length == 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }

            this.setState({accounts: _accounts});

            if (!this.state.account)
                this.setState({account: _accounts[0]});
        }.bind(this));
    },
    setText: function(val) {
        this.setState({text: val})
    },
    getAccount: function() {
        return this.state.account;
    },
    render: function () {
        return (
            <div>
                <NewSensor
                    getAccount={this.getAccount}
                    setText={this.setText} />
                <div id="status">{this.state.text}</div>

                <Sensors
                    getAccount={this.getAccount}
                    setText={this.setText} />

                <CheckAccess
                    getAccount={this.getAccount}
                    setText={this.setText} />

                <Withdraw
                    getAccount={this.getAccount}
                    setText={this.setText} />

                <h3>All accounts</h3>
                <Accounts
                    accounts={this.state.accounts}
                    getAccount={this.getAccount}
                    updateUser={this.updateUser}/>
            </div>
        )
    }
})

render((
    <IotMarket />
), document.getElementById('root'))