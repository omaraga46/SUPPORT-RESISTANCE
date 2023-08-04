const Binance = require('binance-api-node').default;
const apiKey = 'API_KEY';
const apiSecret = 'API_SECRET';
const { Telegraf } = require('telegraf');
const TELEGRAM_API_KEY = 'TELEGRAM_API_KEY';
const TELEGRAM_GROUP_ID = 'TELEGRAM_GROUP_ID';
const bot = new Telegraf(TELEGRAM_API_KEY);

const symbols = [
  "ETHUSDT",
  "BCHUSDT",
  "XRPUSDT",
  "EOSUSDT",
  "LTCUSDT",
  "TRXUSDT",
  "ETCUSDT",
  "LINKUSDT",
  "XLMUSDT",
  "ADAUSDT",
  "XMRUSDT",
  "DASHUSDT",
  "ZECUSDT",
  "XTZUSDT",
  "BNBUSDT",
  "ATOMUSDT",
  "ONTUSDT",
  "IOTAUSDT",
  "BATUSDT",
  "VETUSDT",
  "NEOUSDT",
  "QTUMUSDT",
  "IOSTUSDT",
  "THETAUSDT",
  "ALGOUSDT",
  "ZILUSDT",
  "KNCUSDT",
  "ZRXUSDT",
  "COMPUSDT",
  "OMGUSDT",
  "DOGEUSDT",
  "SXPUSDT",
  "KAVAUSDT",
  "BANDUSDT",
  "RLCUSDT",
  "WAVESUSDT",
  "MKRUSDT",
  "SNXUSDT",
  "DOTUSDT",
  "DEFIUSDT",
  "YFIUSDT",
  "BALUSDT",
  "CRVUSDT",
  "TRBUSDT",
  "RUNEUSDT",
  "SUSHIUSDT",
  "SRMUSDT",
  "EGLDUSDT",
  "SOLUSDT",
  "ICXUSDT",
  "STORJUSDT",
  "BLZUSDT",
  "UNIUSDT",
  "AVAXUSDT",
  "FTMUSDT",
  "HNTUSDT",
  "ENJUSDT",
  "FLMUSDT",
  "TOMOUSDT",
  "RENUSDT",
  "KSMUSDT",
  "NEARUSDT",
  "AAVEUSDT",
  "FILUSDT",
  "RSRUSDT",
  "LRCUSDT",
  "MATICUSDT",
  "OCEANUSDT",
  "CVCUSDT",
  "BELUSDT",
  "CTKUSDT",
  "AXSUSDT",
  "ALPHAUSDT",
  "ZENUSDT",
  "SKLUSDT",
  "GRTUSDT",
  "1INCHUSDT",
  "CHZUSDT",
  "SANDUSDT",
  "ANKRUSDT",
  "BTSUSDT",
  "LITUSDT",
  "UNFIUSDT",
  "REEFUSDT",
  "RVNUSDT",
  "SFPUSDT",
  "XEMUSDT",
  "BTCSTUSDT",
  "COTIUSDT",
  "CHRUSDT",
  "MANAUSDT",
  "ALICEUSDT",
  "HBARUSDT",
  "ONEUSDT",
  "LINAUSDT",
  "STMXUSDT",
  "DENTUSDT",
  "CELRUSDT",
  "HOTUSDT",
  "MTLUSDT",
  "OGNUSDT",
  "NKNUSDT",
  "SCUSDT",
  "DGBUSDT",
  "1000SHIBUSDT",
  "BAKEUSDT",
  "GTCUSDT",
  "IOTXUSDT",
  "AUDIOUSDT",
  "RAYUSDT",
  "C98USDT",
  "MASKUSDT",
  "ATAUSDT",
  "DYDXUSDT",
  "1000XECUSDT",
  "GALAUSDT",
  "CELOUSDT",
  "ARUSDT",
  "KLAYUSDT",
  "ARPAUSDT",
  "CTSIUSDT",
  "LPTUSDT",
  "ENSUSDT",
  "PEOPLEUSDT",
  "ANTUSDT",
  "ROSEUSDT",
  "DUSKUSDT",
  "FLOWUSDT",
  "IMXUSDT",
  "API3USDT",
  "GMTUSDT",
  "APEUSDT",
  "WOOUSDT",
  "FTTUSDT",
  "JASMYUSDT",
  "DARUSDT",
  "GALUSDT",
  "OPUSDT",
  "INJUSDT",
  "STGUSDT",
  "FOOTBALLUSDT",
  "SPELLUSDT",
  "1000LUNCUSDT",
  "LUNA2USDT",
  "LDOUSDT",
  "CVXUSDT",
  "ICPUSDT",
  "APTUSDT",
  "QNTUSDT",
  "BLUEBIRDUSDT",
  "FETUSDT",
  "FXSUSDT",
  "HOOKUSDT",
  "MAGICUSDT",
  "TUSDT",
  "RNDRUSDT",
  "HIGHUSDT",
  "MINAUSDT",
  "ASTRUSDT",
  "AGIXUSDT",
  "PHBUSDT",
  "GMXUSDT",
  "CFXUSDT",
  "STXUSDT",
  "BNXUSDT",
  "ACHUSDT",
  "SSVUSDT",
  "CKBUSDT",
  "PERPUSDT",
  "TRUUSDT",
  "LQTYUSDT",
  "USDCUSDT",
  "IDUSDT",
  "ARBUSDT",
  "JOEUSDT",
  "TLMUSDT",
  "AMBUSDT",
  "LEVERUSDT",
  "RDNTUSDT",
  "HFTUSDT",
  "XVSUSDT",
  "BLURUSDT",
  "EDUUSDT",
  "IDEXUSDT",
  "SUIUSDT",
  "1000PEPEUSDT",
  "1000FLOKIUSDT"
  ]
/////////////////////BURASI ÇOKOMELLİ////////////////////////
const fixedRisk = 0.2; // x dolar sabit risk
////////////////////////////////////////////////////////////
const rR = 0.5
////////////////////////////////////////////////////////////
const maxOpenTrades = 10;
///////////////////////////////////////////////////////////
const callbackRate = 1;
///////////////////////////////////////////////////////////
const timeperiod = '15m';
///////////////////////////////////////////////////////////
const period = 10
///////////////////////////////////////////////////////////
const stopPeriod = 5
///////////////////////////////////////////////////////////
const client = Binance({
  apiKey: apiKey,
  apiSecret: apiSecret
});

function calculate_stoch_rsi(klines, period = 14) {

  const close = klines.map(data => parseFloat(data.close));

  const input = {
    values: close,
    rsiPeriod: period,
    stochasticPeriod: period,
    kPeriod: 3,
    dPeriod: 3,
  };

  const stochRSI = StochasticRSI.calculate(input);

  return stochRSI.slice(-1)[0];
}


async function getKlines(symbol, interval = timeperiod, limit = 100) {
  const klines = await client.futuresCandles({ symbol, interval, limit });
  const sendMessageToTelegram = (message) => {
    bot.telegram.sendMessage(TELEGRAM_GROUP_ID, message);
  };
  return klines;
}
async function getKlinesWithRetry(symbol, retries = 3, delay = 1000) {
  while (retries > 0) {
    try {
      const klines = await getKlines(symbol);
      return klines;
    } catch (error) {
      retries--;
      console.error(`[${symbol}] Hata: ${error.message}. ${retries} deneme hakkı kaldı.`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error(`[${symbol}] Tüm yeniden denemeler başarısız oldu.`);
}

function findPivotPointsV3(highs, lows, period) {
  const pivotHighs = [];
  const pivotLows = [];

  for (let i = period; i < highs.length - period; i++) {
    const leftHighs = highs.slice(i - period, i);
    const rightHighs = highs.slice(i + 1, i + period + 1);
    const leftLows = lows.slice(i - period, i);
    const rightLows = lows.slice(i + 1, i + period + 1);

    const highestLeftHigh = Math.max(...leftHighs);
    const highestRightHigh = Math.max(...rightHighs);
    const lowestLeftLow = Math.min(...leftLows);
    const lowestRightLow = Math.min(...rightLows);

    const isPivotHigh = highs[i] > highestLeftHigh && highs[i] > highestRightHigh;
    const isPivotLow = lows[i] < lowestLeftLow && lows[i] < lowestRightLow;

    if (isPivotHigh) {
      pivotHighs.push({ index: i, value: highs[i] });
    }
    if (isPivotLow) {
      pivotLows.push({ index: i, value: lows[i] });
    }
  }

  return { pivotHighs, pivotLows };
}
function findPivotPointsV4(highs, lows, period) {
  const pivotHigh = [];
  const pivotLow = [];

  for (let i = period; i < highs.length - period; i++) {
    const leftHighs = highs.slice(i - period, i);
    const rightHighs = highs.slice(i + 1, i + period + 1);
    const leftLows = lows.slice(i - period, i);
    const rightLows = lows.slice(i + 1, i + period + 1);

    const highestLeftHigh = Math.max(...leftHighs);
    const highestRightHigh = Math.max(...rightHighs);
    const lowestLeftLow = Math.min(...leftLows);
    const lowestRightLow = Math.min(...rightLows);

    const isPivotHigh = highs[i] > highestLeftHigh && highs[i] > highestRightHigh;
    const isPivotLow = lows[i] < lowestLeftLow && lows[i] < lowestRightLow;

    if (isPivotHigh) {
      pivotHigh.push({ index: i, value: highs[i] });
    }
    if (isPivotLow) {
      pivotLow.push({ index: i, value: lows[i] });
    }
  }

  return { pivotHigh, pivotLow };
}
function calculateAverageVolume(volumeData, days = 20) {
  const recentVolumes = volumeData.slice(-days);
  const sum = recentVolumes.reduce((total, currentValue) => total + currentValue, 0);
  const average = sum / days;
  return average;
}
async function checkSupportResistance(symbol, period) {
  const klines = await getKlinesWithRetry(symbol);

  const open = klines.map(data => parseFloat(data.open));
  const high = klines.map(data => parseFloat(data.high));
  const low = klines.map(data => parseFloat(data.low));
  const close = klines.map(data => parseFloat(data.close));
  const volume = klines.map(data => parseFloat(data.volume));
  const averageVolume = calculateAverageVolume(volume);
  const { pivotHighs, pivotLows } = findPivotPointsV3(high, low, period); 
  const { pivotHigh, pivotLow } = findPivotPointsV4(high, low, stopPeriod);   

  if (pivotHighs.length > 0 && pivotLows.length > 0) {
    const lastClosePrice = close[close.length - 1];
    const lastClose2 = close[close.length - 2];
    const lastClose3 = close[close.length - 3];
    const lastOpen = open[open.length - 1];
    const lastOpen3 = open[open.length - 3];
    const lastPivotHigh = pivotHighs[pivotHighs.length - 1];
    const lastPivotHigh5 = pivotHigh[pivotHigh.length - 1];
    const lastPivotLow = pivotLows[pivotLows.length - 1];
    const lastPivotLow5 = pivotLow[pivotLow.length - 1];
    const hacim = volume[volume.length-1]
    const hacim2 = volume[volume.length-2]
    const hacim3 = volume[volume.length-3]
    let orderResult = null
    const positions = await client.futuresPositionRisk();    
    let   positionAmt = positions.filter(position => Number(position.positionAmt) !== 0).length
    const nonZeroPositions = positions.filter(position => Number(position.positionAmt) !== 0);
    const symbolWithNonZeroPosition = nonZeroPositions.find(position => position.symbol === symbol);
    const walletBalance= 10
    const exchangeInfo = await client.futuresExchangeInfo();
    const symbolInfo = exchangeInfo.symbols.find((s) => s.symbol === symbol);
    const quantityPrecision = symbolInfo.quantityPrecision;
    const pricePrecision = symbolInfo.pricePrecision
    const maxPositionAmt = (walletBalance / lastClosePrice).toFixed(quantityPrecision) 
    if (symbolWithNonZeroPosition ===0) {
      const openOrders = await futuresOpenOrders(symbol);
      for (const order of openOrders) {
        await client.futuresCancelOrder({ symbol: symbol, orderId: order.orderId });
        console.log(`İptal edildi: ${symbol} - Order ID: ${order.orderId}`);
      }
    }
    
    if (lastClose2 > lastPivotHigh.value && 
      lastClose3 < lastPivotHigh.value && 
      lastClosePrice > lastPivotHigh.value &&
      hacim3< hacim2  &&
      hacim2 < hacim3*2 &&
      hacim3 > averageVolume &&
      hacim2>averageVolume*1.5 &&
      lastOpen * 1.005 >lastClosePrice &&
      lastClosePrice>lastClose2 &&
      lastOpen3<lastClose3 &&
      hacim<hacim2 &&
      hacim<averageVolume ) 
      {
      const slPrice = (lastPivotLow5.value * 0.999).toFixed(pricePrecision);
      const risk = lastClosePrice - slPrice;
      const tpPrice = (lastClosePrice + (risk * rR)).toFixed(pricePrecision);
      const positionSize = (fixedRisk / risk).toFixed(quantityPrecision);
      const deger = positionSize*lastClosePrice;
      const callbacklong = ((((risk) * 1) / lastClosePrice) * 100 ).toFixed(1);
      const message =`${symbol}===> Long Partisi \nGİRİŞ FİYATI===> ${lastClosePrice},\nTP NOKTASI===> ${tpPrice}, \nSTOP NOKTASI===> ${slPrice}, \nPOZ BÜYÜKLÜĞÜ===>${(deger).toFixed(pricePrecision)}`; 
      console.log(message); 
          
              if (positionAmt < maxOpenTrades && deger>5 && !symbolWithNonZeroPosition) 
              { 
                  bot.telegram.sendMessage(TELEGRAM_GROUP_ID, message); 
                  orderResult = await client.futuresOrder({
                  symbol,
                  side: "BUY",
                  positionSide: "LONG",
                  type: "MARKET",
                  quantity: positionSize,                           
              });   
              orderResult = await client.futuresOrder({   
                symbol,
                side: "SELL",
                positionSide: "LONG",
                type: "TAKE_PROFIT_MARKET",
                timeInForce: "GTC",
                quantity: positionSize,
                stopPrice:tpPrice,
                workingType:"CONTRACT_PRICE" ,
                closePosition: true
                    
              });
              orderResult = await client.futuresOrder({
                symbol,
                side: "SELL",
                positionSide: "LONG",
                type: "STOP_MARKET",
                timeInForce: "GTC",
                quantity: positionSize,
                stopPrice:slPrice,
                workingType:"CONTRACT_PRICE" ,
                closePosition: true
              });
              if (callbacklong>=0.1) {
                
             
              orderResult = await client.futuresOrder({  
                symbol,
                side: "SELL",
                positionSide: "LONG",
                type: "TRAILING_STOP_MARKET",
                timeInForce: "GTC",
                quantity: positionSize,
                workingType:"CONTRACT_PRICE" ,
                callbackRate:callbacklong,
            }); }
            }
      console.log(`${symbol}: Direnç kırıldı! Pivot High: ${lastPivotHigh.value}, Kapanış: ${lastClosePrice}`);
    } else if (lastClose2 < lastPivotLow.value && 
      lastClose3 >lastPivotLow.value && 
      lastClosePrice < lastPivotLow.value &&
      lastOpen * 0.995 <lastClosePrice&&
      lastClosePrice<lastClose2 &&
      lastOpen3>lastClose3 &&
      hacim3< hacim2  &&
      hacim2 < hacim3*2 &&
      hacim3 > averageVolume &&
      hacim2>averageVolume*1.5 &&
      hacim<hacim2 &&
      hacim<averageVolume) 
      {
      const slPriceMinus = (lastPivotHigh5.value * 1.001).toFixed(pricePrecision);
      const riskshort =  slPriceMinus-lastClosePrice ;
      const tpPriceMinus = (lastClosePrice - (riskshort * rR)).toFixed(pricePrecision);
      const positionSize = (fixedRisk / riskshort).toFixed(quantityPrecision);
      const deger = positionSize*lastClosePrice;
      const callbackshort = ((((riskshort) * 1) / lastClosePrice) * 100 ).toFixed(1);
      const message =`${symbol}===> Short Partisi \nGİRİŞ FİYATI===> ${lastClosePrice},\nTP NOKTASI===> ${tpPriceMinus}, \nSTOP NOKTASI===> ${slPriceMinus}, \nPOZ BÜYÜKLÜĞÜ===>${(deger).toFixed(pricePrecision)}`; 
      console.log(message); 
      if (positionAmt < maxOpenTrades && deger>5 && !symbolWithNonZeroPosition) 
      { 
          bot.telegram.sendMessage(TELEGRAM_GROUP_ID, message);
          orderResult = await client.futuresOrder({
          symbol,
          side: "SELL",
          type: "MARKET",
          positionSide: "SHORT",
          quantity: positionSize,
        });
        orderResult = await client.futuresOrder({   
          symbol,
          side: "BUY",
          positionSide: "SHORT",
          type: "TAKE_PROFIT_MARKET",
          timeInForce: "GTC",
          quantity: positionSize,
          stopPrice:tpPriceMinus,
          workingType:"CONTRACT_PRICE" ,

         });
        
        orderResult = await client.futuresOrder({
          symbol,
          side: "BUY",
          positionSide: "SHORT",
          type: "STOP_MARKET",
          timeInForce: "GTC",
          quantity: positionSize,
          stopPrice:slPriceMinus,
          workingType:"CONTRACT_PRICE" ,
          closePosition:true
        });
        if (callbackshort>=0.1) {
        orderResult = await client.futuresOrder({
          symbol,
          side: "BUY",
          positionSide: "SHORT",
          type: "TRAILING_STOP_MARKET",
          timeInForce: "GTC",
          quantity: positionSize,
          callbackRate: callbackshort,                
          workingType:"CONTRACT_PRICE" ,
         });}
      }
      console.log(`${symbol}: Destek kırıldı! Pivot Low: ${lastPivotLow.value}, Kapanış: ${lastClosePrice}`);
    } 
  } 
}






async function analyzeSymbols() {
  for (const symbol of symbols) {
    await checkSupportResistance(symbol, period);
  }
}
async function main() {
  setInterval(analyzeSymbols, 150000);
  await analyzeSymbols();
}
function runApp() {
  console.log('Uygulama tekrardan başlatıldı...');
  main()
    .catch((error) => {
      console.error('Uygulama hatası:', error);
      console.log('Uygulamayı yeniden başlatıyor...');
      setTimeout(runApp, 5000); // 5 saniye bekleyip uygulamayı yeniden başlat.
    });
}
runApp();