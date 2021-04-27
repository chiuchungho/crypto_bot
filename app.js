'use strict'

const ccxt = require('ccxt')
const log = require('ololog')

const symbol = ['ETH-PERP', 'ETH/USD']
const exchanges = ['ftx']
const ftxSymbol = 'ETH-PERP'
const binanceSymbol = 'ETH/USD'

const limit = 10
let fee;
let balance;

const exchange = new ccxt.ftx({
    apiKey: '',
    secret: '',
    subaccountName: 'HoSub',
    enableRateLimit: true,
    rateLimit: 35

});

async function updateBalance() {
    console.log('updateBalance');
    balance = await exchange.fetchBalance();
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
    fee = await exchange.publicGetFundingRates()
    console.log(fee)
}

// setInterval(updateBalance, 10 * 1000);
