// TODO Hvordan liste opp alle? Den på nett har jo noe søk. Bare løse med events?
// TODO Skriv in receiving contract som kan brukes istedenfor vanlig overføring
// TODO Optimaliser koden. Modifiers
// This is the base contract that your contract SimpleDataMarket extends from.
contract SimpleDataMarket {

    struct Purchase {
      uint startTime;
    }

    // This struct keeps all data for a Record.
    struct Record {
        // Keeps the address of this record creator.
        address owner;
        // Keeps the time when this record was created.
        uint time;
        // Keeps the index of the keys array for fast lookup
        uint keysIndex;
        string desc;
        bool active;
        string help;
        address payTo;
        uint secondsLength;
        uint256 price;
        // buyer => {block.time purchased, seconds should have access}
        mapping (address => Purchase) purchases; // TODO Hvordan blir dette med 256 stacken? Er det bedre å ha mappingen utenfor -- løser det noe?
        // Er det noe/mye overhead på at det er struct Purchase
        uint vault;
    }

    // This mapping keeps the records of this Registry.
    mapping(address => Record) records;

    // Keeps the total numbers of records in this Registry.
    uint public numRecords;

    // Keeps a list of all keys to interate the records.
    address[] private keys;

    // This is the function that actually insert a record.
    // TODO key og payTo er samme  - og owner? optimalisere
    function register(address key, string desc, bool active, string help, address payTo, uint secondsLength, uint256 price) {
        if (records[key].time == 0) {
            records[key].time = now;
            records[key].owner = msg.sender;
            records[key].keysIndex = keys.length;
            keys.length++;
            keys[keys.length - 1] = key;
            records[key].desc = desc;
            records[key].active = active;
            records[key].help = help;
            records[key].payTo = payTo;
            records[key].secondsLength = secondsLength;
            records[key].price = price;

            numRecords++;
        } else {
            returnValue(); // TODO wat is this
        }
    }

    // Updates the values of the given record.
    function update(address key, string desc, bool active, string help, address payTo, uint secondsLength, uint256 price) {
        // Only the owner can update his record.
        if (records[key].owner == msg.sender) {
            records[key].desc = desc;
            records[key].active = active;
            records[key].help = help;
            records[key].payTo = payTo;
            records[key].secondsLength = secondsLength;
            records[key].price = price;
        }
    }

    // Unregister a given record
    function toggleActive(address _seller) {
      Record r = records[_seller];
      if (r.owner == msg.sender)
        r.active = !r.active;
    }

    // Tells whether a given key is registered.
    function isRegistered(address key) returns(bool) {
        if (records[key].time == 0) {
            return false;
        }
        return true;
    }

    function getRecordAtIndex(uint rindex) returns(address key, address owner, uint time, string desc, bool active, string help, address payTo, uint secondsLength, uint256 price) {
        Record record = records[keys[rindex]];
        key = keys[rindex];
        owner = record.owner;
        time = record.time;
        desc = record.desc;
        active = record.active;
        help = record.help;
        payTo = record.payTo;
        secondsLength = record.secondsLength;
        price = record.price;
    }

    function getRecord(address key) returns(address owner, uint time, string desc, bool active, string help, address payTo, uint secondsLength, uint256 price) {
        Record record = records[key];
        owner = record.owner;
        time = record.time;
        desc = record.desc;
        active = record.active;
        help = record.help;
        payTo = record.payTo;
        secondsLength = record.secondsLength;
        price = record.price;
    }

    // Returns the owner of the given record. The owner could also be get
    // by using the function getRecord but in that case all record attributes
    // are returned.
    function getOwner(address key) returns(address) {
        return records[key].owner;
    }

    // Returns the registration time of the given record. The time could also
    // be get by using the function getRecord but in that case all record attributes
    // are returned.
    function getTime(address key) returns(uint) {
        return records[key].time;
    }

    // Returns the total number of records in this registry.
    function getTotalRecords() constant returns(uint) {
        return numRecords;
    }

    // Deposits money into the contract to buy access to sensor data
    // New data can only be added when previous purchase is ended
    function buyAccess(address _deal, address _buyer) {
    Record r = records[_deal];
      if (r.price != msg.value) throw;

      // if (checkAccess(_deal, _buyer)) throw; // TODO Avoids overwriting already purchased sensordata.

      //if (_buyer == 0) _buyer = msg.sender; // Det er vel ikke mulig å sende inn uten  dette param, så er det vits i?

      r.purchases[_buyer] = Purchase(now);
      r.vault += msg.value;
    }

    function checkAccess(address _deal, address _buyer) constant returns (bool access) {
      Record r = records[_deal];

      uint start = r.purchases[_buyer].startTime;
      if (start == 0) throw; // No purchase exists

      if ((start + r.secondsLength) > now)
        return true;
      return false;
    }

    function withdraw(address key) {
        if (msg.sender == records[key].owner) {
            uint earnings = records[key].vault;
            records[key].vault = 0; // In this order to be sure ledger is set to 0 BEFORE transfering the money
            msg.sender.send(earnings);  // TODO kontrakten må betale for dette. Hvordan får den råd til det? https://ethereum.stackexchange.com/questions/2876/how-does-one-contract-send-a-transaction-to-another-contract-with-more-then-2300
        }
    }

    /*function balance2() constant returns (uint) {
      return this.balance();
    }*/

    // This function is used by subcontracts when an error is detected and
    // the value needs to be returned to the transaction originator.
    function returnValue() internal {
        if (msg.value > 0) {
            msg.sender.send(msg.value);
        }
    }

    function() {}
}