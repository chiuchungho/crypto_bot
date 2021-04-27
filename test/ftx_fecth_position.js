'use strict'

const ccxt = require('ccxt')
const log = require('ololog')
const fs = require('fs');
require ('ansicolor').nice


let fee;


const ftx = new ccxt.ftx({
    apiKey: 'RB8vwp6_ABIOp3M0AZqYNaDgPh0Hg3DznY_wQiz8',
    secret: 'zjInLSC6D-AvBMiAOXP-D5LTkdCk62dmkAabeI2x',
    subaccountName: 'HoSub',
    'enableRateLimit': true,
});

const binance = new ccxt.binance({
    apiKey: '',
    secret: '',
    'enableRateLimit': true,
    'options': {
        'defaultType': 'delivery',
    },
});


async function testFTX() {
    const params = {
        'showAvgPrice': false,      
      }
    let position = await ftx.private_get_positions(params)
    position = position.result.filter(function(result) {
        return result.collateralUsed>0;
      })
      console.log(position)
    //Sample:
    //   [ { collateralUsed: 313.22,
    //     cost: 3132.2,
    //     entryPrice: 1566.1,
    //     estimatedLiquidationPrice: 430.2281595794982,
    //     future: 'ETH-PERP',
    //     initialMarginRequirement: 0.1,
    //     longOrderSize: 0,
    //     maintenanceMarginRequirement: 0.03,
    //     netSize: 2,
    //     openSize: 2,
    //     realizedPnl: -7389.52693799,
    //     recentAverageOpenPrice: 1625,
    //     recentBreakEvenPrice: 1625,
    //     recentPnl: -117.8,
    //     shortOrderSize: 0,
    //     side: 'buy',
    //     size: 2,
    //     unrealizedPnl: 0 } ]
}
testFTX()