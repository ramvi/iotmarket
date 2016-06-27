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
    it("should create a deal as one user and buy it as another", function (done) {
        var market = SimpleDataMarket.deployed();

        var account_creator = accounts[0]; // TODO Test at pengene går et annet sted
        var account_buyer = accounts[1];

        var amount = web3.toWei(1, "ether");

        var account_creator_balance;

        market.register.sendTransaction(
            account_creator,
            "Live GPS data from Jon Ramvis iPhone. Delivered every second. This deal is for access for one month from initialization.",
            true,
            "The solution is available through a REST interface on example.com",
            account_creator,
            amount // TODO Sette prisen i noe mer stabilt, feks dollar
        ).then(function () {
            return web3.eth.getBalance(account_creator).toNumber();
        }).then(function (balance) {
            account_creator_balance = web3.fromWei(balance, "ether");
            console.log(account_creator_balance);
            return market.getRecord.call(account_creator);
        }).then(function (record) {
            return record[5]; // PayTo contract
        }).then(function (payTo) {
            assert.equal(payTo, account_creator);
            return web3.eth.sendTransaction({
                from: account_buyer,
                to: payTo,
                value: amount
            });
        }).then(function () {
            return web3.eth.getBalance(account_creator).toNumber();
        }).then(function (balance) {
            var new_balance = web3.fromWei(balance, "ether");
            console.log(new_balance);
            assert.equal(new_balance, account_creator_balance + 1, "payTo hasn't gotten 1 ether");
        }).then(done).catch(done);
    });


    /*it("shouldn't allow a key to be used twice", function (done) {
     var market = SimpleDataMarket.deployed();
     })*/
});
