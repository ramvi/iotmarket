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

        var account_one_starting_balance;
        var account_two_starting_balance;
        var account_one_ending_balance;
        var account_two_ending_balance;

        var amount = 10;

        market.register.call(
            account_creator,
            "Live GPS data from Jon Ramvis iPhone. Delivered every second. This deal is for access for one month from initialization.",
            true,
            "The solution is available through a REST interface on example.com",
            0.3 // TODO Sette prisen i noe mer stabilt, feks dollar
        ).then(function() {
            account_creator.send()
            market.getRecord.call(account_creator).then(function(address) {

            })
            assert.equal(test, "jon jon2");
        }).then(done).catch(done);
    });
});
