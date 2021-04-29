const ccxtpro = require('../ccxt.pro/ccxt.pro/ccxt.pro')
const APIcredential = require ('../config/credential.json')

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

const ccxtWebscoket = {

    orderbook: [exchangeID][symbol]=null,
    //subscribeOrderbook('binance','ETH/BTC')
    async subscribeOrderbook(exchangeID,symbol,limit){
        while (true) {
            let result = await exchanges[exchangeID].watchOrderBook (symbol)
            if(!result.timestamp){result.timestamp=new Date().getTime();}
            orderbook[exchangeID][symbol] = result
            orderbookEventCallback(exchangeID,symbol)
            console.log (exchangeID,new Date (), result['asks'][0], result['bids'][0])
        }
        return new Promise();
    },

    orderbookEventCallback(exchangeID, symbol){

    },

    ticker: [exchangeID][symbol]=null,
    //subscribeTicker('binance','ETH/BTC')
    async subscribeTicker(exchangeID,symbol){
        while (true) {
            let result = await exchanges[exchangeID].watchTicker (symbol)
            if(!result.timestamp){result.timestamp=new Date().getTime();}
            ticker[exchangeID][symbol]=result
            tickerEventCallback(exchangeID,symbol)
            console.log (new Date (), ticker)
        }
        return new Promise();
    },

    tickerEventCallback(exchangeID, symbol){},

    //subscribeExecution('binance','ETH/BTC')
    async subscribeExecution(exchangeID,symbol){
        while (true) {
            const exec = await exchanges[exchangeID].watchMyTrades(symbol)
            exec.exchangeID=exchangeID
            execution.push(exec)
            executionEventCallback(execution)
            //console.log (new Date (), exec)
        }
        return new Promise();
    },

    executionEventCallback(execution){},

    balance: [exchangeID]=null,
    //subscribeBalance('binance')
    async subscribeBalance(exchangeID){
        if (exchanges[exchangeID].has['watchBalance']) {
            while (true) {
                balance[exchangeID] = await exchanges[exchangeID].watchBalance()
                balanceEventCallback(exchangeID)
                //console.log (new Date (), balance)
            }
        }else{
            console.log('watch balance not available for '+exchangeID+'. Using poll instead')
            while (true){
                balance[exchangeID] = await exchanges[exchangeID].fetchBalance()
                balanceEventCallback(exchangeID)
                await exchanges[exchangeID].sleep (3000) // wait 3 second

            }
        }
        return new Promise();
    },

    balanceEventCallback(execution){},
}


module.exports = ccxtWebscoket;