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
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
Pudding.setWeb3(web3);

// Load our contract, giving it the Pudding object (standard pudding stuff)
SimpleDataMarket.load(Pudding);
// Create our Pudding contract object
var market = SimpleDataMarket.deployed();

var IotMarket = React.createClass({
    getInitialState: function() {
        return {
            accounts: [],
            text: ""
        };
    },
    refreshBalances: function() {
        /*var tmpRows = [];
        this.state.rows.forEach(function (r, i) {
            web3.eth.getBalance(r.props.address, function (error, result) {
                if (!error) {
                    /*tmpRows.push(<AccountRow
                     address={r.props.address}
                     balance={result}
                     updateUser={r.props.updateUser}
                     key={i}
                     getAccount={this.props.getAccount}/>);*

                    // TODO Oppdater json data i state istedenfor å lage elementer
                    // som i https://facebook.github.io/react/docs/tutorial.html#updating-state

                    // Done
                    if (tmpRows.length === this.state.rows.length) {
                        this.setState({
                            rows: tmpRows,
                        });
                    }
                } else console.log(error);
            }.bind(this));
        }.bind(this));*/

        let newList = [];
        this.state.accounts.forEach(function(a, i) {
            let balance = web3.eth.getBalance(a.address);
            newList.push({key: i, address: a.address, balance: balance});
        });
        this.setState({accounts: newList});
    },
    componentDidMount: function() {
        this.refreshBalances();
        setInterval(this.refreshBalances, 2000);
    },
    isRegistered: function() {
        var market = SimpleDataMarket.deployed();
        market.isRegistered.call(this.state.account).then(function (result) {
            console.log(result);
        })
    },
    updateUser: function(address) {
        this.setState({account: address});
    },
    buildAccountsList: function(_accounts) {
        let accountList = [];
        _accounts.forEach(function(a, i) {
            accountList.push({key: i, address: a, balance: 0});
        });
        this.setState({accounts: accountList});

    },
    componentWillMount: function() {
        web3.eth.getAccounts(function (err, _accounts) { // TODO Does pudding give promise for web3?
            if (err != null) {
                alert("There was an error fetching your accounts.");
                return;
            }
            if (_accounts.length == 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }

            this.buildAccountsList(_accounts);

            // Set active account to first in list if not selected by user
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
    render: function() {
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
});

render((
    <IotMarket />
), document.getElementById('root'))