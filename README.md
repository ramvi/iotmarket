# IoT marketplace
Data feed market on the Ethereum blockchain.

## Dependencies

* Node
* `npm install -g ethereumjs-testrpc` (good luck installing this. [You're going to need it](https://github.com/ethereumjs/testrpc#install))
* `npm install -g truffle`

## Commands

### Run locally
* `testrpc`
* `truffle serve`

### Run tests
* `npm test`

## Branches
* [] [**master**](https://github.com/ramvi/iotmarket/tree/master) currently developed branch. This branch builds on the simplest implementation, extending it by moving more of the features to the blockchain.
![simplest]

* [x] [**simplest**](https://github.com/ramvi/iotmarket/tree/simplest) is the most primitive implementation of the IoT market idea. 

## Roadmap
* [] More tests
* [] Frontend
* [] Discovery. How to aggregate, find and filter available
* [] Reputation - or ratings at least. Is this feed delivering what's promised?
* [] Payment Channel using e.g. [obscurien's implementation](https://github.com/obscuren/whisper-payment-channel) or [void4's implementation](https://github.com/void4/paymentchannel)
* [] Evaluate permissioned blockchain for this service using e.g. [HydraChain](https://github.com/HydraChain/hydrachain)

## Open Questions
* Who deactivates offline sensors? There's a function for the owner doing it, but we can't rely on the owner to clean up the registry. 

[simplest]: https://goo.gl/photos/bKukxfUjuY4qLJbC8 "IoT market simplest implementation"

