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
    var balance = web3.eth.getBalance(account).valueOf();
    balanceField.innerHTML = parseFloat(Math.round(web3.fromWei(balance, "ether") * 100) / 100).toFixed(2);
    ;

    /*meta.getBalance.call(account, {from: account}).then(function(value) {
     var balance_element = document.getElementById("balance");
     balance_element.innerHTML = value.valueOf();
     }).catch(function(e) {
     console.log(e);
     setStatus("Error getting balance; see log.");
     });*/
};

function registerSensor() {
    var market = SimpleDataMarket.deployed();

    var desc = document.getElementById("desc").value;
    var help = document.getElementById("help").value;
    var secondsLength = new BigNumber(document.getElementById("secondsLength").value);
    var price = new BigNumber(document.getElementById("price").value);

    market.register(
        account,
        "TEST: Live GPS data from Jon Ramvis iPhone. Delivered every second. This deal is for access for one month from initialization.",
        true,
        "The solution is available through a REST interface on example.com",
        account,
        secondsLength, // one month
        price,
        {from: account}
    ).then(function (tx) {
        a = JSON.parse(localStorage.getItem('sensors'));
        if (!a) var a = [];
        a.push(tx);
        localStorage.setItem('sensors', JSON.stringify(a));

        var table = document.getElementById("mySensors");
        var row = table.insertRow(0);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = tx;
    });
}

function listen() {
    var market = SimpleDataMarket.deployed();

    var event = market.NewSensor();

// watch for changes
    event.watch(function (error, result) {
        console.log(result);
        if (!error) {
            var table = document.getElementById("mySensors");
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = result.args.key;
            cell2.innerHTML = result.args.desc;
            cell2.innerHTML = result.args.help;// TODO
            cell2.innerHTML = result.args.price;// TODO
            cell2.innerHTML = result.args.duration;// TODO
        } else console.log(error);
    });
}

function clearLocalStorage() {
    ;
    localStorage.setItem('sensors', null);
}

window.onload = function () {

    var pubkeyField = document.getElementById("pubkey");
    if (pubkeyField && pubkeyField.value === "...") {
        state = StateEnum.NEWSENSOR;
    } else {
        state = StateEnum.DISCOVERY;
    }

    listen();

    web3.eth.getAccounts(function (err, accs) {
        if (err != null) {
            alert("There was an error fetching your accounts.");
            return;
        }

        if (accs.length == 0) {
            alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
        }

        accounts = accs;
        account = accounts[0];

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
            a.forEach(function (tx) {
                var row = table.insertRow(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.innerHTML = tx;
            });
        }
    })


}
