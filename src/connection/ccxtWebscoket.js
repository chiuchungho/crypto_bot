const ccxtpro = require('../../ccxt.pro/ccxt.pro/ccxt.pro')
const APIcredential = require ('../../config/credential.json')

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

class CcxtWebscoket{
    constructor(){
        this.orderbook;
        this.ticker;
        this.balance;
    }
    //subscribeOrderbook('binance','ETH/BTC')
    async subscribeOrderbook(exchangeID,symbol,limit){
        while (true) {
            let result = await exchanges[exchangeID].watchOrderBook (symbol)
            if(!result.timestamp){result.timestamp=new Date().getTime();}
            this.orderbook = result
            this.emitOrderbookMessage("order_event", "data123")
            // orderbookEventCallback(exchangeID,symbol)
            // console.log (exchangeID,new Date (), this.orderbook['asks'][0], this.orderbook['bids'][0])
        }
    }

    emitOrderbookMessage(event, data) {}
    registerOrderbookListener(listener) {
        this.emitOrderbookMessage = listener;
    }


    // orderbookEventCallback(exchangeID, symbol){

    // }

    //subscribeTicker('binance','ETH/BTC')
    async subscribeTicker(exchangeID,symbol){
        while (true) {
            let result = await exchanges[exchangeID].watchTicker (symbol)
            if(!result.timestamp){result.timestamp=new Date().getTime();}
            this.ticker=result
            // tickerEventCallback(exchangeID,symbol)
            // console.log (new Date (), ticker)
        }
    }

    // tickerEventCallback(exchangeID, symbol){}

    // //subscribeExecution('binance','ETH/BTC')
    async subscribeExecution(exchangeID,symbol){
        while (true) {
            const exec = await exchanges[exchangeID].watchMyTrades(symbol)
            exec.exchangeID=exchangeID
            execution.push(exec)
            executionEventCallback(execution)
            //console.log (new Date (), exec)
        }
    }

    // executionEventCallback(execution){},

    // balance: [exchangeID]=null,
    // //subscribeBalance('binance')
    async subscribeBalance(exchangeID){
        if (exchanges[exchangeID].has['watchBalance']) {
            while (true) {
                this.balance = await exchanges[exchangeID].watchBalance()
                // balanceEventCallback(exchangeID)
                //console.log (new Date (), balance)
            }
        }else{
            console.log('watch balance not available for '+exchangeID+'. Using poll instead')
            while (true){
                this.balance = await exchanges[exchangeID].fetchBalance()
                // balanceEventCallback(exchangeID)
                await exchanges[exchangeID].sleep (3000) // wait 3 second

            }
        }
    }

    // balanceEventCallback(execution){}
}

module.exports = CcxtWebscoket;