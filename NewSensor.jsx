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

var NewSensor = React.createClass({
    getInitialState: function () {
        return {
            DEBUG: 1
        };
    },
    registerSensor: function () {
        var desc = document.getElementById("desc").value;
        var help = document.getElementById("help").value;
        var secondsLength = new BigNumber(document.getElementById("secondsLength").value);
        var price = new BigNumber(document.getElementById("price").value);

        market.register(
            document.getElementById("id").value,
            desc,
            true,
            help,
            this.props.getAccount(),
            secondsLength,
            price,
            {from: this.props.getAccount()}
        ).then(function () {
            this.props.setText("... pushing to blockchain ...");
        }.bind(this));
    },
    componentDidMount: function () {
        // Populate data
        if (this.state.DEBUG) {
            document.getElementById("desc").value = "Example description of sensor data.";
            document.getElementById("help").value = "Example of help text / how to use sensor data once purchased.";
            document.getElementById("secondsLength").value = 2592000;
            document.getElementById("price").value = web3.toWei(1, "ether");
        }
    },
    render: function () {
        return (
            <div>
                <br />
                <h3>New sensor</h3>
                <br />

                <label>ID: <input type="text" id="id"/></label><br />
                <label>Description of data: <input type="text" id="desc"/></label><br />
                <label>Help for retrieval of data: <input type="text" id="help"/></label><br />
                <label>Access in seconds: <input type="text" id="secondsLength"/></label><br />
                <label>Price in wei
                    (<a href="http://ether.fund/tool/converter" target="_blank">calc</a>):
                    <input type="number" id="price"/></label><br />

                <button onClick={this.registerSensor}>Register Sensor</button>
            </div>
        );
    }
});

export default NewSensor;