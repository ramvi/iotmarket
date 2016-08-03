# IoT marketplace
Data feed market on the Ethereum blockchain.

### [`master`](https://github.com/ramvi/iotmarket/tree/master) Extends the `simplest` implementation with more featueres on-chain

#### Use case diagram

![simple]

1. The Provider of the data / the sensor owner registers the sensor on the blockchain
1. The Buyer finds the sensor through some kind of discovery app and gets it's record from the blockchain
1. The Buyer reviews records and sends the given amount of ether
1. The Buyer follows the contract help string on how to get the data
1. The sensor checks if the Buyer has access

Only getting sensor data off-chain.

#### TODO
  * [ ] Frontend. Header (menu, select account), material design, react? Price in ether, time in minutes. Display contract being stored.
  * [ ] One sensor can have many different contracts
  * [ ] Tests for all use cases
  * [ ] Discovery of available data sources
  How to aggregate active sensor contracts over time? Oracle outside of
   the blockchain? Gossiping mellom alle klienter? Eller gi oppgaven til gateways?
  * [ ] Rewrite using newly proposed [Condition-oriented programming](https://blog.ethcore.io/condition-oriented-programming-2/)
  * [ ] Security audit
  * [ ] The contract needs funds to send ether in the withdraw function. Take a 0.1% premium? Has to 1. always be enough to widthdraw. 2. Needs a contract widthdraw so that the contract doesn't hold a lot of unusable ether

## Roadmap

* [ ] Reputation - or ratings at least. Is this feed delivering what's promised?
* [ ] Payment Channel using e.g. [obscurien's implementation](https://github.com/obscuren/whisper-payment-channel) or [void4's implementation](https://github.com/void4/paymentchannel) ![paymentchannel]
* [ ] Evaluate permissioned blockchain where Providers are kinds for optimalization e.g. [HydraChain](https://github.com/HydraChain/hydrachain), HyperLedger, MultiChain
* [ ] Test in real environment with real data from a sensor is being purchased
* [ ] Display prices in USD (and other currencies?)
Not completely sold on this one. If the price is actually in ether, but shown in dollars can you end up paying a different amount than expected. In the payment channel scenario at least. Without the payment channel the purchase is completed at the same time that the price is displayed. With an accepted price in USD, but actually done in Ether, is it possible to envision a solution where both parties keep the deal running as long as the ratio between eth/usd is within a given threshold.
* [ ] Support USD or other ways of payment e.g. Stipe

## Open Questions
* Who deactivates offline sensors? There's a function for the owner doing it, but we can't rely on the owner to clean up the registry.
* How to aggregate, find and filter available data feeds?
* With most features moved on-chain with Payment Channels, how to move the actual data on-chain?

[simple]: https://lh3.googleusercontent.com/W7JnuMBl2Bhj4rIMn2UJcFcRdor5OThPCQjP3Q7pzi1IeIDPjMTVtmZquZjvBLCY7EzYw27Yn0B1UyjVHv5_lUBVt4ushN_Haew7xZMCxw3GCQD1IBqjHsVmqP_W9HNYQYsHyFWZevTlWj8Nf7SJjtagpXFpXbgVfcwyeDA1WtfVD_wvCISbWdRKAvzGZe41YgwuWAj55314lBgpBPKzVGKaKI9gUHzH2_YULx_r6oAkGsQcUEMV07JpW2O3Z7SOMNkilTsziGw7tM1d9jdkSxBCGws7Jbi4G9OaUZeGh60O9ceOip9pWJtyGSfpEZTvnJNrk74kPjKOwiB_NAMQLmvufaERHWKf2nDXPDGrX-760W7iScljrwA-6qdPLjjlqs5Ke2LyMI-6EaO0TqdQ3sMDRFW4gPiA5ZieULY3Y1I9n4EH6MMjEsSHX7VrOxnP9tzVBlYhXUqgDZfHJaGbHFNJlhhaknm-DXkmGZJaz8SWvxXDJ5cGIjq2P1YoUpOUUlErwm6amzHNc8rw5k9oUtqeUKcVs1J_6begbyFaP1swwX5ZFeeryEXL_WlB44qkJQCTemcUVeZ75_HrIzx1oTPGlpyWV2Lw=w2688-h2016-no "A somewhat more advanced architecture than 'simplest'"

[paymentchannel]: https://lh3.googleusercontent.com/Ebb7mV3wh08aWke-si5_Xtfol00RBuhmQHCRtdl5MZ8qjLo2Qcza_phxewVPBVfDGkIdC9M0968i4mqzSns3FjOmyxwKsytsoG5jB7_ddrrtpNCbdQ5C9PaK_o_JBiGpVTj0Nnt0R1jUxpqNcgVow7mcKi5WGQ7Q1YZ2bcKa6bz3gqzDw_dKaBrlFrMHmGmVAHgWUwCKCb2GJqfHUlWADg1gWdOODhH61ycf9X9LyEnYqwKqmaOoSOUCxQIMYm3uqVZXdg1Oll5bKKwInO9yX02McW4ntJOLi_uE0qFheQ14EKgwMantgKINrdHYAoXk7mJ5yyv2R5DRCXlbQxxUx37T37rFLeJWOaO32WAzlTniZgyOoUuFNDrkL8vRcw6Hb7ZTB6umG4cph9iN7phllurumdVZLcI4KLMfeoIcqqCVGey_WVeWzMxbiLrAvMG1KwfSXoxcFnhfffUjsLX_t0WmjGs83ePtgcFvj1E1cd77EH-rl07rvPnCCSubN57jYzetfw2e4NV8zq9IN6QXu9dh9Hwwyrh4Spu37-en8h6qn453O8ijnnarPp-r9VjDaHHypUiN1E-We_G6FN2KRA3jQ5a5dFVx=w2688-h2016-no "Architecture for using payment channels"


## Dependencies

* Node
* `npm install -g ethereumjs-testrpc` (good luck installing this. [You're going to need it - especially on Windows](https://github.com/ethereumjs/testrpc#install))

## Commands

### Run locally
* `npm install`
* `testrpc`
* `webpack-dev-server`

Solution is hosted on http://localhost:8080
