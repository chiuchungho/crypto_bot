"use strict";

const ccxtpro = require('./ccxt.pro/ccxt.pro')
const ccxt  = require('ccxt')
const log = require('ololog')
const fs    = require('fs')
const path  = require('path')
const ansi  = require ('ansicolor').nice
const sqlite3 = require('sqlite3').verbose();
const open  = require('open')
const WebSocket    = require('ws')
const crypto = require('crypto')
const { ExchangeError, NetworkError } = ccxtpro
const APIcredential = require ('./config/credential.json')
const Calculation =require('./src/strategy/calculation')
const TradeModel = require('./src/model/tradeModel')
const ccxtWebscoket = require('./src/connection/ccxtWebscoket')
const ccxtWs = new ccxtWebscoket();
let position={}

//Store in Composite Order ID
let pendingOrders={}
let activeOrders={}
let orders={}

//Web UI server
const http = require('http'); // 1 - 載入 Node.js 原生模組 http
const server = http.createServer(function (req, res) {   // 2 - 建立server
  res.writeHead(200, { 'content-type': 'text/html' })
  fs.createReadStream('ui/index.html').pipe(res)
});
 
server.listen(80); //3 - 進入此網站的監聽 port, 就是 localhost:xxxx 的 xxxx
 
//Websocket Server
const clientWs = new WebSocket.Server({ port: 8080 });

clientWs.on('connection', async function connection(ws) {
    ws.on('message', async function incoming(msg) {
        msg=JSON.parse(msg)
        console.log('received');
        console.log(msg)

        if(msg.action=='vwap'){
            console.log('Get vwap price')
            ws.send(JSON.stringify({action:msg.action,data:Calculation.vwap(msg.exchangeID,msg.instrument,msg.size)}))
        }
        if(msg.action=='get_orderbook'){
            console.log('Dump Orderbook State')
            ws.send(JSON.stringify({action:msg.action,data:orderbook}))
        }
        if(msg.action=='get_markets'){
            console.log('Get avbl markets')
            ws.send(JSON.stringify({action:msg.action,data:TradeModel.avblMarkets}))
        }
        if(msg.action=='get_balances'){
            console.log('Get balances')
            ws.send(JSON.stringify({action:msg.action,data:TradeModel.balance}))
        }
        if(msg.action=='get_position'){
            console.log('Get position')
            ws.send(JSON.stringify({action:msg.action,data:position}))
        }
        if(msg.action=='submit_order'){
            console.log('submit order')
            submitOrder(msg.data.origin,msg.data.exchangeID ,msg.data.symbol,msg.data.type, msg.data.side, msg.data.amount, msg.data.price, msg.data.params)
        }
        if(msg.action=='get_orders'){
            console.log('get_orders')
            ws.send(JSON.stringify({action:msg.action,data:orders}))
        }
        if(msg.action=='get_active_orders'){
            console.log('active_orders')
            ws.send(JSON.stringify({action:msg.action,data:activeOrders}))
        }
        if(msg.action=='get_pending_orders'){
            console.log('pending_orders')
            ws.send(JSON.stringify({action:msg.action,data:pendingOrders}))
        }
    })
})


function clientSend(data,action){
	console.log('emit to client')
	clientWs.clients.forEach(function each(client) {
	   client.send(JSON.stringify({action:action,data:data}));
	});
}



let ccxtws = new ccxtWebscoket();
ccxtws.subscribeOrderbook('binance',"BTC/USDT")
ccxtws.subscribeOrderbook('ftx',"BTC-PERP")
ccxtws.subscribeExecution('binance')
ccxtws.subscribeExecution('ftx')
ccxtws.subscribeBalance('binance')
ccxtws.subscribeBalance('ftx')
ccxtws.getTickers('ftx')
ccxtws.getTickers('binance')
ccxtws.registerOrderbookListener(function(origin,cliOrdID,order) {

}); 


ccxtws.registerExecutionListener(function(exchangeID,symbol,exec) {
    console.log(exchangeID)
    console.log(symbol)
    console.log(exec)
    console.log('=====')
 // bind executions to orders

 // if order is monitored, handle position changes
 
 // ping regarded stretegy

});

function submitOrder(origin,exchangeID ,symbol,type, side, amount, price, params) {
    if(typeof pendingOrders[origin]=='undefined'){
        pendingOrders[origin]=[];
        activeOrders[origin]=[]
    }
    const cliOrdID=exchangeID+"_"+new Date().getTime();
    pendingOrders[origin].push(cliOrdID)
    orders[cliOrdID]={
        clientOrderId: cliOrdID,
        status: 'pending',
        symbol: symbol,
        type: type,
        side: side,
        amount: amount,
        price: price,
        origin: origin
    }
    ccxtws.submitOrder(origin,exchangeID,symbol,type,side, amount, price,cliOrdID, params)

}

ccxtws.registerSubmitOrderListener(function(origin,exchangeID,cliOrdID,order) {
    delete orders[cliOrdID]
    order.origin=origin
    orders[composeOrderID(exchangeID,order.id)]=order
    pendingOrders[origin].pop(cliOrdID)
    activeOrders[origin].push(composeOrderID(exchangeID,order.id))
    console.log(activeOrders)
}); 


function cancelBotOrder(origin){
    let tempActiveOrders=activeOrders[origin]
    console.log(tempActiveOrders)
    if(typeof tempActiveOrders!= "undefined"){
        for(var i=0; i<tempActiveOrders.length; i++){
            console.log("cancel order by id")
            console.log(tempActiveOrders[i],origin)
            cancelOrderByID(tempActiveOrders[i],origin)
        }
    }
}
function cancelOrderByID(exchOrderID,origin=null){
    let orderIDparts=splitOrderID(exchOrderID)
    if(typeof orders[exchOrderID] != "undefined"){
        orders[exchOrderID].status="cancelling"
    }
    ccxtws.cancelOrder(orderIDparts[0],orderIDparts[1],origin)
}

ccxtws.registerCancelOrderListener(function(exchangeID, rawOrderID, result,origin=null) {
    console.log(result)
   if(origin==null){
    //Find order origin
        try{
            if(typeof orders[composeOrderID(exchangeID,rawOrderID)]!='undefined'){
                origin = orders[composeOrderID(exchangeID,rawOrderID)].origin
            }
        }catch(e){}
        
   }
   //remove from activeorder[origin]
   try{
     activeOrders[origin].pop(composeOrderID(exchangeID,rawOrderID))
    }catch(e){}
   //Archive orders[ID] state to database
   
   //Delete orders[ID]
   try{
    delete orders[composeOrderID(exchangeID,rawOrderID)]
    }catch(e){}
   

}); 

function composeOrderID(exchangeID,rawOrderID){
    return exchangeID+"_"+rawOrderID
}
function splitOrderID(exchOrderID){
    return exchOrderID.split(/_(.+)/)
}
let countdown=3
let count = 0;
function runMainStretegy(){
    
    let price = 50000;

    countdown--;
    console.log(countdown)
    if(countdown == 0){
        console.log('bot1')
        countdown=3;
        count++;
        cancelBotOrder('bot1')
        submitOrder('bot1','ftx','BTC-PERP','limit','buy','0.01',price+count)
    }
    
}

function runCallbackStretegy(){

    
}




function printLog(){
    //console.log ( TradeModel.balance)
    //console.log ( TradeModel.orderbook)
    //console.log ( TradeModel.execution)
}

setInterval(printLog,5 * 1000)
setInterval(runMainStretegy, 1000)





//================================================================
// above code are all modularized into diferent package
//all depreciated 
//================================================================






// let orderbook = {
//     ftx: {},
//     binance: {}
// }
// let ticker = {
//     ftx: {},
//     binance: {}
// }
// let balance = {
//     ftx: {},
//     binance: {}
// }
// let exposure = {
    
// }
// let activeOrder={} //orderID format exchangeID_orderID
// let execution = []




// let fee;
// let exchanges = {
//     ftx: new ccxtpro.ftx(),
//     binance: new ccxtpro.binance()
// }

// exchanges.ftx = new ccxtpro.ftx({
//     apiKey: APIcredential.ftx.apiKey,
//     secret: APIcredential.ftx.secret,
//     enableRateLimit: true,
//     rateLimit: 10
// });

// exchanges.binance = new ccxtpro.binance({
//     apiKey: APIcredential.binance.apiKey,
//     secret: APIcredential.binance.secret,
//     enableRateLimit: true,
//     rateLimit: 10
// });

// async function updateFundingRate() {
//     console.log('get funding rate');
//     fee = await exchanges['ftx'].publicGetFundingRates()
//     console.log(fee)
// }
// updateFundingRate();
// setInterval(updateBalance, 10 * 1000);

// //subscribeOrderbook('binance','ETH/BTC')
// async function subscribeOrderbook(exchangeID,symbol,limit){
//     orderbook[exchangeID][symbol]=null
//     while (true) {
//         let result = await exchanges[exchangeID].watchOrderBook (symbol)
//         if(!result.timestamp){result.timestamp=new Date().getTime();}
//         orderbook[exchangeID][symbol] = result
//         orderbookEventCallback(exchangeID,symbol)
//         console.log (exchangeID,new Date (), result['asks'][0], result['bids'][0])
//     }
//     return new Promise();
// }

// let orderbookEventCallback = function(exchangeID, symbol){}

// //subscribeTicker('binance','ETH/BTC')
// async function subscribeTicker(exchangeID,symbol){
//     ticker[exchangeID][symbol]=null
//     while (true) {
//         let result = await exchanges[exchangeID].watchTicker (symbol)
//         if(!result.timestamp){result.timestamp=new Date().getTime();}
//         ticker[exchangeID][symbol]=result
//         tickerEventCallback(exchangeID,symbol)
//         console.log (new Date (), ticker)
//     }
//     return new Promise();
// }
// let tickerEventCallback = function(exchangeID, symbol){}

// //subscribeExecution('binance','ETH/BTC')
// async function subscribeExecution(exchangeID,symbol){
//     while (true) {
//         const exec = await exchanges[exchangeID].watchMyTrades(symbol)
//         exec.exchangeID=exchangeID
//         execution.push(exec)
//         executionEventCallback(execution)
//         //console.log (new Date (), exec)
//     }
//     return new Promise();
// }
// let executionEventCallback = function(execution){}

// //subscribeBalance('binance')
// async function subscribeBalance(exchangeID){
//     balance[exchangeID]=null
//     if (exchanges[exchangeID].has['watchBalance']) {
//         while (true) {
//             balance[exchangeID] = await exchanges[exchangeID].watchBalance()
//             balanceEventCallback(exchangeID)
//             //console.log (new Date (), balance)
//         }
//     }else{
//         console.log('watch balance not available for '+exchangeID+'. Using poll instead')
//         while (true){
//             balance[exchangeID] = await exchanges[exchangeID].fetchBalance()
//             balanceEventCallback(exchangeID)
//             await exchanges[exchangeID].sleep (3000) // wait 3 second

//         }
//     }
//     return new Promise();
// }
// let balanceEventCallback = function(execution){}


// function vwap(exchangeID,symbol,size){
// 	var direction=size>0?'asks':'bids';
// 	var sizeRemaining=Math.abs(size);
// 	var vwapProduct=0
// 	for (var i=0;i<orderbook[exchangeID][symbol][direction].length&&sizeRemaining!=0;i++){
// 		var sizeToBuy=sizeRemaining<orderbook[exchangeID][symbol][direction][i][1]?sizeRemaining:orderbook[exchangeID][symbol][direction][i][1]
// 		vwapProduct+=sizeToBuy*orderbook[exchangeID][symbol][direction][i][0]
// 		sizeRemaining-=sizeToBuy
// 	}
// 	if(sizeRemaining>0){
// 		console.error('Insufficient Liquidity')
// 		return 0
// 	}
// 	return vwapProduct/Math.abs(size)
// }
