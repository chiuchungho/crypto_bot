class TradeModel{
    static orderbook = {
        ftx: {},
        binance: {}
    };

    static avblMarkets = {
        ftx:{},
        binance:{}
    }

    static ticker = {
        ftx: {},
        binance: {}
    };

    static balance = {
        ftx: {},
        binance: {}
    };

    static exposure = {};

    static activeOrder = {};

    static execution = [];
    

}

module.exports = TradeModel;