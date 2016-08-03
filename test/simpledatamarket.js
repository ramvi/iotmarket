var BigNumber = require('bignumber.js');

contract('SimpleDataMarket', (accounts) => {

    let account_creator = accounts[0];
    let amount = web3.toWei(1, "ether"); // 1 ether
    let account_balance;

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

    it("should purchase access and get accepted. Sensor should be paid", (done) => {
        let market = SimpleDataMarket.deployed();
        let threeEtherAsBigNum = new BigNumber(web3.toWei(3, "ether"));

        let gasUsed = 0;

        market.register.sendTransaction(
            'a',
            "TEST: Live GPS data from Jon Ramvis iPhone. Delivered every second. This deal is for access for one month from initialization.",
            true,
            "The solution is available through a REST interface on example.com",
            account_creator,
            2592000, // one month
            amount
        )
            .then(() => {
            // 3x purchases
            return market.buyAccess.sendTransaction(
                'a',
                {from: accounts[1], value: amount});
        }).then(() => {
            return market.buyAccess.sendTransaction(
                'a',
                {from: accounts[2], value: amount});
        }).then(() => {
            return market.buyAccess.sendTransaction(
                'a',
                {from: accounts[3], value: amount});
        })
            .then(() => {
            return web3.eth.getBalance(market.address);
        }).then((balance) => {
            assert.equal(threeEtherAsBigNum.equals(balance), true, "The _contract balance_ is not correct. Balance: " + balance);
            return market.balance('a');
        }).then((balance) => {
            assert.equal(threeEtherAsBigNum.equals(balance), true, "The _sensor balance_ is not correct. Balance: " + balance);
            return web3.eth.getBalance(account_creator); // Get balance before withdraw
        }).then((balance) => {
            account_balance = balance;//web3.fromWei(balance, "ether");
            // Try to withdraw with wrong ID
            return market.withdraw('b', {from: account_creator});
        }).then((tx) => {
            return web3.eth.getTransactionReceipt(tx);
        }).then((receipt) => {
            gasUsed = receipt.gasUsed;
            // Get balance after withdraw
            return web3.eth.getBalance(account_creator);
        }).then((balance) => {
            // Pre tx + gas should be new tx
            assert.equal(balance.plus(gasUsed).valueOf(), account_balance.valueOf(), "The Provider has not gotten it's revenue");
        }).then(done).catch(done);
    });

});

