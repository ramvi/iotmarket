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
    mapping (address => Purchase) purchases; // TODO Hvordan blir dette med 256 stacken? Er det bedre å ha mappingen utenfor -- løser det noe?
    uint vault;
  }

  // This mapping keeps the records of this Registry.
  mapping(string => Record) records;

  // Keeps the total numbers of records in this Registry.
  uint public numRecords;

  // Keeps a list of all keys to interate the records.
  address[] private keys;

  event NewSensor(string key, string desc, string help, uint secondsLength, uint price);

  // TODO moar events!!! event SensorToggled();

  // This is the function that actually insert a record.
  // TODO key og payTo er somregel samme  - og owner, og sender. optimalisere
  function register(string key, string desc, bool active, string help, address payTo, uint secondsLength, uint price) {
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

      NewSensor(key, desc, help, secondsLength, price);
    }
  }

  // Updates the values of the given record.
  function update(string key, string desc, bool active, string help, address payTo, uint secondsLength, uint256 price) {
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
  function isRegistered(string key) constant returns(bool) {
    if (records[key].time == 0) {
      return false;
    }
    return true;
  }

  function getRecordAtIndex(uint rindex) returns(string key, address owner, uint time, string desc, bool active, string help, address payTo, uint secondsLength, uint256 price) {
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

  function getRecord(string key) returns(address owner, uint time, string desc, bool active, string help, address payTo, uint secondsLength, uint256 price) {
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
  function getOwner(string key) returns(address) {
    return records[key].owner;
  }

  // Returns the registration time of the given record. The time could also
  // be get by using the function getRecord but in that case all record attributes
  // are returned.
  function getTime(string key) returns(uint) {
    return records[key].time;
  }

  // Returns the total number of records in this registry.
  function getTotalRecords() constant returns(uint) {
    return numRecords;
  }

  // Deposits money into the contract to buy access to sensor data
  // New data can only be added when previous purchase is ended
  function buyAccess(string key) {
    Record r = records[key];
    if (r.price == msg.value) {
      // if (checkAccess(key, _buyer)) throw; // TODO Avoids overwriting already purchased sensordata.
      //if (_buyer == 0) _buyer = msg.sender; // Det er vel ikke mulig å sende inn uten  dette param, så er det vits i?
      r.purchases[msg.sender] = Purchase(now);
      r.vault += msg.value;
    } else {
      returnValue();
    }
  }

  function checkAccess(string key, address _buyer) constant returns (bool access) {
    Record r = records[key];

    uint start = r.purchases[_buyer].startTime;
    if (start == 0) throw; // No purchase exists

    if ((start + r.secondsLength) > now)
      return true;
    return false;
  }

  function withdraw(string key) {
    if (msg.sender == records[key].owner) {
      uint earnings = records[key].vault;
      records[key].vault = 0; // In this order to be sure ledger is set to 0 BEFORE transfering the money. DAO bug
      msg.sender.send(earnings);
    }
  }

  function balance(string key) constant returns (uint balance) {
    if (msg.sender == records[key].owner) {
      return records[key].vault;
    }
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