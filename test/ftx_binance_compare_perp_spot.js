'use strict'

const ccxt = require('ccxt')
const log = require('ololog')
const fs = require('fs');
require('ansicolor').nice


let fee;


const ftx = new ccxt.ftx({
    apiKey: 'RB8vwp6_ABIOp3M0AZqYNaDgPh0Hg3DznY_wQiz8',
    secret: 'zjInLSC6D-AvBMiAOXP-D5LTkdCk62dmkAabeI2x',
    subaccountName: 'HoSub',
    'enableRateLimit': true,
    'options': {
        'defaultType': 'delivery',
    },
});

const binanceDelivery = new ccxt.binance({
    apiKey: '',
    secret: '',
    'enableRateLimit': true,
    'options': {
        'defaultType': 'delivery',
    },
});

const binanceFuture = new ccxt.binance({
    apiKey: '',
    secret: '',
    'enableRateLimit': true,
    'options': {
        'defaultType': 'future',
    },
});



async function compareAllPrepSpot() {

    await updateFundingRate()


    console.log('compareAllPrepSpot');
    await ftx.load_markets();

    let binanceDeliveryTickers = await binanceDelivery.fetchTickers()
    let binanceFutureTickers = await binanceFuture.fetchTickers()
    // console.log(markets)
    for (let symbol in ftx.markets) {

        const market = ftx.markets[symbol]
        // console.log (symbol)
        if (market['future'] && symbol!='DEFI-PERP') {
            //     // rs+= symbol + ' '
            let tem = symbol.split("-");
            if (tem[1] == 'PERP') {
                // console.log (symbol)

                try {
                    let binancePair = binanceDeliveryTickers[tem[0] + '/USD']
                    let margin = Math.abs(1 - (binancePair.last / market.info.price))

                    if (margin > 0.005) {
                        let fees = getFundingRateBySymbol(symbol)
                        console.log('FTX', symbol, (market.info.price.toString()).yellow, 'Binance', binancePair.symbol, (binancePair.last.toString()).yellow, 'Last hour funding fee:', (fees[0].rate.toString()).yellow, 'Spread:', ((margin * 100).toFixed(2) + '%').green)
                        console.log(symbol, 'volumeUsd24h:', (market.info.volumeUsd24h.toString()).red, binancePair.symbol, 'volumeUsd24h:', (binancePair.baseVolume.toString()).red)
                    }
                } catch (error) {
                    // console.log(error);
                }

                //Binance USDT PERP
                try {
                    let usdtRate = ftx.markets['USDT/USD']
                    let binancePair = binanceFutureTickers[tem[0] + '/USDT']
                    let margin = Math.abs(1 - ((binancePair.last/usdtRate.info.price) / market.info.price))

                    if (margin > 0.005) {
                        let fees = getFundingRateBySymbol(symbol)
                        console.log('FTX', symbol, (market.info.price.toString()).yellow, 'Binance', binancePair.symbol, (binancePair.last.toString()).yellow, 'Last hour funding fee:', (fees[0].rate.toString()).yellow, 'Margin:', ((margin * 100).toFixed(2) + '%').green)
                        console.log('FTX', symbol, (market.info.price.toString()).yellow, 'Binance', binancePair.symbol, ((binancePair.last/usdtRate.info.price).toFixed(4).toString()).yellow, '<<<adjusted USD Price')
                        console.log(symbol, 'volumeUsd24h:', (market.info.volumeUsd24h.toString()).red, binancePair.symbol, 'volumeUsd24h:', (binancePair.baseVolume.toString()).red)
                    }
                } catch (error) {
                }

            }
        }
    }
}
compareAllPrepSpot()
// setInterval(updateBalance, 10 * 1000);

// fs.writeFileSync('data.json', JSON.stringify(tickers)

async function updateFundingRate() {
    console.log('get funding rate');
    fee = await ftx.publicGetFundingRates()
    fee = fee.result
}

function getFundingRateBySymbol(symbol) {
    return fee.filter(function (result) {
        // return result.rate >= 0.0003 ;
        return result.future == symbol && ftx.parse8601(result.time) > (ftx.seconds() * 1000 - (1 * 60 * 60 * 1000));
    })
}


// [ { future: 'BTT-PERP',
//     rate: 0.000374,
//     time: '2021-02-02T17:00:00+00:00' },
//   { future: 'HOLY-PERP',
//     rate: 0.000361,
//     time: '2021-02-02T17:00:00+00:00' },
//   { future: 'BTMX-PERP',
//     rate: 0.000629,
//     time: '2021-02-02T17:00:00+00:00' } ]




async function test() {
    console.log('test');
    // let ftxMarkets = await ftx.load_markets();
    // let binanceMarkets = await binance.load_markets();
    // console.log(markets)
    // let market = binance.markets['1INCH-PERP']
    await binanceFuture.loadMarkets()
    // let binancePair = binanceTickers['BTC/USD']

    // let ftxTickers = await ftx.fetchTickers()
    // let ftxPair = ftxTickers['DOGE-PERP']
    // let usdtRate = ftxMarkets['USDT/USD']

    for(let symbol in binanceFuture.markets){
        console.log(symbol.toString())
    }
    

    // console.log('Perp: ',market.info.price, 'USD Pair: ', usdPair.info.price)
    // console.log(Math.abs(1-(usdPair.info.price/market.info.price)))
    // console.log(Math.abs(1-(market.info.price/usdPair.info.price)))

}
// test()

async function getBinanceFundingRate(){
    let exchange = new ccxt.binance({
        'enableRateLimit': true,
        'options': {
            'defaultType': 'future',
        },
    })
    
    let markets = await exchange.load_markets()
    
    let symbol = 'BTC/USDT'
    let market =  await exchange.market(symbol)
    console.log(market)
    let response = await exchange.fapiPublic_get_fundingrate({
        'symbol': market['id'],
        // # 'startTime': exchange.parse8601('2020-11-25T00:00:00Z'),  # ms to get funding rate from INCLUSIVE.
        // # 'endTime': exchange.parse8601('2020-11-26T00:00:00Z'),  # ms to get funding rate until INCLUSIVE.
        // # 'limit': 100,  # default 100, max 1000
    })
    
    // console.log(response)
    
}
// getBinanceFundingRate()