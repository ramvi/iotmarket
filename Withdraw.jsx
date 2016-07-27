import React from "react";
import {render} from "react-dom";
import Web3 from "web3";
import Pudding from "ether-pudding";
import SimpleDataMarket from "./contracts/SimpleDataMarket.sol";
import BigNumber from "bignumber.js";

// Preform the normal web3 configurations
var web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
Pudding.setWeb3(web3)

// Load our contract, giving it the Pudding object (standard pudding stuff)
SimpleDataMarket.load(Pudding)
// Create our Pudding contract object
var market = SimpleDataMarket.deployed()

var Withdraw = React.createClass({
    withdraw: function() {
        this.props.setText("... performing withdraw...");
        var id = document.getElementById("id").value;
        market.withdraw.sendTransaction(id, {from: this.props.getAccount()}).then(function() {
            this.props.setText(this.props.getAccount() + " withdrew.");
        }.bind(this));
    },
    render: function () {
        return (
            <div>
                <h3>Withdraw</h3>
                <input type="text" id="id" />
                <button onClick={() => {this.withdraw()}}>Withdraw</button>
            </div>
        );
    }
});

export default Withdraw;