'use strict'

const ccxt = require('ccxt')
const log = require('ololog')

const CcxtWebscoket = require('../src/connection/ccxtWebscoket')
const TradeModel = require('../src/model/tradeModel')

// var initWS = new ccxtWebscoket();

let exchangeID = 'binance'
let symbol = 'ETH/BTC'

let ccxtWebscoket = new CcxtWebscoket();
ccxtWebscoket.subscribeOrderbook('binance',symbol)
ccxtWebscoket.subscribeOrderbook('ftx',symbol)

ccxtWebscoket.registerOrderbookListener(function(event, data) {
    console.log("event: " + event + " data: "+ data);
  });

function printLog(){
    console.log (exchangeID,new Date (), 
    TradeModel.orderbook[exchangeID][symbol]['asks'][0], 
    TradeModel.orderbook[exchangeID][symbol]['bids'][0])

    console.log ('ftx',new Date (), 
    TradeModel.orderbook['ftx'][symbol]['asks'][0], 
    TradeModel.orderbook['ftx'][symbol]['bids'][0])
}

setInterval(printLog,5 * 1000)