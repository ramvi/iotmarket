// TODO Hvordan liste opp alle? Den på nett har jo noe søk. Bare løse med events?

// This is the base contract that your contract SimpleDataMarket extends from.
contract BaseRegistry {

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
        uint256 price;
    }

    // This mapping keeps the records of this Registry.
    mapping(address => Record) records;

    // Keeps the total numbers of records in this Registry.
    uint public numRecords;

    // Keeps a list of all keys to interate the records.
    address[] private keys;


    uint public TIME_TO_LIVE = 31536000;
    uint public FREQUENCY_TO_CHECK_EXPIRATION = 3600;
    uint private lastCheck = now;

    // This is the function that actually insert a record.
    // key og payTo er samme
    function register(address key, string desc, bool active, string help, uint256 price) {
        if (now - lastCheck > FREQUENCY_TO_CHECK_EXPIRATION) {
            lastCheck = now;
            // Checks if there are expirted records. If so, remove them.
            for (uint i = 0; i < numRecords; i++) {
                Record record = records[keys[i]];
                if (block.timestamp - record.time > TIME_TO_LIVE) {
                    // record expired
                    delete records[keys[i]];
                    keys[i] = keys[numRecords - 1];
                    keys.length--;
                    numRecords--;
                    i--; // Repeat last i since now keys[i] = keys[i+1]
                } else {
                    // Since index contains the list of the keys ordered by timestamp, if a given
                    // record has not expired then it is guaranteed that the next blocks will not have
                    // expired either.
                    break;
                }
            }
        }
        if (records[key].time == 0) {
            records[key].time = now;
            records[key].owner = msg.sender;
            records[key].keysIndex = keys.length;
            keys.length++;
            keys[keys.length - 1] = key;
            records[key].desc = desc;
            records[key].active = active;
            records[key].help = help;
            records[key].price = price;

            numRecords++;
        } else {
            returnValue();
        }
    }

    // Updates the values of the given record.
    function update(address key, string desc, bool active, string help, uint256 price) {
        // Only the owner can update his record.
        if (records[key].owner == msg.sender) {
            records[key].desc = desc;
            records[key].active = active;
            records[key].help = help;
            records[key].price = price;
        }
    }

    // Unregister a given record
    function unregister(address key) {
        if (records[key].owner == msg.sender) {
            uint keysIndex = records[key].keysIndex;
            delete records[key];
            numRecords--;
            keys[keysIndex] = keys[keys.length - 1];
            records[keys[keysIndex]].keysIndex = keysIndex;
            keys.length--;
        }
    }

    // Tells whether a given key is registered.
    function isRegistered(address key) returns(bool) {
        if (records[key].time == 0) {
            return false;
        }
        if (now - records[key].time > TIME_TO_LIVE) {
            return false;
        }
        return true;
    }

    function getRecordAtIndex(uint rindex) returns(address key, address owner, uint time, string desc, bool active, string help, uint256 price) {
        Record record = records[keys[rindex]];
        key = keys[rindex];
        owner = record.owner;
        time = record.time;
        desc = record.desc;
        active = record.active;
        help = record.help;
        price = record.price;
    }

    function getRecord(address key) returns(address owner, uint time, string desc, bool active, string help, uint256 price) {
        Record record = records[key];
        owner = record.owner;
        time = record.time;
        desc = record.desc;
        active = record.active;
        help = record.help;
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
    function getTotalRecords() returns(uint) {
        return numRecords;
    }

    // This function is used by subcontracts when an error is detected and
    // the value needs to be returned to the transaction originator.
    function returnValue() internal {
        if (msg.value > 0) {
            msg.sender.send(msg.value);
        }
    }

    function() {}
}

contract SimpleDataMarket is BaseRegistry {}