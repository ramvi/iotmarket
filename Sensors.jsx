import React from "react";
import {render} from "react-dom";
import Web3 from "web3";
import Pudding from "ether-pudding";
import SimpleDataMarket from "./contracts/SimpleDataMarket.sol";
import BigNumber from "bignumber.js";
import SensorRow from "./SensorRow.jsx";

// Preform the normal web3 configurations
var web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
Pudding.setWeb3(web3)

// Load our contract, giving it the Pudding object (standard pudding stuff)
SimpleDataMarket.load(Pudding)
// Create our Pudding contract object
var market = SimpleDataMarket.deployed()

var Sensors = React.createClass({
    getInitialState: function () {
        return {
            rows: []
        }
    },
    listen: function () {
        var event = market.NewSensor();
        // watch for changes
        // TODO If register(can see the tx) but no event: key taken?
        event.watch(function (error, result) {
            if (!error) {
                // Update status
                if (result.args.key === document.getElementById("id").value) {
                    this.props.setText("Done!");
                }

                var row = <SensorRow
                    id={result.args.key}
                    desc={result.args.desc}
                    help={result.args.help}
                    price={result.args.price}
                    length={result.args.secondsLength.valueOf()}
                    getAccount={this.props.getAccount}
                    key={result.args.key}
                    setText={this.props.setText}/>
                this.setState({rows: this.state.rows.concat([row])})

                /*a = JSON.parse(localStorage.getItem('sensors'));
                 if (!a) var a = [];
                 a.push(row);
                 localStorage.setItem('sensors', JSON.stringify(a));*/
            } else console.log(error);
        }.bind(this));
    },
    componentWillMount: function (){
        this.listen();
    },
    render: function () {
        return (
            <div>
            <h3>Sensors contracts</h3>
            <table>
                <thead>
                <tr>
                    <th>Key</th>
                    <th>Description</th>
                    <th>Manual</th>
                    <th>Price</th>
                    <th>Contract length</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>{this.state.rows}</tbody>
            </table>
            </div>
        );
    }
});

export default Sensors;