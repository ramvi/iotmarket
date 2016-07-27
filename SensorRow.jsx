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

var SensorRow = React.createClass({
    prettyEther: function (val) {
        if (val)
            return parseFloat(Math.round(web3.fromWei(val.valueOf(), "ether") * 100) / 100).toFixed(2);
    },
    render: function () {
        return (
            <tr>
                <td>{this.props.id}</td>
                <td>{this.props.desc}</td>
                <td>{this.props.help}</td>
                <td>{this.prettyEther(this.props.price)} ether</td>
                <td>{this.props.length} seconds</td>
                <td>
                    <a href="#" onClick={() => {
                        market.getRecord.call(
                            this.props.id,
                            {from: this.props.getAccount()}).then(function(ret) {
                                console.log(ret[0]);
                            this.props.setText(ret[0]);
                        }.bind(this));
                    }}>
                        Owner
                    </a>
                </td>
                <td>
                    <a href="#" onClick={() => {
                        market.buyAccess.sendTransaction(
                            this.props.id,
                            {from: this.props.getAccount(), value: this.props.price}).then(function(tx) {
                                this.props.setText("Bought access!")
                        }.bind(this));
                }}>
                    Buy access
                </a>
                </td>
            </tr>
        );
    }
});

export default SensorRow;