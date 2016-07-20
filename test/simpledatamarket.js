var BigNumber = require('bignumber.js');

contract('SimpleDataMarket', function (accounts) {

    var account_creator = accounts[0];
    var amount = web3.toWei(1, "ether"); // 1 ether
    var account_balance;

    /*it("should purchase access and get accepted. Sensor should be paid", function (done) {
     var market = SimpleDataMarket.deployed();

     market.register.sendTransaction(
     account_creator,
     "TEST: Live GPS data from Jon Ramvis iPhone. Delivered every second. This deal is for access for one month from initialization.",
     true,
     "The solution is available through a REST interface on example.com",
     account_creator,
     2592000, // one month
     amount // TODO Sette prisen i noe mer stabilt, feks dollar
     ).then(function () {
     return market.buyAccess.sendTransaction(
     account_creator,
     account_buyer,
     {from: account_buyer, value: amount});
     }).then(function () {
     return market.checkAccess.call(account_creator, account_buyer);
     }).then(function (access) {
     assert.equal(true, access, "Buyer hasn't gotten access");
     }).then(done).catch(done);
     });*/

    it("should purchase access and get accepted. Sensor should be paid", function (done) {
        var market = SimpleDataMarket.deployed();
        var threeEtherAsBigNum = new BigNumber(web3.toWei(3, "ether"));

        market.register.sendTransaction(
            account_creator,
            "TEST: Live GPS data from Jon Ramvis iPhone. Delivered every second. This deal is for access for one month from initialization.",
            true,
            "The solution is available through a REST interface on example.com",
            account_creator,
            2592000, // one month
            amount
        ).then(function () {
            // 3x purchases
            return market.buyAccess.sendTransaction(
                account_creator,
                {from: accounts[1], value: amount});
        }).then(function () {
            return market.buyAccess.sendTransaction(
                account_creator,
                {from: accounts[2], value: amount});
        }).then(function () {
            return market.buyAccess.sendTransaction(
                account_creator,
                {from: accounts[3], value: amount});
        }).then(function () {
            return web3.eth.getBalance(market.address);
        }).then(function (balance) {
            assert.equal(threeEtherAsBigNum.equals(balance), true, "The _contract balance_ is not correct");
            return market.balance(account_creator);
        }).then(function (balance) {
            assert.equal(threeEtherAsBigNum.equals(balance), true, "The _sensor balance_ is not correct");
            return web3.eth.getBalance(account_creator); // Get balance before withdraw
        }).then(function (balance) {
            account_balance = web3.fromWei(balance, "ether");
            return market.withdraw(account_creator);
        }).then(function () {
            return web3.eth.getBalance(account_creator); // Get balance after withdraw
        }).then(function (balance) {
            // assert at ether level, not wei, as account_creator has paied an abitrary price in gas
            // for withdraw which is hard to concretize

            //string: preBalance + 3 ether IN ether
            var preBalance = account_balance.plus(web3.fromWei(threeEtherAsBigNum, "ether")).toString();
            var preNoDecimals = preBalance.split('.')[0]; // Only whole ether, cut after decimal

            var postBalance = web3.fromWei(balance, "ether").toString();
            var postNoDecimals = postBalance.split('.')[0];

            assert.equal(preNoDecimals, postNoDecimals, "The Provider has not gotten it's revenue");
        }).then(done).catch(done);
    });

});

