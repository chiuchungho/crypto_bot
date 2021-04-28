# Crypto Trade Bot with CCXT Pro
* Experiment with CCXT Pro
* 

## Installation instructions / Run Instructions

```bash
  node app.js
```


## Approaches

### Technical choices
* CCXT Pro

### System Design
The program should be modulized into diferent package.

Logic based on 2 side contract trade or spot price difference to earn interest and price difference.

* `app.js` should only be starting point of the app

##### User Interface
* `ui` -> can be further modulized

##### Controller/Flow Level
* `balanceController`
flow:
  1. get balance
  1. if one side > other side, initiate transfer through account
* `startTradingController` 
flow: 
  1. check balance both side have enough amount
  1. find pair
  1. change flag to trade
  1. exexution logic
* `endTradingController`
flow: 
  1. check any existing holding crypto in spot/future
  1. compare the price, if price difference less than 0.1%, start convert back to USD

##### Biz Logic level
* `findPair`
* `balance`
* `execution`

##### Connection Level
* `websocket`
* `database` -> logging
* `apiCall`

##### Config
* `credential.json`
* `trading_pair.json` -> hardcode to monitor all the possible arb pairs
* `validation` check all the config variable


## Summary
...
