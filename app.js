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
const APIcredential = require ('./credential.json')
const symbol = ['ETH-PERP', 'ETH/USD']

const ftxSymbol = 'ETH-PERP'
const binanceSymbol = 'ETH/USD'

const limit = 10
let fee;
let balance;
let exchanges = {
    ftx: new ccxtpro.ftx(),
    binance: new ccxtpro.ftx()
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
    console.log('updateBalance');
    balance = await exchanges['ftx'].fetchBalance();
    console.log(balance)
//     { info: { result: [ [Object], [Object] ], success: true },
//   USD: { free: 0, used: 1742.75055516, total: 1742.75055516 },
//   USDT: { free: 0, used: 0.002994, total: 0.002994 },
//   free: { USD: 0, USDT: 0 },
//   used: { USD: 1742.75055516, USDT: 0.002994 },
//   total: { USD: 1742.75055516, USDT: 0.002994 } }
}
updateBalance()

async function updateFundingRate() {
    console.log('get funding rate');
    fee = await exchanges['ftx'].publicGetFundingRates()
    console.log(fee)
}

// setInterval(updateBalance, 10 * 1000);
