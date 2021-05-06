const ccxtpro = require('../../ccxt.pro/ccxt.pro/ccxt.pro')
const APIcredential = require ('../../config/credential.json')
const TradeModel = require('../model/tradeModel')
const ExchangeWithKey = require('./exhangeWithKey')

class CcxtWebscoket{
    //=================================
    // local variable is not needed anymore
    //=================================
    // constructor(){
    //     this.orderbook;
    //     this.ticker;
    //     this.balance;
    // }
    //subscribeOrderbook('binance','ETH/BTC')
    async subscribeOrderbook(exchangeID,symbol,limit){
        while (true) {
            let result = await ExchangeWithKey.exchanges[exchangeID].watchOrderBook (symbol)
            if(!result.timestamp){result.timestamp=new Date().getTime();}
            TradeModel.orderbook[exchangeID][symbol] = result
            this.orderbookEventCallback(exchangeID, symbol, result)
            // console.log (exchangeID,new Date (), this.orderbook['asks'][0], this.orderbook['bids'][0])
        }
    }

    orderbookEventCallback(exchangeID, symbol, result){
        //write the logic you need
        if(true){
            this.emitOrderbookMessage(exchangeID, symbol, result)
        }
    }

    emitOrderbookMessage(exchangeID, symbol, result) {}
    registerOrderbookListener(listener) {
        this.emitOrderbookMessage = listener;
    }




    //subscribeTicker('binance','ETH/BTC')
    async subscribeTicker(exchangeID,symbol){
        while (true) {
            let result = await ExchangeWithKey.exchanges[exchangeID].watchTicker (symbol)
            if(!result.timestamp){result.timestamp=new Date().getTime();}
            TradeModel.ticker[exchangeID][symbol]=result
            this.tickerEventCallback(exchangeID,symbol,result)
            // console.log (new Date (), ticker)
        }
    }

    tickerEventCallback(exchangeID,symbol,result){
        //write the logic you need


        if(true){
            this.emitTickerMessage(exchangeID,symbol,result)
        }
    }

    emitTickerMessage(event, data) {}
    registerTickerListener(listener) {
        this.emitTickerMessage = listener;
    }

    // //subscribeExecution('binance','ETH/BTC')
    async subscribeExecution(exchangeID,symbol){
        while (true) {
            let exec = await ExchangeWithKey.exchanges[exchangeID].watchMyTrades(symbol)
            exec.exchangeID=exchangeID
            TradeModel.execution.push(exec)
            this.executionEventCallback(exchangeID,symbol,exec)
            //console.log (new Date (), exec)
        }
    }

    executionEventCallback(exchangeID,symbol,exec){
        //write the logic you need


        if(true){
            this.emitExecutionMessage(exchangeID,symbol,exec)
        }
    }

    emitExecutionMessage(exchangeID,symbol,exec) {}
    registerExecutionListener(listener) {
        this.emitExecutionMessage = listener;
    }

    // balance: [exchangeID]=null,
    // //subscribeBalance('binance')
    async subscribeBalance(exchangeID){
        if (ExchangeWithKey.exchanges[exchangeID].has['watchBalance']) {
            while (true) {
                TradeModel.balance[exchangeID] = await ExchangeWithKey.exchanges[exchangeID].watchBalance()
                this.balanceEventCallback(exchangeID)
                //console.log (new Date (), balance)
            }
        }else{
            console.log('watch balance not available for '+exchangeID+'. Using poll instead')
            while (true){
                TradeModel.balance[exchangeID]= await ExchangeWithKey.exchanges[exchangeID].fetchBalance()
                this.balanceEventCallback(exchangeID)
                await ExchangeWithKey.exchanges[exchangeID].sleep (3000) // wait 3 second

            }
        }
    }

    balanceEventCallback(exchangeID){
        //write the logic you need


        if(true){
            this.emitBalanceMessage(exchangeID)
        }
    }

    emitBalanceMessage(exchangeID) {}
    registerBalanceListener(listener) {
        this.emitBalanceMessage = listener;
    }


    async submitOrder(origin,exchangeID ,symbol,type, side, amount, price , cliOrdID,params) {
        if(typeof params=='undefined'){
            params = {"clientOrderId":cliOrdID}
        }else{
            params.clientOrderId = cliOrdID
        }
        let order = await ExchangeWithKey.exchanges[exchangeID].createOrder(symbol, type, side, amount, price, params)
        order.exchangeID=exchangeID
        this.submitOrderEventCallback(origin,exchangeID,cliOrdID,order)
    }

    submitOrderEventCallback(origin,exchangeID,cliOrdID,order){
        //write the logic you need
        if(true){
            this.emitSubmitOrderMessage(origin,exchangeID,cliOrdID,order)
        }
    }

    emitSubmitOrderMessage(origin,exchangeID,cliOrdID,order) {}
    registerSubmitOrderListener(listener) {
        this.emitSubmitOrderMessage = listener;
    }


    async cancelOrder(exchangeID ,orderID, origin=null) {
        console.log('cancelling order'+orderID)
        try{
            let result = await ExchangeWithKey.exchanges[exchangeID].cancelOrder(orderID)
            this.cancelOrderEventCallback(exchangeID,orderID,result,origin)    
        }catch(e){
            console.log(e); 
            if(e instanceof ccxtpro.CancelPending){
                console.log("cancellation pending")
                this.cancelOrderEventCallback(exchangeID,orderID,"Cancellation Pending",origin)    
            }
            if(e instanceof ccxtpro.InvalidOrder){
                console.log("cancellation pending")
                this.cancelOrderEventCallback(exchangeID,orderID,"Already closed",origin)    
            }
        }
    }

    cancelOrderEventCallback(exchangeID,orderID,result,origin=null){
        //write the logic you need
        if(true){
            this.emitCancelOrderMessage(exchangeID,orderID,"",origin)
        }
    }

    emitCancelOrderMessage(exchangeID,orderID,result,origin=null) {}
    registerCancelOrderListener(listener) {
        this.emitCancelOrderMessage = listener;
    }


    //subscribeTicker('binance','ETH/BTC')
    async getTickers(exchangeID){
       
            let result = await ExchangeWithKey.exchanges[exchangeID].fetchTickers ()
            TradeModel.avblMarkets[exchangeID] = result
        
    }

}

module.exports = CcxtWebscoket;