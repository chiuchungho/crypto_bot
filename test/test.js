'use strict'

const ccxt = require ('ccxt')
const log  = require ('ololog')

const symbol = 'ETH-PERP'
const exchanges = ['ftx']

;(async () => {

    const result = await Promise.all (exchanges.map (async id => {

        // const exchange = new ccxt[id] ({ 'enableRateLimit': true })
        const exchange = new ccxt[id] ({ 'enableRateLimit': true , options: { defaultType: 'future' }})
        // const ticker = await exchange.fetchTicker (symbol)
        await exchange.loadMarkets ()
        // let succeeded = exchange.markets.filter(market => market.future ? true : false).length.toString ().bright.green
        // let succeeded = exchanges.filter (exchange => exchange.markets ? true : false).length.toString ().bright.green

        // var rs = '';

        // console.log (symbol, await exchange.fetchTicker (symbol))

        for (let symbol in exchange.markets) {

            const market = exchange.markets[symbol]
            // console.log (symbol)
            if (market['future']) {
            //     // rs+= symbol + ' '
                let tem = symbol.split("-");
                if(tem[1] == 'PERP'){
                    console.log (symbol)
                }
                
            //     // console.log (symbol, await exchange.fetchTicker (symbol))
            //     // await ccxt.sleep (exchange.rateLimit)
            }
        }

        // console.log(rs)

        

    }))

    // log (result);

}) ()

// async function test () {

//     const exchange = new ccxt.okex ()
//     await exchange.loadMarkets ()

//     for (let symbol in exchange.markets) {

//         const market = exchange.markets[symbol]

//         if (market['future']) {
//             console.log ('----------------------------------------------------')
//             console.log (symbol, await exchange.fetchTicker (symbol))
//             await ccxt.sleep (exchange.rateLimit)
//         }
//     }
// }

// test ()