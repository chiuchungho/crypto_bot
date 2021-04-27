"use strict";

const ccxtpro = require('./ccxt.pro/ccxt.pro')
const ccxt  = require('ccxt')
const log = require('ololog')
const fs    = require('fs')
const path  = require('path')
const ansi  = require ('ansicolor').nice
const sqlite3 = require('sqlite3').verbose();
const open  = require('open')
const ws    = require('ws')
const crypto = require('crypto')
const { ExchangeError, NetworkError } = ccxtpro
const APIcredential = require ('./config/credential.json')
const symbol = ['ETH-PERP', 'ETH/USD']
const ftxSymbol = 'ETH-PERP'
const binanceSymbol = 'ETH/USD'
const limit = 10;


const http = require('http'); // 1 - 載入 Node.js 原生模組 http
const server = http.createServer(function (req, res) {   // 2 - 建立server
  res.writeHead(200, { 'content-type': 'text/html' })
  fs.createReadStream('index.html').pipe(res)
});
 
server.listen(80); //3 - 進入此網站的監聽 port, 就是 localhost:xxxx 的 xxxx
 


let orderbook = {
    ftx: {},
    binance: {}
}
let ticker = {
    ftx: {},
    binance: {}
}
let balance = {
    ftx: {},
    binance: {}
}
let execution = []


let fee;
let exchanges = {
    ftx: new ccxtpro.ftx(),
    binance: new ccxtpro.binance()
}

exchanges.ftx = new ccxtpro.ftx({
    apiKey: APIcredential.ftx.apiKey,
    secret: APIcredential.ftx.secret,
    enableRateLimit: true,
    rateLimit: 10
});

exchanges.binance = new ccxtpro.binance({
    apiKey: APIcredential.binance.apiKey,
    secret: APIcredential.binance.secret,
    enableRateLimit: true,
    rateLimit: 10
});

async function updateBalance() {
    //Depreciated
//    console.log('updateBalance');
//    balance = await exchanges['ftx'].fetchBalance();
//    console.log(balance)
//     { info: { result: [ [Object], [Object] ], success: true },
//   USD: { free: 0, used: 1742.75055516, total: 1742.75055516 },
//   USDT: { free: 0, used: 0.002994, total: 0.002994 },
//   free: { USD: 0, USDT: 0 },
//   used: { USD: 1742.75055516, USDT: 0.002994 },
//   total: { USD: 1742.75055516, USDT: 0.002994 } }
}
//updateBalance()

async function updateFundingRate() {
    console.log('get funding rate');
    fee = await exchanges['ftx'].publicGetFundingRates()
    console.log(fee)
}
updateFundingRate();
// setInterval(updateBalance, 10 * 1000);



//subscribeOrderbook('binance','ETH/BTC')
async function subscribeOrderbook(exchangeID,symbol,limit){
    orderbook[exchangeID][symbol]=null
    while (true) {
        let result = await exchanges[exchangeID].watchOrderBook (symbol)
        result.timestamp=new Date().getTime();
        orderbook[exchangeID][symbol] = result
        orderbookEventCallback(exchangeID,symbol)
        console.log (exchangeID,new Date (), result['asks'][0], result['bids'][0])
    }
    return new Promise();
}

let orderbookEventCallback = function(exchangeID, symbol){}

//subscribeTicker('binance','ETH/BTC')
async function subscribeTicker(exchangeID,symbol){
    ticker[exchangeID][symbol]=null
    while (true) {
        let result = await exchanges[exchangeID].watchTicker (symbol)
        result.timestamp=new Date().getTime();
        ticker[exchangeID][symbol]=result
        tickerEventCallback(exchangeID,symbol)
        console.log (new Date (), ticker)
    }
    return new Promise();
}
let tickerEventCallback = function(exchangeID, symbol){}

//subscribeExecution('binance','ETH/BTC')
async function subscribeExecution(exchangeID,symbol){
    while (true) {
        const exec = await exchanges[exchangeID].watchMyTrades(symbol)
        exec.exchangeID=exchangeID
        execution.push(exec)
        executionEventCallback(execution)
        //console.log (new Date (), exec)
    }
    return new Promise();
}
let executionEventCallback = function(execution){}

//subscribeBalance('binance')
async function subscribeBalance(exchangeID){
    balance[exchangID]=null
    if (exchanges[exchangeID].has['watchBalance']) {
        while (true) {
            balance[exchangID] = await exchanges[exchangeID].watchBalance()
            balanceEventCallback(exchangeID)
            //console.log (new Date (), balance)
        }
    }else{
        console.log('watch balance not available for '+exchangeID+'. Using poll instead')
        while (true){
            balance[exchangID] = await exchanges[exchangeID].fetchBalance()
            balanceEventCallback(exchangeID)
            await exchanges[exchangeID].sleep (3000) // wait 3 second

        }
    }
    return new Promise();
}
let balanceEventCallback = function(execution){}

