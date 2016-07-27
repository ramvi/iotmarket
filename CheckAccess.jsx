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

var CheckAccess = React.createClass({
    checkAccess: function() {
        this.props.setText("Checking...");
        var checkID = document.getElementById("checkAccessID").value;
        market.checkAccess.call(checkID, this.props.getAccount()).then(function(result) {
            this.props.setText(this.props.getAccount() + " access to " + checkID + ": " + result);
        }.bind(this));
    },
    render: function () {
        return (
            <div>
                <h3>Check Access</h3>
                <input type="text" id="checkAccessID" />
                <button onClick={() => {this.checkAccess()}}>Check!</button>
            </div>
        );
    }
});

export default CheckAccess;