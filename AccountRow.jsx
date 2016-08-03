import React from "react";
import {render} from "react-dom";
import Web3 from "web3";
import Pudding from "ether-pudding";
import SimpleDataMarket from "./contracts/SimpleDataMarket.sol";

// Preform the normal web3 configurations
var web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
Pudding.setWeb3(web3)

// Load our contract, giving it the Pudding object (standard pudding stuff)
SimpleDataMarket.load(Pudding)
// Create our Pudding contract object
var market = SimpleDataMarket.deployed()

var AccountRow = React.createClass({
    prettyEther: function (val) {
        if (val)
            return parseFloat(Math.round(web3.fromWei(val.valueOf(), "ether") * 100) / 100).toFixed(2);
    },
    render: function() {
        return (
            <tr>
                <td style={this.props.isSelected ? {fontWeight: 'bold'} : null }>
                    <a href="#" onClick={() => {
                        this.props.updateUser(this.props.address)
                    }}>
                        {this.props.address}
                    </a>
                </td>
                <td>{this.prettyEther(this.props.balance)}</td>
            </tr>
        );
    }
});

export default AccountRow;