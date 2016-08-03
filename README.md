# IoT marketplace
Data feed market on the Ethereum blockchain.

### [`simplest`](https://github.com/ramvi/iotmarket/tree/simplest) is the most primitive implementation of the IoT market idea.

![simplest]

1. The Provider of the data / the sensor owner registers the sensor on the blockchain
1. The Buyer finds the sensor through some kind of discovery app and gets it's record from the blockchain
1. The Buyer reviews records and sends the given amount of ether *directly to the Provider, outside of the contract*
1. The Buyer follows the contract help string on how to get the data
1. The Provider or sensor is responsible for access management

[simplest]: https://lh3.googleusercontent.com/R2aaHY--RSP_tfDsUcE2S3qxPyl3Of1_c9foJvKt2NK3IaQhiu1xSCGv_4z2Uh5zCTjbbfnsvNPjK9QZuecRMultXU7HpNdW5hDG7Z_U-tCmAgkdXe3HjkyH0rzsQXFCgniKMnZZKBu3VFw7P4Yv2ht-vlfgj1K8Gr8N54nstMFlReqYj98Qc96byuvjnzeGckiFRuW7RXmViK53yURxueIg5cJXs95uTL9_GxmGUExJlePQulabzFrgxJ9C-J-EHAfS4LvZuzTM7utZdMUc-mvXBwkw4RwL0ygCAucDTz-NYYxXsJN6_ZeTbo_cHbar9GxG_8_d_YcqYs8Go9HFdjN8hN4h4pPPQRW9O6bPwMiR3WIxSeg_PtFzlQFtY97gkYqw_yqwsVI3fyHsad06uAcNXkT4t7cHMRDLc4gVAKXD1af8S23hlH63mq6-Ur1In5ONgGvtOhsnqD313ujMIM5TwKrBCjy-yAnB4ed5UD19OFZKwwISqqlNyz6wdKEg9dFlCoSs4XWB-5TGi7c_iEGlum7S5V-X5RKIFg18yKqOybA9Bwe5U6XwVsEFylUUUKG_KNNemhcnprVlk5WGWhHO1CPToe_o=s2016-no "IoT market simplest implementation"

## Dependencies

* Node
* `npm install -g ethereumjs-testrpc` (good luck installing this. [You're going to need it - especially on Windows](https://github.com/ethereumjs/testrpc#install))

## Commands

### Run locally
* `npm install`
* `testrpc`
* `webpack-dev-server`

Solution is hosted on http://localhost:8080
