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
    it("should create a deal with owner&payTo: primary user, and buy it as another", function (done) {
     var market = SimpleDataMarket.deployed();

     var account_creator = accounts[0]; // TODO Test at pengene går inn på smartkontrakt
     var account_buyer = accounts[1];

     var amount = web3.toWei(50, "finney"); // 0.05 ether

     var account_creator_balance;
     var payTo;

     /*market.register.sendTransaction(
     account_creator,
     "Live GPS data from Jon Ramvis iPhone. Delivered every second. This deal is for access for one month from initialization.",
     true,
     "The solution is available through a REST interface on example.com",
     account_creator,
     amount // TODO Sette prisen i noe mer stabilt, feks dollar
     ).then(function () {
     return web3.eth.getBalance(account_creator);
     }).then(function (balance) {
     account_creator_balance = web3.fromWei(balance, "ether");
     return market.getRecord.call(account_creator);
     }).then(function (record) {
     payTo = record[5]; // PayTo contract
     return web3.eth.getBalance(account_buyer);
     }).then(function (balance) {
     return web3.eth.sendTransaction({
     from: account_buyer,
     to: payTo,
     value: amount
     });
     }).then(function () {
     return web3.eth.getBalance(account_creator);
     }).then(function (balance) {
     var new_balance = web3.fromWei(balance, "ether");
     assert.equal(new_balance.toString(), account_creator_balance.plus(web3.fromWei(amount, "ether")).toString(), "payTo hasn't gotten " +amount +" wei");
     }).then(done).catch(done);
     });*/

    it("should purchase access and get accepted. Sensor should be paid", function (done) {
        var market = SimpleDataMarket.deployed();

        var account_creator = accounts[0];
        var account_buyer = accounts[1];

        var amount = web3.toWei(1, "ether"); // 1 ether


        market.register.sendTransaction(
            account_creator,
            "TEST: Live GPS data from Jon Ramvis iPhone. Delivered every second. This deal is for access for one month from initialization.",
            true,
            "The solution is available through a REST interface on example.com",
            account_creator,
            2592000, // one month
            amount // TODO Sette prisen i noe mer stabilt, feks dollar
        ).then(function () {
            return market.buyAccess.call(
                account_creator,
                account_buyer,
                {from: account_buyer, value: amount});
        }).then(function (val) {
            console.log("val: ");
            console.log(val);
            return market.checkAccess.call(account_creator, account_buyer);
        }).then(function (access) {
            assert.equals(true, access, "Buyer hasn't gotten access");
        }).then(done).catch(done);
    });


    /*it("shouldn't allow a key to be used twice", function (done) {
     var market = SimpleDataMarket.deployed();
     })*/
});