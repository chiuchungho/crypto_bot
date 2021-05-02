class Calculation{

    static vwap(orderbook,exchangeID,symbol,size){
        var direction=size>0?'asks':'bids';
        var sizeRemaining=Math.abs(size);
        var vwapProduct=0
        for (var i=0;i<orderbook[exchangeID][symbol][direction].length&&sizeRemaining!=0;i++){
            var sizeToBuy=sizeRemaining<orderbook[exchangeID][symbol][direction][i][1]?sizeRemaining:orderbook[exchangeID][symbol][direction][i][1]
            vwapProduct+=sizeToBuy*orderbook[exchangeID][symbol][direction][i][0]
            sizeRemaining-=sizeToBuy
        }
        if(sizeRemaining>0){
            console.error('Insufficient Liquidity')
            return 0
        }
        return vwapProduct/Math.abs(size)
    }

}

module.exports = Calculation;