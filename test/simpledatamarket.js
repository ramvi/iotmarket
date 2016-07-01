/*
 - register
 - update(address key, string desc, bool active, string help, uint256 price)
 - unregister(address key)
 - isRegistered(address key) returns(bool)
 - getRecordAtIndex(uint rindex) returns(address key, address owner, uint time, string desc, bool active, string help, uint256 price)
 - getRecord(address key) returns(address owner, uint time, string desc, bool active, string help, uint256 price)
 - getOwner(address key) returns(address)
 - getTime(address key) returns(uint)
 - getTotalRecords() returns(uint)
 */


contract('SimpleDataMarket', function (accounts) {

    var account_creator = accounts[0];
    var account_buyer = accounts[1];
    var amount = web3.toWei(1, "ether"); // 1 ether

    it("should purchase access and get accepted. Sensor should be paid", function (done) {
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
    });

    it("should purchase access and get accepted. Sensor should be paid", function (done) {
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
            // 3x purchases
            return market.buyAccess.sendTransaction(
                account_creator,
                account_buyer,
                {from: account_buyer, value: amount});
        }).then(function () {
            return market.buyAccess.sendTransaction(
                account_creator,
                accounts[2],
                {from: accounts[2], value: amount});
        }).then(function () {
            return market.buyAccess.sendTransaction(
                account_creator,
                accounts[3],
                {from: accounts[3], value: amount});
        }).then(function () {
            console.log(market.balance); // TODO Get balance
        }).then(function (balance) {
            assert.equal(web3.toWei(3, "ether"), balance, "The contract balance is not correct");
        }).then(done).catch(done);
    });

    // TODO Sjekk at kontrakt-verdien er lik summen av vaults
    // TODO Sjekk withdraw
    /*it("shouldn't allow a key to be used twice", function (done) {
     var market = SimpleDataMarket.deployed();
     })*/
});

