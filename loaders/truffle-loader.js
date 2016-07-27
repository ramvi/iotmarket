var Truffle = require('truffle')
var path = require('path')
var argv = require('yargs').argv
var PuddingGenerator = require('ether-pudding/generator')
var solc = require('solc')

// Set file structure - TODO: Do this with a config
var truffle_dir = path.join(__dirname, '../node_modules/truffle')
var working_dir = path.join(__dirname, '..')

var config = Truffle.config.gather(truffle_dir, working_dir, argv, 'development')

var deploying = false

/**
 * Main webpack loader function.
 * *Note*: This loader uses `this.async()`, a callback which is
 * passed around for async functions like `Truffle.contracts.deploy`
 *
 * @param {string} source - The input string
 */
module.exports = function (source) {
  // Create the callback used for async calls
  var callback = this.async()

  // There are two important branches:
  // `deployContracts()` & `waitForDeployment()`
  //
  // `deployContracts()` is called **once** on every compilation
  // by the first Solidity file that makes it to this logic.
  //
  // `waitForDeployment` is called by every **subsequent** Solidity file,
  // causing them to wait until the deploy has completed. This prevents
  // a flood of unnecessary parallel deployments.
  if (!deploying) {
    deployContracts(source, callback)
  } else {
    waitForDeployment(source, callback)
  }
}

/* Poll `deploying`, once `deploying` = flase, call `done()` */
function waitForDeployment (source, callback) {
  setTimeout(function () {
    if (deploying) {
      waitForDeployment(source, callback)
      return
    }
    done(source, callback)
  }, 50)
}

/**
 * Call `Truffle.contracts.deploy()`.
 * Once finished, set deploying to false and call `done()`
 *
 * @dependency {config} - global which holds the contract info
 */
function deployContracts (source, callback) {
  deploying = true
  Truffle.contracts.deploy(config, true, function (err) {
    // Contracts have been deployed.
    // Note: The global variable `config` will now be loaded
    // with the contract information.
    deploying = false
    if (err != null) {
      callback(err)
    } else {
      done(source, callback)
    }
  })
}

/**
 * Build the .sol.js source for the contract, and return it.
 *
 * @dependency {config} - global which holds the contract info
 */
function done (source, callback) {
  // `config.contracts.classes` contains an array of all the contract definitions
  var classes = config.contracts.classes
  var targetContract = getContractClass(source)
  var compiledContract = PuddingGenerator.generate(targetContract, classes[targetContract])

  callback(null, compiledContract)
}

/* Get the name of the contract class we care about */
function getContractClass (source) {
  var output = solc.compile(source, 1)
  for (var contractName in output.contracts) {
    return contractName
  }
}
