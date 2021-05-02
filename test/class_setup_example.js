'use strict'

const ccxt = require('ccxt')
const log = require('ololog')

const CcxtWebscoket = require('../src/connection/ccxtWebscoket')

// var initWS = new ccxtWebscoket();

let ccxtWebscoket = new CcxtWebscoket();
ccxtWebscoket.subscribeOrderbook('binance','ETH/BTC')

ccxtWebscoket.registerOrderbookListener(function(event, data) {
    console.log("event: " + event + " data: "+ data);
  });

// function printLog(){
//     console.log (ccxtWebscoket.orderbook['asks'][0], ccxtWebscoket.orderbook['bids'][0]);
// }

// setInterval(printLog,5 * 1000)