const ccxtpro = require('../../ccxt.pro/ccxt.pro/ccxt.pro')
const APIcredential = require ('../../config/credential.json')

class ExchangeWithKey{

    static exchanges = {
        ftx: new ccxtpro.ftx({
            apiKey: APIcredential.ftx.apiKey,
            secret: APIcredential.ftx.secret,
            enableRateLimit: true,
            rateLimit: 10
        }),
        binance: new ccxtpro.binance({
            apiKey: APIcredential.binance.apiKey,
            secret: APIcredential.binance.secret,
            enableRateLimit: true,
            rateLimit: 10,
            options:{'defaultType': 'future'}
        })
    };

};

module.exports = ExchangeWithKey;