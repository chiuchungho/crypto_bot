'use strict'

const ccxt = require('ccxt.pro')
const log = require('ololog')
const fs = require('fs');
require ('ansicolor').nice


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

const binance = new ccxt.binance({
    apiKey: '',
    secret: '',
    'enableRateLimit': true,
    'options': {
        'defaultType': 'delivery',
    },
});

async function compareAllPrepSpot() {

    await updateFundingRate()


    console.log('compareAllPrepSpot');
    await ftx.load_markets();
    // console.log(markets)
    for (let symbol in ftx.markets) {

        const market = ftx.markets[symbol]
        // console.log (symbol)
        if (market['future']) {
        //     // rs+= symbol + ' '
            let tem = symbol.split("-");
            if(tem[1] == 'PERP'){
                // console.log (symbol)
                let show = false;
                
                try {
                    let usdPair = ftx.markets[tem[0] + '/USD']
                    let margin = Math.abs(1-(usdPair.info.price/market.info.price))
                    if(market.info.price > usdPair.info.price){
                        // show = true;
                        let fees = getFundingRateBySymbol(symbol)
                        if(fees[0].rate> 0.0003){
                            console.log(symbol, (market.info.price.toString()).yellow, usdPair.symbol, (usdPair.info.price.toString()).yellow ,'Last hour funding fee:' , (fees[0].rate.toString()).yellow , 'Margin:', ((margin*100).toFixed(2) + '%').green)
                            console.log(symbol,'volumeUsd24h:',(market.info.volumeUsd24h.toString()).red, usdPair.symbol,'volumeUsd24h:',(usdPair.info.volumeUsd24h.toString()).red)
                        }
                    }
                } catch (error) {
                }


            }
            
        //     // console.log (symbol, await exchange.fetchTicker (symbol))
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

function getFundingRateBySymbol(symbol){
    return fee.filter(function(result) {
        // return result.rate >= 0.0003 ;
        return result.future == symbol && ftx.parse8601(result.time) > (ftx.seconds () * 1000 - (1*60*60*1000));
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
    console.log('compareAllPrepSpot');
    let markets = await exchange.load_markets();
    // console.log(markets)
    let market = exchange.markets['1INCH-PERP']
    let usdPair = exchange.markets['1INCH/USD']

    console.log('Perp: ',market.info.price, 'USD Pair: ', usdPair.info.price)
    console.log(Math.abs(1-(usdPair.info.price/market.info.price)))
    console.log(Math.abs(1-(market.info.price/usdPair.info.price)))
    
}
// test()