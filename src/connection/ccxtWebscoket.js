const ccxtpro = require('../../ccxt.pro/ccxt.pro/ccxt.pro')
const APIcredential = require ('../../config/credential.json')
const TradeModel = require('../model/tradeModel')
const ExchangeWithKey = require('./exhangeWithKey')

class CcxtWebscoket{
    constructor(){
        this.orderbook;
        this.ticker;
        this.balance;
    }
    //subscribeOrderbook('binance','ETH/BTC')
    async subscribeOrderbook(exchangeID,symbol,limit){
        while (true) {
            let result = await ExchangeWithKey.exchanges[exchangeID].watchOrderBook (symbol)
            if(!result.timestamp){result.timestamp=new Date().getTime();}
            TradeModel.orderbook[exchangeID][symbol] = result
            this.orderbookEventCallback(exchangeID, symbol)
            // console.log (exchangeID,new Date (), this.orderbook['asks'][0], this.orderbook['bids'][0])
        }
    }

    orderbookEventCallback(exchangeID, symbol){
        //write the logic you need


        if(true){
            this.emitOrderbookMessage("order_event", "data123")
        }
    }

    emitOrderbookMessage(event, data) {}
    registerOrderbookListener(listener) {
        this.emitOrderbookMessage = listener;
    }




    //subscribeTicker('binance','ETH/BTC')
    async subscribeTicker(exchangeID,symbol){
        while (true) {
            let result = await ExchangeWithKey.exchanges[exchangeID].watchTicker (symbol)
            if(!result.timestamp){result.timestamp=new Date().getTime();}
            this.ticker=result
            this.tickerEventCallback(exchangeID,symbol)
            // console.log (new Date (), ticker)
        }
    }

    tickerEventCallback(exchangeID, symbol){
        //write the logic you need


        if(true){
            this.emitTickerMessage("ticker_event", "data123")
        }
    }

    emitTickerMessage(event, data) {}
    registerTickerListener(listener) {
        this.emitTickerMessage = listener;
    }

    // //subscribeExecution('binance','ETH/BTC')
    async subscribeExecution(exchangeID,symbol){
        while (true) {
            const exec = await ExchangeWithKey.exchanges[exchangeID].watchMyTrades(symbol)
            exec.exchangeID=exchangeID
            execution.push(exec)
            this.executionEventCallback(execution)
            //console.log (new Date (), exec)
        }
    }

    executionEventCallback(exchangeID, symbol){
        //write the logic you need


        if(true){
            this.emitExecutionMessage("execution_event", "data123")
        }
    }

    emitExecutionMessage(event, data) {}
    registerExecutionListener(listener) {
        this.emitExecutionMessage = listener;
    }

    // balance: [exchangeID]=null,
    // //subscribeBalance('binance')
    async subscribeBalance(exchangeID){
        if (exchanges[exchangeID].has['watchBalance']) {
            while (true) {
                this.balance = await ExchangeWithKey.exchanges[exchangeID].watchBalance()
                this.balanceEventCallback(exchangeID)
                //console.log (new Date (), balance)
            }
        }else{
            console.log('watch balance not available for '+exchangeID+'. Using poll instead')
            while (true){
                this.balance = await ExchangeWithKey.exchanges[exchangeID].fetchBalance()
                this.balanceEventCallback(exchangeID)
                await exchanges[exchangeID].sleep (3000) // wait 3 second

            }
        }
    }

    balanceEventCallback(exchangeID, symbol){
        //write the logic you need


        if(true){
            this.emitBalanceMessage("balance_event", "data123")
        }
    }

    emitBalanceMessage(event, data) {}
    registerBalanceListener(listener) {
        this.emitBalanceMessage = listener;
    }
}

module.exports = CcxtWebscoket;