'use strict'

const ccxt = require('ccxt')
const log = require('ololog')

const symbol = ['ETH-PERP', 'ETH/USD']
const exchanges = ['ftx']
const ftxSymbol = 'ETH-PERP'
const binanceSymbol = 'ETH/USD'

const limit = 10

    ; (async () => {
        const result = await Promise.all(exchanges.map(async (id, i) => {

            const exchange = new ccxt[id]({
                'enableRateLimit': true,
            })

            let fee = await exchange.publicGetFundingRates()
            let latestFee = fee.result.filter(function(result) {
                // return result.rate >= 0.0003 ;
                return (result.rate >= 0.0002 && exchange.parse8601(result.time) > (exchange.seconds () * 1000 - (1*60*60*1000)));
              })
            console.log('latest Fee > 0.3%')
            console.log(latestFee)
            console.log('------------------------------------')

            for( let i of latestFee){
                getFTXFutureAndSpotMarkPriceWithSymbol(exchange, i.future)
                getFTXFutureAndSpotMarkPriceWithSymbol(exchange, i.future.split('-')[0] + '/USD')
            }
            
        }))

    })()

    async function getFTXFutureAndSpotMarkPriceWithSymbol(exchange, symbol){
        try {
            const orders = await exchange.fetchOrderBook(symbol, limit, {
                'group':1
            })
            // console.log(orders)
            let bid = orders.bids.length ? orders.bids[0][0] : undefined
            let ask = orders.asks.length ? orders.asks[0][0] : undefined
            let spread = (bid && ask) ? ask - bid : undefined
            console.log(symbol, 'market price', { bid, ask, spread })
        } catch (error) {
            
        }

    }
