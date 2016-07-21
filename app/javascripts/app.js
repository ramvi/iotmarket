var BigNumber = require('bignumber.js');

var accounts;
var balance;

var DEBUG = true;

var StateEnum = {
    NEWSENSOR: 1,
    DISCOVERY: 2,
    OVERVIEW: 3
};

var state;

function refreshBalance() {
    var balanceField = document.getElementById("balance");
    web3.eth.getBalance(settings.account, function(error, result) {
        if (!error) {
            balance = new BigNumber(result);
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
        settings.account,
        desc,
        true,
        help,
        settings.account,
        secondsLength,
        price,
        {from: settings.account}

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

    //var filter = web3.eth.filter({address: SimpleDataMarket.deployed().address, 'topics':['0x' + web3.sha3('NewSensor(address,string,string,uint256,uint256)')]});


    //var myResults = filter.get(function(error, logs){ ... });

    var event = market.NewSensor();


    // watch for changes
    // TODO If register(can see the tx) but no event: key taken?
    event.watch(function (error, result) {
        if (!error) {
            // Update status
            if (result.args.key === settings.account) {
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
    localStorage.setItem('settings', null);
}

function isRegistered() {
    var market = SimpleDataMarket.deployed();
    market.isRegistered.call(settings.account).then(function(result) {
        console.log(result);
    })
}


var handler = {
    get: function(target, property, receiver) {
        var ls = JSON.parse(localStorage.getItem('settings'));
        return ls[property];
    },
    set: function(target, property, value, receiver) {
        var ls = JSON.parse(localStorage.getItem('settings'));
        ls[property] = value;
        localStorage.setItem('settings', JSON.stringify(ls));
        if (property === "account") {
            refreshBalance();
        }
    }
};

var settings = new Proxy({}, handler);

function populateOverview() {
    if (state != StateEnum.OVERVIEW) return;


}

window.onload = function () {

    var elState = document.getElementById("state");
    if (elState === "newsensor")
        state = StateEnum.NEWSENSOR;
    else if (elState === "discovery")
        state = StateEnum.DISCOVERY;
    else if (elState === "overciew")
        state = StateEnum.OVERVIEW;

    listen();

    web3.eth.getAccounts(function (err, _accounts) {
        if (err != null) {
            alert("There was an error fetching your accounts.");
            return;
        }

        if (_accounts.length == 0) {
            alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
        }

        accounts = _accounts;
        if (!settings.account)
            settings.account = _accounts[0];

        refreshBalance();

        // TODO Dont include this code in prod. testrpc can take genesisblock data. better solution. no DOUBT
        if (DEBUG) {
            // Create an account with ~1 ether
            web3.eth.getBalance(accounts[1], function(error, result) {
                result = new BigNumber(result);
                web3.eth.sendTransaction({
                    value: result.minus(new BigNumber(web3.toWei(1, "ether"))),
                    from: accounts[1],
                    to: "0x0000000000000000000000000000000000000000"
                });
            });
        }

        // Populate data
        var pubkeyField = document.getElementById("pubkey");
        if (state == StateEnum.NEWSENSOR) {
            pubkeyField.value = settings.account;
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

        populateOverview();
    })




}
