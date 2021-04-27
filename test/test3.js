'use strict'

const ccxt = require('ccxt')
const log = require('ololog')

    (async () => {
        let ftx = new ccxt.binance()
        // let markets = await ftx.load_markets ()


        const limit = 10
        const orders = await ftx.fetchOrderBook('ETH/USDT', limit, {
            // this parameter is exchange-specific, all extra params have unique names per exchange
            'group': 0, // 1 = orders are grouped by price, 0 = orders are separate
        })

        console.log(orders)

        let bid = orders.bids.length ? orders.bids[0][0] : undefined
        let ask = orders.asks.length ? orders.asks[0][0] : undefined
        let spread = (bid && ask) ? ask - bid : undefined
        console.log(ftx.id, 'YFI-PERP market price', { bid, ask, spread })


    })()