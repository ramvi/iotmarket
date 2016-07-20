var BigNumber = require('bignumber.js');

var accounts;
var account;
var balance;

var DEBUG = true;

var StateEnum = {
    NEWSENSOR: 1,
    DISCOVERY: 2
};

var state;

function refreshBalance() {
    var balanceField = document.getElementById("balance");
    web3.eth.getBalance(account, function(error, result) {
        if (!error) {
            balanceField.innerHTML = parseFloat(Math.round(web3.fromWei(result.valueOf(), "ether") * 100) / 100).toFixed(2);
    } else
            console.error(error);
    });

};

function registerSensor() {
    var market = SimpleDataMarket.deployed();

    var desc = document.getElementById("desc").value;
    var help = document.getElementById("help").value;
    var secondsLength = new BigNumber(document.getElementById("secondsLength").value);
    var price = new BigNumber(document.getElementById("price").value);

    market.register(
        account,
        desc,
        true,
        help,
        account,
        secondsLength, // one month
        price,
        {from: account}

    ).then(function (tx) {

        setStatus("... pushing to blockchain ...");
        /*a = JSON.parse(localStorage.getItem('sensors'));
        if (!a) var a = [];
        a.push(tx);
        localStorage.setItem('sensors', JSON.stringify(a));*/
    });
}

function setStatus(text) {
    var statusDiv = document.getElementById("status");
    statusDiv.innerHTML = text;
}

function listen() {
    var market = SimpleDataMarket.deployed();

    var event = market.NewSensor();

// watch for changes
    event.watch(function (error, result) {
        console.log(result);
        if (!error) {
            // Update status
            if (result.args.key === account) {
                setStatus("");
            }

            var table = document.getElementById("mySensors");
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);
            cell1.innerHTML = result.args.key;
            cell2.innerHTML = result.args.desc;
            cell3.innerHTML = result.args.help;
            cell4.innerHTML = result.price;
            cell5.innerHTML = result.duration;
            cell6.innerHTML = '<button id="buyAccess" onclick="">Buy Access</button>';

            a = JSON.parse(localStorage.getItem('sensors'));
            if (!a) var a = [];
            a.push(row);
            localStorage.setItem('sensors', JSON.stringify(a));
        } else console.log(error);
    });
}

function clearLocalStorage() {
    localStorage.setItem('sensors', null);
}


var handler = {
    get: function(target, prop, receiver){
        var ls = JSON.parse(localStorage.getItem('settings'));
        console.log(target);
        console.log(prop);
        console.log(receiver);
        return ls[prop];
    },
    /*set: function(target, property, value, receiver) {
        //var settings = JSON.parse(localStorage.getItem('settings'));
        var ls = {property: value};
        localStorage.setItem('settings', JSON.stringify(ls));
    }*/
};

var settings = new Proxy({}, handler);


window.onload = function () {

    var pubkeyField = document.getElementById("pubkey");
    if (pubkeyField && pubkeyField.value === "...") {
        state = StateEnum.NEWSENSOR;
    } else {
        state = StateEnum.DISCOVERY;
    }

    listen();



    web3.eth.getAccounts(function (err, accounts) {
        if (err != null) {
            alert("There was an error fetching your accounts.");
            return;
        }

        if (accounts.length == 0) {
            alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
        }

        account = accounts[0];
        window.account = account;

        refreshBalance();

        // Populate data
        var pubkeyField = document.getElementById("pubkey");
        if (state == StateEnum.NEWSENSOR) {
            pubkeyField.value = account;
            if (DEBUG) {
                document.getElementById("desc").value = "Example description of sensor data. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae urna tincidunt, volutpat nunc porttitor, vehicula turpis. Phasellus viverra ligula sit amet tortor ornare pharetra. Vivamus quis ligula ullamcorper, laoreet turpis sit amet, efficitur leo. Vivamus porta nunc urna, quis sagittis nunc finibus a. Curabitur pretium facilisis magna et tincidunt.";
                document.getElementById("help").value = "Example of help text / how to use sensor data once purchased. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae urna tincidunt, volutpat nunc porttitor, vehicula turpis. Phasellus viverra ligula sit amet tortor ornare pharetra. Vivamus quis ligula ullamcorper, laoreet turpis sit amet, efficitur leo. Vivamus porta nunc urna, quis sagittis nunc finibus a. Curabitur pretium facilisis magna et tincidunt.";
                document.getElementById("secondsLength").value = 2592000;
                document.getElementById("price").value = 1000000000000000000;
            }
        }

        var table = document.getElementById("mySensors");
        a = JSON.parse(localStorage.getItem('sensors'));
        if (a) {
            a.forEach(function (row) {
                //var row = table.insertRow(tx);
                // console.log(row);
            });
        }
    })




}
